<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * 存在しないメールアドレスでのログイン失敗時、該当するuser_idが無いままログを
     * 残そうとしてINSERTが失敗していた（user_login_histories.user_id）。
     * login_logs / user_activity_logs は元々nullableで同じケースに対応済みのため、
     * user_login_histories も揃える。
     */
    public function up(): void
    {
        DB::statement('ALTER TABLE user_login_histories MODIFY user_id CHAR(36) NULL');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('ALTER TABLE user_login_histories MODIFY user_id CHAR(36) NOT NULL');
    }
};
