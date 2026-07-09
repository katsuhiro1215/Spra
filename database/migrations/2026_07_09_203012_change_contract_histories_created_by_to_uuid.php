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
            // created_by カラムを ULID から UUID (char(36)) に変更
            $table->string('created_by', 36)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('contract_histories', function (Blueprint $table) {
            // created_by カラムを UUID から ULID に戻す
            $table->ulid('created_by')->change();
        });
    }
};
