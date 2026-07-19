<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * 管理者テーブル (UUID)
     */
    public function up(): void
    {
        Schema::create('admins', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('email')->unique()->comment('メールアドレス');
            $table->timestamp('email_verified_at')->nullable()->comment('メール確認日時');
            $table->string('password')->comment('パスワード');
            $table->enum('role', ['owner', 'super_admin', 'admin', 'editor', 'viewer'])->default('admin')->comment('役割');
            $table->enum('status', ['active', 'inactive', 'suspended'])->default('active')->comment('ステータス');
            $table->boolean('two_factor_enabled')->default(false)->comment('二段階認証の有効化フラグ');
            $table->string('two_factor_method')->nullable()->comment('email/totp。nullは既存互換のためemail相当として扱う');
            $table->text('two_factor_secret')->nullable()->comment('TOTPシークレット（暗号化して保存）');
            $table->text('two_factor_recovery_codes')->nullable()->comment('リカバリーコード（ハッシュ化した配列。暗号化して保存）');
            $table->timestamp('two_factor_confirmed_at')->nullable();
            $table->unsignedInteger('failed_login_attempts')->default(0)->comment('連続ログイン失敗回数（アカウント単位）');
            $table->timestamp('locked_until')->nullable()->comment('この日時までログイン不可');
            $table->timestamp('last_login_at')->nullable()->comment('最終ログイン日時');
            $table->rememberToken();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['role', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admins');
    }
};
