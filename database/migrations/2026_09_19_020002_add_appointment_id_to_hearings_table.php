<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * ヒアリングと、既存のゲスト予約導線(/consultation、Public\AppointmentController)で
     * 作られたAppointmentを紐付けるためのカラムを追加する。
     * 契約前のクライアントはユーザー登録していないため、appointments.user_idではなく
     * この直接参照でヒアリングの日程を追跡する。
     */
    public function up(): void
    {
        Schema::table('hearings', function (Blueprint $table) {
            $table->foreignId('appointment_id')->nullable()->after('quote_id')
                ->constrained('appointments')->nullOnDelete()
                ->comment('/consultation等で予約されたヒアリング日程(任意。電話等の手動調整の場合はnull)');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('hearings', function (Blueprint $table) {
            $table->dropConstrainedForeignId('appointment_id');
        });
    }
};
