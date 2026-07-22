<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\User\InvoiceController;

// 認証・権限ミドルウェアは web.php 側の親グループで適用済みのためここでは付与しない

// 請求書（クライアント向け） userを付与
Route::resource('/invoice', InvoiceController::class)->only(['index', 'show']);
Route::post('/invoice/{invoice}/payments', [InvoiceController::class, 'storePayment'])->name('invoice.payments.store');
Route::get('/invoice/{invoice}/receipt/download', [InvoiceController::class, 'downloadReceipt'])->name('invoice.receipt.download');
Route::get('/invoice/{invoice}/pdf', [InvoiceController::class, 'downloadPdf'])->name('invoice.pdf');
Route::get('/invoice/{invoice}/pdf/preview', [InvoiceController::class, 'previewPdf'])->name('invoice.pdf.preview');
