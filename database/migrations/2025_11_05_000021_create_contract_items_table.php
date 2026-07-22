<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * 契約明細テーブル (ULID)
     * QuoteItemからスナップショットとしてコピーされる
     */
    public function up(): void
    {
        Schema::create('contract_items', function (Blueprint $table) {
            $table->ulid('id')->primary();

            // ContractVersion参照（各明細は特定バージョンに属する）
            $table->ulid('contract_version_id');
            $table->foreign('contract_version_id')->references('id')->on('contract_versions')->cascadeOnDelete();

            // サービス参照（スナップショット）
            // ServicePlan選択時のプラン割引行など、特定のServiceItemに紐付かない明細行も保存できるようnullable
            $table->ulid('service_id')->nullable();
            $table->foreign('service_id')->references('id')->on('services')->onDelete('restrict');
            $table->ulid('service_item_id')->nullable();
            $table->foreign('service_item_id')->references('id')->on('service_items')->onDelete('restrict');

            // 明細情報（QuoteItemからコピー）
            $table->string('name')->comment('項目名');
            $table->text('description')->nullable()->comment('説明');
            $table->enum('item_type', ['plan_base', 'included', 'optional', 'addon', 'custom'])->default('custom');

            // 契約タイプ
            $table->enum('billing_type', ['one_time', 'monthly', 'quarterly', 'yearly'])->default('one_time');

            // 価格情報
            $table->decimal('quantity', 10, 2)->default(1)->comment('数量');
            $table->decimal('unit_price', 12, 2)->comment('単価');
            $table->decimal('amount', 12, 2)->comment('金額');

            // 作業情報
            $table->integer('estimated_days')->nullable()->comment('見積工数（日数）');

            // 表示順
            $table->integer('sort_order')->default(0);

            $table->timestamps();

            $table->index(['contract_version_id', 'sort_order']);
            $table->index(['service_id', 'billing_type']);
            $table->index('service_item_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contract_items');
    }
};
