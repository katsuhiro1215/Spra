<?php

namespace App\Services;

use App\Models\Admin;
use App\Models\AdminAttendanceRecord;
use App\Models\AdminShift;
use Carbon\Carbon;
use Illuminate\Support\Collection;

/**
 * 勤怠管理サービス
 *
 * シフト予定と出退勤実績を扱う。
 */
class AttendanceService
{
    public function clockIn(Admin $admin, ?Carbon $at = null): AdminAttendanceRecord
    {
        $at ??= now();

        $record = AdminAttendanceRecord::firstOrNew([
            'admin_id' => $admin->id,
            'work_date' => $at->format('Y-m-d'),
        ]);

        if (!$record->exists) {
            $record->created_by = $admin->id;
        }

        if (!$record->clocked_in_at) {
            $record->clocked_in_at = $at;
        }

        $record->clocked_out_at = null;
        $record->status = 'working';
        $record->updated_by = $admin->id;
        $record->save();

        return $record;
    }

    public function clockOut(Admin $admin, ?Carbon $at = null): AdminAttendanceRecord
    {
        $at ??= now();

        $record = AdminAttendanceRecord::firstOrNew([
            'admin_id' => $admin->id,
            'work_date' => $at->format('Y-m-d'),
        ]);

        if (!$record->exists) {
            $record->created_by = $admin->id;
            $record->clocked_in_at = $at;
        }

        $record->clocked_out_at = $at;
        $record->status = 'finished';
        $record->updated_by = $admin->id;
        $record->save();

        return $record;
    }

    public function getTodayRecord(Admin $admin): ?AdminAttendanceRecord
    {
        return AdminAttendanceRecord::where('admin_id', $admin->id)
            ->where('work_date', now()->format('Y-m-d'))
            ->first();
    }

    /**
     * 本日出勤中の管理者一覧を取得
     */
    public function getWorkingNow(): Collection
    {
        return AdminAttendanceRecord::with('admin.profile')
            ->where('work_date', now()->format('Y-m-d'))
            ->currentlyWorking()
            ->get();
    }

    /**
     * 期間内の全管理者の状態マップ（admin_id => status）を取得
     */
    public function getStatusMap(): array
    {
        return AdminAttendanceRecord::where('work_date', now()->format('Y-m-d'))
            ->get()
            ->pluck('status', 'admin_id')
            ->all();
    }

    /**
     * 指定期間のシフト予定・出退勤実績を日付ごとにまとめて取得（N+1回避のためバッチ取得）
     */
    public function getAttendanceCalendar(Carbon $startDate, Carbon $endDate): Collection
    {
        $shifts = AdminShift::with('admin.profile')
            ->whereBetween('shift_date', [$startDate->format('Y-m-d'), $endDate->format('Y-m-d')])
            ->orderBy('start_time')
            ->get()
            ->groupBy(fn (AdminShift $shift) => $shift->shift_date->format('Y-m-d'));

        $records = AdminAttendanceRecord::with('admin.profile')
            ->whereBetween('work_date', [$startDate->format('Y-m-d'), $endDate->format('Y-m-d')])
            ->get()
            ->groupBy(fn (AdminAttendanceRecord $record) => $record->work_date->format('Y-m-d'));

        $calendar = collect();
        $current = $startDate->copy();

        while ($current->lte($endDate)) {
            $dateKey = $current->format('Y-m-d');

            $calendar->put($dateKey, [
                'date' => $dateKey,
                'shifts' => ($shifts->get($dateKey) ?? collect())->map(fn (AdminShift $shift) => [
                    'id' => $shift->id,
                    'admin_id' => $shift->admin_id,
                    'admin_name' => $shift->admin?->profile?->full_name ?? $shift->admin?->email,
                    'start_time' => $shift->start_time,
                    'end_time' => $shift->end_time,
                ])->values(),
                'records' => ($records->get($dateKey) ?? collect())->map(fn (AdminAttendanceRecord $record) => [
                    'id' => $record->id,
                    'admin_id' => $record->admin_id,
                    'admin_name' => $record->admin?->profile?->full_name ?? $record->admin?->email,
                    'clocked_in_at' => $record->clocked_in_at?->format('H:i'),
                    'clocked_out_at' => $record->clocked_out_at?->format('H:i'),
                    'status' => $record->status,
                    'status_label' => AdminAttendanceRecord::getStatusLabel($record->status),
                ])->values(),
            ]);

            $current->addDay();
        }

        return $calendar;
    }
}
