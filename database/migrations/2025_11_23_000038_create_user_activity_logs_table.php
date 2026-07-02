<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  /**
   * ユーザー活動ログテーブル (ULID)
   */
  public function up(): void
  {
    Schema::create('user_activity_logs', function (Blueprint $table) {
      $table->ulid('id')->primary();
      $table->uuid('user_id')->nullable()->comment('ユーザーID（システム操作の場合はnull）');
      $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
      $table->string('action');           // 操作種別
      $table->string('model_type')->nullable();
      $table->string('model_id')->nullable();  // ULID or UUID
      $table->json('old_values')->nullable();
      $table->json('new_values')->nullable();
      $table->string('ip_address', 45)->nullable();
      $table->text('user_agent')->nullable();
      $table->text('description')->nullable();
      $table->timestamps();

      $table->index(['user_id', 'created_at']);
      $table->index(['model_type', 'model_id']);
      $table->index('action');
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('user_activity_logs');
  }
};
