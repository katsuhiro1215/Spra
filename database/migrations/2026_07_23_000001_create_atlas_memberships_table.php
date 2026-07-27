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
        Schema::create('atlas_memberships', function (Blueprint $table) {
            $table->ulid('id')->primary();

            $table->uuid('user_id')->unique();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

            $table->enum('brand', ['concierge', 'life', 'japan'])->comment('Atlas Concierge / Atlas Life / Atlas Japan');
            $table->enum('status', ['pending', 'active', 'paused', 'revoked'])->default('pending')->comment('会員ステータス');

            $table->uuid('granted_by')->nullable()->comment('付与した管理者');
            $table->foreign('granted_by')->references('id')->on('admins')->onDelete('set null');

            $table->timestamp('activated_at')->nullable()->comment('有効化日時');
            $table->text('note')->nullable()->comment('管理者向けメモ');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('atlas_memberships');
    }
};
