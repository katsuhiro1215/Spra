<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::create('payment_notifications', function (Blueprint $table) {
      $table->ulid('id')->primary();

      // 関連
      $table->ulid('invoice_id');
      $table->foreign('invoice_id')->references('id')->on('invoices')->onDelete('cascade');
      $table->ulid('payment_id')->nullable()->comment('Adminが確認した際に作成される実際のPaymentレコードとの紐付け');
      $table->foreign('payment_id')->references('id')->on('payments')->onDelete('set null');
      $table->uuid('user_id');
      $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
      $table->ulid('company_id')->nullable();
      $table->foreign('company_id')->references('id')->on('companies')->onDelete('set null');

      // 支払い情報
      $table->enum('payment_method', ['bank_transfer', 'credit_card', 'cash', 'other'])->comment('支払方法');
      $table->decimal('amount', 12, 2)->comment('金額');
      $table->date('payment_date')->comment('支払い日');
      $table->string('transaction_id')->nullable()->comment('トランザクションID');
      $table->text('notes')->nullable()->comment('備考');

      // ステータス
      $table->enum('status', ['pending', 'acknowledged', 'verified', 'rejected'])->default('pending')->comment('ステータス');
      $table->timestamp('acknowledged_at')->nullable()->comment('確認日時');
      $table->uuid('acknowledged_by')->nullable()->comment('確認したAdmin');
      $table->foreign('acknowledged_by')->references('id')->on('admins')->onDelete('set null');

      $table->timestamps();
      $table->softDeletes();

      $table->index(['invoice_id', 'status']);
      $table->index(['user_id', 'status']);
      $table->index('payment_date');
      $table->index('created_at');
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('payment_notifications');
  }
};
