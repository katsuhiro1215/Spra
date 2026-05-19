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
        Schema::table('contacts', function (Blueprint $table) {
            // カテゴリーカラムを追加
            $table->string('category')->nullable()->after('company');

            // 担当管理者IDを追加（adminsテーブルはUUIDを使用）
            $table->uuid('assigned_to')->nullable()->after('admin_notes');
            $table->foreign('assigned_to')
                ->references('id')
                ->on('admins')
                ->nullOnDelete();

            // インデックスを追加
            $table->index('category');
            $table->index('assigned_to');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('contacts', function (Blueprint $table) {
            $table->dropForeign(['assigned_to']);
            $table->dropIndex(['category']);
            $table->dropIndex(['assigned_to']);
            $table->dropColumn(['category', 'assigned_to']);
        });
    }
};
