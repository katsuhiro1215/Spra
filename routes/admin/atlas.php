<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Admin\AtlasMembershipController;
use App\Http\Controllers\Admin\AtlasInviteCodeController;

// 認証・権限ミドルウェアは admin.php 側の親グループで適用済みのためここでは付与しない

// Atlas会員管理（富裕層向けサービスの会員付与・ブランド/ステータス管理）
Route::resource('atlas-membership', AtlasMembershipController::class)
    ->only(['index', 'create', 'store', 'edit', 'update']);

// Atlas招待コード管理（Private Room登録時に必要な招待コードの発行・失効）
Route::resource('atlas-invite-code', AtlasInviteCodeController::class)
    ->only(['index', 'create', 'store']);
Route::post('/atlas-invite-code/{atlas_invite_code}/revoke', [AtlasInviteCodeController::class, 'revoke'])
    ->name('atlas-invite-code.revoke');
