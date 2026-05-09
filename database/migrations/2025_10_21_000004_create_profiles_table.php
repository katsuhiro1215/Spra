<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * プロフィールテーブル (ULID)
     */
    public function up(): void
    {
        Schema::create('profiles', function (Blueprint $table) {
            $table->ulid('id')->primary();
            // ポリモーフィックリレーション（AdminまたはUser）
            // morphs()の代わりに手動定義（UUID対応）
            $table->string('profilable_type')->comment('対象モデル');
            $table->string('profilable_id')->comment('対象ID (UUID)');
            $table->index(['profilable_type', 'profilable_id']);
            $table->foreignUuid('media_id')->nullable()->constrained('media')->nullOnDelete()->comment('メディアID(UUID)');
            // 基本情報
            $table->string('last_name', 50)->nullable()->comment('姓');
            $table->string('first_name', 50)->nullable()->comment('名');
            $table->string('last_name_kana', 50)->nullable()->comment('姓（カナ）');
            $table->string('first_name_kana', 50)->nullable()->comment('名（カナ）');
            $table->string('display_name', 50)->nullable()->comment('表示名');
            $table->date('birth_date')->nullable()->comment('生年月日');
            $table->enum('gender', ['male', 'female', 'other', 'prefer_not_to_say'])->nullable()->comment('性別');
            // 連絡先
            $table->string('phone', 20)->nullable()->comment('電話番号');
            $table->string('mobile', 20)->nullable()->comment('携帯電話番号');
            $table->string('emergency_contact_name', 50)->nullable()->comment('緊急連絡先氏名');
            $table->string('emergency_contact_phone', 20)->nullable()->comment('緊急連絡先電話番号');
            // プロフィール
            $table->text('bio')->nullable()->comment('自己紹介');
            // 監査用カラム Admin, User両方なので監査用カラムは付与しない
            $table->timestamps();
            $table->softDeletes();
            // インデックス（morphs()が既にprofilable_type, profilable_idのインデックスを作成）
            $table->index(['last_name', 'first_name']);
            $table->index('display_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('profiles');
    }
};
