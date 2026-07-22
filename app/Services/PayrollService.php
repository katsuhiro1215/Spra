<?php

namespace App\Services;

use App\Models\Admin;
use App\Models\AdminAttendanceRecord;
use App\Models\AdminEmployment;
use Carbon\Carbon;
use Illuminate\Support\Collection;

/**
 * 給与計算サービス
 *
 * 勤怠実績（AdminAttendanceRecord）と雇用設定（AdminEmployment）から、
 * 指定月の支給額をその場で概算する（保存はしない・確定処理は将来の拡張）。
 *
 * 保留事項: 残業/深夜/休日割増、遅刻早退控除、所得税・住民税の源泉徴収、
 * 社会保険料控除、各種手当、時刻の端数処理ルールは未実装。
 */
class PayrollService
{
    /**
     * 指定年月の全管理者（雇用設定が登録済みの者に限る）の給与を概算する
     */
    public function calculateForMonth(int $year, int $month): Collection
    {
        $startDate = Carbon::create($year, $month, 1)->startOfMonth();
        $endDate = $startDate->copy()->endOfMonth();

        $recordsByAdmin = AdminAttendanceRecord::whereBetween('work_date', [
            $startDate->format('Y-m-d'),
            $endDate->format('Y-m-d'),
        ])
            ->get()
            ->groupBy('admin_id');

        return Admin::with(['profile', 'employment'])
            ->whereHas('employment')
            ->get()
            ->map(fn (Admin $admin) => $this->calculateForAdmin($admin, $recordsByAdmin->get($admin->id, collect())))
            ->sortBy('admin_name')
            ->values();
    }

    protected function calculateForAdmin(Admin $admin, Collection $records): array
    {
        /** @var AdminEmployment $employment */
        $employment = $admin->employment;

        $workedMinutes = $records->sum(fn (AdminAttendanceRecord $record) => $record->getWorkedMinutes() ?? 0);
        $workedHours = round($workedMinutes / 60, 2);
        $workDays = $records->where('status', 'finished')->count();

        $pay = $employment->pay_type === 'hourly'
            ? round($workedHours * (float) $employment->hourly_wage)
            : (float) $employment->base_salary;

        return [
            'admin_id' => $admin->id,
            'admin_name' => $admin->profile?->full_name ?? $admin->email,
            'employment_type' => $employment->employment_type,
            'employment_type_label' => AdminEmployment::getEmploymentTypeLabel($employment->employment_type),
            'pay_type' => $employment->pay_type,
            'pay_type_label' => AdminEmployment::getPayTypeLabel($employment->pay_type),
            'base_salary' => $employment->base_salary,
            'hourly_wage' => $employment->hourly_wage,
            'work_days' => $workDays,
            'worked_minutes' => $workedMinutes,
            'worked_hours' => $workedHours,
            'pay' => $pay,
        ];
    }
}
