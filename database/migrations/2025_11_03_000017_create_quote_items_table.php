<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * 見積明細テーブル (ULID)
     */
    public function up(): void
    {
        Schema::create('quote_items', function (Blueprint $table) {
            $table->ulid('id')->primary();

            // QuoteVersion参照（各明細は特定バージョンに属する）
            $table->ulid('quote_version_id');
            $table->foreign('quote_version_id')->references('id')->on('quote_versions')->cascadeOnDelete();

            // サービス参照
            // ServicePlan選択時のプラン割引行など、特定のServiceItemに紐付かない明細行も保存できるようnullable
            $table->ulid('service_id')->nullable();
            $table->foreign('service_id')->references('id')->on('services')->onDelete('restrict');
            $table->ulid('service_item_id')->nullable();
            $table->foreign('service_item_id')->references('id')->on('service_items')->onDelete('restrict');

            // 明細情報
            $table->string('name');                          // 項目名
            $table->text('description')->nullable();         // 説明
            $table->enum('item_type', ['plan_base', 'included', 'optional', 'addon', 'custom'])->default('custom');

            // 契約タイプ
            $table->enum('billing_type', ['one_time', 'monthly', 'quarterly', 'yearly'])->default('one_time');

            // 価格情報
            $table->decimal('quantity', 10, 2)->default(1);
            $table->decimal('unit_price', 12, 2);
            $table->decimal('amount', 12, 2);

            // 作業情報
            $table->integer('estimated_days')->nullable();

            // 表示順
            $table->integer('sort_order')->default(0);

            $table->timestamps();

            $table->index(['quote_version_id', 'sort_order']);
            $table->index(['service_id', 'billing_type']);
            $table->index('service_item_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quote_items');
    }
};
