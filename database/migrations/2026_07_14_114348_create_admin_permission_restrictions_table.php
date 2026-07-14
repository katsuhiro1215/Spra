<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * 個別Adminに対する権限の追加制限（ロールが本来許可している権限を剥奪する）
     */
    public function up(): void
    {
        Schema::create('admin_permission_restrictions', function (Blueprint $table) {
            $table->id();
            $table->uuid('admin_id')->comment('制限対象の管理者');
            $table->foreignId('permission_id')->constrained('permissions')->cascadeOnDelete();
            $table->timestamps();

            $table->foreign('admin_id')->references('id')->on('admins')->cascadeOnDelete();
            $table->unique(['admin_id', 'permission_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admin_permission_restrictions');
    }
};
