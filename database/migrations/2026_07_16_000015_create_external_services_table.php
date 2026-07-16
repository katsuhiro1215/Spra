<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * 外部SaaS/サービスへのリンクとAPI連携情報を管理するテーブル
     * 中央管理システムから外部で作成・運用されているサービスへの導線とデータ取得を集約する
     */
    public function up(): void
    {
        Schema::create('external_services', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('name')->comment('サービス名（例: 会計SaaS）');
            $table->string('category')->nullable()->comment('分類（例: 会計、CRM、勤怠 等）');
            $table->string('url')->comment('サービスへのリンク（管理画面等への遷移先）');
            $table->text('description')->nullable();
            $table->string('icon')->nullable()->comment('絵文字またはアイコン画像URL');
            $table->boolean('is_active')->default(true);

            // API連携設定（任意。設定されている場合のみデータ取得を行う）
            $table->string('api_base_url')->nullable();
            $table->string('api_endpoint')->nullable()->comment('base_urlに付与するパス');
            $table->string('auth_type')->default('none')->comment('none/bearer/api_key/basic');
            $table->string('auth_header')->nullable()->comment('api_key認証時に使用するヘッダー名');
            $table->text('credential')->nullable()->comment('トークン/APIキー/basic認証情報（暗号化して保存）');

            $table->timestamp('last_synced_at')->nullable();
            $table->string('last_sync_status')->nullable()->comment('success/failed');
            $table->text('last_sync_error')->nullable();
            $table->json('cached_data')->nullable()->comment('直近の取得結果のスナップショット');

            $table->unsignedInteger('sort_order')->default(0);
            $table->uuid('created_by')->nullable();
            $table->foreign('created_by')->references('id')->on('admins')->onDelete('set null');

            $table->timestamps();
            $table->softDeletes();

            $table->index(['is_active', 'sort_order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('external_services');
    }
};
