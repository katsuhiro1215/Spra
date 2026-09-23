<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * タスクボードに「レビュー待ち」段階を追加する。
     * AI社員がタスクを完了させた際、人間(または他のAI社員)が内容を確認してから
     * 「完了」に移すための中間ステータス。
     */
    public function up(): void
    {
        DB::statement("ALTER TABLE tasks MODIFY status ENUM('todo', 'in_progress', 'review', 'done') NOT NULL DEFAULT 'todo'");
    }

    /**
     * Reverse the migrations.
     *
     * MySQLはenumの許容値を超えた既存データを空文字列に切り詰めてしまうため、
     * enumを縮小する前に'review'行を安全な値へ退避する。
     */
    public function down(): void
    {
        DB::table('tasks')->where('status', 'review')->update(['status' => 'in_progress']);

        DB::statement("ALTER TABLE tasks MODIFY status ENUM('todo', 'in_progress', 'done') NOT NULL DEFAULT 'todo'");
    }
};
