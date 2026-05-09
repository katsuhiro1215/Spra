<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  /**
   * サービス項目テーブル (ULID)
   */
  public function up(): void
  {
    Schema::create('service_items', function (Blueprint $table) {
      $table->ulid('id')->primary();
      $table->ulid('service_id');
      $table->foreign('service_id')->references('id')->on('services')->onDelete('cascade');
      $table->ulid('service_plan_id')->nullable();
      $table->foreign('service_plan_id')->references('id')->on('service_plans')->onDelete('cascade');

      // 項目タイプ
      $table->enum('item_type', ['plan_base', 'included', 'optional', 'addon'])->default('included');

      // 基本情報
      $table->string('name');
      $table->text('description')->nullable();
      $table->decimal('price', 12, 2)->default(0);

      // 追加設定
      $table->integer('estimated_days')->nullable();
      $table->boolean('is_required')->default(false);
      $table->integer('sort_order')->default(0);
      $table->enum('status', ['active', 'inactive'])->default('active');

      $table->uuid('created_by');
      $table->foreign('created_by')->references('id')->on('admins')->onDelete('restrict');
      $table->uuid('updated_by')->nullable();
      $table->foreign('updated_by')->references('id')->on('admins')->onDelete('set null');
      $table->timestamps();
      $table->softDeletes();

      $table->index(['service_id', 'status']);
      $table->index(['service_plan_id', 'item_type']);
      $table->index(['item_type', 'sort_order']);
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('service_items');
  }
};
