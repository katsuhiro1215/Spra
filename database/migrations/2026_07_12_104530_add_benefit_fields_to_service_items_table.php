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
        Schema::table('service_items', function (Blueprint $table) {
            $table->string('benefit_type')->nullable()->after('item_type')->comment('契約特典の種類: meeting等（将来拡張用）');
            $table->unsignedInteger('benefit_ticket_count')->nullable()->after('benefit_type')->comment('この項目1単位が付与するチケット枚数');
            $table->unsignedInteger('benefit_unit_minutes')->nullable()->after('benefit_ticket_count')->comment('チケット1枚あたりの時間（分）');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('service_items', function (Blueprint $table) {
            $table->dropColumn(['benefit_type', 'benefit_ticket_count', 'benefit_unit_minutes']);
        });
    }
};
