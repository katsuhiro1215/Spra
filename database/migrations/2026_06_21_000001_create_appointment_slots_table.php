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
    Schema::create('appointment_slots', function (Blueprint $table) {
      $table->id();
      $table->date('date')->comment('予約枠の日付');
      $table->time('start_time')->comment('開始時刻');
      $table->time('end_time')->comment('終了時刻');
      $table->enum('slot_type', ['meeting', 'progress_review', 'consultation', 'other'])
        ->default('meeting')
        ->comment('予約枠タイプ: meeting=面談, progress_review=進捗会, consultation=相談, other=その他');
      $table->unsignedInteger('max_capacity')->default(1)->comment('最大予約数');
      $table->unsignedInteger('current_bookings')->default(0)->comment('現在の予約数');
      $table->foreignUuid('assigned_admin_id')->nullable()->constrained('admins')->nullOnDelete()->comment('担当管理者');
      $table->enum('status', ['available', 'blocked', 'full'])
        ->default('available')
        ->comment('ステータス: available=予約可能, blocked=ブロック中, full=満席');
      $table->text('notes')->nullable()->comment('メモ');

      // 監査用カラム
      $table->foreignUuid('created_by')->nullable()->constrained('admins')->nullOnDelete()->comment('作成者');
      $table->foreignUuid('updated_by')->nullable()->constrained('admins')->nullOnDelete()->comment('更新者');
      $table->foreignUuid('deleted_by')->nullable()->constrained('admins')->nullOnDelete()->comment('削除者');
      $table->timestamps();
      $table->softDeletes();

      // インデックス
      $table->index(['date', 'start_time']);
      $table->index('assigned_admin_id');
      $table->index('status');
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('appointment_slots');
  }
};
