<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * 画面一覧セクションの明細（1行=1画面）
     */
    public function up(): void
    {
        Schema::create('project_document_section_screens', function (Blueprint $table) {
            $table->ulid('id')->primary();

            $table->ulid('project_document_section_id');
            $table->foreign('project_document_section_id', 'pdss_section_fk')
                ->references('id')->on('project_document_sections')->cascadeOnDelete();

            $table->string('screen_name');
            $table->string('path')->nullable();
            $table->text('description')->nullable();
            $table->string('related_features')->nullable();
            $table->integer('sort_order')->default(0);

            $table->timestamps();

            $table->index(['project_document_section_id', 'sort_order'], 'pdss_section_sort_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_document_section_screens');
    }
};
