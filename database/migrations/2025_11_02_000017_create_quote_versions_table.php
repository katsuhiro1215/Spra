<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * 見積書バージョン管理テーブル (ULID)
     * 
     * 見積もりの変更履歴を管理し、監査証跡を保持
     */
    public function up(): void
    {
        Schema::create('quote_versions', function (Blueprint $table) {
            $table->ulid('id')->primary();

            // 親Quote
            $table->ulid('quote_id');
            $table->foreign('quote_id')->references('id')->on('quotes')->cascadeOnDelete();

            // バージョン番号
            $table->integer('version')->comment('見積書のバージョン番号 v1, v2, ...');

            // 見積内容
            $table->string('title');
            $table->text('requirements')->nullable();
            $table->json('custom_specifications')->nullable();

            // 金額
            $table->decimal('base_amount', 12, 2);
            $table->decimal('discount_amount', 12, 2)->default(0);
            $table->ulid('campaign_id')->nullable();
            $table->foreign('campaign_id')->references('id')->on('campaigns')->onDelete('set null');
            $table->ulid('service_plan_id')->nullable()->comment('「プランから追加」で選択されたプラン');
            $table->foreign('service_plan_id')->references('id')->on('service_plans')->onDelete('set null');
            $table->decimal('tax_rate', 5, 2)->default(10);
            $table->decimal('tax_amount', 12, 2);
            $table->decimal('total_amount', 12, 2);

            // ステータス（このバージョンの状態）
            $table->enum('status', [
                'draft',
                'sent',
                'viewed',
                'revision_requested',
                'approved',
                'rejected',
                'expired'
            ])->default('draft');

            // 顧客フィードバック
            $table->text('client_feedback')->nullable();
            $table->text('revision_reason')->nullable();

            // タイムスタンプ
            $table->timestamp('sent_at')->nullable();
            $table->timestamp('responded_at')->nullable();
            $table->timestamp('expires_at')->nullable();

            // 現在採用版フラグ
            $table->boolean('is_current')->default(false)->comment('このバージョンが現在採用版か');

            // 管理情報
            $table->uuid('created_by');
            $table->foreign('created_by')->references('id')->on('admins')->restrictOnDelete();

            $table->timestamps();

            // インデックス
            $table->index(['quote_id', 'version']);
            $table->index(['quote_id', 'is_current']);
            $table->index(['status', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quote_versions');
    }
};
