<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * API設計セクションのエンドポイント定義（1行=1エンドポイント）
     */
    public function up(): void
    {
        Schema::create('project_document_section_endpoints', function (Blueprint $table) {
            $table->ulid('id')->primary();

            $table->ulid('project_document_section_id');
            $table->foreign('project_document_section_id', 'pdse_section_fk')
                ->references('id')->on('project_document_sections')->cascadeOnDelete();

            $table->enum('http_method', ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']);
            $table->string('path');
            $table->string('summary')->nullable();
            $table->longText('request_body')->nullable();
            $table->longText('response_body')->nullable();
            $table->string('status_codes')->nullable();
            $table->text('notes')->nullable();
            $table->integer('sort_order')->default(0);

            $table->timestamps();

            $table->index(['project_document_section_id', 'sort_order'], 'pdse_section_sort_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_document_section_endpoints');
    }
};
