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
        Schema::create('user_addresses', function (Blueprint $table) {
            $table->id();

            // 多態関係：User または Company の住所を管理
            $table->morphs('addressable'); // addressable_type, addressable_id

            // 住所タイプ
            $table->enum('type', ['home', 'office', 'billing', 'shipping', 'branch', 'other'])->default('home');
            $table->string('label')->nullable(); // カスタムラベル（例：本社、支店A等）

            // 日本の住所体系
            $table->string('postal_code', 8); // 郵便番号（ハイフンあり）
            $table->string('prefecture'); // 都道府県
            $table->string('city'); // 市区町村
            $table->string('district')->nullable(); // 地域名（町・字等）
            $table->string('address_other')->nullable(); // その他住所（番地・建物名・部屋番号等）

            // 連絡先情報
            $table->string('phone')->nullable(); // 電話番号
            $table->string('contact_person')->nullable(); // 連絡担当者名

            // API取得情報
            $table->decimal('latitude', 10, 7)->nullable(); // 緯度
            $table->decimal('longitude', 10, 7)->nullable(); // 経度
            $table->json('api_response')->nullable(); // 住所APIからの完全なレスポンス

            // ステータス
            $table->boolean('is_default')->default(false); // デフォルト住所
            $table->boolean('is_active')->default(true); // 有効/無効
            $table->timestamp('verified_at')->nullable(); // 住所確認日時

            // メタデータ
            $table->text('notes')->nullable(); // メモ
            $table->json('metadata')->nullable(); // その他の情報

            $table->timestamps();
            $table->softDeletes();

            // インデックス
            $table->index(['addressable_type', 'addressable_id', 'type']);
            $table->index('postal_code');
            $table->index(['prefecture', 'city']);
            $table->index(['is_default', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_addresses');
    }
};
