<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Session;

/**
 * CSRF トークンの更新を管理するコントローラー
 */
class CsrfTokenController extends Controller
{
    /**
     * 新しい CSRF トークンを生成して返す
     */
    public function refresh(): JsonResponse
    {
        // セッションを再生成してトークンを更新
        Session::regenerateToken();

        return response()->json([
            'token' => csrf_token(),
            'timestamp' => now()->timestamp,
        ]);
    }
}
