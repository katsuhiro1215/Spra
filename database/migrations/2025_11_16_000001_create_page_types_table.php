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
        Schema::create('page_types', function (Blueprint $table) {
            $table->ulid('id')->primary()->comment('ページタイプID(ULID)');
            $table->string('key', 50)->unique()->comment('ページタイプキー');
            $table->string('name', 100)->unique()->comment('ページタイプ名');
            $table->string('slug', 100)->unique()->comment('PageType識別子');
            $table->text('description')->nullable()->comment('ページタイプ説明');
            $table->boolean('is_system')->default(false)->comment('システム定義フラグ');
            $table->boolean('is_dynamic')->default(false)->comment('動的ページフラグ');
            $table->boolean('has_detail')->default(false)->comment('詳細ページの有無');
            $table->json('allowed_component_types')->nullable()->comment('使用可能なComponentType');
            $table->json('default_layout')->nullable()->comment('デフォルトレイアウト定義');
            $table->uuid('created_by')->nullable();
            $table->foreign('created_by')->references('id')->on('admins')->nullOnDelete();
            $table->uuid('updated_by')->nullable();
            $table->foreign('updated_by')->references('id')->on('admins')->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('page_types');
    }
};
