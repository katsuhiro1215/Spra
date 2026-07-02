<?php

use App\Http\Controllers\Api\CsrfTokenController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('api')->group(function () {
    /*
    |--------------------------------------------------------------------------
    | API Routes
    |--------------------------------------------------------------------------
    */

    /**
     * CSRF トークンリフレッシュエンドポイント
     * - 認証不要（公開エンドポイント）
     * - 定期的にフロントエンドから呼び出され、トークンを更新
     */
    Route::post('/csrf-token/refresh', [CsrfTokenController::class, 'refresh'])
        ->withoutMiddleware('csrf') // CSRF 検証をスキップ（新トークン取得用）
        ->name('api.csrf.refresh');

    // 認証が必要な API ルートは以下に追加
    // Route::middleware('auth:api')->group(function () {
    //     // ...
    // });
});
