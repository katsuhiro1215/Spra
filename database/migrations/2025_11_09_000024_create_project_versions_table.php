<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * プロジェクトバージョンテーブル (ULID)
     * プロジェクト計画・スケジュールのスナップショット管理
     * Quote/Contract と同じパターンで Version 管理
     */
    public function up(): void
    {
        Schema::create('project_versions', function (Blueprint $table) {
            $table->ulid('id')->primary();

            // 親Project
            $table->ulid('project_id');
            $table->foreign('project_id')->references('id')->on('projects')->cascadeOnDelete();

            // バージョン番号
            $table->integer('version')->comment('プロジェクトのバージョン番号 v1, v2, ...');

            // プロジェクト計画情報
            $table->string('title')->comment('その版のプロジェクト名');
            $table->text('description')->nullable()->comment('その版の説明');

            // スケジュール情報
            $table->date('start_date')->nullable()->comment('計画開始日');
            $table->date('estimated_end_date')->nullable()->comment('計画終了日');

            // サマリー情報（ProjectItem から計算可能）
            $table->integer('total_estimated_hours')->default(0)->comment('見積工数の合計');

            // ステータス（このバージョンの状態）
            $table->enum('status', [
                'draft',        // 下書き
                'approved',     // 承認済み
                'active',       // 進行中
                'superseded',   // 改訂版あり
                'cancelled'     // キャンセル
            ])->default('draft')->comment('バージョンの状態');

            // 変更理由
            $table->text('revision_reason')->nullable()->comment('改訂理由');

            // 現在採用版フラグ
            $table->boolean('is_current')->default(false)->comment('このバージョンが現在採用版か');

            // 管理情報
            $table->uuid('created_by')->nullable();
            $table->foreign('created_by')->references('id')->on('admins')->nullOnDelete();

            $table->timestamps();
            $table->softDeletes();

            // インデックス
            $table->index(['project_id', 'version']);
            $table->index(['project_id', 'is_current']);
            $table->index(['status', 'created_at']);
            $table->unique(['project_id', 'version'], 'unique_project_version');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project_versions');
    }
};
