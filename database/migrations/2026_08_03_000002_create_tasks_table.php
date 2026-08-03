<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('status', ['todo', 'in_progress', 'done'])->default('todo');
            $table->enum('priority', ['high', 'medium', 'low'])->default('medium');

            $table->ulid('task_category_id')->nullable();
            $table->foreign('task_category_id')->references('id')->on('task_categories')->onDelete('set null');

            $table->json('tags')->nullable();

            $table->uuid('admin_id')->nullable()->comment('担当者');
            $table->foreign('admin_id')->references('id')->on('admins')->onDelete('set null');

            $table->uuid('created_by')->comment('作成者');
            $table->foreign('created_by')->references('id')->on('admins')->onDelete('cascade');

            $table->date('due_date');
            $table->time('due_time')->nullable();
            $table->dateTime('completed_at')->nullable();

            $table->json('recurrence_rule')->nullable()->comment('繰り返しテンプレート行のみ設定される');

            $table->ulid('parent_task_id')->nullable()->comment('繰り返し実体タスクが参照するテンプレートID');
            $table->foreign('parent_task_id')->references('id')->on('tasks')->onDelete('cascade');

            $table->timestamps();
            $table->softDeletes();

            $table->index(['admin_id', 'due_date']);
            $table->index('status');
            $table->index('task_category_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
