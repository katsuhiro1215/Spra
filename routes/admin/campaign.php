<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Admin\CampaignController;

// 認証・権限ミドルウェアは admin.php 側の親グループで適用済みのためここでは付与しない

// キャンペーン管理
Route::resource('campaign', CampaignController::class);
Route::post('/campaign/{campaign}/attach-media', [CampaignController::class, 'attachMedia'])->name('campaign.attach-media');
Route::delete('/campaign/{campaign}/detach-media', [CampaignController::class, 'detachMedia'])->name('campaign.detach-media');
