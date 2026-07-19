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
use App\Http\Controllers\Admin\Website\VoiceController;
use App\Http\Controllers\Admin\Website\SiteSettingController;

// 認証・権限ミドルウェアは admin.php 側の親グループで適用済みのためここでは付与しない
Route::prefix('website')->name('website.')->group(function () {
    // ダッシュボード
    Route::controller(DashboardController::class)->group(function () {
        Route::get('/', 'index')->name('dashboard');
    });
    // ページ管理
    Route::prefix('page')->name('page.')->group(function () {
        Route::resource('type', PageTypeController::class)->names('type')->parameters(['type' => 'pageType']);
        Route::resource('', PageController::class)->parameters(['' => 'page']);
        Route::post('/{page}/restore', [PageController::class, 'restore'])->name('restore')->withTrashed();
    });
    // セクション管理
    Route::resource('section', SectionController::class);
    Route::post('/section/reorder', [SectionController::class, 'reorder'])->name('section.reorder');
    // ポスト管理
    Route::prefix('post')->name('post.')->group(function () {
        // カテゴリ関連ルートは post/{post} などの動的ルートに
        // 食われないよう、Postリソースルートより先に登録する
        Route::resource('category', PostCategoryController::class)->parameters(['category' => 'postCategory']);
        Route::controller(PostCategoryController::class)->name('category.')->group(function () {
            Route::post('/category/bulk-action', 'bulkAction')->name('bulk-action');
            Route::post('/category/update-order', 'updateOrder')->name('update-order');
        });
        Route::resource('', PostController::class)->parameters(['' => 'post']);
        Route::controller(PostController::class)->group(function () {
            Route::post('/bulk-action', 'bulkAction')->name('bulk-action');
            Route::patch('/{post}/status', 'changeStatus')->name('change-status');
            Route::post('/upload-editor-image', 'uploadEditorImage')->name('upload-editor-image');
        });
    });
    // FAQ管理
    Route::prefix('faq')->name('faq.')->group(function () {
        Route::resource('category', FaqCategoryController::class)->parameters(['category' => 'faqCategory']);
        Route::controller(FaqCategoryController::class)->name('category.')->group(function () {
            Route::post('/category/bulk-action', 'bulkAction')->name('bulk-action');
            Route::post('/category/update-order', 'updateOrder')->name('update-order');
        });
        Route::resource('', FaqController::class)->parameters(['' => 'faq']);
        Route::controller(FaqController::class)->group(function () {
            Route::post('/bulk-action', 'bulkAction')->name('bulk-action');
            Route::patch('/{faq}/status', 'changeStatus')->name('change-status');
            Route::post('/upload-editor-image', 'uploadEditorImage')->name('upload-editor-image');
        });
    });
    // お客様の声管理
    Route::prefix('voice')->name('voice.')->group(function () {
        Route::resource('', VoiceController::class)->parameters(['' => 'voice']);
        Route::controller(VoiceController::class)->group(function () {
            Route::post('/bulk-action', 'bulkAction')->name('bulk-action');
            Route::patch('/{voice}/status', 'changeStatus')->name('change-status');
        });
    });
    // メニュー管理
    Route::resource('menu', MenuController::class);
    Route::prefix('menu')->name('menu.')->group(function () {
        Route::resource('{menu}/item', MenuItemController::class)->parameters(['item' => 'menuItem']);
    });
    // サイト設定管理
    Route::prefix('siteSetting')->name('siteSetting.')->group(function () {
        // プリセット設定（表示・保存を同一ルートで受け、1画面にまとめて管理）
        Route::match(['get', 'post'], '/settings', [SiteSettingController::class, 'settings'])->name('settings');
        // 個別設定項目の汎用CRUD（プリセットにない項目向け）
        Route::resource('', SiteSettingController::class)->parameters(['' => 'siteSetting']);
    });
});
