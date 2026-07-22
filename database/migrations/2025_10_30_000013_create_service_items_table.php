<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * サービス項目テーブル (ULID)
     */
    public function up(): void
    {
        Schema::create('service_items', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->ulid('service_id');
            $table->foreign('service_id')->references('id')->on('services')->onDelete('cascade');

            // 基本情報
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();

            // 項目タイプ
            $table->enum('item_type', ['plan_base', 'included', 'optional', 'addon'])->default('included');

            // 契約特典（将来拡張用）
            $table->string('benefit_type')->nullable()->comment('契約特典の種類: meeting等（将来拡張用）');
            $table->unsignedInteger('benefit_ticket_count')->nullable()->comment('この項目1単位が付与するチケット枚数');
            $table->unsignedInteger('benefit_unit_minutes')->nullable()->comment('チケット1枚あたりの時間（分）');

            // 価格
            $table->decimal('standard_price', 12, 2)->default(0);
            $table->decimal('internal_cost', 12, 2)->default(0);

            // 追加設定
            $table->integer('estimated_days')->nullable();
            $table->integer('estimated_hours')->nullable();

            // ステータス
            $table->enum('status', ['active', 'inactive'])->default('active');

            // ソート順序
            $table->integer('sort_order')->default(0);

            // 監査フィールド
            $table->foreignUuid('created_by')->nullable()->constrained('admins')->nullOnDelete()->comment('作成者');
            $table->foreignUuid('updated_by')->nullable()->constrained('admins')->nullOnDelete()->comment('更新者');
            $table->foreignUuid('deleted_by')->nullable()->constrained('admins')->nullOnDelete()->comment('削除者');

            $table->timestamps();
            $table->softDeletes();

            // インデックス
            $table->index(['service_id', 'status']);
            $table->index(['service_id', 'item_type']);
            $table->index(['item_type', 'sort_order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('service_items');
    }
};
