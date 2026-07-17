<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Admin\MembershipRankController;

// 認証・権限ミドルウェアは admin.php 側の親グループで適用済みのためここでは付与しない

// 会員ランク管理
Route::resource('membership-rank', MembershipRankController::class)->except(['show']);
