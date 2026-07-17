<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Admin\PointRedemptionController;

// 認証・権限ミドルウェアは admin.php 側の親グループで適用済みのためここでは付与しない

// ポイント交換申請の確認・承認
Route::resource('point-redemption', PointRedemptionController::class)->only(['index', 'show']);
Route::post('/point-redemption/{point_redemption}/approve', [PointRedemptionController::class, 'approve'])
    ->name('point-redemption.approve');
Route::post('/point-redemption/{point_redemption}/reject', [PointRedemptionController::class, 'reject'])
    ->name('point-redemption.reject');
