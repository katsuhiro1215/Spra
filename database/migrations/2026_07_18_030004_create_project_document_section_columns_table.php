<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * DB設計セクションのカラム定義（1行=1カラム）
     */
    public function up(): void
    {
        Schema::create('project_document_section_columns', function (Blueprint $table) {
            $table->ulid('id')->primary();

            $table->ulid('project_document_section_id');
            $table->foreign('project_document_section_id', 'pdsc_section_fk')
                ->references('id')->on('project_document_sections')->cascadeOnDelete();

            $table->string('name');
            $table->string('data_type');
            $table->string('length')->nullable();
            $table->boolean('nullable')->default(false);
            $table->string('default_value')->nullable();
            $table->boolean('is_primary_key')->default(false);
            $table->boolean('is_unique')->default(false);
            $table->string('references_table')->nullable();
            $table->string('references_column')->nullable();
            $table->string('comment')->nullable();
            $table->integer('sort_order')->default(0);

            $table->timestamps();

            $table->index(['project_document_section_id', 'sort_order'], 'pdsc_section_sort_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_document_section_columns');
    }
};
