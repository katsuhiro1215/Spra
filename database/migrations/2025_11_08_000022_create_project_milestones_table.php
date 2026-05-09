<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  /**
   * プロジェクトマイルストーンテーブル (ULID)
   * 開発進捗をクライアントが随時確認できるよう管理
   */
  public function up(): void
  {
    Schema::create('project_milestones', function (Blueprint $table) {
      $table->ulid('id')->primary();
      $table->ulid('project_id');
      $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade');
      $table->string('title');
      $table->text('description')->nullable();
      $table->enum('status', ['pending', 'in_progress', 'completed', 'skipped'])->default('pending');
      $table->date('due_date')->nullable();
      $table->timestamp('completed_at')->nullable();
      $table->integer('sort_order')->default(0);
      $table->boolean('is_client_visible')->default(true);
      $table->timestamps();

      $table->index(['project_id', 'status']);
      $table->index(['project_id', 'sort_order']);
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('project_milestones');
  }
};
