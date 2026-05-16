<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * 契約グループテーブル (ULID)
     * 関連する複数の契約（単発・継続）をまとめて管理
     */
    public function up(): void
    {
        Schema::create('contract_groups', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('group_number')->unique();    // グループ番号 CG2026-001

            // 元の見積参照
            $table->ulid('quote_id')->nullable();
            $table->foreign('quote_id')->references('id')->on('quotes')->onDelete('set null');

            // クライアント情報
            $table->uuid('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('restrict');
            $table->ulid('company_id')->nullable();
            $table->foreign('company_id')->references('id')->on('companies')->onDelete('set null');

            $table->string('title');
            $table->text('description')->nullable();

            // 全体のステータス（すべての契約の状態を反映）
            $table->enum('status', ['active', 'partially_active', 'completed', 'cancelled'])->default('active');

            $table->uuid('created_by')->nullable();
            $table->foreign('created_by')->references('id')->on('admins')->onDelete('set null');
            $table->timestamps();
            $table->softDeletes();

            $table->index(['user_id', 'status']);
            $table->index('quote_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contract_groups');
    }
};
