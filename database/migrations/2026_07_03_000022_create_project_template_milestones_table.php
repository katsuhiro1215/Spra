<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  /**
   * プロジェクトテンプレートのマイルストーン定義テーブル
   */
  public function up(): void
  {
    Schema::create('project_template_milestones', function (Blueprint $table) {
      $table->ulid('id')->primary();
      $table->ulid('project_template_id');
      $table->foreign('project_template_id')->references('id')->on('project_templates')->onDelete('cascade');
      $table->string('milestone_name'); // "企画", "デザイン", "コーディング" など
      $table->text('description')->nullable();
      $table->integer('order')->default(0); // 順序
      $table->timestamps();
      $table->softDeletes();

      $table->index(['project_template_id', 'order']);
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('project_template_milestones');
  }
};
