<?php

namespace App\Http\Controllers\Admin\Schedule;

use App\Http\Controllers\Controller;
use App\Http\Requests\ScheduleDefaultRequest;
use App\Models\ScheduleDefault;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ScheduleDefaultController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response|RedirectResponse
    {
        // 曜日ごとのスケジュールを取得（0:日曜日 ～ 6:土曜日）
        $schedules = ScheduleDefault::orderBy('day_of_week')
            ->get()
            ->keyBy('day_of_week');

        // 7日分のスケジュールを準備（未設定の場合は空配列）
        $weekSchedules = [];
        $dayNames = ['日', '月', '火', '水', '木', '金', '土'];

        for ($i = 0; $i < 7; $i++) {
            $weekSchedules[] = $schedules->get($i) ?? [
                'day_of_week' => $i,
                'day_name' => $dayNames[$i],
                'is_open' => false,
                'open_time' => null,
                'close_time' => null,
                'break_start' => null,
                'break_end' => null,
            ];
        }

        return Inertia::render('Admin/Schedules/Default', [
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
     * Remove the specified resource from storage.
     */
    public function destroy(ScheduleDefault $scheduleDefault)
    {
        //
    }
}
