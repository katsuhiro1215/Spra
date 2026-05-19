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
        Schema::create('schedule_defaults', function (Blueprint $table) {
            $table->id();
            $table->unsignedTinyInteger('day_of_week')->comment('0:日曜日, 1:月曜日, ..., 6:土曜日');
            $table->boolean('is_open')->default(true)->comment('営業するか');
            $table->time('open_time')->nullable()->comment('開店時刻');
            $table->time('close_time')->nullable()->comment('閉店時刻');
            $table->time('break_start')->nullable()->comment('休憩開始時刻');
            $table->time('break_end')->nullable()->comment('休憩終了時刻');
            // 監査用カラム
            $table->foreignUuid('created_by')->nullable()->constrained('admins')->nullOnDelete()->comment('作成者');
            $table->foreignUuid('updated_by')->nullable()->constrained('admins')->nullOnDelete()->comment('更新者');
            $table->foreignUuid('deleted_by')->nullable()->constrained('admins')->nullOnDelete()->comment('削除者');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('schedule_defaults');
    }
};
