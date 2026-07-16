<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Admin\Schedule\HolidayController;
use App\Http\Controllers\Admin\Schedule\ScheduleController;
use App\Http\Controllers\Admin\Schedule\ScheduleDefaultController;
use App\Http\Controllers\Admin\Schedule\ScheduleExceptionController;

// 認証・権限ミドルウェアは admin.php 側の親グループで適用済みのためここでは付与しない

// スケジュール管理
Route::prefix('schedules')->name('schedules.')->group(function () {
    // スケジュールカレンダー統合画面
    Route::get('/', [ScheduleController::class, 'calendar'])->name('index');

    // 祝日・休業日管理
    Route::resource('holidays', HolidayController::class);
    Route::post('/holidays/import', [HolidayController::class, 'import'])->name('holidays.import');
    Route::get('/holidays/export', [HolidayController::class, 'export'])->name('holidays.export');

    // デフォルトスケジュール管理
    Route::get('/defaults', [ScheduleDefaultController::class, 'index'])->name('defaults.index');
    Route::post('/defaults/bulk-update', [ScheduleDefaultController::class, 'bulkUpdate'])->name('defaults.bulk-update');

    // 例外スケジュール管理
    Route::resource('exceptions', ScheduleExceptionController::class);
});
