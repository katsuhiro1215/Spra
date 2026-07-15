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
        Schema::table('appointments', function (Blueprint $table) {
            $table->string('reminder_status')->default('pending')->after('reminder_sent_at')->comment('リマインダー送信状況（pending/sent/failed）');
            $table->text('reminder_error')->nullable()->after('reminder_status')->comment('リマインダー送信失敗時のエラー内容');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->dropColumn(['reminder_status', 'reminder_error']);
        });
    }
};
