<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * ポストカテゴリテーブル (ULID)
     */
    public function up(): void
    {
        Schema::create('post_categories', function (Blueprint $table) {
            $table->ulid('id')->primary()->comment('投稿カテゴリーID(ULID)');
            $table->ulid('parent_id')->nullable();
            $table->foreign('parent_id')->references('id')->on('post_categories')->nullOnDelete();
            $table->string('name', 200)->comment('カテゴリー名');
            $table->string('slug', 200)->unique()->comment('URLスラッグ');
            $table->text('description')->nullable()->comment('カテゴリー説明');
            $table->boolean('is_active')->default(true)->comment('有効/無効');
            $table->integer('sort_order')->default(0)->comment('表示順');
            $table->uuid('created_by')->nullable();
            $table->foreign('created_by')->references('id')->on('admins')->nullOnDelete();
            $table->uuid('updated_by')->nullable();
            $table->foreign('updated_by')->references('id')->on('admins')->nullOnDelete();
            $table->uuid('deleted_by')->nullable();
            $table->foreign('deleted_by')->references('id')->on('admins')->nullOnDelete();
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
        Schema::dropIfExists('post_categories');
    }
};
