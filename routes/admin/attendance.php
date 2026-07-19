<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Admin\Attendance\AttendanceController;
use App\Http\Controllers\Admin\Attendance\AdminShiftController;
use App\Http\Controllers\Admin\Attendance\AttendanceRecordController;

// 認証・権限ミドルウェアは admin.php 側の親グループで適用済みのためここでは付与しない
Route::prefix('attendance')->name('attendance.')->group(function () {
    // 勤怠カレンダー統合画面
    Route::get('/', [AttendanceController::class, 'calendar'])->name('index');

    // 出退勤打刻（全管理者が利用可能・config/admin_permissions.php でホワイトリスト）
    Route::post('/clock-in', [AttendanceController::class, 'clockIn'])->name('clock-in');
    Route::post('/clock-out', [AttendanceController::class, 'clockOut'])->name('clock-out');

    // シフト予定管理
    Route::get('/shifts-bulk-create', [AdminShiftController::class, 'bulkCreate'])->name('shifts.bulk-create');
    Route::post('/shifts-bulk-store', [AdminShiftController::class, 'bulkStore'])->name('shifts.bulk-store');
    Route::resource('shifts', AdminShiftController::class)->except(['show']);

    // 出退勤実績の修正
    Route::resource('records', AttendanceRecordController::class)->only(['index', 'edit', 'update', 'destroy']);
});
