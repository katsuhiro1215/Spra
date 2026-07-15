<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('contract_versions', function (Blueprint $table) {
            $table->text('custom_specifications')->nullable()->after('notes')->comment('カスタム仕様・メモ');
        });
    }

    public function down(): void
    {
        Schema::table('contract_versions', function (Blueprint $table) {
            $table->dropColumn('custom_specifications');
        });
    }
};
