<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('admin_attendance_records', function (Blueprint $table) {
            $table->dateTime('break_started_at')->nullable()->after('clocked_out_at')->comment('現在進行中の休憩の開始時刻（休憩中でなければnull）');
            $table->unsignedInteger('break_minutes')->default(0)->after('break_started_at')->comment('その日の休憩合計時間（分）');
        });

        // enumに 'on_break' を追加（MySQLのenumはカラム再定義が必要）
        DB::statement("ALTER TABLE admin_attendance_records MODIFY status ENUM('working', 'on_break', 'finished') NOT NULL DEFAULT 'working' COMMENT 'working=勤務中, on_break=休憩中, finished=退勤済み'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE admin_attendance_records MODIFY status ENUM('working', 'finished') NOT NULL DEFAULT 'working' COMMENT 'working=勤務中, finished=退勤済み'");

        Schema::table('admin_attendance_records', function (Blueprint $table) {
            $table->dropColumn(['break_started_at', 'break_minutes']);
        });
    }
};
