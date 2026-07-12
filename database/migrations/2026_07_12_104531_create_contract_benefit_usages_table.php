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
        Schema::create('contract_benefit_usages', function (Blueprint $table) {
            $table->ulid('id')->primary();

            $table->ulid('contract_benefit_id');
            $table->foreign('contract_benefit_id')->references('id')->on('contract_benefits')->onDelete('cascade');

            $table->foreignId('appointment_id')->nullable()->constrained('appointments')->nullOnDelete();

            $table->unsignedInteger('quantity_used')->default(1);
            $table->timestamp('used_at');
            $table->timestamp('reversed_at')->nullable();
            $table->string('reversed_reason')->nullable();

            $table->timestamps();

            $table->index('contract_benefit_id');
            $table->index('appointment_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contract_benefit_usages');
    }
};
