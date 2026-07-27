<?php

namespace App\Notifications;

use App\Models\Announcement;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Str;

class AnnouncementPublished extends Notification
{
    public function __construct(private Announcement $announcement) {}

    /**
     * mail + database を同期実行する。この環境ではキューワーカーが常駐していないため、
     * 既存のNotificationクラス群（InvoiceSent等）と同様にShouldQueueは実装しない
     * （実装するとキューワーカーが動いていない環境ではメールもダッシュボード通知も届かなくなる）。
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $mail = (new MailMessage)
            ->subject("【お知らせ】{$this->announcement->title}")
            ->greeting($this->announcement->title);

        $paragraphs = preg_split('/\n{2,}/', trim($this->announcement->body)) ?: [$this->announcement->body];
        foreach ($paragraphs as $paragraph) {
            $mail->line($paragraph);
        }

        return $mail
            ->action('お知らせを確認する', route('user.announcement.show', $this->announcement->id))
            ->line('ご不明な点がございましたら、お問い合わせフォームよりご連絡ください。');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'title' => $this->announcement->title,
            'message' => Str::limit(strip_tags($this->announcement->body), 100),
            'announcement_id' => $this->announcement->id,
            'url' => route('user.announcement.show', $this->announcement->id),
        ];
    }
}
