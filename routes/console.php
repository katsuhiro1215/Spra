<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// 予約リマインダーを毎日午前9時に送信（24時間後の予約）
Schedule::command('appointments:send-reminders')->dailyAt('09:00');

// 月額請求書を毎日午前9時に自動生成
Schedule::command('invoices:generate-monthly')->dailyAt('09:00');

// 未送信請求書を毎日午前10時に送信
Schedule::command('invoices:send-pending')->dailyAt('10:00');
