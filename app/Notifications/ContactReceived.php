<?php

namespace App\Notifications;

use App\Models\Contact;
use Illuminate\Notifications\Notification;

class ContactReceived extends Notification
{
    public function __construct(private Contact $contact) {}

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
            'title' => 'お問い合わせがありました',
            'message' => "{$this->contact->name}様より「{$this->contact->subject}」のお問い合わせがありました。",
            'color' => 'blue',
            'contact_id' => $this->contact->id,
            'url' => route('admin.contact.show', $this->contact->id),
        ];
    }
}
