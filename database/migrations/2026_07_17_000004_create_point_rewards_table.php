<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('point_rewards', function (Blueprint $table) {
            $table->ulid('id')->primary();

            $table->string('code', 50)->unique()->comment('付与イベントの識別コード 例: referral_referrer, first_contract');
            $table->string('name');
            $table->integer('points')->comment('付与ポイント数');
            $table->boolean('is_active')->default(true);
            $table->text('description')->nullable();

            $table->uuid('created_by')->nullable();
            $table->foreign('created_by')->references('id')->on('admins')->onDelete('set null');
            $table->uuid('updated_by')->nullable();
            $table->foreign('updated_by')->references('id')->on('admins')->onDelete('set null');

            $table->timestamps();
            $table->softDeletes();
        });

        // 紹介プログラムが動作するために最低限必要なデフォルト特典
        DB::table('point_rewards')->insert([
            [
                'id' => (string) Str::ulid(),
                'code' => 'referral_referrer',
                'name' => 'ご紹介特典（紹介者）',
                'points' => 1000,
                'is_active' => true,
                'description' => '既存のお客様が新規のお客様をご紹介いただいた際に付与',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => (string) Str::ulid(),
                'code' => 'referral_referred',
                'name' => 'ご紹介特典（被紹介者）',
                'points' => 500,
                'is_active' => true,
                'description' => 'ご紹介を受けてご契約いただいた際に付与',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('point_rewards');
    }
};
