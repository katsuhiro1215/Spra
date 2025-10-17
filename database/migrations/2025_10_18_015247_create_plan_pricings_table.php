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
        Schema::create('plan_pricings', function (Blueprint $table) {
            $table->id();

            // 基本情報
            $table->unsignedBigInteger('service_plan_id'); // 紐づくサービスプラン
            $table->string('name'); // 価格設定名（例：基本料金、追加オプション、企業向け割引）
            $table->string('type'); // 価格タイプ（base, addon, discount, tier）
            $table->text('description')->nullable(); // 価格設定説明

            // 価格設定
            $table->decimal('price', 12, 2); // 価格
            $table->string('price_unit')->nullable(); // 価格単位（時間、件、人、月など）
            $table->enum('billing_type', ['fixed', 'per_unit', 'tiered', 'volume'])->default('fixed'); // 課金タイプ
            $table->decimal('min_quantity', 10, 2)->nullable(); // 最小数量
            $table->decimal('max_quantity', 10, 2)->nullable(); // 最大数量

            // 段階料金設定（Tiered Pricing）
            $table->json('tier_rules')->nullable(); // 段階料金ルール
            $table->decimal('tier_start_quantity', 10, 2)->nullable(); // 段階開始数量
            $table->decimal('tier_end_quantity', 10, 2)->nullable(); // 段階終了数量

            // 割引・特別価格
            $table->decimal('discount_percentage', 5, 2)->nullable(); // 割引率
            $table->decimal('discount_amount', 12, 2)->nullable(); // 割引額
            $table->date('discount_start_date')->nullable(); // 割引開始日
            $table->date('discount_end_date')->nullable(); // 割引終了日

            // 条件設定
            $table->json('conditions')->nullable(); // 適用条件（最小契約期間、対象地域など）
            $table->boolean('requires_approval')->default(false); // 承認が必要か
            $table->text('approval_notes')->nullable(); // 承認に関する備考

            // ビジネス設定
            $table->boolean('is_default')->default(false); // デフォルト価格か
            $table->boolean('is_negotiable')->default(false); // 価格交渉可能か
            $table->boolean('is_recurring')->default(false); // 定期課金か
            $table->integer('recurring_months')->nullable(); // 定期課金周期（月）

            // 表示設定
            $table->boolean('is_visible')->default(true); // 顧客に表示するか
            $table->boolean('is_featured')->default(false); // 特徴的な価格か
            $table->integer('sort_order')->default(0); // 表示順序
            $table->string('display_name')->nullable(); // 表示用名称

            // ステータス管理
            $table->boolean('is_active')->default(true); // アクティブ状態
            $table->datetime('effective_from')->nullable(); // 有効開始日時
            $table->datetime('effective_until')->nullable(); // 有効終了日時

            // 管理情報
            $table->unsignedBigInteger('created_by'); // 作成者
            $table->unsignedBigInteger('updated_by')->nullable(); // 更新者
            $table->text('notes')->nullable(); // 管理用メモ
            $table->timestamps();

            // 外部キー制約
            $table->foreign('service_plan_id')->references('id')->on('service_plans')->onDelete('cascade');
            $table->foreign('created_by')->references('id')->on('admins')->onDelete('restrict');
            $table->foreign('updated_by')->references('id')->on('admins')->onDelete('set null');

            // インデックス
            $table->index(['service_plan_id', 'is_active']);
            $table->index(['type', 'is_active']);
            $table->index(['is_default', 'service_plan_id']);
            $table->index(['effective_from', 'effective_until']);
            $table->index(['sort_order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plan_pricings');
    }
};
