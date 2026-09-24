<?php

namespace App\Console\Commands\AiStaff;

use App\Models\AiStaffActivityLog;
use App\Models\AiStaffDailyReport;
use Carbon\Carbon;
use Illuminate\Console\Command;

class GenerateDailyReports extends Command
{
    protected $signature = 'ai-staff:generate-daily-reports {date? : 集計対象日(YYYY-MM-DD、省略時は前日)}';

    protected $description = 'AI社員の活動ログ(ai_staff_activity_logs)から、AI社員ごとの日報(ai_staff_daily_reports)を生成する';

    public function handle(): int
    {
        $date = $this->argument('date')
            ? Carbon::parse($this->argument('date'))->startOfDay()
            : now()->subDay()->startOfDay();

        $this->info("集計対象日: {$date->toDateString()}");

        $logs = AiStaffActivityLog::query()
            ->whereBetween('occurred_at', [$date->copy()->startOfDay(), $date->copy()->endOfDay()])
            ->orderBy('occurred_at')
            ->get()
            ->groupBy('admin_id');

        if ($logs->isEmpty()) {
            $this->line('対象日の活動ログがありません（日報は作成しません）');

            return self::SUCCESS;
        }

        foreach ($logs as $adminId => $adminLogs) {
            $body = $adminLogs
                ->map(fn (AiStaffActivityLog $log) => sprintf(
                    '[%s] %s',
                    $log->occurred_at->format('H:i'),
                    $log->description
                ))
                ->implode("\n");

            AiStaffDailyReport::updateOrCreate(
                ['admin_id' => $adminId, 'report_date' => $date->toDateString()],
                [
                    'body' => $body,
                    'activity_count' => $adminLogs->count(),
                    'generated_at' => now(),
                ]
            );

            $this->line("  admin_id={$adminId}: {$adminLogs->count()}件のログから日報を生成しました");
        }

        $this->info('日報の生成が完了しました。');

        return self::SUCCESS;
    }
}
