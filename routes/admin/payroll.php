<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Admin\PayrollController;

Route::prefix('payroll')->name('payroll.')->group(function () {
    Route::get('/', [PayrollController::class, 'index'])->name('index');
});
