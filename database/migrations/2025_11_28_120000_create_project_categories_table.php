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
        Schema::create('project_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // カテゴリ名
            $table->text('description')->nullable(); // カテゴリ説明
            $table->string('slug')->unique(); // URL用スラッグ
            $table->boolean('is_active')->default(true); // 有効フラグ
            $table->integer('sort_order')->default(0); // 表示順序
            $table->foreignId('created_by')->nullable()->constrained('admins')->onDelete('set null')->comment('作成者');
            $table->foreignId('updated_by')->nullable()->constrained('admins')->onDelete('set null')->comment('更新者');
            $table->foreignId('deleted_by')->nullable()->constrained('admins')->onDelete('set null')->comment('削除者');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project_categories');
    }
};
