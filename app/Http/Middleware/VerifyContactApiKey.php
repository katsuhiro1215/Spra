<?php

namespace App\Http\Middleware;

use App\Models\ContactApiClient;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * 外部サイト(WordPress等)からのお問い合わせAPI連携リクエストを
 * X-Api-Key ヘッダーで検証する
 */
class VerifyContactApiKey
{
    public function handle(Request $request, Closure $next): Response
    {
        $plainKey = $request->header('X-Api-Key');

        if (!$plainKey) {
            return response()->json(['message' => 'APIキーが指定されていません。'], 401);
        }

        $client = ContactApiClient::where('api_key_hash', hash('sha256', $plainKey))->first();

        if (!$client) {
            return response()->json(['message' => 'APIキーが無効です。'], 401);
        }

        if (!$client->is_active) {
            return response()->json(['message' => 'このAPIキーは無効化されています。'], 403);
        }

        $client->update(['last_used_at' => now()]);

        $request->attributes->set('contactApiClient', $client);

        return $next($request);
    }
}
