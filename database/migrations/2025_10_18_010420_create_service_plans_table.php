<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('service_plans', function (Blueprint $table) {
            $table->id();

            // 基本情報
            $table->string('name'); // プラン名（例: ベーシック、スタンダード、プレミアム）
            $table->string('slug')->unique(); // URL用スラッグ
            $table->unsignedBigInteger('service_type_id'); // 紐づくサービスタイプ
            $table->text('description'); // プラン説明
            $table->longText('detailed_description')->nullable(); // 詳細説明

            // 価格設定
            $table->decimal('base_price', 12, 2); // 基本価格
            $table->string('price_unit')->nullable(); // 価格単位（件、時間、月など）
            $table->enum('billing_cycle', ['one_time', 'monthly', 'quarterly', 'yearly'])->default('one_time'); // 請求サイクル
            $table->decimal('setup_fee', 12, 2)->default(0); // 初期費用

            // プラン特徴
            $table->json('features')->nullable(); // プラン特有の機能・特徴
            $table->json('included_items')->nullable(); // 含まれる項目
            $table->json('limitations')->nullable(); // 制限事項
            $table->integer('max_revisions')->nullable(); // 最大修正回数
            $table->integer('estimated_delivery_days')->nullable(); // 標準納期

            // ビジネス設定
            $table->boolean('is_popular')->default(false); // 人気プランフラグ
            $table->boolean('is_recommended')->default(false); // 推奨プランフラグ
            $table->integer('sort_order')->default(0); // 表示順序
            $table->boolean('is_active')->default(true); // アクティブ状態

            // 表示設定
            $table->string('color', 7)->nullable(); // プラン色（Hex）
            $table->string('badge_text')->nullable(); // バッジテキスト（例: "最人気"）
            $table->string('icon')->nullable(); // アイコン

            // 管理情報
            $table->unsignedBigInteger('created_by'); // 作成者
            $table->unsignedBigInteger('updated_by')->nullable(); // 更新者
            $table->timestamps();

            // 外部キー制約
            $table->foreign('service_type_id')->references('id')->on('service_types')->onDelete('cascade');
            $table->foreign('created_by')->references('id')->on('admins')->onDelete('restrict');
            $table->foreign('updated_by')->references('id')->on('admins')->onDelete('set null');

            // インデックス
            $table->index(['service_type_id', 'is_active']);
            $table->index(['is_popular', 'sort_order']);
            $table->index(['slug']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('service_plans');
    }
};
