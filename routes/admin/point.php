<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Admin\PointRewardController;
use App\Http\Controllers\Admin\ReferralController;
use App\Http\Controllers\Admin\MembershipRankController;
use App\Http\Controllers\Admin\PointCatalogItemController;
use App\Http\Controllers\Admin\PointRedemptionController;

// 認証・権限ミドルウェアは admin.php 側の親グループで適用済みのためここでは付与しない

// ポイント特典（ボーナスポイントのルールマスタ）管理
Route::resource('point-reward', PointRewardController::class)->except(['show']);

// 紹介管理
Route::resource('referral', ReferralController::class);
Route::post('/referral/{referral}/mark-contracted', [ReferralController::class, 'markContracted'])
    ->name('referral.mark-contracted');

// 会員ランク管理
Route::resource('membership-rank', MembershipRankController::class)->except(['show']);

// ポイント交換カタログ管理
Route::resource('point-catalog-item', PointCatalogItemController::class)->except(['show']);

// ポイント交換申請の確認・承認
Route::resource('point-redemption', PointRedemptionController::class)->only(['index', 'show']);
Route::post('/point-redemption/{point_redemption}/approve', [PointRedemptionController::class, 'approve'])
    ->name('point-redemption.approve');
Route::post('/point-redemption/{point_redemption}/reject', [PointRedemptionController::class, 'reject'])
    ->name('point-redemption.reject');
