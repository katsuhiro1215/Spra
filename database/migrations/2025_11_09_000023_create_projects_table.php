<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * プロジェクトテーブル (ULID)
     */
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('project_code')->unique();

            // 関連する契約
            $table->ulid('contract_id')->nullable();
            $table->foreign('contract_id')->references('id')->on('contracts')->onDelete('set null');

            // クライアント情報
            $table->uuid('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->ulid('company_id')->nullable();
            $table->foreign('company_id')->references('id')->on('companies')->onDelete('set null');
            $table->uuid('admin_id')->nullable();
            $table->foreign('admin_id')->references('id')->on('admins')->onDelete('set null');

            // 基本情報
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('thumbnail')->nullable();

            // ステータス管理
            $table->enum('status', [
                'planning',     // 計画中
                'design',       // デザイン中
                'development',  // 開発中
                'testing',      // テスト中
                'review',       // レビュー中
                'completed',    // 完了
                'on_hold',      // 保留
                'cancelled',    // キャンセル
            ])->default('planning');
            $table->enum('priority', ['low', 'medium', 'high', 'urgent'])->default('medium');

            // 期間
            $table->date('start_date')->nullable();
            $table->date('estimated_end_date')->nullable();
            $table->date('actual_end_date')->nullable();

            // クライアント向け設定
            $table->boolean('is_client_visible')->default(true);  // クライアント閲覧可否
            $table->text('client_visible_notes')->nullable();      // クライアントへのメモ
            $table->text('internal_notes')->nullable();            // 内部メモ

            $table->integer('sort_order')->default(0);

            $table->uuid('created_by')->nullable();
            $table->foreign('created_by')->references('id')->on('admins')->onDelete('set null');
            $table->uuid('updated_by')->nullable();
            $table->foreign('updated_by')->references('id')->on('admins')->onDelete('set null');
            $table->uuid('deleted_by')->nullable();
            $table->foreign('deleted_by')->references('id')->on('admins')->onDelete('set null');
            $table->timestamps();
            $table->softDeletes();

            $table->index(['user_id', 'status']);
            $table->index(['admin_id', 'status']);
            $table->index(['contract_id', 'status']);
            $table->index(['status', 'priority']);
            $table->index('is_client_visible');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
