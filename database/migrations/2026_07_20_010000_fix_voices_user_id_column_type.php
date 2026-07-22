<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * voices.user_id が ULID(CHAR26) で作成されていたが、参照先の users.id は UUID(CHAR36) のため、
     * 保存時に値が切り詰められて "Data too long for column 'user_id'" エラーになる不具合の修正。
     */
    public function up(): void
    {
        Schema::table('voices', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
        });

        DB::statement('ALTER TABLE voices MODIFY user_id CHAR(36) NULL');

        Schema::table('voices', function (Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('voices', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
        });

        DB::statement('ALTER TABLE voices MODIFY user_id CHAR(26) NULL');

        Schema::table('voices', function (Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users')->nullOnDelete();
        });
    }
};
