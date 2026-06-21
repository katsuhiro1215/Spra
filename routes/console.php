<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// 予約リマインダーを毎日午前9時に送信（24時間後の予約）
Schedule::command('appointments:send-reminders')->dailyAt('09:00');
