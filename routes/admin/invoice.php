<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Admin\Invoice\InvoiceController;

// 認証・権限ミドルウェアは admin.php 側の親グループで適用済みのためここでは付与しない

// 請求書管理
Route::resource('invoice', InvoiceController::class);
Route::prefix('invoice')->name('invoice.')->group(function () {
    Route::get('/overdue', [InvoiceController::class, 'overdueList'])->name('overdue');
    Route::patch('/{id}/send', [InvoiceController::class, 'send'])->name('send');
    Route::post('/{id}/payments', [InvoiceController::class, 'recordPayment'])->name('payments.store');
    Route::get('/{id}/pdf', [InvoiceController::class, 'downloadPdf'])->name('pdf');
    Route::get('/{id}/pdf/preview', [InvoiceController::class, 'previewPdf'])->name('pdf.preview');
    Route::post('/{id}/confirm-payment', [InvoiceController::class, 'confirmPayment'])->name('confirm-payment');
    Route::post('/{id}/resend', [InvoiceController::class, 'resend'])->name('resend');
    Route::post('/{id}/receipt/issue', [InvoiceController::class, 'issueReceipt'])->name('receipt.issue');
    Route::get('/{id}/receipt/download', [InvoiceController::class, 'downloadReceipt'])->name('receipt.download');
});
