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
        Schema::create('company_memberships', function (Blueprint $table) {
            $table->ulid('id')->primary();

            $table->ulid('company_id')->unique();
            $table->foreign('company_id')->references('id')->on('companies')->onDelete('cascade');

            $table->integer('points_balance')->default(0)->comment('現在の利用可能ポイント残高');
            $table->integer('lifetime_points')->default(0)->comment('累計獲得ポイント（参考値）');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('company_memberships');
    }
};
