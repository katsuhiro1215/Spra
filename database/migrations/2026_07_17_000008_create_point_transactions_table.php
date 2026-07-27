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
        Schema::create('point_transactions', function (Blueprint $table) {
            $table->ulid('id')->primary();

            $table->ulid('company_id');
            $table->foreign('company_id')->references('id')->on('companies')->onDelete('cascade');

            $table->integer('points')->comment('符号あり。付与は正、将来のポイント利用は負');
            $table->enum('type', ['purchase', 'bonus', 'referral', 'adjustment', 'redemption']);

            $table->ulid('point_reward_id')->nullable();
            $table->foreign('point_reward_id')->references('id')->on('point_rewards')->onDelete('set null');

            $table->ulid('receipt_id')->nullable();
            $table->foreign('receipt_id')->references('id')->on('receipts')->onDelete('set null');

            $table->ulid('referral_id')->nullable();
            $table->foreign('referral_id')->references('id')->on('referrals')->onDelete('set null');

            $table->ulid('redemption_id')->nullable();
            $table->foreign('redemption_id')->references('id')->on('point_redemptions')->onDelete('set null');

            $table->string('description');
            $table->integer('balance_after')->comment('このトランザクション後の残高スナップショット');

            $table->uuid('created_by')->nullable()->comment('手動付与の実行者');
            $table->foreign('created_by')->references('id')->on('admins')->onDelete('set null');

            $table->timestamps();

            $table->index(['company_id', 'created_at']);
            $table->index('type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('point_transactions');
    }
};
