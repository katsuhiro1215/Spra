<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  /**
   * FAQテーブル (ULID)
   */
  public function up(): void
  {
    Schema::create('faqs', function (Blueprint $table) {
      $table->ulid('id')->primary();
      $table->ulid('faq_category_id')->nullable();
      $table->foreign('faq_category_id')->references('id')->on('faq_categories')->onDelete('set null');
      $table->string('question');
      $table->longText('answer');
      $table->boolean('is_published')->default(false);
      $table->integer('sort_order')->default(0);
      $table->timestamps();
      $table->softDeletes();

      $table->index(['faq_category_id', 'is_published']);
      $table->index(['is_published', 'sort_order']);
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('faqs');
  }
};
