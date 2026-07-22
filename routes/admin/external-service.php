<?php

use App\Http\Controllers\Admin\ExternalServiceController;
use Illuminate\Support\Facades\Route;

Route::resource('external-service', ExternalServiceController::class)->except(['show']);
Route::patch('external-service/{externalService}/toggle-active', [ExternalServiceController::class, 'toggleActive'])
    ->name('external-service.toggle-active');
Route::post('external-service/{externalService}/sync', [ExternalServiceController::class, 'sync'])
    ->name('external-service.sync');
