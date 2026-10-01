<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Admin\CompletedTaskController;
use App\Http\Controllers\Admin\RecurringTaskController;
use App\Http\Controllers\Admin\TaskCategoryController;
use App\Http\Controllers\Admin\TaskController;

// 認証・権限ミドルウェアは admin.php 側の親グループで適用済みのためここでは付与しない

Route::resource('task-category', TaskCategoryController::class)->parameters(['task-category' => 'task_category'])->except(['show']);

Route::resource('recurring-task', RecurringTaskController::class)
    ->parameters(['recurring-task' => 'recurringTask'])
    ->only(['index', 'update', 'destroy']);
Route::get('/completed-task', [CompletedTaskController::class, 'index'])->name('completed-task.index');

Route::patch('/task/bulk-status', [TaskController::class, 'bulkUpdateStatus'])->name('task.bulk-status');
Route::resource('task', TaskController::class)->except(['create', 'edit']);
Route::patch('/task/{task}/status', [TaskController::class, 'updateStatus'])->name('task.status');
