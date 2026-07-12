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
            $table->ulid('service_plan_id')->nullable()->after('quote_id')->comment('この契約の元になったServicePlan（契約特典の算出に使用）');
            $table->foreign('service_plan_id')->references('id')->on('service_plans')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('contracts', function (Blueprint $table) {
            $table->dropForeign(['service_plan_id']);
            $table->dropColumn('service_plan_id');
        });
    }
};
