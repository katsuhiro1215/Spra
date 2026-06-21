<?php

namespace App\Http\Controllers\Admin\Schedule;

use App\Http\Controllers\Controller;
use App\Http\Requests\ScheduleDefaultRequest;
use App\Models\ScheduleDefault;
use App\Services\ScheduleService;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ScheduleDefaultController extends Controller
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
        $year = $request->input('year', now()->year);
        $month = $request->input('month', now()->month);
        
        $startDate = Carbon::create($year, $month, 1)->startOfMonth();
        $endDate = $startDate->copy()->endOfMonth();

        // カレンダーデータを取得
        $calendar = $this->scheduleService->getBusinessCalendar($startDate, $endDate);
        
        // 今月の休日一覧を取得
        $holidays = $this->scheduleService->getHolidaysForMonth($year, $month);

        return Inertia::render('Admin/Schedules/Index', [
            'calendar' => $calendar,
            'holidays' => $holidays,
            'currentYear' => $year,
            'currentMonth' => $month,
        ]);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(): Response|RedirectResponse
    {
        // 曜日ごとのスケジュールを取得（0:日曜日 ～ 6:土曜日）
        $schedules = ScheduleDefault::orderBy('day_of_week')
            ->get()
            ->keyBy('day_of_week');

        // 7日分のスケジュールを準備（未設定の場合はデフォルト値）
        $weekSchedules = [];
        $dayNames = ['日', '月', '火', '水', '木', '金', '土'];

        for ($i = 0; $i < 7; $i++) {
            if ($schedules->has($i)) {
                $schedule = $schedules->get($i);
                $weekSchedules[] = [
                    'id' => $schedule->id,
                    'day_of_week' => $schedule->day_of_week,
                    'day_name' => $dayNames[$i],
                    'is_open' => $schedule->is_open,
                    'open_time' => $schedule->open_time,
                    'close_time' => $schedule->close_time,
                    'break_start' => $schedule->break_start,
                    'break_end' => $schedule->break_end,
                ];
            } else {
                $weekSchedules[] = [
                    'day_of_week' => $i,
                    'day_name' => $dayNames[$i],
                    'is_open' => false,
                    'open_time' => null,
                    'close_time' => null,
                    'break_start' => null,
                    'break_end' => null,
                ];
            }
        }

        return Inertia::render('Admin/Schedules/Defaults/Index', [
            'schedules' => $weekSchedules,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ScheduleDefaultRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(ScheduleDefault $scheduleDefault)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ScheduleDefault $scheduleDefault)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ScheduleDefaultRequest $request, ScheduleDefault $scheduleDefault)
    {
        //
    }

    /**
     * Bulk update all schedules
     */
    public function bulkUpdate(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'schedules' => 'required|array',
            'schedules.*.day_of_week' => 'required|integer|between:0,6',
            'schedules.*.is_open' => 'required|boolean',
            'schedules.*.open_time' => 'nullable|date_format:H:i',
            'schedules.*.close_time' => 'nullable|date_format:H:i',
            'schedules.*.break_start' => 'nullable|date_format:H:i',
            'schedules.*.break_end' => 'nullable|date_format:H:i',
        ]);

        foreach ($validated['schedules'] as $scheduleData) {
            ScheduleDefault::updateOrCreate(
                ['day_of_week' => $scheduleData['day_of_week']],
                [
                    'is_open' => $scheduleData['is_open'],
                    'open_time' => $scheduleData['is_open'] ? $scheduleData['open_time'] : null,
                    'close_time' => $scheduleData['is_open'] ? $scheduleData['close_time'] : null,
                    'break_start' => $scheduleData['is_open'] ? $scheduleData['break_start'] : null,
                    'break_end' => $scheduleData['is_open'] ? $scheduleData['break_end'] : null,
                    'created_by' => auth()->id(),
                    'updated_by' => auth()->id(),
                ]
            );
        }

        return redirect()->route('admin.schedules.defaults.index')
            ->with('success', 'デフォルトスケジュールを更新しました。');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ScheduleDefault $scheduleDefault)
    {
        //
    }
}
