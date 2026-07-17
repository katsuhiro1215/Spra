<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Admin\PointRewardController;

// 認証・権限ミドルウェアは admin.php 側の親グループで適用済みのためここでは付与しない

// ポイント特典（ボーナスポイントのルールマスタ）管理
Route::resource('point-reward', PointRewardController::class)->except(['show']);
