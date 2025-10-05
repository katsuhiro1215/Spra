<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\Homepage\PageController;
use App\Http\Controllers\Admin\Homepage\ServicesController;
use App\Http\Controllers\Admin\Homepage\BlogPostController;
use App\Http\Controllers\Admin\Homepage\CategoryController;
use App\Http\Controllers\Admin\Homepage\FaqController;
use App\Http\Controllers\Admin\Homepage\ContactController;
use App\Http\Controllers\Admin\Homepage\SiteSettingController;

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
    Route::resource('blog-posts', BlogPostController::class);
    Route::resource('categories', CategoryController::class);
    Route::resource('faqs', FaqController::class);
    Route::resource('contacts', ContactController::class)->only(['index', 'show', 'destroy']);
    Route::resource('site-settings', SiteSettingController::class);
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
