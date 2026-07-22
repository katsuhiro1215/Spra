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
        Schema::table('point_transactions', function (Blueprint $table) {
            $table->ulid('redemption_id')->nullable()->after('referral_id');
            $table->foreign('redemption_id')->references('id')->on('point_redemptions')->onDelete('set null');
        });

        DB::statement("ALTER TABLE point_transactions MODIFY type ENUM('purchase', 'bonus', 'referral', 'adjustment', 'redemption') NOT NULL");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('point_transactions', function (Blueprint $table) {
            $table->dropForeign(['redemption_id']);
            $table->dropColumn('redemption_id');
        });

        DB::statement("ALTER TABLE point_transactions MODIFY type ENUM('purchase', 'bonus', 'referral', 'adjustment') NOT NULL");
    }
};
