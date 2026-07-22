<?php

use App\Http\Controllers\Api\AnalyticsEventController;
use App\Http\Controllers\Api\BusinessStatusController;
use App\Http\Controllers\Api\ContactApiController;
use App\Http\Controllers\Api\CsrfTokenController;
use App\Http\Controllers\Api\InstagramWebhookController;
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

    /**
     * アクセス解析イベント収集エンドポイント（匿名・認証不要）
     * 公開サイトのPublicLayoutからpageview等を送信する
     */
    Route::post('/analytics/event', [AnalyticsEventController::class, 'store'])
        ->withoutMiddleware('csrf')
        ->name('api.analytics.event');

    /**
     * 外部サイト(WordPress等)からのお問い合わせAPI連携（APIキー認証必須）
     */
    Route::middleware(['throttle:30,1', 'contact.api_key'])
        ->withoutMiddleware('csrf')
        ->prefix('contacts')
        ->name('api.contacts.')
        ->group(function () {
            Route::get('/categories', [ContactApiController::class, 'categories'])->name('categories');
            Route::post('/', [ContactApiController::class, 'store'])->name('store');
        });

    /**
     * 顧客向け「現在営業中か」判定API（公開・認証不要）
     */
    Route::get('/business-hours/status', [BusinessStatusController::class, 'status'])
        ->middleware('throttle:60,1')
        ->name('api.business-hours.status');

    /**
     * Instagram(Meta) DMからの無料相談予約導線用Webhook
     * - GET: Webhook購読検証用ハンドシェイク
     * - POST: DM受信イベント（X-Hub-Signature-256署名検証必須）
     */
    Route::withoutMiddleware('csrf')
        ->prefix('webhooks/instagram')
        ->name('api.webhooks.instagram.')
        ->group(function () {
            Route::get('/', [InstagramWebhookController::class, 'verify'])->name('verify');
            Route::post('/', [InstagramWebhookController::class, 'handle'])
                ->middleware('instagram.signature')
                ->name('handle');
        });

    // 認証が必要な API ルートは以下に追加
    // Route::middleware('auth:api')->group(function () {
    //     // ...
    // });
});
