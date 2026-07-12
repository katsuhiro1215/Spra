<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * 保存レポートテーブル (ULID) - Phase2
     * ダッシュボードで組み立てたレポート定義(指標・フィルタ・期間)の保存と、
     * 将来的な定期生成・メール配信のスケジュール設定を保持する
     */
    public function up(): void
    {
        Schema::create('analytics_reports', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('name', 255)->comment('レポート名');
            $table->text('description')->nullable()->comment('説明');
            $table->json('config')->comment('指標・フィルタ・期間などのレポート定義');
            $table->string('schedule', 100)->nullable()->comment('定期生成スケジュール(cron形式等、未設定なら手動のみ)');
            $table->uuid('created_by')->nullable();
            $table->foreign('created_by')->references('id')->on('admins')->nullOnDelete();
            $table->timestamp('last_generated_at')->nullable()->comment('最終生成日時');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('analytics_reports');
    }
};
