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
        Schema::create('contract_benefits', function (Blueprint $table) {
            $table->ulid('id')->primary();

            $table->ulid('contract_id');
            $table->foreign('contract_id')->references('id')->on('contracts')->onDelete('cascade');

            $table->ulid('contract_version_id')->nullable();
            $table->foreign('contract_version_id')->references('id')->on('contract_versions')->onDelete('set null');

            $table->string('benefit_type')->default('meeting')->comment('特典の種類: meeting等（将来拡張用）');
            $table->unsignedInteger('unit_minutes')->nullable()->comment('チケット1枚あたりの時間（分）');

            $table->string('period_label')->comment('付与期間ラベル 例: 2026-07');
            $table->date('period_start');
            $table->date('period_end');

            $table->unsignedInteger('granted_quantity')->default(0)->comment('当期間の付与枚数');
            $table->unsignedInteger('carried_over_quantity')->default(0)->comment('前期間からの繰越枚数');
            $table->unsignedInteger('used_quantity')->default(0)->comment('消費済み枚数');

            $table->enum('status', ['active', 'expired'])->default('active');
            $table->date('expires_at')->nullable();

            $table->uuid('created_by')->nullable();
            $table->foreign('created_by')->references('id')->on('admins')->onDelete('set null');
            $table->uuid('updated_by')->nullable();
            $table->foreign('updated_by')->references('id')->on('admins')->onDelete('set null');

            $table->timestamps();
            $table->softDeletes();

            $table->unique(['contract_id', 'benefit_type', 'period_label']);
            $table->index(['contract_id', 'benefit_type', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contract_benefits');
    }
};
