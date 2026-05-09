<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  /**
   * 請求書テーブル (ULID)
   * 月額契約の場合は毎月生成
   */
  public function up(): void
  {
    Schema::create('invoices', function (Blueprint $table) {
      $table->ulid('id')->primary();
      $table->string('invoice_number')->unique();
      $table->ulid('contract_id');
      $table->foreign('contract_id')->references('id')->on('contracts')->onDelete('restrict');
      $table->uuid('user_id');
      $table->foreign('user_id')->references('id')->on('users')->onDelete('restrict');
      $table->ulid('company_id')->nullable();
      $table->foreign('company_id')->references('id')->on('companies')->onDelete('set null');

      // 請求期間（月額の場合）
      $table->date('billing_period_start')->nullable();
      $table->date('billing_period_end')->nullable();

      // 金額
      $table->decimal('subtotal', 12, 2);
      $table->decimal('discount_amount', 12, 2)->default(0);
      $table->decimal('tax_rate', 5, 2)->default(10);
      $table->decimal('tax_amount', 12, 2);
      $table->decimal('total_amount', 12, 2);

      // ステータス管理
      $table->enum('status', [
        'draft',    // 下書き
        'sent',     // 送付済み
        'viewed',   // 確認済み
        'paid',     // 支払済み
        'overdue',  // 期限超過
        'cancelled', // キャンセル
      ])->default('draft');
      $table->date('due_date');
      $table->timestamp('sent_at')->nullable();
      $table->timestamp('viewed_at')->nullable();
      $table->timestamp('paid_at')->nullable();

      $table->text('notes')->nullable();

      $table->uuid('created_by')->nullable();
      $table->foreign('created_by')->references('id')->on('admins')->onDelete('set null');
      $table->timestamps();
      $table->softDeletes();

      $table->index(['user_id', 'status']);
      $table->index(['contract_id', 'status']);
      $table->index(['status', 'due_date']);
      $table->index('billing_period_start');
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('invoices');
  }
};
