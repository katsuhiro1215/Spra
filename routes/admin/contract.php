<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Admin\Contract\ContractController;
use App\Http\Controllers\Admin\Contract\ContractItemController;
use App\Http\Controllers\Admin\Contract\ContractSignatureController;
use App\Http\Controllers\Admin\Contract\ContractGroupController;
use App\Http\Controllers\Admin\Contract\ContractTemplateController;

// 契約管理
Route::prefix('contract')->name('contract.')->group(function () {
    // 契約書テンプレート管理（契約条項・特別条項のひな形）
    Route::resource('template', ContractTemplateController::class)
        ->parameters(['template' => 'contractTemplate']);
    // 契約管理
    Route::resource('', ContractController::class)->parameters(['' => 'contract']);
    Route::controller(ContractController::class)->group(function () {
        Route::patch('/{id}/activate', 'activate')->name('activate');
        Route::patch('/{id}/cancel', 'cancel')->name('cancel');
        Route::patch('/{id}/approve', 'approve')->name('approve');
        Route::post('/{id}/send-reminder', 'sendReminder')->name('send-reminder');
        Route::post('/{id}/documents', 'uploadDocument')->name('documents.upload');
        Route::patch('/{id}/billing-settings', 'updateBillingSettings')->name('billing-settings.update');
        Route::post('/{id}/send', 'send')->name('send');
        Route::get('/{id}/pdf', 'generatePdf')->name('pdf');
        Route::get('/{id}/pdf/preview', 'previewPdf')->name('pdf.preview');
        // 契約条項編集
        Route::get('/{id}/terms/edit', 'editTerms')->name('terms.edit');
        Route::post('/{id}/terms', 'updateTerms')->name('terms.update');
        Route::get('/{id}/preview', 'preview')->name('preview');
    });
    // 契約明細管理
    Route::controller(ContractItemController::class)->group(function () {
        Route::get('/{contract}/item/create', 'create')->name('item.create');
        Route::post('/{contract}/item', 'store')->name('item.store');
        Route::get('/{contract}/item/edit', 'edit')->name('item.edit');
        Route::put('/{contract}/item', 'update')->name('item.update');
        Route::delete('/{contract}/item', 'destroy')->name('item.destroy');
    });
    // 手動で明細を追加/編集（QuoteItemがない場合）
    Route::controller(ContractItemController::class)->group(function () {
        Route::get('/{contract}/item/add-manual', 'create')->name('item.add-manual');
        Route::post('/{contract}/item/manual', 'store')->name('item.store-manual');
        Route::get('/{contract}/item/edit', 'edit')->name('item.edit');
        Route::put('/{contract}/item', 'update')->name('item.update');
        Route::delete('/{contract}/item', 'destroy')->name('item.destroy');
    });
    // 署名関連ルート
    Route::controller(ContractSignatureController::class)->group(function () {
        Route::get('/{id}/signature/user', 'showUserSignaturePage')->name('signature.user.show');
        Route::post('/{id}/signature/user', 'storeUserSignature')->name('signature.user.store');
        Route::post('/{id}/signature/verify-user', 'verifyUserSignature')->name('signature.verify-user');
        Route::get('/{id}/signature/admin', 'showAdminSignaturePage')->name('signature.admin.show');
        Route::post('/{id}/signature/admin', 'storeAdminSignature')->name('signature.admin.store');
        Route::post('/{id}/signature/reject', 'rejectSignature')->name('signature.reject');
    });
});

// 契約グループ管理
Route::prefix('contract-group')->name('contract-group.')->group(function () {
    Route::controller(ContractGroupController::class)->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('/create', 'create')->name('create');
        Route::post('/', 'store')->name('store');
        Route::get('/{id}', 'show')->name('show');
        Route::post('/{id}/send', 'send')->name('send');
        Route::post('/{id}/add-contract', 'addContract')->name('add-contract');
        Route::delete('/{id}/remove-contract/{contractId}', 'removeContract')->name('remove-contract');
        Route::delete('/{id}', 'destroy')->name('destroy');
    });
});
