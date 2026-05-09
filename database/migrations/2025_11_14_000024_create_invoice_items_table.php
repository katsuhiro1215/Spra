<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  /**
   * 請求明細テーブル (ULID)
   */
  public function up(): void
  {
    Schema::create('invoice_items', function (Blueprint $table) {
      $table->ulid('id')->primary();
      $table->ulid('invoice_id');
      $table->foreign('invoice_id')->references('id')->on('invoices')->onDelete('cascade');
      $table->string('description');
      $table->decimal('quantity', 10, 2)->default(1);
      $table->decimal('unit_price', 12, 2);
      $table->decimal('amount', 12, 2);
      $table->integer('sort_order')->default(0);
      $table->timestamps();

      $table->index(['invoice_id', 'sort_order']);
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('invoice_items');
  }
};
