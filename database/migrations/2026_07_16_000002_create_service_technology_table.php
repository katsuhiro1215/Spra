<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Service ⇔ Technology 中間テーブル (ULID)
     */
    public function up(): void
    {
        Schema::create('service_technology', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->ulid('service_id');
            $table->foreign('service_id')->references('id')->on('services')->onDelete('cascade');
            $table->ulid('technology_id');
            $table->foreign('technology_id')->references('id')->on('technologies')->onDelete('cascade');
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            $table->unique(['service_id', 'technology_id'], 'service_technology_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('service_technology');
    }
};
