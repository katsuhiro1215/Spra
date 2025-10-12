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
        Schema::create('service_types', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('service_category_id'); // サービスカテゴリID
            $table->string('name'); // サービスタイプ名 (コーポレートサイト、ECサイト、SaaS等)
            $table->string('product_name')->nullable(); // 商品愛称 (Spra Class, Spra Commerce等)
            $table->string('version', 20)->nullable(); // バージョン (v1.0, v2.0, beta等)
            $table->unsignedBigInteger('parent_service_id')->nullable(); // 親サービスID (バージョン違いの関連付け)
            $table->string('slug')->unique(); // URL用スラッグ
            $table->text('description')->nullable(); // 説明
            $table->longText('detailed_description')->nullable(); // 詳細説明
            $table->enum('pricing_model', ['fixed', 'subscription', 'custom', 'hybrid'])->default('fixed'); // 料金体系
            $table->json('features')->nullable(); // 特徴・機能一覧
            $table->json('target_audience')->nullable(); // 対象顧客 ["企業", "個人事業主", "店舗"]
            $table->json('deliverables')->nullable(); // 成果物 ["Webサイト", "管理画面", "マニュアル"]
            $table->json('technologies')->nullable(); // 使用技術 ["Laravel", "React", "MySQL"]
            $table->string('icon')->nullable(); // アイコン
            $table->string('color', 7)->default('#3B82F6'); // テーマカラー (Hex)
            $table->integer('estimated_delivery_days')->nullable(); // 標準納期（日数）
            $table->decimal('base_price', 12, 2)->nullable(); // 基本価格
            $table->string('price_unit')->nullable(); // 価格単位 ("式", "ページ", "ライセンス")
            $table->integer('sort_order')->default(0); // 表示順序
            $table->boolean('is_active')->default(true); // アクティブ状態
            $table->boolean('is_featured')->default(false); // おすすめサービス
            $table->boolean('requires_consultation')->default(false); // 要相談フラグ
            $table->text('consultation_note')->nullable(); // 相談時の注意事項

            // 作成者・更新者情報
            $table->unsignedBigInteger('created_by'); // 作成者（管理者ID）
            $table->unsignedBigInteger('updated_by')->nullable(); // 更新者（管理者ID）
            $table->timestamp('published_at')->nullable(); // 公開日時
            $table->timestamps();

            // 外部キー制約
            $table->foreign('service_category_id')->references('id')->on('service_categories')->onDelete('cascade');
            $table->foreign('parent_service_id')->references('id')->on('service_types')->onDelete('cascade');
            $table->foreign('created_by')->references('id')->on('admins')->onDelete('restrict');
            $table->foreign('updated_by')->references('id')->on('admins')->onDelete('set null');

            // インデックス
            $table->index(['service_category_id', 'is_active']);
            $table->index(['parent_service_id', 'version']);
            $table->index(['product_name', 'version']);
            $table->index(['sort_order', 'is_active']);
            $table->index(['pricing_model', 'is_active']);
            $table->index('is_featured');
            $table->index('requires_consultation');
            $table->index('created_by');
            $table->index('published_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('service_types');
    }
};
