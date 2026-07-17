<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Admin\ReferralController;

// 認証・権限ミドルウェアは admin.php 側の親グループで適用済みのためここでは付与しない

// 紹介管理
Route::resource('referral', ReferralController::class);
Route::post('/referral/{referral}/mark-contracted', [ReferralController::class, 'markContracted'])
    ->name('referral.mark-contracted');
