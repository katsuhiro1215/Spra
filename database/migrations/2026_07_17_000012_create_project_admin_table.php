<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * ProjectとAdminの中間テーブル（複数担当者・役割対応）
     */
    public function up(): void
    {
        Schema::create('project_admin', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->ulid('project_id');
            $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade');
            $table->uuid('admin_id');
            $table->foreign('admin_id')->references('id')->on('admins')->onDelete('cascade');
            $table->enum('role', ['leader', 'designer', 'developer', 'manager', 'other'])->default('other')->comment('プロジェクト内での役割');
            $table->timestamps();

            $table->unique(['project_id', 'admin_id']);
            $table->index(['project_id', 'role']);
        });

        // 既存の projects.admin_id を「リーダー」として project_admin へ移行
        DB::table('projects')
            ->whereNotNull('admin_id')
            ->select('id', 'admin_id')
            ->get()
            ->each(function ($project) {
                DB::table('project_admin')->insert([
                    'id' => (string) Str::ulid(),
                    'project_id' => $project->id,
                    'admin_id' => $project->admin_id,
                    'role' => 'leader',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            });

        Schema::table('projects', function (Blueprint $table) {
            $table->dropForeign(['admin_id']);
            $table->dropIndex(['admin_id', 'status']);
            $table->dropColumn('admin_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->uuid('admin_id')->nullable();
            $table->foreign('admin_id')->references('id')->on('admins')->onDelete('set null');
            $table->index(['admin_id', 'status']);
        });

        DB::table('project_admin')
            ->where('role', 'leader')
            ->select('project_id', 'admin_id')
            ->get()
            ->each(function ($row) {
                DB::table('projects')->where('id', $row->project_id)->update(['admin_id' => $row->admin_id]);
            });

        Schema::dropIfExists('project_admin');
    }
};
