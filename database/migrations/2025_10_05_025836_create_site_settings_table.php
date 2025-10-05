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
        Schema::create('site_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique(); // 設定キー
            $table->text('value')->nullable(); // 設定値
            $table->string('type')->default('text'); // 設定値の型（text, json, boolean, number）
            $table->string('group')->default('general'); // 設定グループ
            $table->text('description')->nullable(); // 設定の説明
            $table->timestamps();
            
            $table->index('group');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('site_settings');
    }
};
