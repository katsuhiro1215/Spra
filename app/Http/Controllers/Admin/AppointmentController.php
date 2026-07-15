<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\AppointmentSlot;
use App\Models\Company;
use App\Models\Project;
use App\Models\User;
use App\Services\AppointmentNotificationService;
use App\Services\AppointmentService;
use App\Services\ContractBenefitService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class AppointmentController extends Controller
{
  /**
   * 通知サービス
   */
  protected AppointmentNotificationService $notificationService;

  /**
   * 予約サービス
   */
  protected AppointmentService $appointmentService;

  /**
   * 契約特典サービス
   */
  protected ContractBenefitService $benefitService;

  /**
   * コンストラクタ
   */
  public function __construct(
    AppointmentNotificationService $notificationService,
    AppointmentService $appointmentService,
    ContractBenefitService $benefitService,
  ) {
    $this->notificationService = $notificationService;
    $this->appointmentService = $appointmentService;
    $this->benefitService = $benefitService;
  }

  /**
   * Display a listing of the resource.
   */
  public function index(Request $request): Response
  {
    $filters = $request->only(['search', 'status', 'company_id', 'project_id', 'date_from', 'date_to']);
    $sort = [
      'field' => $request->get('sort', 'created_at'),
      'direction' => $request->get('direction', 'desc')
    ];

    $query = Appointment::query()
      ->with([
        'appointmentSlot.assignedAdmin.profile',
        'user.profile',
        'company',
        'project',
      ]);

    // 検索フィルター
    if (!empty($filters['search'])) {
      $search = $filters['search'];
      $query->where(function ($q) use ($search) {
        $q->where('subject', 'like', "%{$search}%")
          ->orWhere('description', 'like', "%{$search}%")
          ->orWhere('guest_name', 'like', "%{$search}%")
          ->orWhereHas('company', function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%");
          });
      });
    }

    // ステータスフィルター
    if (!empty($filters['status'])) {
      $query->where('status', $filters['status']);
    }

    // 企業フィルター
    if (!empty($filters['company_id'])) {
      $query->where('company_id', $filters['company_id']);
    }

    // プロジェクトフィルター
    if (!empty($filters['project_id'])) {
      $query->where('project_id', $filters['project_id']);
    }

    // 日付範囲フィルター
    if (!empty($filters['date_from'])) {
      $query->whereHas('appointmentSlot', function ($q) use ($filters) {
        $q->where('date', '>=', $filters['date_from']);
      });
    }
    if (!empty($filters['date_to'])) {
      $query->whereHas('appointmentSlot', function ($q) use ($filters) {
        $q->where('date', '<=', $filters['date_to']);
      });
    }

    // ソート
    if ($sort['field'] === 'appointment_date') {
      $query->join('appointment_slots', 'appointments.appointment_slot_id', '=', 'appointment_slots.id')
        ->select('appointments.*')
        ->orderBy('appointment_slots.date', $sort['direction'])
        ->orderBy('appointment_slots.start_time', $sort['direction']);
    } else {
      $query->orderBy($sort['field'], $sort['direction']);
    }

    $appointments = $query->paginate(20)->withQueryString();

    // 選択肢データ
    $companies = Company::select('id', 'name')
      ->orderBy('name')
      ->get()
      ->map(fn($company) => [
        'value' => $company->id,
        'label' => $company->name
      ]);

    $projects = Project::select('id', 'title')
      ->orderBy('title')
      ->get()
      ->map(fn($project) => [
        'value' => $project->id,
        'label' => $project->title
      ]);

    $statuses = [
      ['value' => 'pending', 'label' => '保留中'],
      ['value' => 'confirmed', 'label' => '確定'],
      ['value' => 'completed', 'label' => '完了'],
      ['value' => 'cancelled', 'label' => 'キャンセル'],
      ['value' => 'no_show', 'label' => '不参加'],
    ];

    return Inertia::render('Admin/Appointments/Index', [
      'appointments' => $appointments,
      'companies' => $companies,
      'projects' => $projects,
      'statuses' => $statuses,
      'filters' => $filters,
      'sort' => $sort,
    ]);
  }

  /**
   * Show the form for creating a new resource.
   */
  public function create(Request $request): Response
  {
    $slotId = $request->get('slot_id');
    $appointmentSlot = null;

    if ($slotId) {
      $appointmentSlot = AppointmentSlot::with('assignedAdmin.profile')->find($slotId);
    }

    return Inertia::render('Admin/Appointments/Create', [
      'appointmentSlot' => $appointmentSlot,
      'availableSlots' => $this->appointmentService->availableSlotOptions(),
      'users' => $this->userOptions(),
      'companies' => $this->companyOptions(),
      'projects' => Project::select('id', 'title', 'company_id')->orderBy('title')->get(),
    ]);
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(Request $request)
  {
    $validated = $request->validate([
      'appointment_slot_id' => 'required|exists:appointment_slots,id',
      'user_id' => 'nullable|exists:users,id',
      'guest_name' => 'nullable|required_without:user_id|string|max:255',
      'guest_email' => 'nullable|email|max:255',
      'guest_phone' => 'nullable|string|max:30',
      'company_id' => 'nullable|exists:companies,id',
      'project_id' => 'nullable|exists:projects,id',
      'subject' => 'required|string|max:255',
      'description' => 'nullable|string|max:2000',
      'location_type' => 'required|in:in_person,online',
      'meeting_tool' => 'nullable|required_if:location_type,online|in:zoom,teams,google_meet,other',
      'client_notes' => 'nullable|string|max:1000',
      'send_reminder' => 'nullable|boolean',
    ]);

    try {
      $slotId = $validated['appointment_slot_id'];
      unset($validated['appointment_slot_id']);
      $validated['send_reminder'] = $validated['send_reminder'] ?? false;
      $validated['created_by'] = Auth::guard('admins')->id();

      $appointment = $this->appointmentService->book($slotId, $validated);

      // 通知を送信
      $appointment->load(['appointmentSlot.assignedAdmin', 'company', 'project', 'user']);
      $this->notificationService->sendNewAppointmentNotifications($appointment);

      return redirect()->route('admin.appointments.index')
        ->with('success', '予約が作成されました。');
    } catch (\RuntimeException $e) {
      return redirect()->back()
        ->withInput()
        ->with('error', $e->getMessage());
    } catch (\Exception $e) {
      Log::error('Appointment store error: ' . $e->getMessage());
      return redirect()->back()
        ->withInput()
        ->with('error', '予約の作成に失敗しました。');
    }
  }

  /**
   * Display the specified resource.
   */
  public function show(Appointment $appointment): Response
  {
    $appointment->load([
      'appointmentSlot.assignedAdmin.profile',
      'user.profile',
      'company',
      'project',
      'creator.profile',
      'updater.profile'
    ]);

    return Inertia::render('Admin/Appointments/Show', [
      'appointment' => $appointment,
    ]);
  }

  /**
   * Show the form for editing the specified resource.
   */
  public function edit(Appointment $appointment): Response
  {
    $statuses = [
      ['value' => 'pending', 'label' => '保留中'],
      ['value' => 'confirmed', 'label' => '確定'],
      ['value' => 'completed', 'label' => '完了'],
      ['value' => 'cancelled', 'label' => 'キャンセル'],
      ['value' => 'no_show', 'label' => '不参加'],
    ];

    return Inertia::render('Admin/Appointments/Edit', [
      'appointment' => $appointment->load('appointmentSlot', 'company', 'project', 'user'),
      'availableSlots' => $this->appointmentService->availableSlotOptions($appointment->appointment_slot_id),
      'users' => $this->userOptions(),
      'companies' => $this->companyOptions(),
      'projects' => Project::select('id', 'title', 'company_id')->orderBy('title')->get(),
      'statuses' => $statuses,
    ]);
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(Request $request, Appointment $appointment)
  {
    $validated = $request->validate([
      'appointment_slot_id' => 'required|exists:appointment_slots,id',
      'user_id' => 'nullable|exists:users,id',
      'guest_name' => 'nullable|required_without:user_id|string|max:255',
      'guest_email' => 'nullable|email|max:255',
      'guest_phone' => 'nullable|string|max:30',
      'company_id' => 'nullable|exists:companies,id',
      'project_id' => 'nullable|exists:projects,id',
      'subject' => 'required|string|max:255',
      'description' => 'nullable|string|max:2000',
      'location_type' => 'required|in:in_person,online',
      'meeting_tool' => 'nullable|required_if:location_type,online|in:zoom,teams,google_meet,other',
      'meeting_url' => 'nullable|string|max:500',
      'status' => 'required|in:pending,confirmed,completed,cancelled,no_show',
      'admin_notes' => 'nullable|string|max:1000',
      'client_notes' => 'nullable|string|max:1000',
      'send_reminder' => 'nullable|boolean',
    ]);

    try {
      $slotId = $validated['appointment_slot_id'];
      unset($validated['appointment_slot_id']);
      $validated['updated_by'] = Auth::guard('admins')->id();
      $validated['send_reminder'] = $validated['send_reminder'] ?? false;
      $wasCancelled = $appointment->status === 'cancelled';

      $this->appointmentService->reschedule($appointment, $slotId, $validated);

      // 編集画面からステータスを直接「キャンセル」に変更した場合も、
      // 専用のキャンセル操作と同様にチケットを返却する
      if ($validated['status'] === 'cancelled' && !$wasCancelled) {
        $this->benefitService->refund($appointment, ignoreCutoff: true);
      }

      return redirect()->route('admin.appointments.index')
        ->with('success', '予約が更新されました。');
    } catch (\RuntimeException $e) {
      return redirect()->back()
        ->withInput()
        ->with('error', $e->getMessage());
    } catch (\Exception $e) {
      Log::error('Appointment update error: ' . $e->getMessage());
      return redirect()->back()
        ->withInput()
        ->with('error', '予約の更新に失敗しました。');
    }
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(Appointment $appointment)
  {
    try {
      $appointment->deleted_by = Auth::guard('admins')->id();
      $appointment->save();
      $appointment->delete();

      // 予約枠の予約数を更新
      $appointment->appointmentSlot->updateBookingCount();

      // チケットを返却（管理者操作のため締切時間に関わらず常に返却）
      $this->benefitService->refund($appointment, ignoreCutoff: true);

      return redirect()->route('admin.appointments.index')
        ->with('success', '予約が削除されました。');
    } catch (\Exception $e) {
      Log::error('Appointment destroy error: ' . $e->getMessage());
      return redirect()->back()
        ->with('error', '予約の削除に失敗しました。');
    }
  }

  /**
   * 予約を確定
   */
  public function confirm(Appointment $appointment)
  {
    try {
      $appointment->confirm();

      // 通知を送信
      $appointment->load(['appointmentSlot.assignedAdmin', 'company', 'project', 'user']);
      $this->notificationService->sendConfirmationNotification($appointment);

      return redirect()->back()
        ->with('success', '予約が確定されました。');
    } catch (\Exception $e) {
      Log::error('Appointment confirm error: ' . $e->getMessage());
      return redirect()->back()
        ->with('error', '予約の確定に失敗しました。');
    }
  }

  /**
   * 予約をキャンセル
   */
  public function cancel(Request $request, Appointment $appointment)
  {
    $validated = $request->validate([
      'cancellation_reason' => 'nullable|string|max:500',
    ]);

    try {
      $appointment->cancel($validated['cancellation_reason'] ?? null);

      // チケットを返却（管理者操作のため締切時間に関わらず常に返却）
      $this->benefitService->refund($appointment, ignoreCutoff: true);

      // 通知を送信
      $appointment->load(['appointmentSlot.assignedAdmin', 'company', 'project', 'user']);
      $this->notificationService->sendCancellationNotification($appointment);

      return redirect()->back()
        ->with('success', '予約がキャンセルされました。');
    } catch (\Exception $e) {
      Log::error('Appointment cancel error: ' . $e->getMessage());
      return redirect()->back()
        ->with('error', '予約のキャンセルに失敗しました。');
    }
  }

  /**
   * 予約を完了
   */
  public function complete(Appointment $appointment)
  {
    try {
      $appointment->complete();

      return redirect()->back()
        ->with('success', '予約が完了しました。');
    } catch (\Exception $e) {
      Log::error('Appointment complete error: ' . $e->getMessage());
      return redirect()->back()
        ->with('error', '予約の完了処理に失敗しました。');
    }
  }

  /**
   * 登録済みユーザーの選択肢
   */
  private function userOptions()
  {
    return User::select('id', 'email')
      ->with('profile')
      ->get()
      ->map(fn($user) => [
        'value' => $user->id,
        'label' => $user->profile?->full_name ? "{$user->profile->full_name} ({$user->email})" : $user->email,
      ]);
  }

  /**
   * 企業の選択肢
   */
  private function companyOptions()
  {
    return Company::select('id', 'name')
      ->orderBy('name')
      ->get()
      ->map(fn($company) => [
        'value' => $company->id,
        'label' => $company->name
      ]);
  }
}
