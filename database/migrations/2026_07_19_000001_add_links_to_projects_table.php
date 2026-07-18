<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->string('repository_url')->nullable()->after('thumbnail')->comment('GitHub等のリポジトリURL');
            $table->string('production_url')->nullable()->after('repository_url')->comment('本番公開URL');
        });
    }

    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn(['repository_url', 'production_url']);
        });
    }
};
