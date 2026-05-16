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
        Schema::create('login_logs', function (Blueprint $table) {
            $table->ulid('id')->primary();

            // アクション情報
            $table->enum('action', [
                'login_attempt',
                'login_success',
                'login_failed',
                'logout',
                'session_expired',
                'forced_logout',
            ])->index();

            // ユーザー情報
            $table->enum('user_type', ['admin', 'user'])->index();
            $table->string('user_id', 100)->nullable()->index(); // ログイン成功時のみ
            $table->string('email', 255)->index(); // ログイン試行時のメールアドレス

            // 認証情報
            $table->string('guard', 50)->nullable(); // 'admin', 'owner', 'web'
            $table->enum('auth_method', ['password', 'remember_token', 'api_token', 'social'])->default('password');
            $table->string('social_provider', 50)->nullable(); // 'google', 'facebook', 'line'

            // 失敗情報
            $table->string('failure_reason', 255)->nullable(); // 'invalid_credentials', 'account_locked', 'email_not_verified'
            $table->integer('attempt_count')->default(1); // 連続失敗回数

            // リクエスト情報
            $table->ipAddress('ip_address')->index();
            $table->string('user_agent', 500)->nullable();
            $table->string('device_type', 50)->nullable(); // 'desktop', 'mobile', 'tablet'
            $table->string('browser', 100)->nullable();
            $table->string('os', 100)->nullable();

            // 位置情報（オプション）
            $table->string('country', 100)->nullable();
            $table->string('city', 100)->nullable();

            // セッション情報
            $table->string('session_id', 100)->nullable()->index();
            $table->timestamp('session_expires_at')->nullable();

            // セキュリティフラグ
            $table->boolean('is_suspicious')->default(false)->index(); // 不審なアクセス
            $table->boolean('requires_2fa')->default(false); // 2FA要求
            $table->boolean('is_blocked')->default(false); // ブロックされたアクセス
            $table->timestamps();

            // パフォーマンス用インデックス
            $table->index(['user_type', 'user_id', 'created_at']);
            $table->index(['ip_address', 'action', 'created_at']);
            $table->index(['is_suspicious', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('login_logs');
    }
};
