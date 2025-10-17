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
    Schema::create('quote_items', function (Blueprint $table) {
      $table->id();
      $table->unsignedBigInteger('quote_id'); // 見積ID
      $table->unsignedBigInteger('service_type_price_item_id')->nullable(); // ベースとなる価格項目（テンプレートから作成の場合）
      $table->string('category'); // 内訳カテゴリ
      $table->string('name'); // 項目名
      $table->text('description')->nullable(); // 項目詳細説明
      $table->decimal('unit_price', 10, 2); // 単価
      $table->string('unit')->default('式'); // 単位
      $table->integer('quantity')->default(1); // 数量
      $table->decimal('total_price', 10, 2); // 小計
      $table->boolean('is_optional')->default(false); // オプション項目
      $table->boolean('is_custom')->default(false); // カスタム項目（テンプレートにない項目）
      $table->text('notes')->nullable(); // 備考
      $table->integer('sort_order')->default(0); // 表示順序
      $table->timestamps();

      // 外部キー制約
      $table->foreign('quote_id')->references('id')->on('quotes')->onDelete('cascade');
      $table->foreign('service_type_price_item_id')->references('id')->on('service_type_price_items')->onDelete('set null');

      // インデックス
      $table->index(['quote_id', 'sort_order']);
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('quote_items');
  }
};
