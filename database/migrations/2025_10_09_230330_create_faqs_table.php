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
        Schema::create('faqs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('faq_category_id')->nullable()->constrained('faq_categories')->onDelete('set null'); // FAQカテゴリとの関連
            $table->string('question'); // 質問
            $table->text('answer'); // 回答
            $table->enum('category', ['pricing', 'contract', 'support', 'process', 'technical', 'general'])->nullable(); // 旧カテゴリ（移行用、後で削除予定）
            $table->integer('sort_order')->default(0); // 表示順序
            $table->boolean('is_featured')->default(false); // よくある質問として表示
            $table->boolean('is_published')->default(true); // 公開状態
            $table->timestamps();
            
            $table->index(['faq_category_id', 'is_published']);
            $table->index(['category', 'is_published']); // 旧カテゴリ用インデックス
            $table->index('sort_order');
            $table->index('is_featured');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('faqs');
    }
};
