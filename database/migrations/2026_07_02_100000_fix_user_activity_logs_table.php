<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  /**
   * Run the migrations.
   */
  public function up(): void
  {
    // user_activity_logs テーブルを再作成（正しいスキーマで）
    Schema::dropIfExists('user_activity_logs');

    Schema::create('user_activity_logs', function (Blueprint $table) {
      $table->ulid('id')->primary();
      $table->uuid('user_id');
      $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

      // 操作情報
      $table->string('action');                    // page_view, profile_update, file_upload など
      $table->string('method')->nullable();         // GET, POST, PUT, DELETE など
      $table->string('url')->nullable();            // リクエストURL
      $table->string('route_name')->nullable();     // ルート名

      // リクエスト・レスポンス情報
      $table->json('request_data')->nullable();     // リクエストデータ
      $table->json('response_data')->nullable();    // レスポンスデータ

      // モデル変更追跡
      $table->string('model_type')->nullable();     // 変更されたモデルタイプ
      $table->string('model_id')->nullable();       // 変更されたモデルID
      $table->json('old_values')->nullable();       // 変更前の値
      $table->json('new_values')->nullable();       // 変更後の値

      // クライアント情報
      $table->string('ip_address', 45)->nullable();
      $table->text('user_agent')->nullable();
      $table->string('device_type')->nullable();    // desktop, mobile, tablet
      $table->string('browser')->nullable();
      $table->string('platform')->nullable();
      $table->string('session_id')->nullable();

      // ステータス
      $table->string('status')->nullable();         // success, error, warning
      $table->text('description')->nullable();
      $table->json('additional_data')->nullable();

      // タイムスタンプ
      $table->timestamp('performed_at')->nullable();
      $table->timestamps();

      // インデックス
      $table->index(['user_id', 'created_at']);
      $table->index(['model_type', 'model_id']);
      $table->index('action');
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
