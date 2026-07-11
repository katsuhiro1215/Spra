<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Contact モデル(fillable)と実スキーマの不整合を修正
     * - replied_at → responded_at にリネーム(Service/Repositoryは既にresponded_atで読み書きしている)
     * - status enumに resolved を追加
     * - api_client_id (外部API連携クライアント紐付け)を追加
     */
    public function up(): void
    {
        Schema::table('contacts', function (Blueprint $table) {
            $table->renameColumn('replied_at', 'responded_at');
        });

        DB::statement("ALTER TABLE contacts MODIFY status ENUM('new', 'in_progress', 'replied', 'resolved', 'closed') NOT NULL DEFAULT 'new'");

        Schema::table('contacts', function (Blueprint $table) {
            $table->ulid('api_client_id')->nullable()->after('source');
            $table->foreign('api_client_id')->references('id')->on('contact_api_clients')->onDelete('set null');
            $table->index('api_client_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('contacts', function (Blueprint $table) {
            $table->dropForeign(['api_client_id']);
            $table->dropIndex(['api_client_id']);
            $table->dropColumn('api_client_id');
        });

        DB::statement("ALTER TABLE contacts MODIFY status ENUM('new', 'in_progress', 'replied', 'closed') NOT NULL DEFAULT 'new'");

        Schema::table('contacts', function (Blueprint $table) {
            $table->renameColumn('responded_at', 'replied_at');
        });
    }
};
