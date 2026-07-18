<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * プロジェクト設計文書バージョンテーブル (ULID)
     * Sectionはこのバージョンに直接ひも付く（ContractVersion/ContractItemと同じ方式）
     */
    public function up(): void
    {
        Schema::create('project_document_versions', function (Blueprint $table) {
            $table->ulid('id')->primary();

            $table->ulid('project_document_id');
            $table->foreign('project_document_id')->references('id')->on('project_documents')->cascadeOnDelete();

            $table->integer('version')->comment('文書のバージョン番号 v1, v2, ...');

            $table->enum('status', [
                'draft',      // 編集中
                'released',   // 確定済み
                'superseded', // 改訂版あり
            ])->default('draft');

            $table->boolean('is_current')->default(true)->comment('現在編集/表示対象のバージョンか');

            $table->text('revision_reason')->nullable()->comment('改訂理由');

            $table->uuid('released_by')->nullable();
            $table->foreign('released_by')->references('id')->on('admins')->nullOnDelete();
            $table->timestamp('released_at')->nullable();

            $table->uuid('created_by')->nullable();
            $table->foreign('created_by')->references('id')->on('admins')->nullOnDelete();

            $table->timestamps();
            $table->softDeletes();

            $table->unique(['project_document_id', 'version']);
            $table->index(['project_document_id', 'is_current']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_document_versions');
    }
};
