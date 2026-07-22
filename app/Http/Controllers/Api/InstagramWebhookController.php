<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\SendInstagramBookingLinkJob;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\Log;

/**
 * Instagram(Meta) Webhook連携コントローラー
 *
 * DMを受信したら、既存の無料相談予約ページへのリンクを自動返信する
 * （DM内で予約を完結させる会話フローは実装しない）
 */
class InstagramWebhookController extends Controller
{
    /**
     * Webhook購読の検証用ハンドシェイク（Meta Developer Console設定時に一度だけ呼ばれる）
     */
    public function verify(Request $request): HttpResponse
    {
        $mode = $request->query('hub_mode', $request->query('hub.mode'));
        $token = $request->query('hub_verify_token', $request->query('hub.verify_token'));
        $challenge = $request->query('hub_challenge', $request->query('hub.challenge'));

        if ($mode === 'subscribe' && $token === config('services.instagram.verify_token')) {
            return response($challenge, 200);
        }

        return response('Forbidden', 403);
    }

    /**
     * DM等のイベントを受信する（VerifyInstagramSignatureミドルウェアで署名検証済み）
     */
    public function handle(Request $request): HttpResponse
    {
        foreach ($request->input('entry', []) as $entry) {
            foreach ($entry['messaging'] ?? [] as $event) {
                // 自分自身が送信したメッセージのエコー通知は無視する
                if (!empty($event['message']['is_echo'])) {
                    continue;
                }

                $igsid = $event['sender']['id'] ?? null;

                if ($igsid) {
                    SendInstagramBookingLinkJob::dispatch($igsid);
                }
            }
        }

        Log::info('Instagram Webhookイベントを受信しました');

        return response('', 200);
    }
}
