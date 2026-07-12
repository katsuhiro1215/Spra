<?php

namespace App\Notifications;

use App\Models\Project;
use Illuminate\Notifications\Notification;

class ProjectCreatedForUser extends Notification
{
    public function __construct(private Project $project) {}

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
            'title' => '新しいプロジェクトが開始されました',
            'message' => "「{$this->project->title}」が開始されました。",
            'project_id' => $this->project->id,
            'url' => route('user.projects.show', $this->project->id),
        ];
    }
}
