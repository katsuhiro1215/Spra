<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  /**
   * ブログテーブル (ULID)
   */
  public function up(): void
  {
    Schema::create('blogs', function (Blueprint $table) {
      $table->ulid('id')->primary();
      $table->string('title');
      $table->string('slug')->unique();
      $table->ulid('blog_category_id')->nullable();
      $table->foreign('blog_category_id')->references('id')->on('blog_categories')->onDelete('set null');
      $table->uuid('author_id')->nullable();
      $table->foreign('author_id')->references('id')->on('admins')->onDelete('set null');
      $table->text('excerpt')->nullable();
      $table->longText('content')->nullable();
      $table->string('thumbnail')->nullable();
      $table->json('tags')->nullable();
      $table->json('meta')->nullable();
      $table->boolean('is_published')->default(false);
      $table->timestamp('published_at')->nullable();
      $table->integer('sort_order')->default(0);
      $table->timestamps();
      $table->softDeletes();

      $table->index(['is_published', 'published_at']);
      $table->index(['blog_category_id', 'is_published']);
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('blogs');
  }
};
