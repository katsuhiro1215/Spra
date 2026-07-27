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
        Schema::create('point_redemptions', function (Blueprint $table) {
            $table->ulid('id')->primary();

            $table->ulid('company_id');
            $table->foreign('company_id')->references('id')->on('companies')->onDelete('cascade');

            $table->ulid('point_catalog_item_id')->nullable();
            $table->foreign('point_catalog_item_id')->references('id')->on('point_catalog_items')->onDelete('set null');

            $table->string('item_name')->comment('申請時点の商品名スナップショット');
            $table->integer('points_used')->comment('申請時点の消費ポイント数スナップショット');

            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');

            $table->uuid('requested_by')->comment('申請したクライアント');
            $table->foreign('requested_by')->references('id')->on('users');

            $table->uuid('reviewed_by')->nullable();
            $table->foreign('reviewed_by')->references('id')->on('admins')->onDelete('set null');
            $table->dateTime('reviewed_at')->nullable();
            $table->text('rejection_reason')->nullable();

            $table->timestamps();

            $table->index('company_id');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('point_redemptions');
    }
};
