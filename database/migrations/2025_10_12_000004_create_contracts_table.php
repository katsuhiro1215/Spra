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
    Schema::create('contracts', function (Blueprint $table) {
      $table->id();
      $table->string('contract_number')->unique(); // 契約番号 (C2025-001)
      $table->unsignedBigInteger('quote_id'); // 承認された見積ID
      $table->string('client_name'); // クライアント名
      $table->string('client_email'); // クライアントメール
      $table->string('company_name')->nullable(); // 会社名
      $table->text('contract_terms')->nullable(); // 契約条件

      // 価格情報（見積から転記）
      $table->decimal('contract_amount', 12, 2); // 契約金額
      $table->decimal('tax_amount', 12, 2); // 税額
      $table->decimal('total_amount', 12, 2); // 総額

      // 支払い情報
      $table->enum('payment_terms', ['upfront', 'milestone', 'completion'])->default('milestone'); // 支払条件
      $table->json('payment_schedule')->nullable(); // 支払スケジュール
      $table->decimal('paid_amount', 12, 2)->default(0); // 支払済額

      // 進行管理
      $table->enum('status', ['active', 'completed', 'cancelled', 'on_hold'])->default('active');
      $table->date('start_date'); // 開始日
      $table->date('expected_delivery_date'); // 予定納期
      $table->date('actual_delivery_date')->nullable(); // 実際の納期
      $table->integer('progress_percentage')->default(0); // 進捗率

      // 管理情報
      $table->unsignedBigInteger('assigned_to')->nullable(); // 担当者
      $table->unsignedBigInteger('created_by'); // 作成者
      $table->unsignedBigInteger('updated_by')->nullable(); // 更新者
      $table->timestamps();

      // 外部キー制約
      $table->foreign('quote_id')->references('id')->on('quotes')->onDelete('restrict');
      $table->foreign('assigned_to')->references('id')->on('admins')->onDelete('set null');
      $table->foreign('created_by')->references('id')->on('admins')->onDelete('restrict');
      $table->foreign('updated_by')->references('id')->on('admins')->onDelete('set null');

      // インデックス
      $table->index(['status', 'start_date']);
      $table->index(['assigned_to']);
      $table->index(['expected_delivery_date']);
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('contracts');
  }
};
