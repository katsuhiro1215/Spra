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
        Schema::create('referrals', function (Blueprint $table) {
            $table->ulid('id')->primary();

            $table->ulid('referrer_company_id')->comment('紹介した既存顧客');
            $table->foreign('referrer_company_id')->references('id')->on('companies');

            $table->ulid('referred_company_id')->nullable()->comment('被紹介企業（契約成立まで空でもよい）');
            $table->foreign('referred_company_id')->references('id')->on('companies')->onDelete('set null');

            $table->ulid('referred_contact_id')->nullable();
            $table->foreign('referred_contact_id')->references('id')->on('contacts')->onDelete('set null');

            $table->string('referral_code', 20)->unique();
            $table->enum('status', ['pending', 'contracted', 'expired', 'cancelled'])->default('pending');

            $table->integer('referrer_points')->nullable()->comment('成立時点のPointReward値のスナップショット');
            $table->integer('referred_points')->nullable();

            $table->dateTime('contracted_at')->nullable();
            $table->dateTime('referrer_rewarded_at')->nullable()->comment('紹介者への付与済み日時（冪等性ガード）');
            $table->dateTime('referred_rewarded_at')->nullable()->comment('被紹介者への付与済み日時（冪等性ガード）');

            $table->text('description')->nullable();

            $table->uuid('created_by')->nullable();
            $table->foreign('created_by')->references('id')->on('admins')->onDelete('set null');
            $table->uuid('updated_by')->nullable();
            $table->foreign('updated_by')->references('id')->on('admins')->onDelete('set null');

            $table->timestamps();
            $table->softDeletes();

            $table->index('status');
            $table->index('referrer_company_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('referrals');
    }
};
