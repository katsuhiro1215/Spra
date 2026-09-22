<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * 過去(現行システム導入以前)の請求書・領収書を記録として保管するテーブル。
     * 既存の invoices/receipts/payments とは意図的に外部キーを持たず、
     * 既存の請求パイプライン(金額整合性チェック)には一切影響しない。
     */
    public function up(): void
    {
        Schema::create('legacy_documents', function (Blueprint $table) {
            $table->ulid('id')->primary();

            $table->enum('document_type', ['invoice', 'receipt'])->comment('過去の書類種別');
            $table->string('client_name')->comment('クライアント名(自由記述。既存User/Companyとは紐付けない)');
            $table->date('issued_at')->comment('発行日');
            $table->decimal('total_amount', 12, 2)->comment('合計金額(明細分割はしない)');

            $table->string('disk')->default('private');
            $table->string('pdf_path')->nullable()->comment('スキャンPDFの保存パス(任意)');

            $table->text('notes')->nullable();

            $table->uuid('created_by')->nullable();
            $table->foreign('created_by')->references('id')->on('admins')->onDelete('set null');

            $table->timestamps();
            $table->softDeletes();

            $table->index(['document_type', 'issued_at']);
            $table->index('client_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('legacy_documents');
    }
};
