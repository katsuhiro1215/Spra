<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Admin\Quote\QuoteController;
use App\Http\Controllers\Admin\Quote\QuoteItemController;
use App\Http\Controllers\Admin\Quote\QuoteResponseController;

// 認証・権限ミドルウェアは admin.php 側の親グループで適用済みのためここでは付与しない

// 見積もり管理
Route::resource('quote', QuoteController::class);
Route::prefix('quote')->name('quote.')->group(function () {
    // 見積明細管理
    Route::get('/{quote}/item/create', [QuoteItemController::class, 'create'])->name('item.create');
    Route::post('/{quote}/item', [QuoteItemController::class, 'store'])->name('item.store');
    Route::get('/{quote}/item/edit', [QuoteItemController::class, 'edit'])->name('item.edit');
    Route::put('/{quote}/item', [QuoteItemController::class, 'update'])->name('item.update');
    Route::delete('/{quote}/item', [QuoteItemController::class, 'destroy'])->name('item.destroy');

    // その他の見積もり機能
    Route::get('/{quote}/preview', [QuoteController::class, 'preview'])->name('preview');
    Route::post('/{quote}/send', [QuoteController::class, 'send'])->name('send');
    Route::post('/{quote}/approve', [QuoteController::class, 'approve'])->name('approve');
    Route::post('/{quote}/reject', [QuoteController::class, 'reject'])->name('reject');
    Route::get('/{quote}/pdf', [QuoteController::class, 'downloadPdf'])->name('pdf');
    Route::get('/{quote}/pdf/preview', [QuoteController::class, 'previewPdf'])->name('pdf.preview');
});

// お客様返信管理
Route::prefix('quote-response')->name('quote-response.')->group(function () {
    Route::get('/', [QuoteResponseController::class, 'index'])->name('index');
    Route::get('/{quoteResponse}', [QuoteResponseController::class, 'show'])->name('show');
    Route::post('/{quoteResponse}/send-invitation', [QuoteResponseController::class, 'sendInvitation'])->name('send-invitation');
    Route::post('/{quoteResponse}/mark-declined', [QuoteResponseController::class, 'markDeclined'])->name('mark-declined');
});
