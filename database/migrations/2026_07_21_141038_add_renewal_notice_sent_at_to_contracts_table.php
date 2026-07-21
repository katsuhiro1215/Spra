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
        Schema::table('contracts', function (Blueprint $table) {
            // 自動更新の事前通知を送付済みかどうか(契約1サイクルにつき1回のみ送付するためのフラグ)
            $table->timestamp('renewal_notice_sent_at')->nullable()->after('renewal_notice_days')
                ->comment('自動更新の事前通知を送付した日時');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('contracts', function (Blueprint $table) {
            $table->dropColumn('renewal_notice_sent_at');
        });
    }
};
