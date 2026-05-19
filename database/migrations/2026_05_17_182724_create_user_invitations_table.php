<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * ユーザー招待テーブル (ULID)
     * お問い合わせから正式なアカウント作成への招待を管理
     */
    public function up(): void
    {
        Schema::create('user_invitations', function (Blueprint $table) {
            $table->ulid('id')->primary();

            // お問い合わせ参照
            $table->ulid('contact_id');
            $table->foreign('contact_id')->references('id')->on('contacts')->onDelete('cascade');

            // 招待情報
            $table->string('email')->index();
            $table->string('token', 64)->unique();
            $table->timestamp('expires_at');

            // 使用状態
            $table->enum('status', ['pending', 'accepted', 'expired', 'revoked'])->default('pending');
            $table->timestamp('used_at')->nullable();
            $table->uuid('user_id')->nullable();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');

            // 招待者（管理者）
            $table->uuid('invited_by');
            $table->foreign('invited_by')->references('id')->on('admins')->onDelete('restrict');

            // メタ情報
            $table->text('notes')->nullable()->comment('招待時のメモ');
            $table->string('ip_address')->nullable()->comment('招待リンクアクセス元IP');
            $table->text('user_agent')->nullable()->comment('招待リンクアクセス元UA');

            $table->timestamps();
            $table->softDeletes();

            $table->index(['email', 'status']);
            $table->index(['contact_id', 'status']);
            $table->index(['token', 'expires_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_invitations');
    }
};
