<?php

use App\Http\Controllers\Admin\AiStaffDailyReportController;
use Illuminate\Support\Facades\Route;

// 認証・権限ミドルウェアは admin.php 側の親グループで適用済みのためここでは付与しない

Route::resource('ai-staff-daily-reports', AiStaffDailyReportController::class)
    ->only(['index', 'show'])
    ->parameters(['ai-staff-daily-reports' => 'aiStaffDailyReport']);
