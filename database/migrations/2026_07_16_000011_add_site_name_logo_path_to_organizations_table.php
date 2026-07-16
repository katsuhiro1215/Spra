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
        Schema::table('organizations', function (Blueprint $table) {
            $table->string('site_name')->nullable()->after('name')->comment('サイト表示名');
            $table->string('logo_path', 500)->nullable()->after('site_name')->comment('ロゴ画像パス（public直下）');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('organizations', function (Blueprint $table) {
            $table->dropColumn(['site_name', 'logo_path']);
        });
    }
};
