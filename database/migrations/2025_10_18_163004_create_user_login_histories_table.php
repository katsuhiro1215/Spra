<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('user_login_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('type'); // 'login', 'logout', 'failed_login', 'forced_logout'
            $table->string('ip_address', 45); // IPv4/IPv6対応
            $table->string('user_agent')->nullable(); // ユーザーエージェント
            $table->string('device_type')->nullable(); // デバイスタイプ (desktop, mobile, tablet)
            $table->string('browser')->nullable(); // ブラウザ名
            $table->string('browser_version')->nullable(); // ブラウザバージョン
            $table->string('platform')->nullable(); // OS/プラットフォーム
            $table->string('platform_version')->nullable(); // OSバージョン
            $table->string('country')->nullable(); // 国（GeoIPから取得）
            $table->string('city')->nullable(); // 都市（GeoIPから取得）
            $table->string('session_id')->nullable(); // セッションID
            $table->string('login_method')->default('password'); // password, oauth, 2fa等
            $table->boolean('is_successful')->default(true); // ログイン成功/失敗
            $table->string('failure_reason')->nullable(); // 失敗理由
            $table->integer('login_duration')->nullable(); // ログイン継続時間（秒）
            $table->timestamp('logged_in_at'); // ログイン時刻
            $table->timestamp('logged_out_at')->nullable(); // ログアウト時刻
            $table->json('additional_data')->nullable(); // 追加データ
            $table->timestamps();

            // インデックス
            $table->index(['user_id', 'logged_in_at']);
            $table->index(['type', 'logged_in_at']);
            $table->index(['ip_address', 'logged_in_at']);
            $table->index(['is_successful', 'logged_in_at']);
            $table->index(['login_method', 'logged_in_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_login_histories');
    }
};
