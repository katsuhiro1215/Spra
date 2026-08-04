<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * ヒアリング質問項目マスタ (ULID)
     * 小規模版につきSeederで固定投入し、管理画面での編集機能は持たない
     */
    public function up(): void
    {
        Schema::create('hearing_template_items', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('category')->comment('質問カテゴリ（サイト目的/デザイン/ページ構成/機能要件/参考サイト/予算感/納期/その他）');
            $table->string('question')->comment('質問文');
            $table->enum('type', ['single_choice', 'multi_choice', 'text', 'number'])->comment('回答形式');
            $table->json('options')->nullable()->comment('選択肢（single_choice/multi_choiceのみ使用）');
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['category', 'sort_order']);
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hearing_template_items');
    }
};
