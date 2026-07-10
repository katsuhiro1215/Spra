<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  /**
   * プロジェクトテンプレートテーブル (ULID)
   */
  public function up(): void
  {
    Schema::create('project_templates', function (Blueprint $table) {
      $table->ulid('id')->primary();
      $table->string('name'); // "Webサイト制作", "CRM", など
      $table->text('description')->nullable();
      $table->string('icon')->nullable();
      $table->integer('sort_order')->default(0);
      $table->boolean('is_active')->default(true);
      $table->timestamps();
      $table->softDeletes();

      $table->index(['is_active', 'sort_order']);
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('project_templates');
  }
};
