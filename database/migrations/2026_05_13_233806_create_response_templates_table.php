<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * 返答テンプレートテーブル (ULID)
     */
    public function up(): void
    {
        Schema::create('response_templates', function (Blueprint $table) {
            $table->ulid('id')->primary();

            // テンプレート情報
            $table->string('name');              // テンプレート名
            $table->string('category')->nullable();  // カテゴリ（一般、見積、技術、営業など）
            $table->string('subject');           // メール件名
            $table->longText('body');            // メール本文

            // 変数プレースホルダー説明
            $table->text('placeholders')->nullable();  // 使用可能な変数の説明

            // ステータス
            $table->enum('status', ['active', 'inactive'])->default('active');

            // 表示順
            $table->integer('sort_order')->default(0);

            $table->uuid('created_by')->nullable();
            $table->foreign('created_by')->references('id')->on('admins')->onDelete('set null');
            $table->uuid('updated_by')->nullable();
            $table->foreign('updated_by')->references('id')->on('admins')->onDelete('set null');
            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'category']);
            $table->index('sort_order');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('response_templates');
    }
};
