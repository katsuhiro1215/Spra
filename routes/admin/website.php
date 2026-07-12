<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Admin\Website\DashboardController;
use App\Http\Controllers\Admin\Website\PageTypeController;
use App\Http\Controllers\Admin\Website\PageController;
use App\Http\Controllers\Admin\Website\SectionController;
use App\Http\Controllers\Admin\Website\PostCategoryController;
use App\Http\Controllers\Admin\Website\PostController;
use App\Http\Controllers\Admin\Website\MenuController;
use App\Http\Controllers\Admin\Website\MenuItemController;
use App\Http\Controllers\Admin\Website\FaqCategoryController;
use App\Http\Controllers\Admin\Website\FaqController;
use App\Http\Controllers\Admin\Website\SiteSettingController;

Route::middleware(['auth:admin', 'verified'])->group(function () {
    // Website Management (Webサイト管理)
    Route::prefix('website')->name('website.')->group(function () {
        // ダッシュボード
        Route::controller(DashboardController::class)->group(function () {
            Route::get('/', 'index')->name('dashboard');
        });
        // ページ管理
        Route::prefix('page')->name('page.')->group(function () {
            Route::resource('type', PageTypeController::class)->names('type');
            Route::resource('', PageController::class)->parameters(['' => 'page']);
            Route::post('/{page}/restore', [PageController::class, 'restore'])->name('restore')->withTrashed();
        });
        // セクション管理
        Route::resource('section', SectionController::class);
        // ポスト管理
        Route::prefix('post')->name('post.')->group(function () {
            Route::resource('', PostController::class)->parameters(['' => 'post']);
            Route::controller(PostController::class)->group(function () {
                Route::post('/bulk-action', 'bulkAction')->name('bulk-action');
                Route::patch('/{post}/status', 'changeStatus')->name('change-status');
                Route::post('/upload-editor-image', 'uploadEditorImage')->name('upload-editor-image');
            });
            Route::resource('category', PostCategoryController::class);
            Route::controller(PostCategoryController::class)->name('category.')->group(function () {
                Route::post('/category/bulk-action', 'bulkAction')->name('bulk-action');
                Route::post('/category/update-order', 'updateOrder')->name('update-order');
            });
        });
        // FAQ管理
        Route::prefix('faq')->name('faq.')->group(function () {
            Route::resource('', FaqController::class)->parameters(['' => 'faq']);
            Route::controller(FaqController::class)->group(function () {
                Route::post('/bulk-action', 'bulkAction')->name('bulk-action');
                Route::patch('/{faq}/status', 'changeStatus')->name('change-status');
                Route::post('/upload-editor-image', 'uploadEditorImage')->name('upload-editor-image');
            });
            Route::resource('category', FaqCategoryController::class);
            Route::controller(FaqCategoryController::class)->name('category.')->group(function () {
                Route::post('/category/bulk-action', 'bulkAction')->name('bulk-action');
                Route::post('/category/update-order', 'updateOrder')->name('update-order');
            });
        });
        // メニュー管理
        Route::resource('menu', MenuController::class);
        Route::prefix('menu')->name('menu.')->group(function () {
            Route::resource('{menu}/item', MenuItemController::class)->parameters(['item' => 'menuItem']);
        });
        // サイト設定管理
        Route::prefix('siteSetting')->name('siteSetting.')->group(function () {
            // グループ別設定画面（表示・保存を同一ルートで受ける）
            Route::controller(SiteSettingController::class)->group(function () {
                Route::match(['get', 'post'], '/general', 'general')->name('general');
                Route::match(['get', 'post'], '/navigation', 'navigation')->name('navigation');
                Route::match(['get', 'post'], '/footer', 'footer')->name('footer');
                Route::match(['get', 'post'], '/seo', 'seo')->name('seo');
                Route::match(['get', 'post'], '/ogp', 'ogp')->name('ogp');
            });
            // 個別設定項目の汎用CRUD（プリセットにない項目向け）
            Route::resource('', SiteSettingController::class)->parameters(['' => 'siteSetting']);
        });
    });
});
