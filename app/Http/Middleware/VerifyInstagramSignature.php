<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Instagram(Meta) Webhookからのリクエストを X-Hub-Signature-256 署名で検証する
 */
class VerifyInstagramSignature
{
    public function handle(Request $request, Closure $next): Response
    {
        $signature = $request->header('X-Hub-Signature-256');
        $appSecret = config('services.instagram.app_secret');

        if (!$signature || !$appSecret) {
            return response()->json(['message' => '署名が指定されていません。'], 401);
        }

        $expected = 'sha256=' . hash_hmac('sha256', $request->getContent(), $appSecret);

        if (!hash_equals($expected, $signature)) {
            return response()->json(['message' => '署名が無効です。'], 401);
        }

        return $next($request);
    }
}
