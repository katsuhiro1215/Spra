<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// 失敗時にコンソール出力を管理者へメール送信する(全スケジュールコマンド共通)
$alertOnFailure = fn ($schedule) => $schedule->emailOutputOnFailure(config('mail.admin_address'));

// 契約更新の事前通知（自動更新設定の契約の終了日が近づいたら管理者に通知）を毎日午前8時に送信
$alertOnFailure(Schedule::command('contracts:send-renewal-notices')->dailyAt('08:00'));

// 予約リマインダーを毎日午前9時に送信（24時間後の予約）
$alertOnFailure(Schedule::command('appointments:send-reminders')->dailyAt('09:00'));

// 繰り返し予約枠設定から、先行生成分の予約枠を毎日午前6時に穴埋め
$alertOnFailure(Schedule::command('appointments:generate-recurring-slots')->dailyAt('06:00'));
$alertOnFailure(Schedule::command('tasks:generate-recurring')->dailyAt('06:10'));

// タスク期限のリマインダー通知を15分おきに送信（--minutes=30のデフォルト窓と組み合わせて期限30分前までに捕捉）
$alertOnFailure(Schedule::command('tasks:send-reminders')->everyFifteenMinutes());

// 月額請求書を毎日午前9時に自動生成
$alertOnFailure(Schedule::command('invoices:generate-monthly')->dailyAt('09:00'));

// 継続契約の契約特典（チケット）を毎日午前9時に自動生成
$alertOnFailure(Schedule::command('benefits:generate-monthly')->dailyAt('09:00'));

// 会員ランク（年間利用額に基づく）を毎日午前9時30分に再計算
$alertOnFailure(Schedule::command('membership:calculate-ranks')->dailyAt('09:30'));

// 未送信請求書を毎日午前10時に送信
$alertOnFailure(Schedule::command('invoices:send-pending')->dailyAt('10:00'));

// 支払期限を過ぎた請求書の督促（前回督促から3日以上経過したもの）を毎日午前11時に送信
$alertOnFailure(Schedule::command('invoices:send-overdue-reminders')->dailyAt('11:00'));

// アクセス解析・業務KPIの日次集計（前日分）を毎日深夜2時に実行
$alertOnFailure(Schedule::command('analytics:aggregate-daily')->dailyAt('02:00'));

// Search Console検索パフォーマンスの同期（反映ラグを考慮し3日前分）を毎日深夜3時に実行
$alertOnFailure(Schedule::command('analytics:sync-search-console')->dailyAt('03:00'));
