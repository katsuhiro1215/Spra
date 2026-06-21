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
        Schema::create('receipts', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('receipt_number')->unique()->comment('領収書番号');
            
            // 関連
            $table->ulid('invoice_id');
            $table->foreign('invoice_id')->references('id')->on('invoices')->onDelete('restrict');
            $table->ulid('payment_id')->nullable();
            $table->foreign('payment_id')->references('id')->on('payments')->onDelete('set null');
            $table->uuid('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('restrict');
            $table->ulid('company_id')->nullable();
            $table->foreign('company_id')->references('id')->on('companies')->onDelete('set null');
            
            // 金額情報（スナップショット）
            $table->decimal('amount', 12, 2)->comment('小計');
            $table->decimal('tax_amount', 12, 2)->comment('税額');
            $table->decimal('total_amount', 12, 2)->comment('合計金額');
            
            // PDF保存
            $table->string('pdf_path')->nullable()->comment('PDFファイルパス');
            
            // ステータス
            $table->enum('status', ['draft', 'issued', 'sent'])->default('draft')->comment('ステータス');
            $table->timestamp('issued_at')->nullable()->comment('発行日時');
            $table->timestamp('sent_at')->nullable()->comment('送付日時');
            
            $table->text('notes')->nullable()->comment('備考');
            $table->uuid('created_by')->nullable();
            $table->foreign('created_by')->references('id')->on('admins')->onDelete('set null');
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['invoice_id', 'status']);
            $table->index(['user_id', 'status']);
            $table->index(['company_id', 'status']);
            $table->index('issued_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('receipts');
    }
};
