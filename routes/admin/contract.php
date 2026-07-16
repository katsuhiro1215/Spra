<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Admin\Contract\ContractController;
use App\Http\Controllers\Admin\Contract\ContractItemController;
use App\Http\Controllers\Admin\Contract\ContractSignatureController;
use App\Http\Controllers\Admin\Contract\ContractGroupController;

// 認証・権限ミドルウェアは admin.php 側の親グループで適用済みのためここでは付与しない

// 契約管理
Route::resource('contract', ContractController::class);
Route::prefix('contract')->name('contract.')->group(function () {
    Route::patch('/{id}/activate', [ContractController::class, 'activate'])->name('activate');
    Route::patch('/{id}/cancel', [ContractController::class, 'cancel'])->name('cancel');
    Route::patch('/{id}/approve', [ContractController::class, 'approve'])->name('approve');
    Route::post('/{id}/send-reminder', [ContractController::class, 'sendReminder'])->name('send-reminder');
    Route::post('/{id}/documents', [ContractController::class, 'uploadDocument'])->name('documents.upload');
    Route::patch('/{id}/billing-settings', [ContractController::class, 'updateBillingSettings'])->name('billing-settings.update');
    Route::post('/{id}/send', [ContractController::class, 'send'])->name('send');
    Route::get('/{id}/pdf', [ContractController::class, 'generatePdf'])->name('pdf');
    Route::get('/{id}/pdf/preview', [ContractController::class, 'previewPdf'])->name('pdf.preview');

    // 契約明細管理
    Route::get('/{contract}/item/create', [ContractItemController::class, 'create'])->name('item.create');
    Route::post('/{contract}/item', [ContractItemController::class, 'store'])->name('item.store');
    Route::get('/{contract}/item/edit', [ContractItemController::class, 'edit'])->name('item.edit');
    Route::put('/{contract}/item', [ContractItemController::class, 'update'])->name('item.update');
    Route::delete('/{contract}/item', [ContractItemController::class, 'destroy'])->name('item.destroy');

    // 手動で明細を追加/編集（QuoteItemがない場合）
    Route::get('/{contract}/item/add-manual', [ContractItemController::class, 'create'])->name('item.add-manual');
    Route::post('/{contract}/item/manual', [ContractItemController::class, 'store'])->name('item.store-manual');
    Route::get('/{contract}/item/edit', [ContractItemController::class, 'edit'])->name('item.edit');
    Route::put('/{contract}/item', [ContractItemController::class, 'update'])->name('item.update');
    Route::delete('/{contract}/item', [ContractItemController::class, 'destroy'])->name('item.destroy');

    // 契約条項編集
    Route::get('/{id}/terms/edit', [ContractController::class, 'editTerms'])->name('terms.edit');
    Route::post('/{id}/terms', [ContractController::class, 'updateTerms'])->name('terms.update');
    Route::get('/{id}/preview', [ContractController::class, 'preview'])->name('preview');

    // 署名関連ルート
    Route::post('/{id}/signature/user', [ContractSignatureController::class, 'storeUserSignature'])->name('signature.user.store');
    Route::post('/{id}/signature/verify-user', [ContractSignatureController::class, 'verifyUserSignature'])->name('signature.verify-user');
    Route::get('/{id}/signature/admin', [ContractSignatureController::class, 'showAdminSignaturePage'])->name('signature.admin.show');
    Route::post('/{id}/signature/admin', [ContractSignatureController::class, 'storeAdminSignature'])->name('signature.admin.store');
    Route::post('/{id}/signature/reject', [ContractSignatureController::class, 'rejectSignature'])->name('signature.reject');
});

// 契約グループ管理
Route::prefix('contract-group')->name('contract-group.')->group(function () {
    Route::get('/', [ContractGroupController::class, 'index'])->name('index');
    Route::get('/create', [ContractGroupController::class, 'create'])->name('create');
    Route::post('/', [ContractGroupController::class, 'store'])->name('store');
    Route::get('/{id}', [ContractGroupController::class, 'show'])->name('show');
    Route::post('/{id}/send', [ContractGroupController::class, 'send'])->name('send');
    Route::post('/{id}/add-contract', [ContractGroupController::class, 'addContract'])->name('add-contract');
    Route::delete('/{id}/remove-contract/{contractId}', [ContractGroupController::class, 'removeContract'])->name('remove-contract');
    Route::delete('/{id}', [ContractGroupController::class, 'destroy'])->name('destroy');
});
