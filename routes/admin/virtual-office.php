<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Admin\VirtualOfficeController;

// 認証・権限ミドルウェアは admin.php 側の親グループで適用済みのためここでは付与しない

Route::get('/virtual-office', [VirtualOfficeController::class, 'index'])->name('virtual-office.index');
