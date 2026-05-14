<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  /**
   * プロジェクトとカテゴリの中間テーブル
   */
  public function up(): void
  {
    Schema::create('project_category_project', function (Blueprint $table) {
      $table->ulid('id')->primary();
      $table->ulid('project_id');
      $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade');
      $table->ulid('project_category_id');
      $table->foreign('project_category_id')->references('id')->on('project_categories')->onDelete('cascade');
      $table->timestamps();

      $table->unique(['project_id', 'project_category_id']);
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('project_category_project');
  }
};
