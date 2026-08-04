<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Admin\Contact\ContactController;
use App\Http\Controllers\Admin\Contact\ContactCategoryController;
use App\Http\Controllers\Admin\Contact\ContactApiClientController;
use App\Http\Controllers\Admin\Contact\ResponseController;
use App\Http\Controllers\Admin\Contact\ResponseTemplateController;
use App\Http\Controllers\Admin\Contact\HearingController;
use App\Http\Controllers\Admin\UserInvitationController;

// 認証・権限ミドルウェアは admin.php 側の親グループで適用済みのためここでは付与しない

// お問い合わせカテゴリ管理 / 外部API連携クライアント管理
Route::prefix('contact')->name('contact.')->group(function () {
    Route::resource('category', ContactCategoryController::class)->except(['show']);
    Route::resource('api-client', ContactApiClientController::class)->except(['show']);
    Route::patch('api-client/{apiClient}/toggle-active', [ContactApiClientController::class, 'toggleActive'])->name('api-client.toggle-active');
    Route::post('api-client/{apiClient}/regenerate', [ContactApiClientController::class, 'regenerate'])->name('api-client.regenerate');
});
// お問い合わせ管理
Route::resource('contact', ContactController::class)->only(['index', 'show', 'update', 'destroy']);
Route::patch('/contact/bulk-update', [ContactController::class, 'bulkUpdate'])->name('contact.bulk-update');
Route::get('/contact/export', [ContactController::class, 'export'])->name('contact.export');

// 返信管理（グローバル一覧）
Route::get('response', [ResponseController::class, 'index'])->name('response.index');

// お問い合わせ返答管理（Contact配下）
Route::prefix('contact/{contact}')->name('contact.')->group(function () {
    Route::resource('response', ResponseController::class)->except(['index']);
    Route::post('response/{response}/send', [ResponseController::class, 'send'])->name('response.send');
    // ユーザー招待管理
    Route::post('invitation', [UserInvitationController::class, 'store'])->name('invitation.store');
    // ヒアリング管理（Contact配下、小規模版のため一覧はContact詳細画面に表示）
    Route::resource('hearing', HearingController::class)->except(['index']);
});
// ユーザー招待管理（グローバル）
Route::prefix('invitation')->name('invitation.')->group(function () {
    Route::post('{invitation}/resend', [UserInvitationController::class, 'resend'])->name('resend');
    Route::patch('{invitation}/revoke', [UserInvitationController::class, 'revoke'])->name('revoke');
});

// 返答テンプレート管理
Route::prefix('response')->name('response.')->group(function () {
    Route::resource('template', ResponseTemplateController::class);
});
