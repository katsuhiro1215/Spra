<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('quote_responses', function (Blueprint $table) {
            $table->uuid('user_id')->nullable()->after('token')->comment('作成されたユーザーID');
            $table->ulid('company_id')->nullable()->after('user_id')->comment('作成された会社ID');
            $table->foreign('user_id')->references('id')->on('users')->nullableOnDelete();
            $table->foreign('company_id')->references('id')->on('companies')->nullableOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('quote_responses', function (Blueprint $table) {
            // Foreign key constraints を削除
            DB::statement('ALTER TABLE quote_responses DROP FOREIGN KEY quote_responses_user_id_foreign');
            DB::statement('ALTER TABLE quote_responses DROP FOREIGN KEY quote_responses_company_id_foreign');
            $table->dropColumn(['user_id', 'company_id']);
        });
    }
};
