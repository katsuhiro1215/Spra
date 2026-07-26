<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Admin\AnnouncementController;

// 認証・権限ミドルウェアは admin.php 側の親グループで適用済みのためここでは付与しない

// お知らせ配信管理（詳細ページは持たず、編集画面が詳細を兼ねる）
Route::resource('announcement', AnnouncementController::class)->except(['show']);
Route::post('/announcement/{announcement}/publish', [AnnouncementController::class, 'publish'])->name('announcement.publish');
