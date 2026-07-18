<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * 権限一覧セクションの明細（1行=1権限）
     */
    public function up(): void
    {
        Schema::create('project_document_section_permissions', function (Blueprint $table) {
            $table->ulid('id')->primary();

            $table->ulid('project_document_section_id');
            $table->foreign('project_document_section_id', 'pdsp_section_fk')
                ->references('id')->on('project_document_sections')->cascadeOnDelete();

            $table->string('role_name');
            $table->string('permission');
            $table->text('description')->nullable();
            $table->integer('sort_order')->default(0);

            $table->timestamps();

            $table->index(['project_document_section_id', 'sort_order'], 'pdsp_section_sort_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_document_section_permissions');
    }
};
