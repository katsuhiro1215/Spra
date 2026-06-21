<?php

namespace App\Console\Commands;

use App\Services\AppointmentNotificationService;
use Illuminate\Console\Command;

class SendAppointmentReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'appointments:send-reminders {--hours=24 : 予約の何時間前にリマインダーを送信するか}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = '予約リマインダーを送信します';

    /**
     * Execute the console command.
     */
    public function handle(AppointmentNotificationService $notificationService)
    {
        $hours = (int) $this->option('hours');

        $this->info("予約リマインダーを送信しています（{$hours}時間前の予約）...");

        $count = $notificationService->sendUpcomingReminders($hours);

        $this->info("{$count}件のリマインダーを送信しました。");

        return Command::SUCCESS;
    }
}
