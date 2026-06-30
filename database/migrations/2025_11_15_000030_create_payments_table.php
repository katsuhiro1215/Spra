<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  /**
   * 入金記録テーブル (ULID)
   */
  public function up(): void
  {
    Schema::create('payments', function (Blueprint $table) {
      $table->ulid('id')->primary();
      $table->ulid('invoice_id');
      $table->foreign('invoice_id')->references('id')->on('invoices')->onDelete('restrict');
      $table->ulid('company_id')->nullable()->comment('会社ID');
      $table->foreign('company_id')->references('id')->on('companies')->onDelete('set null');
      $table->decimal('amount', 12, 2);
      $table->enum('payment_method', ['bank_transfer', 'credit_card', 'cash', 'other'])->default('bank_transfer');
      $table->date('payment_date');
      $table->string('transaction_id')->nullable(); // 外部決済ID
      $table->enum('status', ['pending', 'completed', 'failed', 'refunded'])->default('completed');
      $table->text('notes')->nullable();
      $table->uuid('confirmed_by')->nullable();
      $table->foreign('confirmed_by')->references('id')->on('admins')->onDelete('set null');
      $table->timestamp('confirmed_at')->nullable()->comment('決済確認日時');
      $table->timestamps();

      $table->index(['invoice_id', 'status']);
      $table->index(['company_id', 'status']);
      $table->index('payment_date');
      $table->index('payment_method');
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('payments');
  }
};
