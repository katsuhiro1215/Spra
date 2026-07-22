<?php

namespace App\Http\Controllers\Admin\Schedule;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\Appointment;
use App\Models\AppointmentSlot;
use App\Services\ScheduleService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ScheduleController extends Controller
{
    protected ScheduleService $scheduleService;

    public function __construct(ScheduleService $scheduleService)
    {
        $this->scheduleService = $scheduleService;
    }

    /**
     * Display integrated schedule calendar
     */
    public function calendar(Request $request): Response
    {
        // 表示期間を取得（デフォルトは今月）
        $year = (int) $request->input('year', now()->year);
        $month = (int) $request->input('month', now()->month);

        $startDate = Carbon::create($year, $month, 1)->startOfMonth();
        $endDate = $startDate->copy()->endOfMonth();

        // カレンダーデータを取得
        $calendar = $this->scheduleService->getBusinessCalendar($startDate, $endDate);

        // 今月の休日一覧を取得
        $holidays = $this->scheduleService->getHolidaysForMonth($year, $month);

        // 期間内の予約を日付ごとにグループ化して取得（カレンダー上に表示するため）
        $appointments = Appointment::with(['appointmentSlot', 'user.profile'])
            ->whereHas('appointmentSlot', function ($query) use ($startDate, $endDate) {
                $query->whereBetween('date', [$startDate->format('Y-m-d'), $endDate->format('Y-m-d')]);
            })
            ->whereNotIn('status', ['cancelled'])
            ->get()
            ->groupBy(fn (Appointment $appointment) => $appointment->appointmentSlot->date->format('Y-m-d'))
            ->map(function ($dayAppointments) {
                return $dayAppointments
                    ->sortBy(fn (Appointment $appointment) => $appointment->appointmentSlot->start_time)
                    ->map(fn (Appointment $appointment) => [
                        'id' => $appointment->id,
                        'start_time' => $appointment->appointmentSlot->start_time,
                        'end_time' => $appointment->appointmentSlot->end_time,
                        'subject' => $appointment->subject,
                        'status' => $appointment->status,
                        'status_color' => Appointment::getStatusColor($appointment->status),
                        'booker_name' => $appointment->booker_name,
                        'is_guest_booking' => $appointment->is_guest_booking,
                    ])
                    ->values();
            });

        // 期間内の予約枠を日付ごとにグループ化して取得（カレンダーからの枠作成のため）
        $appointmentSlots = AppointmentSlot::with('assignedAdmin.profile')
            ->whereBetween('date', [$startDate->format('Y-m-d'), $endDate->format('Y-m-d')])
            ->orderBy('start_time')
            ->get()
            ->groupBy(fn (AppointmentSlot $slot) => $slot->date->format('Y-m-d'))
            ->map(function ($daySlots) {
                return $daySlots->map(fn (AppointmentSlot $slot) => [
                    'id' => $slot->id,
                    'start_time' => $slot->start_time,
                    'end_time' => $slot->end_time,
                    'slot_type' => $slot->slot_type,
                    'slot_type_label' => AppointmentSlot::getSlotTypeLabel($slot->slot_type),
                    'status' => $slot->status,
                    'status_label' => AppointmentSlot::getStatusLabel($slot->status),
                    'max_capacity' => $slot->max_capacity,
                    'current_bookings' => $slot->current_bookings,
                    'assigned_admin_name' => $slot->assignedAdmin?->profile?->full_name,
                ])->values();
            });

        // 担当者選択肢
        $admins = Admin::with('profile')
            ->whereHas('profile')
            ->get()
            ->map(fn ($admin) => [
                'value' => $admin->id,
                'label' => $admin->profile->full_name ?? $admin->email,
            ]);

        // サブビュー（週・日）の表示状態をURLで保持し、枠作成後の再読み込みでも同じ表示に戻れるようにする
        $viewMode = $request->input('view', 'month');

        // 週・日表示の基準日。指定が無い場合、表示中の年月が「今月」であれば今日を、
        // それ以外（前後の月へ移動した後など）はその月の1日を基準にする。
        $today = now();
        $selectedDate = $request->input('date')
            ?? ($today->year === $year && $today->month === $month
                ? $today->format('Y-m-d')
                : $startDate->format('Y-m-d'));

        return Inertia::render('Admin/Schedules/Index', [
            'calendar' => $calendar,
            'holidays' => $holidays,
            'appointments' => $appointments,
            'appointmentSlots' => $appointmentSlots,
            'admins' => $admins,
            'currentYear' => $year,
            'currentMonth' => $month,
            'viewMode' => $viewMode,
            'selectedDate' => $selectedDate,
        ]);
    }
}
