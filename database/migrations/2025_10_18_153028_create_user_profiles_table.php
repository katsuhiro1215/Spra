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
        Schema::create('user_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // 基本情報
            $table->string('display_name')->nullable(); // 表示名
            $table->string('first_name')->nullable(); // 名
            $table->string('last_name')->nullable(); // 姓
            $table->string('first_name_kana')->nullable(); // 名（カナ）
            $table->string('last_name_kana')->nullable(); // 姓（カナ）
            $table->date('birth_date')->nullable(); // 生年月日
            $table->enum('gender', ['male', 'female', 'other', 'prefer_not_to_say'])->nullable(); // 性別

            // 連絡先情報
            $table->string('phone_number')->nullable(); // 電話番号
            $table->string('mobile_number')->nullable(); // 携帯番号
            $table->string('emergency_contact_name')->nullable(); // 緊急連絡先名
            $table->string('emergency_contact_phone')->nullable(); // 緊急連絡先電話
            $table->string('emergency_contact_relationship')->nullable(); // 緊急連絡先続柄

            // プロフィール情報
            $table->text('bio')->nullable(); // 自己紹介
            $table->string('avatar')->nullable(); // アバター画像パス
            $table->string('website')->nullable(); // ウェブサイト
            $table->json('social_links')->nullable(); // SNSリンク

            // 職業・学歴情報
            $table->string('occupation')->nullable(); // 職業
            $table->string('job_title')->nullable(); // 役職
            $table->string('education')->nullable(); // 最終学歴
            $table->string('skills')->nullable(); // スキル（カンマ区切り）

            // 設定・プリファレンス
            $table->string('preferred_language', 10)->default('ja'); // 優先言語
            $table->string('timezone', 50)->default('Asia/Tokyo'); // タイムゾーン
            $table->json('notification_preferences')->nullable(); // 通知設定
            $table->json('privacy_settings')->nullable(); // プライバシー設定

            // 住所情報（基本住所、詳細は user_addresses テーブル）
            $table->string('postal_code', 8)->nullable(); // 郵便番号
            $table->string('prefecture')->nullable(); // 都道府県
            $table->string('city')->nullable(); // 市区町村
            $table->string('district')->nullable(); // 地域名
            $table->string('address_other')->nullable(); // その他住所

            // システム情報
            $table->boolean('is_public')->default(false); // プロフィール公開設定
            $table->boolean('is_verified')->default(false); // 認証済みフラグ
            $table->timestamp('verified_at')->nullable(); // 認証日時
            $table->text('notes')->nullable(); // 管理者メモ
            $table->json('metadata')->nullable(); // メタデータ

            $table->timestamps();

            // インデックス
            $table->index('display_name');
            $table->index(['last_name', 'first_name']);
            $table->index('is_public');
            $table->index('is_verified');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_profiles');
    }
};
