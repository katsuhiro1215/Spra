<?php

namespace App\Http\Controllers\Admin\Attendance;

use App\Http\Controllers\Controller;
use App\Services\AttendanceService;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AttendanceController extends Controller
{
    public function __construct(private AttendanceService $attendanceService)
    {
    }

    /**
     * 勤怠カレンダー（月表示）＋現在出勤中の一覧
     */
    public function calendar(Request $request): Response
    {
        $year = (int) $request->input('year', now()->year);
        $month = (int) $request->input('month', now()->month);

        $startDate = Carbon::create($year, $month, 1)->startOfMonth();
        $endDate = $startDate->copy()->endOfMonth();

        $calendar = $this->attendanceService->getAttendanceCalendar($startDate, $endDate);
        $workingNow = $this->attendanceService->getWorkingNow()->map(fn ($record) => [
            'admin_id' => $record->admin_id,
            'admin_name' => $record->admin?->profile?->full_name ?? $record->admin?->email,
            'clocked_in_at' => $record->clocked_in_at?->format('H:i'),
        ])->values();

        return Inertia::render('Admin/Attendance/Index', [
            'calendar' => $calendar,
            'workingNow' => $workingNow,
            'currentYear' => $year,
            'currentMonth' => $month,
        ]);
    }

    /**
     * 出勤打刻
     */
    public function clockIn(Request $request): RedirectResponse
    {
        $admin = Auth::guard('admins')->user();
        $this->attendanceService->clockIn($admin);

        return redirect()->back()->with('success', __('messages.recorded', ['attribute' => '出勤']));
    }

    /**
     * 退勤打刻
     */
    public function clockOut(Request $request): RedirectResponse
    {
        $admin = Auth::guard('admins')->user();
        $this->attendanceService->clockOut($admin);

        return redirect()->back()->with('success', __('messages.recorded', ['attribute' => '退勤']));
    }
}
