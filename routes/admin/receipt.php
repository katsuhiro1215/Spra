<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Admin\ReceiptController;

// 認証・権限ミドルウェアは admin.php 側の親グループで適用済みのためここでは付与しない

// 領収書管理
Route::resource('receipt', ReceiptController::class);
Route::prefix('receipts')->name('receipts.')->group(function () {
    Route::get('/{id}/download', [ReceiptController::class, 'download'])->name('download');
    Route::post('/{id}/send', [ReceiptController::class, 'send'])->name('send');
});
