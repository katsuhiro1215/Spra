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
        Schema::create('pages', function (Blueprint $table) {
            $table->id();
            $table->string('title'); // ページタイトル
            $table->string('slug')->unique(); // URL用スラッグ（home, about, service, contact等）
            $table->string('template')->default('default'); // テンプレート名
            $table->json('content'); // セクション毎のコンテンツ（JSON形式）
            $table->json('meta')->nullable(); // SEO用メタデータ
            $table->json('settings')->nullable(); // ページ固有の設定
            $table->boolean('is_published')->default(false); // 公開状態
            $table->integer('sort_order')->default(0); // 表示順序
            $table->timestamps();
            
            $table->index(['slug', 'is_published']);
            $table->index('sort_order');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pages');
    }
};
