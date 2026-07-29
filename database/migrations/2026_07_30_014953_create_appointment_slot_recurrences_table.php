<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * 予約枠の繰り返しパターン（例: 毎週火曜10:00-10:50）テーブル (ULID)
     * このテーブル自体は予約枠ではなく「生成ルール」を表し、
     * 実際の予約枠は appointment_slots に recurrence_id 付きで生成される
     */
    public function up(): void
    {
        Schema::create('appointment_slot_recurrences', function (Blueprint $table) {
            $table->ulid('id')->primary();

            $table->unsignedTinyInteger('day_of_week')->comment('0:日曜日 ～ 6:土曜日');
            $table->time('start_time')->comment('開始時刻');
            $table->time('end_time')->comment('終了時刻');
            $table->enum('slot_type', ['meeting', 'progress_review', 'consultation', 'other'])
                ->default('meeting')
                ->comment('予約枠タイプ');
            $table->unsignedInteger('max_capacity')->default(1)->comment('最大予約数');

            $table->foreignUuid('assigned_admin_id')->nullable()->constrained('admins')->nullOnDelete()->comment('担当管理者');

            $table->date('starts_on')->comment('繰り返し開始日');
            $table->date('ends_on')->nullable()->comment('繰り返し終了日（未指定なら無期限）');

            $table->enum('status', ['active', 'paused'])->default('active')->comment('active:生成継続中, paused:一時停止');

            $table->text('notes')->nullable();

            $table->foreignUuid('created_by')->nullable()->constrained('admins')->nullOnDelete();
            $table->foreignUuid('updated_by')->nullable()->constrained('admins')->nullOnDelete();

            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'day_of_week']);
            $table->index('assigned_admin_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('appointment_slot_recurrences');
    }
};
