<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * ブロックの実体は Section.content に一本化したため、Page.content は廃止する。
     */
    public function up(): void
    {
        Schema::table('pages', function (Blueprint $table) {
            $table->dropColumn('content');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pages', function (Blueprint $table) {
            $table->json('content')->nullable()->comment('ページコンテンツ(ブロックエディタ)');
        });
    }
};
