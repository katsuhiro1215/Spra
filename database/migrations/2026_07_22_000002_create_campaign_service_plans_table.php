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
        Schema::create('campaign_service_plans', function (Blueprint $table) {
            $table->ulid('campaign_id');
            $table->foreign('campaign_id')->references('id')->on('campaigns')->onDelete('cascade');

            $table->ulid('service_plan_id');
            $table->foreign('service_plan_id')->references('id')->on('service_plans')->onDelete('cascade');

            $table->timestamps();

            $table->primary(['campaign_id', 'service_plan_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('campaign_service_plans');
    }
};
