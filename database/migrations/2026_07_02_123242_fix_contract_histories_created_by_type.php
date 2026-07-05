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
        Schema::table('contract_histories', function (Blueprint $table) {
            // Check if foreign key exists before dropping it
            $indexesDetail = \DB::select("SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE TABLE_NAME = 'contract_histories' AND COLUMN_NAME = 'created_by' AND REFERENCED_TABLE_NAME = 'admins'");

            if (!empty($indexesDetail)) {
                $table->dropForeign(['created_by']);
            }

            // Clear truncate
            \DB::table('contract_histories')->truncate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No-op: Nothing to revert
    }
};
