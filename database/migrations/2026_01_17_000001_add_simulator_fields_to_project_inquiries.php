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
        Schema::table('project_inquiries', function (Blueprint $table) {
            // 見積もりシミュレーター関連フィールドを追加
            $table->ulid('service_category_id')->nullable()->after('company_id');
            $table->foreign('service_category_id')->references('id')->on('service_categories')->onDelete('set null');

            $table->ulid('service_id')->nullable()->after('service_category_id');
            $table->foreign('service_id')->references('id')->on('services')->onDelete('set null');

            $table->ulid('service_plan_id')->nullable()->after('service_id');
            $table->foreign('service_plan_id')->references('id')->on('service_plans')->onDelete('set null');

            // シミュレーター選択データ（追加機能など）をJSON形式で保存
            $table->json('simulator_data')->nullable()->after('service_plan_id');

            // シミュレーターで計算された概算金額と納期
            $table->decimal('estimated_price', 12, 2)->nullable()->after('simulator_data');
            $table->integer('estimated_days')->nullable()->after('estimated_price');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('project_inquiries', function (Blueprint $table) {
            $table->dropForeign(['service_category_id']);
            $table->dropForeign(['service_id']);
            $table->dropForeign(['service_plan_id']);

            $table->dropColumn([
                'service_category_id',
                'service_id',
                'service_plan_id',
                'simulator_data',
                'estimated_price',
                'estimated_days',
            ]);
        });
    }
};
