<?php

namespace App\Notifications;

use App\Models\Task;
use Illuminate\Notifications\Notification;

class TaskDueReminder extends Notification
{
    public function __construct(private Task $task) {}

    /**
     * database チャンネルのみ（同期実行・キューワーカー不要）
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'title' => 'タスクの期限が近づいています',
            'message' => "「{$this->task->title}」の期限が近づいています。",
            'task_id' => $this->task->id,
            'url' => route('admin.task.index'),
        ];
    }
}
