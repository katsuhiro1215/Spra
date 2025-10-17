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
    Schema::create('service_type_price_items', function (Blueprint $table) {
      $table->id();
      $table->unsignedBigInteger('service_type_id'); // サービスタイプID
      $table->string('category'); // 内訳カテゴリ (design, coding, infrastructure, etc.)
      $table->string('name'); // 項目名 (デザイン設計、コーディング、環境構築等)
      $table->text('description')->nullable(); // 項目詳細説明
      $table->decimal('price', 10, 2); // 価格
      $table->string('unit')->default('式'); // 単位 (式、ページ、時間等)
      $table->integer('quantity')->default(1); // 数量
      $table->decimal('total_price', 10, 2); // 小計 (price * quantity)
      $table->boolean('is_optional')->default(false); // オプション項目かどうか
      $table->boolean('is_variable')->default(false); // 可変価格かどうか
      $table->integer('sort_order')->default(0); // 表示順序
      $table->timestamps();

      // 外部キー制約
      $table->foreign('service_type_id')->references('id')->on('service_types')->onDelete('cascade');

      // インデックス
      $table->index(['service_type_id', 'sort_order']);
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('service_type_price_items');
  }
};
