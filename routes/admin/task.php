<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Admin\TaskCategoryController;

// 認証・権限ミドルウェアは admin.php 側の親グループで適用済みのためここでは付与しない

Route::resource('task-category', TaskCategoryController::class)->parameters(['task-category' => 'task_category']);
