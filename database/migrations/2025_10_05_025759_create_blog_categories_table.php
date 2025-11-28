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
        Schema::create('blog_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // カテゴリ名
            $table->string('slug')->unique(); // URL用スラッグ
            $table->text('description')->nullable(); // カテゴリ説明
            $table->string('color')->default('#3B82F6'); // カテゴリカラー
            $table->integer('sort_order')->default(0); // 表示順序
            $table->boolean('is_active')->default(true); // 有効状態
            // メンテナンス用カラム
            $table->foreignId('created_by')->constrained('admins')->nullOnDelete(); // 作成者
            $table->foreignId('updated_by')->constrained('admins')->nullOnDelete(); // 更新者
            $table->foreignId('deleted_by')->constrained('admins')->nullOnDelete(); // 削除者
            $table->timestamps();
            $table->softDeletes();

            $table->index(['is_active', 'sort_order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('blog_categories');
    }
};
