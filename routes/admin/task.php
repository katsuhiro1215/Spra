<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Admin\TaskCategoryController;
use App\Http\Controllers\Admin\TaskController;

// 認証・権限ミドルウェアは admin.php 側の親グループで適用済みのためここでは付与しない

Route::resource('task-category', TaskCategoryController::class)->parameters(['task-category' => 'task_category'])->except(['show']);

Route::resource('task', TaskController::class)->except(['create', 'edit', 'show']);
Route::patch('/task/{task}/status', [TaskController::class, 'updateStatus'])->name('task.status');
