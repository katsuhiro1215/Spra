<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * プロジェクトアイテム（タスク）テーブル (ULID)
     * ガントチャートのタスク管理用
     */
    public function up(): void
    {
        Schema::create('project_items', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->ulid('project_version_id');
            $table->foreign('project_version_id')->references('id')->on('project_versions')->onDelete('cascade');
            $table->ulid('service_item_id')->nullable();
            $table->foreign('service_item_id')->references('id')->on('service_items')->onDelete('restrict');

            // マイルストーンとの紐付け
            $table->ulid('milestone_id')->nullable();
            $table->foreign('milestone_id')->references('id')->on('project_milestones')->onDelete('set null');

            // 階層構造（親子関係）
            $table->ulid('parent_id')->nullable();
            $table->foreign('parent_id')->references('id')->on('project_items')->onDelete('cascade');

            // タスク情報
            $table->string('name');
            $table->text('description')->nullable();
            $table->enum('type', ['task', 'milestone', 'group'])->default('task');

            // スケジュール
            $table->date('start_date');
            $table->date('end_date');
            $table->date('actual_start_date')->nullable();
            $table->date('actual_end_date')->nullable();
            $table->integer('estimated_hours')->nullable();  // 見積もり時間
            $table->integer('actual_hours')->nullable();      // 実績時間

            // ステータス
            $table->enum('status', [
                'not_started',   // 未着手
                'in_progress',   // 進行中
                'completed',     // 完了
                'on_hold',       // 保留
                'cancelled',     // キャンセル
            ])->default('not_started');

            // 進捗
            $table->integer('progress')->default(0);  // 0-100%

            // 優先度
            $table->enum('priority', ['low', 'medium', 'high', 'urgent'])->default('medium');

            // 担当者
            $table->uuid('assigned_to')->nullable();
            $table->foreign('assigned_to')->references('id')->on('admins')->onDelete('set null');

            // 依存関係（JSON配列で複数のタスクIDを保存）
            $table->json('dependencies')->nullable();  // ['task_id_1', 'task_id_2']

            // 表示設定
            $table->integer('sort_order')->default(0);
            $table->boolean('is_client_visible')->default(true);

            // タグ・カテゴリ
            $table->string('category')->nullable();  // design, development, testing等
            $table->json('tags')->nullable();

            // メモ
            $table->text('internal_notes')->nullable();
            $table->text('client_notes')->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->index(['project_version_id', 'status']);
            $table->index(['project_version_id', 'parent_id']);
            $table->index(['milestone_id', 'status']);
            $table->index(['assigned_to', 'status']);
            $table->index(['start_date', 'end_date']);
            $table->index('sort_order');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project_items');
    }
};
