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

            // クライアント情報（user_idとcontact_idの両方を保持可能）
            $table->uuid('user_id')->nullable();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
            $table->ulid('contact_id')->nullable()->comment('お問い合わせからの見積もり作成用');
            $table->foreign('contact_id')->references('id')->on('contacts')->onDelete('set null');

            $table->ulid('company_id')->nullable();
            $table->foreign('company_id')->references('id')->on('companies')->onDelete('set null');

            // 見積タイトル（複数サービスの場合の概要）
            $table->string('title');

            // 要件
            $table->text('requirements')->nullable();

            // 現在採用されているVersion
            $table->ulid('current_version_id')->nullable()->comment('現在有効なQuoteVersion');

            // 案件状態
            $table->enum('status', [
                'draft',
                'negotiating',
                'approved',
                'rejected',
                'contracted',
                'cancelled'
            ])->default('draft');

            // 管理情報
            $table->uuid('created_by');
            $table->foreign('created_by')->references('id')->on('admins')->onDelete('restrict');
            $table->uuid('updated_by')->nullable();
            $table->foreign('updated_by')->references('id')->on('admins')->onDelete('set null');

            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'created_at']);
            $table->index(['user_id', 'status']);
            $table->index(['contact_id', 'status']);
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
