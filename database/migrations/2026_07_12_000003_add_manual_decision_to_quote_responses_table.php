<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * クライアントからの回答が長期間ない見積を、管理者が目視確認のうえ
     * 手動で「見送り(NG)」に倒したことを記録するためのカラムを追加
     */
    public function up(): void
    {
        Schema::table('quote_responses', function (Blueprint $table) {
            $table->uuid('decided_by_admin_id')->nullable()->after('admin_notified_at');
            $table->foreign('decided_by_admin_id')->references('id')->on('admins')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('quote_responses', function (Blueprint $table) {
            $table->dropForeign(['decided_by_admin_id']);
            $table->dropColumn('decided_by_admin_id');
        });
    }
};
