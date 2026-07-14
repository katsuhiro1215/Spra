<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * お問い合わせテーブル (ULID)
     */
    public function up(): void
    {
        Schema::create('contacts', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->ulid('contact_category_id');
            $table->foreign('contact_category_id')->references('id')->on('contact_categories')->onDelete('cascade');
            $table->string('name');
            $table->string('email');
            $table->uuid('user_id')->nullable()->comment('ユーザーアカウント紐付け用');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
            $table->string('phone')->nullable();
            $table->string('company')->nullable();
            $table->string('category')->nullable()->comment('お問い合わせカテゴリー');
            $table->string('subject')->nullable();
            $table->longText('message');
            $table->enum('status', ['new', 'in_progress', 'replied', 'resolved', 'closed'])->default('new');
            $table->text('admin_notes')->nullable();
            $table->uuid('assigned_to')->nullable()->comment('担当管理者');
            $table->foreign('assigned_to')->references('id')->on('admins')->onDelete('set null');
            $table->timestamp('responded_at')->nullable();

            // 流入元トラッキング情報
            $table->string('source')->nullable()->comment('流入元: web, phone, email, sns, referral, other');
            $table->ulid('api_client_id')->nullable()->comment('外部API連携クライアント');
            $table->foreign('api_client_id')->references('id')->on('contact_api_clients')->onDelete('set null');
            $table->string('ip')->nullable()->comment('送信元IPアドレス');
            $table->text('user_agent')->nullable()->comment('ユーザーエージェント');
            $table->string('referrer')->nullable()->comment('リファラーURL');

            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'created_at']);
            $table->index('email');
            $table->index('source');
            $table->index('category');
            $table->index('assigned_to');
            $table->index('user_id');
            $table->index('api_client_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contacts');
    }
};
