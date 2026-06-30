<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\AppointmentSlot;
use App\Models\Company;
use App\Models\Project;
use App\Services\AppointmentNotificationService;
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
   * コンストラクタ
   */
  public function __construct(AppointmentNotificationService $notificationService)
  {
    $this->notificationService = $notificationService;
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
        'user',
        'company',
        'project',
      ]);

    // 検索フィルター
    if (!empty($filters['search'])) {
      $search = $filters['search'];
      $query->where(function ($q) use ($search) {
        $q->where('subject', 'like', "%{$search}%")
          ->orWhere('description', 'like', "%{$search}%")
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

    // 予約可能な予約枠を取得
    $availableSlots = AppointmentSlot::where('status', 'available')
      ->where('date', '>=', now()->format('Y-m-d'))
      ->whereRaw('current_bookings < max_capacity')
      ->with('assignedAdmin.profile')
      ->orderBy('date')
      ->orderBy('start_time')
      ->get()
      ->map(function ($slot) {
        return [
          'value' => $slot->id,
          'label' => sprintf(
            '%s %s-%s (%s) - 残り%d枠',
            $slot->date,
            substr($slot->start_time, 0, 5),
            substr($slot->end_time, 0, 5),
            AppointmentSlot::getSlotTypeLabel($slot->slot_type),
            $slot->max_capacity - $slot->current_bookings
          ),
          'date' => $slot->date,
          'start_time' => $slot->start_time,
          'end_time' => $slot->end_time,
          'slot_type' => $slot->slot_type,
          'assigned_admin' => $slot->assignedAdmin ? [
            'id' => $slot->assignedAdmin->id,
            'name' => $slot->assignedAdmin->profile->full_name ?? $slot->assignedAdmin->email,
          ] : null,
        ];
      });

    $companies = Company::select('id', 'name')
      ->orderBy('name')
      ->get()
      ->map(fn($company) => [
        'value' => $company->id,
        'label' => $company->name
      ]);

    $projects = Project::select('id', 'title', 'company_id')
      ->orderBy('title')
      ->get();

    return Inertia::render('Admin/Appointments/Create', [
      'appointmentSlot' => $appointmentSlot,
      'availableSlots' => $availableSlots,
      'companies' => $companies,
      'projects' => $projects,
    ]);
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(Request $request)
  {
    $validated = $request->validate([
      'appointment_slot_id' => 'required|exists:appointment_slots,id',
      'company_id' => 'nullable|exists:companies,id',
      'project_id' => 'nullable|exists:projects,id',
      'subject' => 'required|string|max:255',
      'description' => 'nullable|string|max:2000',
      'client_notes' => 'nullable|string|max:1000',
      'send_reminder' => 'nullable|boolean',
    ]);

    try {
      // 予約枠の確認
      $slot = AppointmentSlot::findOrFail($validated['appointment_slot_id']);

      if (!$slot->isAvailable()) {
        return redirect()->back()
          ->withInput()
          ->with('error', 'この予約枠は現在予約できません。');
      }

      $validated['status'] = 'pending';
      $validated['send_reminder'] = $validated['send_reminder'] ?? false;
      $validated['created_by'] = Auth::guard('admin')->id();

      $appointment = Appointment::create($validated);

      // 予約枠の予約数を更新
      $slot->updateBookingCount();

      // 通知を送信
      $appointment->load(['appointmentSlot.assignedAdmin', 'company', 'project']);
      $this->notificationService->sendNewAppointmentNotifications($appointment);

      return redirect()->route('admin.appointments.index')
        ->with('success', '予約が作成されました。');
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
      'user',
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
    // 予約可能な予約枠を取得（現在の予約枠も含む）
    $availableSlots = AppointmentSlot::where(function ($query) use ($appointment) {
      $query->where('status', 'available')
        ->whereRaw('current_bookings < max_capacity')
        ->orWhere('id', $appointment->appointment_slot_id);
    })
      ->where('date', '>=', now()->format('Y-m-d'))
      ->with('assignedAdmin.profile')
      ->orderBy('date')
      ->orderBy('start_time')
      ->get()
      ->map(function ($slot) {
        return [
          'value' => $slot->id,
          'label' => sprintf(
            '%s %s-%s (%s) - 残り%d枠',
            $slot->date,
            substr($slot->start_time, 0, 5),
            substr($slot->end_time, 0, 5),
            AppointmentSlot::getSlotTypeLabel($slot->slot_type),
            $slot->max_capacity - $slot->current_bookings
          ),
        ];
      });

    $companies = Company::select('id', 'name')
      ->orderBy('name')
      ->get()
      ->map(fn($company) => [
        'value' => $company->id,
        'label' => $company->name
      ]);

    $projects = Project::select('id', 'name', 'company_id')
      ->orderBy('name')
      ->get();

    $statuses = [
      ['value' => 'pending', 'label' => '保留中'],
      ['value' => 'confirmed', 'label' => '確定'],
      ['value' => 'completed', 'label' => '完了'],
      ['value' => 'cancelled', 'label' => 'キャンセル'],
      ['value' => 'no_show', 'label' => '不参加'],
    ];

    return Inertia::render('Admin/Appointments/Edit', [
      'appointment' => $appointment->load('appointmentSlot', 'company', 'project'),
      'availableSlots' => $availableSlots,
      'companies' => $companies,
      'projects' => $projects,
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
      'company_id' => 'nullable|exists:companies,id',
      'project_id' => 'nullable|exists:projects,id',
      'subject' => 'required|string|max:255',
      'description' => 'nullable|string|max:2000',
      'status' => 'required|in:pending,confirmed,completed,cancelled,no_show',
      'admin_notes' => 'nullable|string|max:1000',
      'client_notes' => 'nullable|string|max:1000',
      'send_reminder' => 'nullable|boolean',
    ]);

    try {
      $oldSlotId = $appointment->appointment_slot_id;

      $validated['updated_by'] = Auth::guard('admin')->id();
      $validated['send_reminder'] = $validated['send_reminder'] ?? false;

      $appointment->update($validated);

      // 予約枠が変更された場合は両方の予約数を更新
      if ($oldSlotId !== $validated['appointment_slot_id']) {
        $oldSlot = AppointmentSlot::find($oldSlotId);
        if ($oldSlot) {
          $oldSlot->updateBookingCount();
        }

        $newSlot = AppointmentSlot::find($validated['appointment_slot_id']);
        if ($newSlot) {
          $newSlot->updateBookingCount();
        }
      }

      return redirect()->route('admin.appointments.index')
        ->with('success', '予約が更新されました。');
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
      $appointment->deleted_by = Auth::guard('admin')->id();
      $appointment->save();
      $appointment->delete();

      // 予約枠の予約数を更新
      $appointment->appointmentSlot->updateBookingCount();

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
      $appointment->load(['appointmentSlot.assignedAdmin', 'company', 'project']);
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

      // 通知を送信
      $appointment->load(['appointmentSlot.assignedAdmin', 'company', 'project']);
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
}
