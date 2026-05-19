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
        Schema::create('schedule_exceptions', function (Blueprint $table) {
            $table->id();
            $table->date('exception_date')->comment('例外日');
            $table->boolean('is_open')->default(false)->comment('営業するかどうか');
            $table->time('open_time')->nullable()->comment('開店時間');
            $table->time('close_time')->nullable()->comment('閉店時間');
            $table->time('break_start')->nullable()->comment('休憩開始時間');
            $table->time('break_end')->nullable()->comment('休憩終了時間');
            $table->string('reason')->nullable()->comment('理由（臨時休業、年末年始、特別営業など）');
            $table->text('notes')->nullable()->comment('備考');
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
        Schema::dropIfExists('schedule_exceptions');
    }
};
