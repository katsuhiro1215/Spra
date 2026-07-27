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
        Schema::create('atlas_invite_codes', function (Blueprint $table) {
            $table->ulid('id')->primary();

            $table->string('code', 20)->unique();
            $table->enum('brand', ['concierge', 'life', 'japan'])->comment('Atlas Concierge / Atlas Life / Atlas Japan');
            $table->enum('status', ['unused', 'used', 'revoked'])->default('unused');

            $table->uuid('issued_by')->nullable()->comment('発行した管理者');
            $table->foreign('issued_by')->references('id')->on('admins')->onDelete('set null');

            $table->uuid('used_by')->nullable()->comment('使用したユーザー');
            $table->foreign('used_by')->references('id')->on('users')->onDelete('set null');
            $table->timestamp('used_at')->nullable();

            $table->timestamp('expires_at')->nullable()->comment('有効期限（nullは無期限）');
            $table->text('note')->nullable()->comment('管理者向けメモ（発行対象や経緯など）');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('atlas_invite_codes');
    }
};
