<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  /**
   * プロジェクト問い合わせテーブル (ULID)
   * 旧 project_drafts を改称・整理
   * 問い合わせ → 見積 → 契約 → プロジェクト の入口
   */
  public function up(): void
  {
    Schema::create('project_inquiries', function (Blueprint $table) {
      $table->ulid('id')->primary();
      $table->string('inquiry_code')->unique();         // 問い合わせ番号
      $table->uuid('user_id');
      $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
      $table->ulid('company_id')->nullable();
      $table->foreign('company_id')->references('id')->on('companies')->onDelete('set null');

      // シミュレーター関連フィールド
      $table->ulid('service_category_id')->nullable()->comment('サービスカテゴリー');
      $table->foreign('service_category_id')->references('id')->on('service_categories')->onDelete('set null');
      $table->ulid('service_id')->nullable()->comment('サービス');
      $table->foreign('service_id')->references('id')->on('services')->onDelete('set null');
      $table->ulid('service_plan_id')->nullable()->comment('サービスプラン');
      $table->foreign('service_plan_id')->references('id')->on('service_plans')->onDelete('set null');
      $table->json('simulator_data')->nullable()->comment('シミュレーター選択データ');
      $table->decimal('estimated_price', 12, 2)->nullable()->comment('概算金額');
      $table->integer('estimated_days')->nullable()->comment('納期予想日数');

      // 基本情報
      $table->string('title');
      $table->text('summary')->nullable();
      $table->decimal('budget_min', 12, 2)->nullable();
      $table->decimal('budget_max', 12, 2)->nullable();
      $table->date('desired_delivery_date')->nullable();

      // ステータス管理
      $table->enum('status', [
        'new',          // 新規受付
        'in_discussion', // 相談中
        'estimated',    // 見積済み
        'contracted',   // 契約済み
        'cancelled',    // キャンセル
      ])->default('new');

      // ヒアリング情報
      $table->longText('hearing_notes')->nullable();
      $table->longText('admin_notes')->nullable();

      // 紐づき
      $table->uuid('assigned_admin_id')->nullable();
      $table->foreign('assigned_admin_id')->references('id')->on('admins')->onDelete('set null');
      $table->ulid('quote_id')->nullable();
      $table->foreign('quote_id')->references('id')->on('quotes')->onDelete('set null');

      $table->uuid('created_by')->nullable();
      $table->foreign('created_by')->references('id')->on('admins')->onDelete('set null');
      $table->timestamps();
      $table->softDeletes();

      $table->index(['user_id', 'status']);
      $table->index(['status', 'created_at']);
      $table->index('assigned_admin_id');
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('project_inquiries');
  }
};
