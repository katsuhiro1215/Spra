<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * 契約テーブル (ULID)
     */
    public function up(): void
    {
        Schema::create('contracts', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('contract_number')->unique();

            // 契約グループ参照（関連契約をまとめる）
            $table->ulid('contract_group_id')->nullable();
            $table->foreign('contract_group_id')->references('id')->on('contract_groups')->onDelete('set null');

            // 親契約参照（継続契約・値上げ時の元契約）
            $table->ulid('parent_contract_id')->nullable();
            $table->foreign('parent_contract_id')->references('id')->on('contracts')->onDelete('set null');

            // Quote参照（見積からの変換）
            $table->ulid('quote_id')->nullable();
            $table->foreign('quote_id')->references('id')->on('quotes')->onDelete('set null');

            // Project参照（契約後にプロジェクトが作成される）
            $table->ulid('project_id')->nullable();
            $table->foreign('project_id')->references('id')->on('projects')->onDelete('set null');

            // クライアント情報
            $table->uuid('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('restrict');
            $table->ulid('company_id')->nullable();
            $table->foreign('company_id')->references('id')->on('companies')->onDelete('set null');

            // サービス情報（Quoteから引き継ぐ）
            $table->ulid('service_id');
            $table->foreign('service_id')->references('id')->on('services')->onDelete('restrict');
            $table->ulid('service_plan_id')->nullable();
            $table->foreign('service_plan_id')->references('id')->on('service_plans')->onDelete('restrict');

            // 契約内容
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('type', ['one_time', 'monthly', 'annual'])->default('one_time');
            $table->decimal('amount', 12, 2);          // 一括金額 or 月額/年額
            $table->decimal('tax_rate', 5, 2)->default(10);

            // 契約期間
            $table->date('start_date');
            $table->date('end_date')->nullable();

            // ステータス管理
            $table->enum('status', [
                'draft',              // 下書き
                'pending_signature',  // 署名待ち
                'active',             // 契約中
                'suspended',          // 一時停止
                'completed',          // 完了
                'cancelled',          // キャンセル
            ])->default('draft');
            $table->timestamp('signed_at')->nullable();
            $table->timestamp('terminated_at')->nullable();
            $table->text('termination_reason')->nullable();

            // 自動更新設定
            $table->boolean('auto_renewal')->default(false);
            $table->integer('renewal_notice_days')->default(30);

            // 契約書
            $table->longText('terms_and_conditions')->nullable();
            $table->text('notes')->nullable();

            $table->uuid('created_by')->nullable();
            $table->foreign('created_by')->references('id')->on('admins')->onDelete('set null');
            $table->timestamps();
            $table->softDeletes();

            $table->index(['user_id', 'status']);
            $table->index(['contract_group_id', 'status']);
            $table->index(['parent_contract_id', 'status']);
            $table->index(['project_id', 'status']);
            $table->index(['quote_id', 'status']);
            $table->index(['status', 'end_date']);
            $table->index(['service_id', 'service_plan_id']);
            $table->index('type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contracts');
    }
};
