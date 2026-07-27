<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\User\QuoteController;

// 認証・権限ミドルウェアは web.php 側の親グループで適用済みのためここでは付与しない

// 見積書（クライアント向け）
Route::get('/quotes', [QuoteController::class, 'index'])->name('quote.index');
Route::get('/quotes/{quote}', [QuoteController::class, 'show'])->name('quote.show');
Route::get('/quotes/{quote}/pdf', [QuoteController::class, 'pdf'])->name('quote.pdf');
Route::get('/quotes/{quote}/pdf/preview', [QuoteController::class, 'pdfPreview'])->name('quote.pdf.preview');
Route::post('/quotes/{quote}/accept', [QuoteController::class, 'accept'])->name('quote.accept');
Route::post('/quotes/{quote}/reject', [QuoteController::class, 'reject'])->name('quote.reject');
