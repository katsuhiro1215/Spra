<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * contactsテーブルにuser_idを追加
     * お問い合わせから正式なユーザーアカウントが作成された場合の紐付け
     */
    public function up(): void
    {
        Schema::table('contacts', function (Blueprint $table) {
            $table->uuid('user_id')->nullable()->after('email');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
            $table->index('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('contacts', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropIndex(['user_id']);
            $table->dropColumn('user_id');
        });
    }
};
