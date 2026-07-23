<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AppointmentSlot;
use App\Models\Admin;
use App\Models\AdminShift;
use App\Services\AttendanceService;
use App\Services\ScheduleService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class AppointmentSlotController extends Controller
{
  /**
   * まとめて作成できる最大期間（日数）
   */
  private const BULK_CREATE_MAX_DAYS = 31;

  public function __construct(
    private ScheduleService $scheduleService,
    private AttendanceService $attendanceService
  )
  {
  }

  /**
   * 指定した時間帯（H:i形式のstart/end）が、渡されたシフト群のいずれかに完全に収まっているか判定
   *
   * @param string $start
   * @param string $end
   * @param \Illuminate\Support\Collection<int, AdminShift> $shifts
   */
  private function isWithinAnyShift(string $start, string $end, $shifts): bool
  {
    foreach ($shifts as $shift) {
      $shiftStart = substr($shift->start_time, 0, 5);
      $shiftEnd = substr($shift->end_time, 0, 5);

      if ($start >= $shiftStart && $end <= $shiftEnd) {
        return true;
      }
    }

    return false;
  }

  /**
   * 個別登録・編集画面で「この担当者・この日のシフト」を注意喚起表示するための情報を返す。
   * あくまで参考表示用であり、シフト外での登録自体は残業対応等のため許可する（ブロックしない）。
   */
  private function getShiftInfo(?string $adminId, ?string $date): ?array
  {
    if (!$adminId || !$date) {
      return null;
    }

    $shifts = AdminShift::where('admin_id', $adminId)
      ->whereDate('shift_date', $date)
      ->get();

    return [
      'shifts' => $shifts->map(fn($shift) => [
        'start_time' => substr($shift->start_time, 0, 5),
        'end_time' => substr($shift->end_time, 0, 5),
      ])->values(),
    ];
  }

  /**
   * Display a listing of the resource.
   */
  public function index(Request $request): Response
  {
    $filters = $request->only(['search', 'slot_type', 'status', 'assigned_admin_id', 'date_from', 'date_to']);
    // 未指定の場合は今月をデフォルト表示にする
    $filters['date_from'] ??= now()->startOfMonth()->toDateString();
    $filters['date_to'] ??= now()->endOfMonth()->toDateString();
    $sort = [
      'field' => $request->get('sort', 'date'),
      'direction' => $request->get('direction', 'asc')
    ];

    $query = AppointmentSlot::query()
      ->with(['assignedAdmin.profile', 'appointments'])
      ->withCount(['appointments as active_bookings' => function ($query) {
        $query->whereIn('status', ['pending', 'confirmed']);
      }]);

    // 検索フィルター
    if (!empty($filters['search'])) {
      $search = $filters['search'];
      $query->where(function ($q) use ($search) {
        $q->where('notes', 'like', "%{$search}%")
          ->orWhereHas('assignedAdmin.profile', function ($q) use ($search) {
            $q->where('full_name', 'like', "%{$search}%");
          });
      });
    }

    // 予約タイプフィルター
    if (!empty($filters['slot_type'])) {
      $query->where('slot_type', $filters['slot_type']);
    }

    // ステータスフィルター
    if (!empty($filters['status'])) {
      $query->where('status', $filters['status']);
    }

    // 担当者フィルター
    if (!empty($filters['assigned_admin_id'])) {
      $query->where('assigned_admin_id', $filters['assigned_admin_id']);
    }

    // 日付範囲フィルター
    if (!empty($filters['date_from'])) {
      $query->where('date', '>=', $filters['date_from']);
    }
    if (!empty($filters['date_to'])) {
      $query->where('date', '<=', $filters['date_to']);
    }

    // ソート
    $query->orderBy($sort['field'], $sort['direction']);
    if ($sort['field'] !== 'date') {
      $query->orderBy('date', 'asc')->orderBy('start_time', 'asc');
    } else {
      $query->orderBy('start_time', 'asc');
    }

    $appointmentSlots = $query->paginate(20)->withQueryString();

    // 選択肢データ
    $admins = Admin::with('profile')
      ->whereHas('profile')
      ->get()
      ->map(fn($admin) => [
        'value' => $admin->id,
        'label' => $admin->profile->full_name ?? $admin->email
      ]);

    $slotTypes = [
      ['value' => 'meeting', 'label' => '面談'],
      ['value' => 'progress_review', 'label' => '進捗会'],
      ['value' => 'consultation', 'label' => '相談'],
      ['value' => 'other', 'label' => 'その他'],
    ];

    $statuses = [
      ['value' => 'available', 'label' => '予約可能'],
      ['value' => 'blocked', 'label' => 'ブロック中'],
      ['value' => 'full', 'label' => '満席'],
    ];

    return Inertia::render('Admin/AppointmentSlots/Index', [
      'appointmentSlots' => $appointmentSlots,
      'admins' => $admins,
      'slotTypes' => $slotTypes,
      'statuses' => $statuses,
      'filters' => $filters,
      'sort' => $sort,
      'attendanceStatuses' => $this->attendanceService->getStatusMap(),
    ]);
  }

  /**
   * Show the form for creating a new resource.
   */
  public function create(Request $request): Response
  {
    $admins = Admin::with('profile')
      ->whereHas('profile')
      ->get()
      ->map(fn($admin) => [
        'value' => $admin->id,
        'label' => $admin->profile->full_name ?? $admin->email
      ]);

    $slotTypes = [
      ['value' => 'meeting', 'label' => '面談'],
      ['value' => 'progress_review', 'label' => '進捗会'],
      ['value' => 'consultation', 'label' => '相談'],
      ['value' => 'other', 'label' => 'その他'],
    ];

    return Inertia::render('Admin/AppointmentSlots/Create', [
      'admins' => $admins,
      'slotTypes' => $slotTypes,
      'shiftInfo' => $this->getShiftInfo(
        $request->query('assigned_admin_id'),
        $request->query('date')
      ),
    ]);
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(Request $request)
  {
    $validated = $request->validate([
      'date' => 'required|date',
      // 編集画面では既存レコード（TIME型カラム=秒付き "H:i:s"）の値がそのまま
      // 送られてくることがあるため、"H:i" だけでなく "H:i:s" も許可する
      'start_time' => 'required|date_format:H:i,H:i:s',
      'end_time' => 'required|date_format:H:i,H:i:s|after:start_time',
      'slot_type' => 'required|in:meeting,progress_review,consultation,other',
      'max_capacity' => 'required|integer|min:1|max:100',
      'assigned_admin_id' => 'nullable|exists:admins,id',
      'status' => 'required|in:available,blocked',
      'notes' => 'nullable|string|max:1000',
    ]);

    try {
      $validated['current_bookings'] = 0;
      $validated['created_by'] = Auth::guard('admins')->id();

      $appointmentSlot = AppointmentSlot::create($validated);

      return redirect()->route('admin.appointment-slots.index')
        ->with('success', __('messages.created', ['attribute' => '予約枠']));
    } catch (\Exception $e) {
      Log::error('AppointmentSlot store error: ' . $e->getMessage());
      return redirect()->back()
        ->withInput()
        ->with('error', __('messages.create_failed', ['attribute' => '予約枠']));
    }
  }

  /**
   * カレンダーからの単一予約枠のクイック作成
   */
  public function quickStore(Request $request)
  {
    $validated = $request->validate([
      'date' => 'required|date',
      // 編集画面では既存レコード（TIME型カラム=秒付き "H:i:s"）の値がそのまま
      // 送られてくることがあるため、"H:i" だけでなく "H:i:s" も許可する
      'start_time' => 'required|date_format:H:i,H:i:s',
      'end_time' => 'required|date_format:H:i,H:i:s|after:start_time',
      'slot_type' => 'required|in:meeting,progress_review,consultation,other',
      'max_capacity' => 'required|integer|min:1|max:100',
      'assigned_admin_id' => 'nullable|exists:admins,id',
      'status' => 'required|in:available,blocked',
      'notes' => 'nullable|string|max:1000',
    ]);

    try {
      $validated['current_bookings'] = 0;
      $validated['created_by'] = Auth::guard('admins')->id();

      AppointmentSlot::create($validated);

      return redirect()->back()->with('success', __('messages.created', ['attribute' => '予約枠']));
    } catch (\Exception $e) {
      Log::error('AppointmentSlot quickStore error: ' . $e->getMessage());
      return redirect()->back()->with('error', __('messages.create_failed', ['attribute' => '予約枠']));
    }
  }

  /**
   * まとめて作成画面の表示（候補プレビューの生成を含む）
   */
  public function bulkCreate(Request $request): Response
  {
    $admins = Admin::with('profile')
      ->whereHas('profile')
      ->get()
      ->map(fn($admin) => [
        'value' => $admin->id,
        'label' => $admin->profile->full_name ?? $admin->email
      ]);

    $slotTypes = [
      ['value' => 'meeting', 'label' => '面談'],
      ['value' => 'progress_review', 'label' => '進捗会'],
      ['value' => 'consultation', 'label' => '相談'],
      ['value' => 'other', 'label' => 'その他'],
    ];

    $params = $request->validate([
      'start_date' => 'nullable|date',
      'end_date' => 'nullable|date|after_or_equal:start_date',
      'assigned_admin_id' => 'nullable|exists:admins,id',
      'slot_type' => 'nullable|in:meeting,progress_review,consultation,other',
      'duration_minutes' => 'nullable|integer|min:10|max:480',
      'interval_minutes' => 'nullable|integer|min:10|max:480',
      'max_capacity' => 'nullable|integer|min:1|max:100',
    ]);

    $startDate = isset($params['start_date']) ? Carbon::parse($params['start_date']) : now()->startOfDay();
    $endDate = isset($params['end_date']) ? Carbon::parse($params['end_date']) : $startDate->copy()->addDays(6);
    $durationMinutes = $params['duration_minutes'] ?? 50;
    // デフォルトは60分間隔・50分枠（9:00-9:50, 10:00-10:50…と毎時0分始まりになる）
    $intervalMinutes = $params['interval_minutes'] ?? 60;
    $maxCapacity = $params['max_capacity'] ?? 1;
    $slotType = $params['slot_type'] ?? 'meeting';
    $assignedAdminId = $params['assigned_admin_id'] ?? null;

    $preview = null;
    $rangeError = null;

    if ($startDate->diffInDays($endDate) + 1 > self::BULK_CREATE_MAX_DAYS) {
      $rangeError = __('messages.appointment_slot.bulk_create_period_max', ['days' => self::BULK_CREATE_MAX_DAYS]);
    } else {
      // 期間内の既存予約枠（担当者が同じものは重複判定に使う）
      $existingSlotsByDate = AppointmentSlot::whereBetween('date', [$startDate->format('Y-m-d'), $endDate->format('Y-m-d')])
        ->when($assignedAdminId, fn($q) => $q->where('assigned_admin_id', $assignedAdminId))
        ->get()
        ->groupBy(fn($slot) => $slot->date->format('Y-m-d'));

      // 担当者を選択している場合、期間内の当該担当者のシフトを取得しておく
      // （生成した候補のうち、シフト時間外のものはデフォルトでチェックを外すため）
      $shiftsByDate = $assignedAdminId
        ? AdminShift::where('admin_id', $assignedAdminId)
          ->whereBetween('shift_date', [$startDate->format('Y-m-d'), $endDate->format('Y-m-d')])
          ->get()
          ->groupBy(fn($shift) => $shift->shift_date->format('Y-m-d'))
        : collect();

      $preview = collect();
      $current = $startDate->copy();

      while ($current->lte($endDate)) {
        if ($this->scheduleService->isBusinessDay($current)) {
          $daySlots = $this->scheduleService->getAvailableTimeSlots($current, $intervalMinutes, $durationMinutes);
          $existingForDay = $existingSlotsByDate->get($current->format('Y-m-d'), collect());
          $shiftsForDay = $shiftsByDate->get($current->format('Y-m-d'), collect());

          $rows = $daySlots
            ->reject(function ($slot) use ($existingForDay) {
              return $existingForDay->contains(function ($existing) use ($slot) {
                $existingStart = substr($existing->start_time, 0, 5);
                $existingEnd = substr($existing->end_time, 0, 5);

                return $existingStart === $slot['start']
                  || (
                    $slot['start'] < $existingEnd
                    && $slot['end'] > $existingStart
                  );
              });
            })
            ->map(function ($slot) use ($current, $assignedAdminId, $shiftsForDay) {
              // 担当者未選択の場合はシフトによる絞り込みができないため常にチェックを入れる
              $withinShift = !$assignedAdminId || $this->isWithinAnyShift($slot['start'], $slot['end'], $shiftsForDay);

              return [
                'date' => $current->format('Y-m-d'),
                'day_name' => ['日', '月', '火', '水', '木', '金', '土'][$current->dayOfWeek],
                'start_time' => $slot['start'],
                'end_time' => $slot['end'],
                'include' => $withinShift,
                'within_shift' => $withinShift,
              ];
            })
            ->values();

          if ($rows->isNotEmpty()) {
            $preview->push([
              'date' => $current->format('Y-m-d'),
              'day_name' => ['日', '月', '火', '水', '木', '金', '土'][$current->dayOfWeek],
              'rows' => $rows,
              // フロント側で「この日の担当者シフト」を表示するための情報
              'shifts' => $assignedAdminId
                ? $shiftsForDay->map(fn($shift) => [
                  'start_time' => substr($shift->start_time, 0, 5),
                  'end_time' => substr($shift->end_time, 0, 5),
                ])->values()
                : null,
            ]);
          }
        }
        $current->addDay();
      }
    }

    return Inertia::render('Admin/AppointmentSlots/BulkCreate', [
      'admins' => $admins,
      'slotTypes' => $slotTypes,
      'preview' => $preview,
      'rangeError' => $rangeError,
      'form' => [
        'start_date' => $startDate->format('Y-m-d'),
        'end_date' => $endDate->format('Y-m-d'),
        'assigned_admin_id' => $assignedAdminId,
        'slot_type' => $slotType,
        'duration_minutes' => $durationMinutes,
        'interval_minutes' => $intervalMinutes,
        'max_capacity' => $maxCapacity,
      ],
      'maxDays' => self::BULK_CREATE_MAX_DAYS,
    ]);
  }

  /**
   * まとめて作成の一括保存
   */
  public function bulkStore(Request $request)
  {
    $validated = $request->validate([
      'slot_type' => 'required|in:meeting,progress_review,consultation,other',
      'max_capacity' => 'required|integer|min:1|max:100',
      'assigned_admin_id' => 'nullable|exists:admins,id',
      'slots' => 'required|array|min:1',
      'slots.*.date' => 'required|date',
      'slots.*.start_time' => 'required|date_format:H:i',
      'slots.*.end_time' => 'required|date_format:H:i|after:slots.*.start_time',
    ]);

    $dates = collect($validated['slots'])->pluck('date');
    if ($dates->max() && $dates->min()
      && Carbon::parse($dates->min())->diffInDays(Carbon::parse($dates->max())) + 1 > self::BULK_CREATE_MAX_DAYS) {
      return redirect()->back()
        ->withInput()
        ->with('error', __('messages.appointment_slot.bulk_create_period_max', ['days' => self::BULK_CREATE_MAX_DAYS]));
    }

    $createdBy = Auth::guard('admins')->id();
    $createdCount = 0;
    $skippedCount = 0;

    try {
      DB::transaction(function () use ($validated, $createdBy, &$createdCount, &$skippedCount) {
        foreach ($validated['slots'] as $slot) {
          // 同じ担当者・同日時の重複を防ぐ（保存直前の再チェック）
          $overlaps = AppointmentSlot::where('date', $slot['date'])
            ->where('assigned_admin_id', $validated['assigned_admin_id'] ?? null)
            ->where('start_time', '<', $slot['end_time'])
            ->where('end_time', '>', $slot['start_time'])
            ->exists();

          if ($overlaps) {
            $skippedCount++;
            continue;
          }

          AppointmentSlot::create([
            'date' => $slot['date'],
            'start_time' => $slot['start_time'],
            'end_time' => $slot['end_time'],
            'slot_type' => $validated['slot_type'],
            'max_capacity' => $validated['max_capacity'],
            'current_bookings' => 0,
            'assigned_admin_id' => $validated['assigned_admin_id'] ?? null,
            'status' => 'available',
            'created_by' => $createdBy,
          ]);
          $createdCount++;
        }
      });

      $message = "{$createdCount}件の予約枠を作成しました。";
      if ($skippedCount > 0) {
        $message .= "（{$skippedCount}件は重複のためスキップしました）";
      }

      return redirect()->route('admin.appointment-slots.index')->with('success', $message);
    } catch (\Exception $e) {
      Log::error('AppointmentSlot bulkStore error: ' . $e->getMessage());
      return redirect()->back()
        ->withInput()
        ->with('error', __('messages.appointment_slot.bulk_create_failed'));
    }
  }

  /**
   * Display the specified resource.
   */
  public function show(AppointmentSlot $appointmentSlot): Response
  {
    $appointmentSlot->load([
      'assignedAdmin.profile',
      'appointments.user',
      'appointments.company',
      'appointments.project',
      'creator.profile',
      'updater.profile'
    ]);

    return Inertia::render('Admin/AppointmentSlots/Show', [
      'appointmentSlot' => $appointmentSlot,
    ]);
  }

  /**
   * Show the form for editing the specified resource.
   */
  public function edit(Request $request, AppointmentSlot $appointmentSlot): Response
  {
    $admins = Admin::with('profile')
      ->whereHas('profile')
      ->get()
      ->map(fn($admin) => [
        'value' => $admin->id,
        'label' => $admin->profile->full_name ?? $admin->email
      ]);

    $slotTypes = [
      ['value' => 'meeting', 'label' => '面談'],
      ['value' => 'progress_review', 'label' => '進捗会'],
      ['value' => 'consultation', 'label' => '相談'],
      ['value' => 'other', 'label' => 'その他'],
    ];

    $statuses = [
      ['value' => 'available', 'label' => '予約可能'],
      ['value' => 'blocked', 'label' => 'ブロック中'],
    ];

    return Inertia::render('Admin/AppointmentSlots/Edit', [
      'appointmentSlot' => $appointmentSlot->load('assignedAdmin.profile'),
      'admins' => $admins,
      'slotTypes' => $slotTypes,
      'statuses' => $statuses,
      'shiftInfo' => $this->getShiftInfo(
        $request->query('assigned_admin_id', $appointmentSlot->assigned_admin_id),
        $request->query('date', optional($appointmentSlot->date)->format('Y-m-d'))
      ),
    ]);
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(Request $request, AppointmentSlot $appointmentSlot)
  {
    $validated = $request->validate([
      'date' => 'required|date',
      // 編集画面では既存レコード（TIME型カラム=秒付き "H:i:s"）の値がそのまま
      // 送られてくることがあるため、"H:i" だけでなく "H:i:s" も許可する
      'start_time' => 'required|date_format:H:i,H:i:s',
      'end_time' => 'required|date_format:H:i,H:i:s|after:start_time',
      'slot_type' => 'required|in:meeting,progress_review,consultation,other',
      'max_capacity' => 'required|integer|min:1|max:100',
      'assigned_admin_id' => 'nullable|exists:admins,id',
      'status' => 'required|in:available,blocked,full',
      'notes' => 'nullable|string|max:1000',
    ]);

    try {
      $validated['updated_by'] = Auth::guard('admins')->id();

      $appointmentSlot->update($validated);

      return redirect()->route('admin.appointment-slots.index')
        ->with('success', __('messages.updated', ['attribute' => '予約枠']));
    } catch (\Exception $e) {
      Log::error('AppointmentSlot update error: ' . $e->getMessage());
      return redirect()->back()
        ->withInput()
        ->with('error', __('messages.update_failed', ['attribute' => '予約枠']));
    }
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(AppointmentSlot $appointmentSlot)
  {
    try {
      // 予約がある場合は削除不可
      if ($appointmentSlot->appointments()->whereIn('status', ['pending', 'confirmed'])->exists()) {
        return redirect()->back()
          ->with('error', __('messages.appointment_slot.has_appointments'));
      }

      $appointmentSlot->deleted_by = Auth::guard('admins')->id();
      $appointmentSlot->save();
      $appointmentSlot->delete();

      return redirect()->route('admin.appointment-slots.index')
        ->with('success', __('messages.deleted', ['attribute' => '予約枠']));
    } catch (\Exception $e) {
      Log::error('AppointmentSlot destroy error: ' . $e->getMessage());
      return redirect()->back()
        ->with('error', __('messages.delete_failed', ['attribute' => '予約枠']));
    }
  }
}
