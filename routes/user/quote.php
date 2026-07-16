<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\User\QuoteController;

// 認証・権限ミドルウェアは web.php 側の親グループで適用済みのためここでは付与しない

// 見積書（クライアント向け）
Route::get('/quotes', [QuoteController::class, 'index'])->name('quote.index');
Route::get('/quotes/{id}', [QuoteController::class, 'show'])->name('quote.show');
Route::get('/quotes/{id}/pdf', [QuoteController::class, 'pdf'])->name('quote.pdf');
Route::post('/quotes/{id}/accept', [QuoteController::class, 'accept'])->name('quote.accept');
Route::post('/quotes/{id}/reject', [QuoteController::class, 'reject'])->name('quote.reject');
