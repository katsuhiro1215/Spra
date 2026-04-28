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
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('project_code')->unique();
            $table->unsignedBigInteger('user_id'); // 依頼したユーザーID
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->unsignedBigInteger('admin_id')->nullable(); // 担当管理者ID
            $table->foreign('admin_id')->references('id')->on('admins')->onDelete('set null');
            $table->string('title'); // プロジェクトタイトル
            $table->text('description')->nullable(); // プロジェクト詳細説明
            $table->string('image')->nullable(); // プロジェクト画像
            $table->enum('status', ['draft', 'estimating', 'waiting_contract', 'contracted', 'design', 'development', 'testing', 'completed', 'closed', 'cancelled'])->default('draft'); // ステータス
            $table->integer('sort_order')->default(0); // 表示順序
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
        Schema::dropIfExists('projects');
    }
};
