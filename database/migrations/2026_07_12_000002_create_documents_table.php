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
        Schema::create('documents', function (Blueprint $table) {
            $table->ulid('id')->primary();

            $table->ulid('document_category_id');
            $table->foreign('document_category_id')->references('id')->on('document_categories')->onDelete('cascade');

            // 文書名（例: 利用規約、プライバシーポリシー、FAQ、社内ルール）
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description')->nullable();

            // true の場合、アカウント作成時などにユーザーの同意（UserAcceptance）が必要
            $table->boolean('requires_acceptance')->default(false);

            $table->integer('sort_order')->default(0);

            $table->timestamps();
            $table->softDeletes();

            $table->index('requires_acceptance');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
