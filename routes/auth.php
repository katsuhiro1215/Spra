<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\User\Auth\AuthenticatedSessionController;
use App\Http\Controllers\User\Auth\ConfirmablePasswordController;
use App\Http\Controllers\User\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\User\Auth\EmailVerificationPromptController;
use App\Http\Controllers\User\Auth\NewPasswordController;
use App\Http\Controllers\User\Auth\PasswordController;
use App\Http\Controllers\User\Auth\PasswordResetLinkController;
use App\Http\Controllers\User\Auth\RegisteredUserController;
use App\Http\Controllers\User\Auth\TwoFactorChallengeController;
use App\Http\Controllers\User\Auth\VerifyEmailController;

Route::middleware('guest:users')->group(function () {
    // 新規登録（招待経由のみ。招待なしの自己登録は廃止）
    Route::controller(RegisteredUserController::class)->group(function () {
        Route::post('register', 'store')->name('user.register.store');
        Route::get('register/invited/{token}', 'createWithInvitation')->name('user.register.invited');
    });
    // ログイン
    Route::controller(AuthenticatedSessionController::class)->group(function () {
        Route::get('login', 'create')->name('user.login');
        Route::post('login', 'store');
    });
    // パスワードリセットリンク
    Route::controller(PasswordResetLinkController::class)->group(function () {
        Route::get('forgot-password', 'create')->name('user.password.request');
        Route::post('forgot-password', 'store')->name('user.password.email');
    });
    // パスワードリセット
    Route::controller(NewPasswordController::class)->group(function () {
        Route::get('reset-password/{token}', 'create')->name('user.password.reset');
        Route::post('reset-password', 'store')->name('user.password.store');
    });
    // 二段階認証
    Route::controller(TwoFactorChallengeController::class)->group(function () {
        Route::get('two-factor-challenge', 'create')->name('user.two-factor.challenge');
        Route::post('two-factor-challenge', 'store')->name('user.two-factor.store');
        Route::post('two-factor-challenge/resend', 'resend')->name('user.two-factor.resend');
    });
});

Route::middleware('auth:users')->group(function () {
    // メール確認
    Route::get('verify-email', EmailVerificationPromptController::class)
        ->name('user.verification.notice');
    // メール確認
    Route::get('verify-email/{id}/{hash}', VerifyEmailController::class)
        ->middleware(['signed', 'throttle:6,1'])
        ->name('user.verification.verify');
    // メール再送信
    Route::post('email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('user.verification.send');
    // パスワード確認
    Route::controller(ConfirmablePasswordController::class)->group(function () {
        Route::get('confirm-password', 'show')->name('user.password.confirm');
        Route::post('confirm-password', 'store');
    });
    // パスワード更新
    Route::put('password', [PasswordController::class, 'update'])->name('user.password.update');
    // ログアウト
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('user.logout');
});
