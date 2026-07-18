<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * 設計文書のセクション（Excelのシート、Wordの章に相当する単位）
     * section_typeに応じた詳細データは専用の子テーブルに実カラムで持つ
     */
    public function up(): void
    {
        Schema::create('project_document_sections', function (Blueprint $table) {
            $table->ulid('id')->primary();

            $table->ulid('project_document_version_id');
            $table->foreign('project_document_version_id')->references('id')->on('project_document_versions')->cascadeOnDelete();

            $table->enum('section_type', [
                'text',             // 自由記述（Markdown本文）
                'db_table',         // DB設計：1セクション=1テーブルのカラム定義一覧
                'api_group',        // API設計：1セクション=1リソースのエンドポイント一覧
                'feature_list',     // 機能一覧
                'screen_list',      // 画面一覧
                'permission_list',  // 権限一覧
            ]);

            $table->string('title')->comment('セクション名（例: システム概要, Users）');
            $table->longText('body')->nullable()->comment('section_type=text のときの本文');
            $table->integer('sort_order')->default(0);

            $table->timestamps();
            $table->softDeletes();

            $table->index(['project_document_version_id', 'sort_order'], 'pds_version_sort_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_document_sections');
    }
};
