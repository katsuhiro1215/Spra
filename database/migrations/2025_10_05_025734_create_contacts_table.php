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
        Schema::create('contacts', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // お名前
            $table->string('email'); // メールアドレス
            $table->string('phone')->nullable(); // 電話番号
            $table->string('company')->nullable(); // 会社名
            $table->enum('category', ['estimate', 'partnership', 'support', 'other']); // 問い合わせカテゴリ
            $table->string('subject'); // 件名
            $table->text('message'); // メッセージ
            $table->json('attachments')->nullable(); // 添付ファイル
            $table->enum('status', ['new', 'in_progress', 'resolved', 'closed'])->default('new'); // 対応状況
            $table->text('admin_notes')->nullable(); // 管理者メモ
            $table->timestamp('responded_at')->nullable(); // 返信日時
            $table->unsignedBigInteger('assigned_to')->nullable(); // 担当者
            $table->timestamps();
            
            $table->foreign('assigned_to')->references('id')->on('admins')->onDelete('set null');
            $table->index(['status', 'category']);
            $table->index('created_at');
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
