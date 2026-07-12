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
        Schema::table('service_plans', function (Blueprint $table) {
            $table->unsignedInteger('max_carryover_tickets')->nullable()->after('max_revisions')->comment('翌期間へ繰り越せるチケット上限。nullは繰越不可');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('service_plans', function (Blueprint $table) {
            $table->dropColumn('max_carryover_tickets');
        });
    }
};
