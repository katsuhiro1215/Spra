<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('project_drafts', function (Blueprint $table) {
            $table->id();
            // 
            $table->string('draft_code')->unique();
            $table->unsignedBigInteger('user_id'); // 依頼したユーザーID
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->unsignedBigInteger('admin_id')->nullable(); // 担当管理者ID
            $table->foreign('admin_id')->references('id')->on('admins')->onDelete('set null');
            $table->string('title'); // プロジェクトタイトル
            $table->text('summary')->nullable(); // プロジェクト概要
            $table->enum('status', ['draft', 'warning_user', 'in_discussion', 'completed', 'cancelled'])->default('draft'); // ステータス
            // 募集内容・ヒアリング
            $table->longText('hearing_notes')->nullable(); // ヒアリングメモ
            $table->longText('admin_notes')->nullable(); // 管理者メモ
            // 将来の移行用
            $table->unsignedBigInteger('project_id')->nullable(); // 紐づくプロジェクトID
            $table->foreignId('created_by')->nullable()->constrained('admins')->onDelete('set null')->comment('作成者');
            $table->foreignId('updated_by')->nullable()->constrained('admins')->onDelete('set null')->comment('更新者');
            $table->foreignId('deleted_by')->nullable()->constrained('admins')->onDelete('set null')->comment('削除者');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project_drafts');
    }
};
