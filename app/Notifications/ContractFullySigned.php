<?php

namespace App\Notifications;

use App\Models\Contract;
use Illuminate\Notifications\Notification;

class ContractFullySigned extends Notification
{
    public function __construct(private Contract $contract) {}

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
            'title' => '契約書の署名が完了しました',
            'message' => "「{$this->contract->title}」の契約書が両者の署名により完了しました。",
            'contract_id' => $this->contract->id,
            'url' => route('user.contract.show', $this->contract->id),
        ];
    }
}
