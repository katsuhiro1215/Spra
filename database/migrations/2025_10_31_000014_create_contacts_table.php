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
            $table->string('name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->string('company')->nullable();
            $table->string('subject')->nullable();
            $table->longText('message');
            $table->enum('status', ['new', 'in_progress', 'replied', 'closed'])->default('new');
            $table->text('admin_notes')->nullable();
            $table->timestamp('replied_at')->nullable();

            // 流入元トラッキング情報
            $table->string('source')->nullable()->comment('流入元: web, phone, email, sns, referral, other');
            $table->string('ip')->nullable()->comment('送信元IPアドレス');
            $table->text('user_agent')->nullable()->comment('ユーザーエージェント');
            $table->string('referrer')->nullable()->comment('リファラーURL');

            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'created_at']);
            $table->index('email');
            $table->index('source');
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
