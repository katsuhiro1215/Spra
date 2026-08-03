<?php

namespace App\Console\Commands;

use App\Notifications\TaskDueReminder;
use App\Services\TaskService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Notification;

class SendTaskReminders extends Command
{
    protected $signature = 'tasks:send-reminders {--minutes=30 : 期限の何分前を対象にするか}';

    protected $description = '期限が近いタスクの担当者へリマインダー通知を送信します';

    public function handle(TaskService $service)
    {
        $minutes = (int) $this->option('minutes');
        $tasks = $service->getTasksNeedingReminder($minutes);

        foreach ($tasks as $task) {
            Notification::send($task->admin, new TaskDueReminder($task));
            $task->update(['reminder_sent_at' => now()]);
        }

        $this->info("{$tasks->count()}件のリマインダーを送信しました。");

        return Command::SUCCESS;
    }
}
