<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * admins.role に AI社員用ロール 'ai_staff' を追加し、
     * 部署slugを保持する department カラムを追加する。
     */
    public function up(): void
    {
        DB::statement("ALTER TABLE admins MODIFY role ENUM('owner', 'super_admin', 'admin', 'editor', 'viewer', 'ai_staff') NOT NULL DEFAULT 'admin'");

        Schema::table('admins', function (Blueprint $table) {
            $table->string('department')->nullable()->after('role')
                ->comment('AI社員の部署slug(company/CLAUDE.mdの部署一覧に対応)。人間の管理者はnull');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // enumを縮小する前に、既存の ai_staff ロールを viewer へ退避させる。
        // MySQLはenum外の値を空文字に丸めるため、これを怠ると本番データが壊れる。
        DB::table('admins')->where('role', 'ai_staff')->update(['role' => 'viewer']);

        Schema::table('admins', function (Blueprint $table) {
            $table->dropColumn('department');
        });

        DB::statement("ALTER TABLE admins MODIFY role ENUM('owner', 'super_admin', 'admin', 'editor', 'viewer') NOT NULL DEFAULT 'admin'");
    }
};
