<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * プロジェクト設計文書テーブル (ULID)
     * 基本設計書・DB設計書・API設計書などの「文書種別」インスタンス
     */
    public function up(): void
    {
        Schema::create('project_documents', function (Blueprint $table) {
            $table->ulid('id')->primary();

            $table->ulid('project_id');
            $table->foreign('project_id')->references('id')->on('projects')->cascadeOnDelete();

            $table->enum('document_type', [
                'overview',         // 概要
                'requirements',     // 要件定義
                'basic_design',     // 基本設計
                'detail_design',    // 詳細設計
                'database_design',  // DB設計
                'api_design',       // API設計
                'screen_design',    // 画面設計
                'test',             // テスト
                'release',          // リリース
                'documents',        // その他ドキュメント
            ])->comment('文書種別');

            $table->string('title')->nullable()->comment('表示名（未指定なら文書種別の既定名を使用）');

            $table->enum('status', [
                'draft',        // 下書き
                'in_progress',  // 作成中
                'reviewing',    // レビュー中
                'confirmed',    // 確定済み
            ])->default('draft')->comment('文書全体のステータス');

            $table->boolean('is_client_deliverable')->default(false)->comment('クライアント提出物かどうか');

            $table->uuid('created_by')->nullable();
            $table->foreign('created_by')->references('id')->on('admins')->nullOnDelete();

            $table->timestamps();
            $table->softDeletes();

            $table->unique(['project_id', 'document_type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_documents');
    }
};
