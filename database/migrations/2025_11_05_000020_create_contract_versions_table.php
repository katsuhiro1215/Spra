<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * 契約書バージョン管理テーブル (ULID)
     * 
     * 契約書の変更履歴を管理し、監査証跡を保持
     * テキスト修正や金額変更の履歴を全て記録
     */
    public function up(): void
    {
        Schema::create('contract_versions', function (Blueprint $table) {
            $table->ulid('id')->primary();

            // 親Contract
            $table->ulid('contract_id');
            $table->foreign('contract_id')->references('id')->on('contracts')->cascadeOnDelete();

            // バージョン番号
            $table->integer('version')->comment('契約書のバージョン番号 v1, v2, ...');

            // 契約書テキスト（甲乙丙などの契約条項）
            $table->longText('terms_and_conditions')->nullable()->comment('契約条項全文');
            $table->text('special_provisions')->nullable()->comment('特別条項');
            $table->text('notes')->nullable()->comment('備考・メモ');
            $table->text('custom_specifications')->nullable()->comment('カスタム仕様・メモ');

            // 金額情報（QuoteVersionから引き継ぐ）
            $table->decimal('base_amount', 12, 2)->comment('小計');
            $table->decimal('discount_amount', 12, 2)->default(0)->comment('割引額');
            $table->decimal('tax_rate', 5, 2)->default(10)->comment('消費税率');
            $table->decimal('tax_amount', 12, 2)->comment('消費税額');
            $table->decimal('total_amount', 12, 2)->comment('合計金額');

            // ステータス（このバージョンの状態）
            $table->enum('status', [
                'draft',              // 下書き
                'pending_review',     // レビュー待ち
                'approved',           // 承認済み
                'sent',               // 送信済み
                'signed',             // 署名済み
                'active',             // 有効
                'superseded',         // 改訂版あり
                'cancelled'           // キャンセル
            ])->default('draft');

            // 変更理由
            $table->text('revision_reason')->nullable()->comment('改訂理由');

            // タイムスタンプ
            $table->timestamp('approved_at')->nullable()->comment('承認日時');
            $table->timestamp('sent_at')->nullable()->comment('送信日時');
            $table->timestamp('signed_at')->nullable()->comment('署名完了日時');

            // 現在採用版フラグ
            $table->boolean('is_current')->default(false)->comment('このバージョンが現在採用版か');

            // 管理情報
            $table->uuid('created_by');
            $table->foreign('created_by')->references('id')->on('admins')->restrictOnDelete();

            $table->timestamps();

            // インデックス
            $table->index(['contract_id', 'version']);
            $table->index(['contract_id', 'is_current']);
            $table->index(['status', 'created_at']);
            $table->unique(['contract_id', 'version'], 'unique_contract_version');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contract_versions');
    }
};
