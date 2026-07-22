<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * 機能一覧セクションの明細（1行=1機能）
     */
    public function up(): void
    {
        Schema::create('project_document_section_features', function (Blueprint $table) {
            $table->ulid('id')->primary();

            $table->ulid('project_document_section_id');
            $table->foreign('project_document_section_id', 'pdsf_section_fk')
                ->references('id')->on('project_document_sections')->cascadeOnDelete();

            $table->string('name');
            $table->text('description')->nullable();
            $table->string('related_screen')->nullable();
            $table->enum('priority', ['low', 'medium', 'high'])->default('medium');
            $table->enum('status', ['planned', 'in_progress', 'done'])->default('planned');
            $table->integer('sort_order')->default(0);

            $table->timestamps();

            $table->index(['project_document_section_id', 'sort_order'], 'pdsf_section_sort_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_document_section_features');
    }
};
