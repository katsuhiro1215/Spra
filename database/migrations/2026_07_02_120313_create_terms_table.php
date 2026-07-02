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
        Schema::create('terms', function (Blueprint $table) {
            // ULID Primary Key
            $table->ulid('id')->primary();

            // 規約の基本情報
            $table->string('title'); // 「利用規約」「サービス規約」など
            $table->longText('content'); // 規約の本文
            $table->integer('version')->default(1); // v1, v2, v3...

            // 状態管理
            $table->date('effective_date')->nullable(); // 発効日
            $table->enum('status', ['active', 'archived', 'draft'])->default('draft'); // ドラフト/有効/廃止

            // 作成者（Admin）
            $table->ulid('created_by')->nullable();
            $table->foreign('created_by')->references('id')->on('admins')->onDelete('set null');

            $table->timestamps();
            $table->softDeletes();

            // インデックス
            $table->index('status');
            $table->index('version');
            $table->unique(['title', 'version']); // タイトルとバージョンの組み合わせは一意
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('terms');
    }
};
