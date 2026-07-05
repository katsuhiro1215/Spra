<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * ServicePlan と ServiceItem の中間テーブル
     * 
     * 例：ベーシックプランに「投稿機能」と「ストレージ 100GB」を含める
     */
    public function up(): void
    {
        Schema::create('service_plan_items', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->ulid('service_plan_id');
            $table->ulid('service_item_id');

            // 外部キー
            $table->foreign('service_plan_id')->references('id')->on('service_plans')->onDelete('cascade');
            $table->foreign('service_item_id')->references('id')->on('service_items')->onDelete('cascade');

            // このプランに含まれるこのアイテムの数（デフォルト1）
            $table->integer('quantity')->default(1);

            // 見積日数の上書き（プランごとに異なる場合）
            $table->integer('estimated_days')->nullable();

            $table->boolean('is_required')->default(false);

            // 並び順
            $table->integer('sort_order')->default(0);

            $table->timestamps();

            // 複合一意制約：同じプランに同じアイテムは1回のみ
            $table->unique(['service_plan_id', 'service_item_id']);

            // インデックス
            $table->index(['service_plan_id', 'sort_order']);
            $table->index(['service_item_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('service_plan_items');
    }
};
