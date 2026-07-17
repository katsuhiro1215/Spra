<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Admin\PointCatalogItemController;

// 認証・権限ミドルウェアは admin.php 側の親グループで適用済みのためここでは付与しない

// ポイント交換カタログ管理
Route::resource('point-catalog-item', PointCatalogItemController::class)->except(['show']);
