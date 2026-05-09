<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  /**
   * 見積明細テーブル (ULID)
   */
  public function up(): void
  {
    Schema::create('quote_items', function (Blueprint $table) {
      $table->ulid('id')->primary();
      $table->ulid('quote_id');
      $table->foreign('quote_id')->references('id')->on('quotes')->onDelete('cascade');

      // サービス参照（各明細が異なるServiceを持てる）
      $table->ulid('service_id')->nullable();
      $table->foreign('service_id')->references('id')->on('services')->onDelete('set null');
      $table->ulid('service_plan_id')->nullable();
      $table->foreign('service_plan_id')->references('id')->on('service_plans')->onDelete('set null');
      $table->ulid('service_item_id')->nullable();
      $table->foreign('service_item_id')->references('id')->on('service_items')->onDelete('set null');

      // 明細情報
      $table->string('name');                          // 項目名
      $table->text('description')->nullable();         // 説明
      $table->enum('item_type', ['plan_base', 'included', 'optional', 'addon', 'custom'])->default('custom');

      // 契約タイプ（この項目が単発か継続か）
      $table->enum('billing_type', ['one_time', 'monthly', 'quarterly', 'yearly'])->default('one_time');

      // 価格情報
      $table->decimal('quantity', 10, 2)->default(1);
      $table->decimal('unit_price', 12, 2);
      $table->decimal('amount', 12, 2);

      // 作業情報
      $table->integer('estimated_days')->nullable();   // 見積作業日数

      // 表示順
      $table->integer('sort_order')->default(0);

      $table->timestamps();

      $table->index(['quote_id', 'sort_order']);
      $table->index(['service_id', 'billing_type']);
      $table->index('service_item_id');
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
