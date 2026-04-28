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
        Schema::create('blogs', function (Blueprint $table) {
            $table->id();
            $table->string('title'); // 記事タイトル
            $table->string('slug')->unique(); // URL用スラッグ
            $table->text('excerpt')->nullable(); // 記事概要
            $table->longText('content'); // 記事本文
            $table->foreignId('media_id')->constrained('media')->nullOnDelete(); // アイキャッチ画像
            $table->json('gallery')->nullable(); // 画像ギャラリー
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft'); // 投稿状態
            $table->enum('post_type', ['blog', 'case_study', 'news'])->default('blog'); // 投稿タイプ
            $table->json('meta')->nullable(); // SEO用メタデータ
            $table->json('custom_fields')->nullable(); // カスタムフィールド
            $table->timestamp('published_at')->nullable(); // 公開日時
            $table->foreignId('created_by')->nullable()->constrained('admins')->onDelete('set null')->comment('作成者');
            $table->foreignId('updated_by')->nullable()->constrained('admins')->onDelete('set null')->comment('更新者');
            $table->foreignId('deleted_by')->nullable()->constrained('admins')->onDelete('set null')->comment('削除者');
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['status', 'post_type', 'published_at']);
            $table->index('slug');
            $table->fullText(['title', 'content']); // 全文検索用
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('blogs');
    }
};
