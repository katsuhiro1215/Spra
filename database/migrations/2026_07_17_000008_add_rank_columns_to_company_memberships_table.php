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
        Schema::table('company_memberships', function (Blueprint $table) {
            $table->ulid('current_rank_id')->nullable()->after('lifetime_points');
            $table->foreign('current_rank_id')->references('id')->on('membership_ranks')->onDelete('set null');

            $table->decimal('annual_usage_amount', 12, 2)->default(0)->after('current_rank_id')->comment('直近バッチで計算した当年（暦年）の利用額');
            $table->dateTime('rank_calculated_at')->nullable()->after('annual_usage_amount');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('company_memberships', function (Blueprint $table) {
            $table->dropForeign(['current_rank_id']);
            $table->dropColumn(['current_rank_id', 'annual_usage_amount', 'rank_calculated_at']);
        });
    }
};
