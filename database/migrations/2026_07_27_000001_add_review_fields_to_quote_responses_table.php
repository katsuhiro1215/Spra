<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * 招待メール自動送信の重複防止用フラグと、管理者が内容を確認したことを示すフラグを追加する。
     * admin_notified_at は「クライアントの回答をもとに管理者へ通知した」という別の意味で
     * 既に使われているため、確認フラグとして流用せず新規カラムを設ける。
     */
    public function up(): void
    {
        Schema::table('quote_responses', function (Blueprint $table) {
            $table->timestamp('invitation_sent_at')->nullable()->after('admin_notified_at');
            $table->timestamp('admin_reviewed_at')->nullable()->after('invitation_sent_at');
            $table->uuid('reviewed_by_admin_id')->nullable()->after('admin_reviewed_at');
            $table->foreign('reviewed_by_admin_id')->references('id')->on('admins')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('quote_responses', function (Blueprint $table) {
            $table->dropForeign(['reviewed_by_admin_id']);
            $table->dropColumn(['invitation_sent_at', 'admin_reviewed_at', 'reviewed_by_admin_id']);
        });
    }
};
