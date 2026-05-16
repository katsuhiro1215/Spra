<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  /**
   * ページテーブル (ULID)
   */
  public function up(): void
  {
    Schema::create('pages', function (Blueprint $table) {
      $table->ulid('id')->primary();
      $table->string('title');
      $table->string('slug')->unique();
      $table->longText('content')->nullable();
      $table->json('meta')->nullable();
      $table->boolean('is_published')->default(false);
      $table->integer('sort_order')->default(0);
      $table->timestamps();
      $table->softDeletes();

      $table->index(['is_published', 'sort_order']);
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('pages');
  }
};
