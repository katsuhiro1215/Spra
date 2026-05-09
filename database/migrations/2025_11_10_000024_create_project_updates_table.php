<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  /**
   * プロジェクト進捗報告テーブル (ULID)
   * 管理者からクライアントへの進捗共有
   */
  public function up(): void
  {
    Schema::create('project_updates', function (Blueprint $table) {
      $table->ulid('id')->primary();
      $table->ulid('project_id');
      $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade');
      $table->uuid('admin_id');
      $table->foreign('admin_id')->references('id')->on('admins')->onDelete('restrict');
      $table->string('title');
      $table->longText('content');
      $table->enum('type', ['progress', 'issue', 'milestone', 'general'])->default('progress');
      $table->boolean('is_client_visible')->default(true);
      $table->timestamp('notified_at')->nullable(); // クライアントへの通知日時
      $table->timestamps();

      $table->index(['project_id', 'is_client_visible']);
      $table->index(['project_id', 'created_at']);
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('project_updates');
  }
};
