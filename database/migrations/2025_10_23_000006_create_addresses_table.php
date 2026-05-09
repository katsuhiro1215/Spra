<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * 住所テーブル (ULID) - ポリモーフィック対応
     * Admin(UUID), User(UUID), Company(ULID)対応
     */
    public function up(): void
    {
        Schema::create('addresses', function (Blueprint $table) {
            $table->ulid('id')->primary();
            // ポリモーフィックリレーション（Admin, User, Companyに対応）
            // morphs()の代わりに手動定義（UUID/ULID混在対応）
            $table->string('addressable_type')->comment('対象モデル');
            $table->string('addressable_id')->comment('対象ID (UUID/ULID)');
            $table->index(['addressable_type', 'addressable_id']);
            $table->enum('type', ['home', 'office', 'branch', 'billing', 'shipping', 'other'])->default('home')->comment('住所種別');
            $table->string('label', 50)->nullable()->comment('ラベル（任意）');
            $table->string('postal_code', 8)->comment('郵便番号');
            $table->string('prefecture', 20)->comment('都道府県');
            $table->string('city', 50)->comment('市区町村');
            $table->string('district', 50)->nullable()->comment('町域');
            $table->string('address_other', 100)->nullable()->comment('番地・建物名');
            $table->string('phone', 15)->nullable()->comment('電話番号');
            $table->string('contact_person', 50)->nullable()->comment('担当者名');
            $table->decimal('latitude', 10, 7)->nullable()->comment('緯度');
            $table->decimal('longitude', 10, 7)->nullable()->comment('経度');
            $table->boolean('is_default')->default(false)->comment('デフォルト住所');
            $table->boolean('is_active')->default(true)->comment('有効フラグ');
            $table->timestamp('verified_at')->nullable()->comment('確認日時');
            $table->text('notes')->nullable()->comment('備考');
            // 監査用カラム Admin, User両方なので監査用カラムは付与しない
            $table->timestamps();
            $table->softDeletes();
            // インデックス（morphs()が既にaddressable_type, addressable_idのインデックスを作成）
            $table->index('type');
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
        Schema::dropIfExists('addresses');
    }
};
