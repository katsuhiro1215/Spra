<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Project;
use App\Services\AppointmentNotificationService;
use App\Services\AppointmentService;
use App\Services\ContractBenefitService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class AppointmentController extends Controller
{
  public function __construct(
    private AppointmentService $appointmentService,
    private AppointmentNotificationService $notificationService,
    private ContractBenefitService $benefitService,
  ) {}

  /**
   * 自分の予約一覧
   */
  public function index(): InertiaResponse
  {
    $appointments = Appointment::where('user_id', Auth::id())
      ->with(['appointmentSlot.assignedAdmin.profile', 'project'])
      ->orderByDesc('created_at')
      ->paginate(10);

    return Inertia::render('User/Appointments/Index', [
      'appointments' => $appointments,
    ]);
  }

  /**
   * 予約作成フォーム
   */
  public function create(): InertiaResponse
  {
    $user = Auth::user();
    $projects = $user->projects()->select('id', 'title', 'contract_id')->get();

    return Inertia::render('User/Appointments/Create', [
      'availableSlots' => $this->appointmentService->availableSlotOptions(),
      'projects' => $projects->map(fn($p) => ['id' => $p->id, 'title' => $p->title]),
      'ticketBalances' => $this->ticketBalancesByProject($projects),
    ]);
  }

  /**
   * 予約を作成（契約特典チケットを1枚消費する）
   */
  public function store(Request $request)
  {
    $user = Auth::user();

    $validated = $request->validate([
      'appointment_slot_id' => 'required|exists:appointment_slots,id',
      'project_id' => 'required|exists:projects,id',
      'subject' => 'required|string|max:255',
      'description' => 'nullable|string|max:2000',
      'location_type' => 'required|in:in_person,online',
      'meeting_tool' => 'nullable|required_if:location_type,online|in:zoom,teams,google_meet,other',
      'client_notes' => 'nullable|string|max:1000',
    ]);

    // 自分のプロジェクトのみ紐付け可能
    $project = $user->projects()->whereKey($validated['project_id'])->first();
    if (!$project) {
      abort(403, 'このプロジェクトへのアクセス権限がありません。');
    }

    $contract = $project->contract;
    if (!$contract) {
      return redirect()->back()
        ->withInput()
        ->with('error', 'このプロジェクトには予約に利用できる契約が設定されていません。');
    }

    try {
      $appointment = DB::transaction(function () use ($validated, $contract, $user) {
        // 先にチケット残高を確認（不足していれば例外で中断し、枠は確保しない）
        if ($this->benefitService->availableBalance($contract) < 1) {
          throw new \RuntimeException('チケットが不足しています。');
        }

        $slotId = $validated['appointment_slot_id'];
        unset($validated['appointment_slot_id']);

        $appointment = $this->appointmentService->book($slotId, [
          ...$validated,
          'user_id' => $user->id,
          'company_id' => $user->primaryCompany?->id,
          'send_reminder' => true,
        ]);

        $this->benefitService->consume($contract, $appointment, 1);

        return $appointment;
      });

      $appointment->load(['appointmentSlot.assignedAdmin', 'company', 'project', 'user']);
      $this->notificationService->sendNewAppointmentNotifications($appointment);

      return redirect()->route('user.appointments.index')
        ->with('success', '予約を受け付けました。');
    } catch (\RuntimeException $e) {
      return redirect()->back()
        ->withInput()
        ->with('error', $e->getMessage());
    } catch (\Exception $e) {
      Log::error('User appointment store error: ' . $e->getMessage());
      return redirect()->back()
        ->withInput()
        ->with('error', '予約の作成に失敗しました。');
    }
  }

  /**
   * 予約編集フォーム
   */
  public function edit(Appointment $appointment): InertiaResponse
  {
    $this->authorize('update', $appointment);

    $user = Auth::user();

    return Inertia::render('User/Appointments/Edit', [
      'appointment' => $appointment->load('appointmentSlot.assignedAdmin.profile', 'project'),
      'availableSlots' => $this->appointmentService->availableSlotOptions($appointment->appointment_slot_id),
      'projects' => $user->projects()->select('id', 'title')->get(),
    ]);
  }

  /**
   * 予約を更新（日時変更のみ。チケットは既に消費済みのため再消費しない）
   */
  public function update(Request $request, Appointment $appointment)
  {
    $this->authorize('update', $appointment);

    $user = Auth::user();

    $validated = $request->validate([
      'appointment_slot_id' => 'required|exists:appointment_slots,id',
      'project_id' => 'nullable|exists:projects,id',
      'subject' => 'required|string|max:255',
      'description' => 'nullable|string|max:2000',
      'location_type' => 'required|in:in_person,online',
      'meeting_tool' => 'nullable|required_if:location_type,online|in:zoom,teams,google_meet,other',
      'client_notes' => 'nullable|string|max:1000',
    ]);

    if (!empty($validated['project_id'])) {
      $ownsProject = $user->projects()->whereKey($validated['project_id'])->exists();
      if (!$ownsProject) {
        abort(403, 'このプロジェクトへのアクセス権限がありません。');
      }
    }

    try {
      $slotId = $validated['appointment_slot_id'];
      unset($validated['appointment_slot_id']);

      $this->appointmentService->reschedule($appointment, $slotId, $validated);

      return redirect()->route('user.appointments.index')
        ->with('success', '予約を更新しました。');
    } catch (\RuntimeException $e) {
      return redirect()->back()
        ->withInput()
        ->with('error', $e->getMessage());
    } catch (\Exception $e) {
      Log::error('User appointment update error: ' . $e->getMessage());
      return redirect()->back()
        ->withInput()
        ->with('error', '予約の更新に失敗しました。');
    }
  }

  /**
   * 予約をキャンセル（開始1時間前を過ぎていなければチケットを返却する）
   */
  public function cancel(Request $request, Appointment $appointment)
  {
    $this->authorize('cancel', $appointment);

    $validated = $request->validate([
      'cancellation_reason' => 'nullable|string|max:500',
    ]);

    try {
      $appointment->cancel($validated['cancellation_reason'] ?? null);
      $this->benefitService->refund($appointment);

      $appointment->load(['appointmentSlot.assignedAdmin', 'company', 'project', 'user']);
      $this->notificationService->sendCancellationNotification($appointment);

      return redirect()->route('user.appointments.index')
        ->with('success', '予約をキャンセルしました。');
    } catch (\Exception $e) {
      Log::error('User appointment cancel error: ' . $e->getMessage());
      return redirect()->back()
        ->with('error', '予約のキャンセルに失敗しました。');
    }
  }

  /**
   * プロジェクトごとの利用可能チケット残数マップ（契約がないプロジェクトはnull）
   */
  private function ticketBalancesByProject($projects): array
  {
    $projects->loadMissing('contract');

    return $projects->mapWithKeys(function (Project $project) {
      if (!$project->contract) {
        return [$project->id => null];
      }

      $config = $this->benefitService->resolveBenefitConfig($project->contract);

      return [$project->id => [
        'balance' => $this->benefitService->availableBalance($project->contract),
        'unitMinutes' => $config['unitMinutes'] ?? null,
      ]];
    })->all();
  }
}
