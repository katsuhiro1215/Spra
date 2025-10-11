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
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // サービス名
            $table->string('slug')->unique(); // URL用スラッグ
            $table->unsignedBigInteger('service_category_id'); // サービスカテゴリID
            $table->text('description'); // サービス説明
            $table->longText('details'); // 詳細説明
            $table->string('icon')->nullable(); // アイコン
            $table->json('features')->nullable(); // 特徴・機能一覧
            $table->json('pricing')->nullable(); // 価格設定
            $table->json('demo_links')->nullable(); // デモサイト・アプリのリンク
            $table->json('gallery')->nullable(); // 画像ギャラリー
            $table->json('technologies')->nullable(); // 使用技術
            $table->string('status')->default('active'); // サービス状態
            $table->integer('sort_order')->default(0); // 表示順序
            $table->boolean('is_featured')->default(false); // おすすめサービス
            $table->boolean('is_active')->default(true); // アクティブ状態
            $table->timestamps();
            
            $table->foreign('service_category_id')->references('id')->on('service_categories')->onDelete('cascade');
            $table->index(['service_category_id', 'status']);
            $table->index('sort_order');
            $table->index('is_featured');
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
