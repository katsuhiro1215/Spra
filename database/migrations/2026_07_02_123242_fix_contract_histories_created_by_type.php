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
            // Drop the old ULID foreign key constraint
            $table->dropForeign(['created_by']);

            // Change the column type from ulid to uuid
            $table->uuid('created_by')->nullable()->change();

            // Add the new foreign key with UUID type
            $table->foreign('created_by')
                ->references('id')
                ->on('admins')
                ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('contract_histories', function (Blueprint $table) {
            // Drop the UUID foreign key
            $table->dropForeign(['created_by']);

            // Change back to ULID
            $table->ulid('created_by')->nullable()->change();

            // Restore the old foreign key
            $table->foreign('created_by')
                ->references('id')
                ->on('admins')
                ->onDelete('set null');
        });
    }
};
