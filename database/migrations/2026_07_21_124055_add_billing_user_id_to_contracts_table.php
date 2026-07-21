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
            // 請求書・領収書の送付先ユーザー（未設定の場合はuser_idを使用する）
            $table->uuid('billing_user_id')->nullable()->after('user_id')
                ->comment('請求書・領収書の送付先ユーザー（未設定時はuser_idにフォールバック）');
            $table->foreign('billing_user_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('contracts', function (Blueprint $table) {
            $table->dropForeign(['billing_user_id']);
            $table->dropColumn('billing_user_id');
        });
    }
};
