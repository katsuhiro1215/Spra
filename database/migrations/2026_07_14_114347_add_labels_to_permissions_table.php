<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * 権限管理画面での表示用ラベル
     */
    public function up(): void
    {
        Schema::table('permissions', function (Blueprint $table) {
            $table->string('group_label')->nullable()->after('guard_name')->comment('画面グループ表示名');
            $table->string('action_label')->nullable()->after('group_label')->comment('操作表示名');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('permissions', function (Blueprint $table) {
            $table->dropColumn(['group_label', 'action_label']);
        });
    }
};
