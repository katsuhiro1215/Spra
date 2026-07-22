<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * 契約テーブル (ULID)
     * プロジェクト管理レベル - 金額やテキストはContractVersionで管理
     */
    public function up(): void
    {
        Schema::create('contracts', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('contract_number')->unique()->comment('契約番号 C2026-001');

            // 契約グループ参照（関連契約をまとめる）
            $table->ulid('contract_group_id')->nullable();
            $table->foreign('contract_group_id')->references('id')->on('contract_groups')->onDelete('set null');

            // 親契約参照（継続契約・値上げ時の元契約）
            $table->ulid('parent_contract_id')->nullable();
            $table->foreign('parent_contract_id')->references('id')->on('contracts')->onDelete('set null');

            // Quote参照（見積からの変換）
            $table->ulid('quote_id')->nullable();
            $table->foreign('quote_id')->references('id')->on('quotes')->onDelete('set null');

            // ServicePlan参照（契約特典の算出に使用）
            $table->ulid('service_plan_id')->nullable()->comment('この契約の元になったServicePlan（契約特典の算出に使用）');
            $table->foreign('service_plan_id')->references('id')->on('service_plans')->onDelete('set null');

            // クライアント情報
            $table->uuid('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('restrict');
            $table->ulid('company_id')->nullable();
            $table->foreign('company_id')->references('id')->on('companies')->onDelete('set null');

            // 契約内容
            $table->string('title')->comment('契約タイトル');
            $table->text('description')->nullable()->comment('契約概要');

            // 現在採用されているVersion
            $table->ulid('current_version_id')->nullable()->comment('現在有効なContractVersion');

            // 契約タイプ
            $table->enum('type', ['one_time', 'monthly', 'annual'])->default('one_time');

            // 契約期間
            $table->date('start_date')->comment('契約開始日');
            $table->date('end_date')->nullable()->comment('契約終了日');

            // 請求設定
            $table->integer('billing_day')->default(10)->comment('請求日（毎月何日に請求するか：1-31）');
            $table->integer('payment_due_days')->default(15)->comment('支払期限日数（請求日から何日後が期限か）');
            $table->boolean('auto_invoice_generation')->default(true)->comment('自動請求書生成フラグ');
            $table->timestamp('next_billing_date')->nullable()->comment('次回請求予定日');
            $table->timestamp('last_invoiced_at')->nullable()->comment('最終請求日時');

            // ステータス管理（プロジェクト管理レベル）
            $table->enum('status', [
                'draft',              // 下書き
                'pending_signature',  // 署名待ち
                'active',             // 契約中
                'suspended',          // 一時停止
                'completed',          // 完了
                'cancelled',          // キャンセル
            ])->default('draft');

            // 署名管理
            $table->enum('signature_status', ['pending', 'user_signed', 'fully_signed', 'rejected'])->default('pending')->comment('署名ステータス');
            $table->enum('signature_required_from', ['user', 'admin', 'both'])->default('user')->comment('誰が署名する必要があるか');
            $table->timestamp('user_signed_at')->nullable()->comment('ユーザー署名日時');
            $table->timestamp('admin_signed_at')->nullable()->comment('管理者署名日時');
            $table->timestamp('signed_at')->nullable()->comment('完全署名完了日時');
            $table->timestamp('terminated_at')->nullable()->comment('解約日時');
            $table->text('termination_reason')->nullable()->comment('解約理由');

            // 自動更新設定
            $table->boolean('auto_renewal')->default(false)->comment('自動更新フラグ');
            $table->integer('renewal_notice_days')->default(30)->comment('更新通知日数');

            // 管理情報
            $table->uuid('created_by');
            $table->foreign('created_by')->references('id')->on('admins')->restrictOnDelete();
            $table->uuid('updated_by')->nullable();
            $table->foreign('updated_by')->references('id')->on('admins')->onDelete('set null');

            $table->timestamps();
            $table->softDeletes();

            $table->index(['user_id', 'status']);
            $table->index(['company_id', 'status']);
            $table->index(['contract_group_id', 'status']);
            $table->index(['parent_contract_id', 'status']);
            $table->index(['quote_id', 'status']);
            $table->index(['status', 'end_date']);
            $table->index(['status', 'created_at']);
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
