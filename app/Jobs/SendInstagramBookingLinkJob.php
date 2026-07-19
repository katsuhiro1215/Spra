<?php

namespace App\Jobs;

use App\Services\InstagramMessagingService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

/**
 * Instagram DM送信者へ無料相談予約ページへのリンクを自動返信する
 */
class SendInstagramBookingLinkJob implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public string $igsid,
    ) {}

    public function handle(InstagramMessagingService $messagingService): void
    {
        try {
            $messagingService->sendBookingLink($this->igsid);
        } catch (\Exception $e) {
            Log::error('Instagram予約リンク送信ジョブでエラーが発生しました', [
                'igsid' => $this->igsid,
                'error' => $e->getMessage(),
            ]);

            $this->release(60);
        }
    }

    public function failed(\Throwable $exception): void
    {
        Log::error('Instagram予約リンク送信ジョブが失敗しました', [
            'igsid' => $this->igsid,
            'exception' => $exception->getMessage(),
        ]);
    }
}
