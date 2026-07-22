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
        Schema::create('menu_items', function (Blueprint $table) {
            $table->ulid('id')->primary()->comment('メニューアイテムID(ULID)');
            $table->ulid('menu_id');
            $table->foreign('menu_id')->references('id')->on('menus')->cascadeOnDelete();
            $table->ulid('parent_id')->nullable();
            $table->foreign('parent_id')->references('id')->on('menu_items')->nullOnDelete();
            $table->string('label', 200)->comment('メニューアイテムラベル');
            $table->string('url', 200)->comment('メニューアイテムURL');
            $table->text('description')->nullable()->comment('説明文（メガメニュー表示用）');
            $table->string('image_path', 500)->nullable()->comment('画像パス（メガメニュー表示用）');
            $table->ulid('page_id')->nullable();
            $table->foreign('page_id')->references('id')->on('pages')->nullOnDelete();
            $table->string('target', 20)->default('_self')->comment('リンクターゲット');
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
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('menu_items');
    }
};
