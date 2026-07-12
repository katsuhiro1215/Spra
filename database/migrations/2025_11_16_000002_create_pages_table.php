<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * ページテーブル (ULID)
     */
    public function up(): void
    {
        Schema::create('pages', function (Blueprint $table) {
            $table->ulid('id')->primary()->comment('ページID(ULID)');
            $table->ulid('page_type_id');
            $table->foreign('page_type_id')->references('id')->on('page_types')->cascadeOnDelete();
            $table->string('title', 200)->comment('ページタイトル');
            $table->string('slug', 150)->unique()->comment('URLスラッグ');
            $table->string('template', 100)->default('default')->comment('使用テンプレート');
            $table->json('content')->nullable()->comment('ページコンテンツ(ブロックエディタ)');
            $table->string('meta_title', 200)->nullable()->comment('メタタイトル');
            $table->text('meta_description')->nullable()->comment('メタディスクリプション');
            $table->boolean('is_published')->default(false)->comment('公開状態');
            $table->timestamp('published_at')->nullable()->comment('公開日時');
            $table->integer('sort_order')->default(0)->comment('表示順');
            $table->uuid('created_by')->nullable();
            $table->foreign('created_by')->references('id')->on('admins')->nullOnDelete();
            $table->uuid('updated_by')->nullable();
            $table->foreign('updated_by')->references('id')->on('admins')->nullOnDelete();
            $table->uuid('deleted_by')->nullable();
            $table->foreign('deleted_by')->references('id')->on('admins')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['is_published', 'sort_order']);
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
