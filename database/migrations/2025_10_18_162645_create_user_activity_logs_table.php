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
        Schema::create('user_activity_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('action'); // 実行されたアクション (例: 'login', 'profile_update', 'password_change')
            $table->string('method')->nullable(); // HTTPメソッド (GET, POST, PUT, DELETE等)
            $table->string('url')->nullable(); // アクセスしたURL
            $table->string('route_name')->nullable(); // ルート名
            $table->json('request_data')->nullable(); // リクエストデータ (機密情報を除く)
            $table->json('response_data')->nullable(); // レスポンス情報
            $table->string('ip_address', 45); // IPv4/IPv6対応
            $table->string('user_agent')->nullable(); // ユーザーエージェント
            $table->string('device_type')->nullable(); // デバイスタイプ (desktop, mobile, tablet)
            $table->string('browser')->nullable(); // ブラウザ名
            $table->string('platform')->nullable(); // OS/プラットフォーム
            $table->string('session_id')->nullable(); // セッションID
            $table->string('status')->default('success'); // success, error, warning
            $table->text('description')->nullable(); // アクションの詳細説明
            $table->json('additional_data')->nullable(); // 追加データ
            $table->timestamp('performed_at'); // アクション実行時刻
            $table->timestamps();

            // インデックス
            $table->index(['user_id', 'performed_at']);
            $table->index(['action', 'performed_at']);
            $table->index(['ip_address', 'performed_at']);
            $table->index(['status', 'performed_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_activity_logs');
    }
};
