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
        Schema::create('contract_histories', function (Blueprint $table) {
            // ULID Primary Key
            $table->ulid('id')->primary();

            // 契約参照
            $table->ulid('contract_id');
            $table->foreign('contract_id')
                ->references('id')
                ->on('contracts')
                ->onDelete('cascade');

            // アクションタイプ
            $table->enum('action', ['created', 'sent', 'signed', 'archived', 'cancelled', 'note_added']);

            // メール関連
            $table->string('recipient_email')->nullable();
            $table->string('subject')->nullable();
            $table->longText('message')->nullable();
            $table->dateTime('sent_at')->nullable();

            // 送信ステータス
            $table->enum('status', ['pending', 'sent', 'failed', 'bounce'])->default('pending');
            $table->json('metadata')->nullable(); // エラー情報など

            // 作成者（Admin）
            $table->ulid('created_by')->nullable();
            $table->foreign('created_by')
                ->references('id')
                ->on('admins')
                ->onDelete('set null');

            $table->timestamps();
            $table->softDeletes();

            // インデックス
            $table->index('contract_id');
            $table->index('action');
            $table->index('status');
            $table->index('sent_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contract_histories');
    }
};
