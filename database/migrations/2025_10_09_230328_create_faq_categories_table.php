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
        Schema::create('faq_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // カテゴリ名
            $table->string('slug')->unique(); // URL用スラッグ
            $table->text('description')->nullable(); // カテゴリ説明
            $table->string('color', 7)->default('#3B82F6'); // カテゴリ色（HEX）
            $table->string('icon')->nullable(); // アイコン（Heroicons等）
            $table->integer('sort_order')->default(0); // 表示順序
            $table->boolean('is_active')->default(true); // アクティブ状態
            $table->timestamps();

            $table->index(['is_active', 'sort_order']);
            $table->index('slug');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('faq_categories');
    }
};
