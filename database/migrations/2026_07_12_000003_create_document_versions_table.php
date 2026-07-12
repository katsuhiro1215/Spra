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
        Schema::create('document_versions', function (Blueprint $table) {
            $table->ulid('id')->primary();

            $table->ulid('document_id');
            $table->foreign('document_id')->references('id')->on('documents')->onDelete('cascade');

            $table->integer('version')->default(1); // v1, v2, v3...
            $table->longText('content');

            // 状態管理（ドラフト/有効/廃止）
            $table->enum('status', ['active', 'archived', 'draft'])->default('draft');
            $table->date('effective_date')->nullable(); // 発効日

            $table->uuid('created_by')->nullable();
            $table->foreign('created_by')->references('id')->on('admins')->onDelete('set null');

            $table->timestamps();
            $table->softDeletes();

            $table->index('status');
            $table->unique(['document_id', 'version']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('document_versions');
    }
};
