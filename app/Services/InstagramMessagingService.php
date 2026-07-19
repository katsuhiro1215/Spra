<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Instagram Messaging API(Graph API)を通じたDM送信を担う
 */
class InstagramMessagingService
{
    private const GRAPH_API_BASE = 'https://graph.facebook.com/v19.0';

    /**
     * DM送信者へ無料相談予約ページへのリンクを送信する
     *
     * @throws \RuntimeException Graph APIがエラーを返した場合
     */
    public function sendBookingLink(string $igsid): void
    {
        $bookingUrl = route('consultation', ['source' => 'instagram', 'ref' => $igsid]);

        $response = Http::withQueryParameters([
            'access_token' => config('services.instagram.page_access_token'),
        ])->post(self::GRAPH_API_BASE . '/me/messages', [
            'recipient' => ['id' => $igsid],
            'message' => [
                'text' => "お問い合わせありがとうございます。以下のページから無料相談のご予約が可能です。\n{$bookingUrl}",
            ],
        ]);

        if ($response->failed()) {
            Log::error('Instagram DM送信に失敗しました', [
                'igsid' => $igsid,
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            throw new \RuntimeException('Instagram DMの送信に失敗しました: ' . $response->body());
        }
    }
}
