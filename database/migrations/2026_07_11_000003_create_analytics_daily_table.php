<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * 日次集計テーブル (ULID)
     * AnalyticsEvent・Search Console等から日次バッチで集計するアクセス解析ロールアップ
     */
    public function up(): void
    {
        Schema::create('analytics_daily', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->date('date')->comment('集計対象日');
            $table->ulid('dimension_id')->comment('対象ディメンション');
            $table->foreign('dimension_id')->references('id')->on('analytics_dimensions')->cascadeOnDelete();
            $table->string('metric', 50)->comment('指標(views/visitors/sessions/clicks/impressions/avg_position等)');
            $table->decimal('value', 18, 4)->default(0)->comment('集計値');
            $table->timestamps();

            $table->unique(['date', 'dimension_id', 'metric']);
            $table->index('date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('analytics_daily');
    }
};
