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
      $table->string('actor_type')->default('user')->comment('操作主体（user または admin）');
      $table->uuid('admin_id')->nullable()->comment('AdminID（Admin操作の場合）');
      $table->foreign('admin_id')->references('id')->on('admins')->onDelete('set null');
      $table->string('action');           // 操作種別
      $table->string('method', 10)->nullable();
      $table->string('url', 2048)->nullable();
      $table->string('route_name')->nullable();
      $table->string('model_type')->nullable();
      $table->string('model_id')->nullable();  // ULID or UUID
      $table->json('old_values')->nullable();
      $table->json('new_values')->nullable();
      $table->json('request_data')->nullable();
      $table->json('response_data')->nullable();
      $table->string('ip_address', 45)->nullable();
      $table->text('user_agent')->nullable();
      $table->string('device_type')->nullable();
      $table->string('browser')->nullable();
      $table->string('platform')->nullable();
      $table->string('session_id')->nullable();
      $table->text('description')->nullable();
      $table->string('status')->default('success');
      $table->json('additional_data')->nullable();
      $table->timestamp('performed_at')->nullable();
      $table->timestamps();

      $table->index(['user_id', 'created_at']);
      $table->index(['admin_id', 'created_at']);
      $table->index(['model_type', 'model_id']);
      $table->index('action');
      $table->index('status');
      $table->index('performed_at');
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
