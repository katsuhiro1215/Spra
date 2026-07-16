<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Admin\Service\ServiceCategoryController;
use App\Http\Controllers\Admin\Service\ServiceController;
use App\Http\Controllers\Admin\Service\ServicePlanController;
use App\Http\Controllers\Admin\Service\ServicePlanItemController;
use App\Http\Controllers\Admin\Service\ServiceItemController;
use App\Http\Controllers\Admin\Service\TechnologyController;
use App\Http\Controllers\Admin\PortfolioController;

// 認証・権限ミドルウェアは admin.php 側の親グループで適用済みのためここでは付与しない

// サービス管理
Route::prefix('service')->name('service.')->group(function () {
    Route::resource('category', ServiceCategoryController::class)->parameters(['category' => 'serviceCategory']);
    Route::resource('plan', ServicePlanController::class)->parameters(['plan' => 'servicePlan']);

    // ServicePlanItemの管理ルート
    Route::prefix('plan/{servicePlan}')->name('plan.')->group(function () {
        Route::get('items/edit', [ServicePlanItemController::class, 'editItems'])->name('items.edit');
        Route::put('items', [ServicePlanItemController::class, 'updateItems'])->name('items.update');
        Route::delete('items/{servicePlanItem}', [ServicePlanItemController::class, 'destroyItem'])->name('items.destroy');
    });

    Route::resource('item', ServiceItemController::class)->parameters(['item' => 'serviceItem']);
    Route::resource('technology', TechnologyController::class)->parameters(['technology' => 'technology'])->except(['show']);
});

// サービス一覧
Route::resource('service', ServiceController::class);
Route::post('/service/{service}/attach-media', [ServiceController::class, 'attachMedia'])->name('service.attach-media');
Route::delete('/service/{service}/detach-media', [ServiceController::class, 'detachMedia'])->name('service.detach-media');

// 実績・ポートフォリオ管理
Route::resource('portfolio', PortfolioController::class)->except(['show']);
