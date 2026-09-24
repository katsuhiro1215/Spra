<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * AI社員ごとの日次集計レポート（1AI社員×1日で1レコード）
     */
    public function up(): void
    {
        Schema::create('ai_staff_daily_reports', function (Blueprint $table) {
            $table->ulid('id')->primary();

            $table->uuid('admin_id');
            $table->foreign('admin_id')->references('id')->on('admins')->onDelete('cascade');

            $table->date('report_date');
            $table->text('body');
            $table->unsignedInteger('activity_count')->default(0);
            $table->dateTime('generated_at');

            $table->timestamps();

            $table->unique(['admin_id', 'report_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ai_staff_daily_reports');
    }
};
