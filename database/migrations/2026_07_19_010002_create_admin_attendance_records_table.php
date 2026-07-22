<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('admin_attendance_records', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('admin_id')->constrained('admins')->cascadeOnDelete()->comment('対象管理者');
            $table->date('work_date')->comment('対象勤務日');
            $table->dateTime('clocked_in_at')->nullable()->comment('出勤打刻時刻');
            $table->dateTime('clocked_out_at')->nullable()->comment('退勤打刻時刻');
            $table->enum('status', ['working', 'finished'])->default('working')->comment('working=勤務中, finished=退勤済み');
            $table->text('notes')->nullable()->comment('手動修正時の備考');
            // 監査用カラム
            $table->foreignUuid('created_by')->nullable()->constrained('admins')->nullOnDelete()->comment('作成者');
            $table->foreignUuid('updated_by')->nullable()->constrained('admins')->nullOnDelete()->comment('更新者');
            $table->foreignUuid('deleted_by')->nullable()->constrained('admins')->nullOnDelete()->comment('削除者');
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['admin_id', 'work_date']);
            $table->index('work_date');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('admin_attendance_records');
    }
};
