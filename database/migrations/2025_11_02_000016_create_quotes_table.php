<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * 見積テーブル (ULID)
     */
    public function up(): void
    {
        Schema::create('quotes', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('quote_number')->unique();        // 見積番号 Q2026-001
            $table->uuid('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->ulid('company_id')->nullable();
            $table->foreign('company_id')->references('id')->on('companies')->onDelete('set null');

            // 見積タイトル（複数サービスの場合の概要）
            $table->string('title');

            // 要件
            $table->text('requirements')->nullable();
            $table->json('custom_specifications')->nullable();

            // 価格情報
            $table->decimal('base_amount', 12, 2);
            $table->decimal('discount_amount', 12, 2)->default(0);
            $table->decimal('tax_rate', 5, 2)->default(10);
            $table->decimal('tax_amount', 12, 2);
            $table->decimal('total_amount', 12, 2);

            // ステータス管理
            $table->enum('status', ['draft', 'sent', 'reviewed', 'approved', 'rejected', 'expired'])->default('draft');
            $table->text('client_feedback')->nullable();
            $table->timestamp('sent_at')->nullable();
            $table->timestamp('responded_at')->nullable();
            $table->timestamp('expires_at')->nullable();

            // 管理情報
            $table->uuid('created_by');
            $table->foreign('created_by')->references('id')->on('admins')->onDelete('restrict');
            $table->uuid('updated_by')->nullable();
            $table->foreign('updated_by')->references('id')->on('admins')->onDelete('set null');
            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'created_at']);
            $table->index(['user_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quotes');
    }
};
