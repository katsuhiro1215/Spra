<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            // リマインダー通知の重複送信を防ぐため、送信済み日時を記録する
            // （app/Services/AppointmentNotificationService.php の reminder_sent_at と同じ対処）
            $table->timestamp('reminder_sent_at')->nullable()->after('completed_at');
        });
    }

    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropColumn('reminder_sent_at');
        });
    }
};
