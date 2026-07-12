<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * 業務分析・KPIテーブル (ULID)
     * Quote/Contract/Invoice/Project等の既存データを日次・月次バッチで集計したスナップショット
     * 生データは重複保存せず、対象モデルはポリモーフィック関連(dimension)で直接参照する
     */
    public function up(): void
    {
        Schema::create('analytics_kpis', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->enum('period_type', ['daily', 'monthly'])->comment('集計期間の単位');
            $table->date('period_date')->comment('集計期間の開始日(monthlyは月初日)');
            $table->string('dimension_type')->nullable()->comment('対象モデルのクラス名(全社KPIの場合はnull)');
            $table->ulid('dimension_id')->nullable()->comment('対象モデルのID(全社KPIの場合はnull)');
            $table->string('kpi_key', 100)->comment('KPI種別(revenue/new_contracts/quote_count/conversion_rate等)');
            $table->decimal('value', 18, 4)->default(0)->comment('KPI値');
            $table->json('meta')->nullable()->comment('内訳・単位等の付加情報');
            $table->timestamps();

            $table->index(['period_type', 'period_date']);
            $table->index(['dimension_type', 'dimension_id']);
            $table->index('kpi_key');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('analytics_kpis');
    }
};
