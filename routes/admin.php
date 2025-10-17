<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\Homepage\PageController;
use App\Http\Controllers\Admin\Homepage\ServicesController;
use App\Http\Controllers\Admin\Homepage\BlogCategoryController;
use App\Http\Controllers\Admin\Homepage\BlogController;
use App\Http\Controllers\Admin\Homepage\FaqsController;
use App\Http\Controllers\Admin\Homepage\ContactController;
use App\Http\Controllers\Admin\Homepage\SiteSettingController;
use App\Http\Controllers\Admin\MediaController;
use App\Http\Controllers\Admin\Service\ServiceTypeController;
use App\Http\Controllers\Admin\Service\ServiceCategoryController;
use App\Http\Controllers\Admin\Service\ServiceTypePriceItemController;

Route::middleware(['auth:admins', 'verified'])->group(function () {
  // 管理者ダッシュボード
  Route::get('/dashboard', function () {
    return Inertia::render('AdminDashboard');
  })->name('dashboard');

  // ユーザー管理
  Route::resource('users', UserController::class);

  // ホームページ管理
  Route::prefix('homepage')->name('homepage.')->group(function () {
    Route::resource('pages', PageController::class);
    Route::resource('services', ServicesController::class);
    Route::resource('blogCategories', BlogCategoryController::class);
    Route::post('/blogCategories/bulk-action', [BlogCategoryController::class, 'bulkAction'])->name('blogCategories.bulk-action');
    Route::post('/blogCategories/update-order', [BlogCategoryController::class, 'updateOrder'])->name('blogCategories.update-order');
    Route::resource('blogs', BlogController::class);
    Route::post('/blogs/bulk-action', [BlogController::class, 'bulkAction'])->name('blogs.bulk-action');
    Route::patch('/blogs/{blog}/status', [BlogController::class, 'changeStatus'])->name('blogs.change-status');
    Route::post('/blogs/upload-editor-image', [BlogController::class, 'uploadEditorImage'])->name('blogs.upload-editor-image');

    // FAQs管理
    Route::resource('faqs', FaqsController::class);
    Route::delete('/faqs/bulk-destroy', [FaqsController::class, 'bulkDestroy'])->name('faqs.bulk-destroy');
    Route::patch('/faqs/bulk-status', [FaqsController::class, 'bulkUpdateStatus'])->name('faqs.bulk-status');

    // お問い合わせ管理
    Route::resource('contacts', ContactController::class)->only(['index', 'show', 'update', 'destroy']);
    Route::patch('/contacts/bulk-update', [ContactController::class, 'bulkUpdate'])->name('contacts.bulk-update');
    Route::get('/contacts/export', [ContactController::class, 'export'])->name('contacts.export');

    Route::resource('site-settings', SiteSettingController::class);
  });

  // メディア管理
  Route::resource('media', MediaController::class);
  Route::post('/media/upload', [MediaController::class, 'upload'])->name('media.upload');
  Route::delete('/media/bulk-destroy', [MediaController::class, 'bulkDestroy'])->name('media.bulk-destroy');

  // サービス管理
  Route::prefix('service')->name('service.')->group(function () {
    Route::resource('categories', ServiceCategoryController::class);
    Route::resource('type', ServiceTypeController::class)->parameters(['type' => 'serviceType']);
    Route::post('/type/bulk-action', [ServiceTypeController::class, 'bulkAction'])->name('type.bulk-action');
    Route::post('/type/update-order', [ServiceTypeController::class, 'updateOrder'])->name('type.update-order');
    Route::post('/type/{serviceType}/duplicate', [ServiceTypeController::class, 'duplicate'])->name('type.duplicate');

    // 価格項目管理
    Route::prefix('type/{serviceType}')->group(function () {
      Route::resource('priceItem', ServiceTypePriceItemController::class)->parameters(['priceItem' => 'priceItem']);
      Route::post('/priceItem/sort-order', [ServiceTypePriceItemController::class, 'updateSortOrder'])->name('priceItem.sort-order');
      Route::post('/priceItem/template', [ServiceTypePriceItemController::class, 'createFromTemplate'])->name('priceItem.template');
    });
  });

  // コンテンツ管理（一時的にダミー）
  Route::get('/content', function () {
    return Inertia::render('Admin/Content/Index');
  })->name('content.index');

  // 設定（一時的にダミー）
  Route::get('/settings', function () {
    return Inertia::render('Admin/Settings/Index');
  })->name('settings.index');

  // 管理者プロフィール  
  Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
  Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
  Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/admin_auth.php';
