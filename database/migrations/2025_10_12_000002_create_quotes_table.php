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
    Schema::create('quotes', function (Blueprint $table) {
      $table->id();
      $table->string('quote_number')->unique(); // 見積番号 (Q2025-001)
      $table->unsignedBigInteger('service_type_id'); // ベースとなるサービスタイプ
      $table->string('client_name'); // クライアント名
      $table->string('client_email'); // クライアントメール
      $table->string('client_phone')->nullable(); // クライアント電話
      $table->string('company_name')->nullable(); // 会社名
      $table->text('requirements')->nullable(); // 要件・要望
      $table->json('custom_specifications')->nullable(); // カスタム仕様

      // 価格情報
      $table->decimal('base_amount', 12, 2); // ベース金額
      $table->decimal('discount_amount', 12, 2)->default(0); // 割引額
      $table->decimal('tax_amount', 12, 2); // 税額
      $table->decimal('total_amount', 12, 2); // 総額

      // ステータス管理
      $table->enum('status', ['draft', 'sent', 'reviewed', 'approved', 'rejected', 'expired'])->default('draft');
      $table->text('client_feedback')->nullable(); // クライアントからのフィードバック
      $table->timestamp('sent_at')->nullable(); // 送信日時
      $table->timestamp('responded_at')->nullable(); // 回答日時
      $table->timestamp('expires_at')->nullable(); // 有効期限

      // 管理情報
      $table->unsignedBigInteger('created_by'); // 作成者（営業担当者）
      $table->unsignedBigInteger('updated_by')->nullable(); // 更新者
      $table->timestamps();

      // 外部キー制約
      $table->foreign('service_type_id')->references('id')->on('service_types')->onDelete('restrict');
      $table->foreign('created_by')->references('id')->on('admins')->onDelete('restrict');
      $table->foreign('updated_by')->references('id')->on('admins')->onDelete('set null');

      // インデックス
      $table->index(['status', 'created_at']);
      $table->index(['client_email']);
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
