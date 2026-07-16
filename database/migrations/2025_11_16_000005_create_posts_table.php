<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * ポストテーブル (ULID)
     */
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->ulid('id')->primary()->comment('投稿ID(ULID)');
            $table->ulid('post_category_id');
            $table->foreign('post_category_id')->references('id')->on('post_categories')->cascadeOnDelete();
            $table->string('title', 200)->comment('投稿タイトル');
            $table->string('slug', 200)->unique()->comment('URLスラッグ');
            $table->json('content')->nullable()->comment('投稿内容(ブロックエディタ)');
            $table->string('thumbnail')->nullable()->comment('サムネイル画像');
            $table->text('excerpt')->nullable()->comment('抜粋');
            $table->unsignedInteger('views')->default(0)->comment('閲覧数');
            $table->json('tags')->nullable()->comment('タグ');
            $table->json('meta')->nullable()->comment('メタデータ');
            $table->boolean('is_published')->default(false)->comment('公開状態');
            $table->timestamp('published_at')->nullable()->comment('公開日時');
            $table->uuid('created_by')->nullable();
            $table->foreign('created_by')->references('id')->on('admins')->nullOnDelete();
            $table->uuid('updated_by')->nullable();
            $table->foreign('updated_by')->references('id')->on('admins')->nullOnDelete();
            $table->uuid('deleted_by')->nullable();
            $table->foreign('deleted_by')->references('id')->on('admins')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['is_published', 'published_at']);
            $table->index(['post_category_id', 'is_published']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
