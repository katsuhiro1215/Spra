<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('admin_shifts', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('admin_id')->constrained('admins')->cascadeOnDelete()->comment('対象管理者');
            $table->date('shift_date')->comment('シフト日');
            $table->time('start_time')->comment('開始予定時刻');
            $table->time('end_time')->comment('終了予定時刻');
            $table->text('notes')->nullable()->comment('メモ');
            // 監査用カラム
            $table->foreignUuid('created_by')->nullable()->constrained('admins')->nullOnDelete()->comment('作成者');
            $table->foreignUuid('updated_by')->nullable()->constrained('admins')->nullOnDelete()->comment('更新者');
            $table->foreignUuid('deleted_by')->nullable()->constrained('admins')->nullOnDelete()->comment('削除者');
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['admin_id', 'shift_date']);
            $table->index('shift_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('admin_shifts');
    }
};
