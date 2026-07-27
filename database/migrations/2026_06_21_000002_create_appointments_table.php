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
    Schema::create('appointments', function (Blueprint $table) {
      $table->id();
      $table->foreignId('appointment_slot_id')->constrained('appointment_slots')->cascadeOnDelete()->comment('予約枠ID');
      $table->foreignUuid('user_id')->nullable()->constrained('users')->cascadeOnDelete()->comment('予約者（ユーザー）');
      $table->foreignUuid('company_id')->nullable()->constrained('companies')->cascadeOnDelete()->comment('予約者（企業）');
      $table->foreignUuid('project_id')->nullable()->constrained('projects')->nullOnDelete()->comment('関連プロジェクト');
      $table->string('source')->default('web')->comment('流入元: web, instagram');
      $table->string('external_reference')->nullable()->comment('外部プラットフォームのユーザー識別子（InstagramのIGSID等）');

      // 一般クライアント（アカウントなし）の連絡先
      $table->string('guest_name')->nullable()->comment('ゲスト氏名（アカウントなしの一般クライアント用）');
      $table->string('guest_email')->nullable()->comment('ゲストメールアドレス');
      $table->string('guest_phone')->nullable()->comment('ゲスト電話番号');

      $table->string('subject')->comment('件名');
      $table->text('description')->nullable()->comment('詳細');

      // 会議形式
      $table->enum('location_type', ['in_person', 'online'])->default('online')->comment('会議形式: in_person=対面, online=オンライン');
      $table->enum('meeting_tool', ['zoom', 'teams', 'google_meet', 'other'])->nullable()->comment('Web会議ツール');
      $table->string('meeting_url')->nullable()->comment('会議URL（確定後に管理者が設定）');

      $table->enum('status', ['pending', 'confirmed', 'completed', 'cancelled', 'no_show'])
        ->default('pending')
        ->comment('ステータス: pending=保留中, confirmed=確定, completed=完了, cancelled=キャンセル, no_show=不参加');
      $table->boolean('attended')->default(false)->comment('参加したか');
      $table->timestamp('confirmed_at')->nullable()->comment('確定日時');
      $table->timestamp('cancelled_at')->nullable()->comment('キャンセル日時');
      $table->text('cancellation_reason')->nullable()->comment('キャンセル理由');

      $table->text('admin_notes')->nullable()->comment('管理者メモ');
      $table->text('client_notes')->nullable()->comment('クライアントメモ');

      // 通知設定
      $table->boolean('send_reminder')->default(true)->comment('リマインダー送信');
      $table->timestamp('reminder_sent_at')->nullable()->comment('リマインダー送信日時');
      $table->string('reminder_status')->default('pending')->comment('リマインダー送信状況（pending/sent/failed）');
      $table->text('reminder_error')->nullable()->comment('リマインダー送信失敗時のエラー内容');

      // 監査用カラム
      $table->foreignUuid('created_by')->nullable()->constrained('admins')->nullOnDelete()->comment('作成者');
      $table->foreignUuid('updated_by')->nullable()->constrained('admins')->nullOnDelete()->comment('更新者');
      $table->foreignUuid('deleted_by')->nullable()->constrained('admins')->nullOnDelete()->comment('削除者');
      $table->timestamps();
      $table->softDeletes();

      // インデックス
      $table->index('appointment_slot_id');
      $table->index('user_id');
      $table->index('company_id');
      $table->index('project_id');
      $table->index('status');
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('appointments');
  }
};
