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
        Schema::create('system_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique(); // 設定キー（例: site_name, maintenance_mode）
            $table->text('value')->nullable(); // 設定値
            $table->string('type')->default('string'); // データ型（string, boolean, integer, json など）
            $table->string('group')->nullable(); // 設定グループ（例: general, mail, security, etc）
            $table->string('category')->nullable(); // カテゴリ（例: 表示、通知、認証など）
            $table->string('label')->nullable(); // 管理画面表示用ラベル
            $table->string('description')->nullable(); // 説明
            $table->boolean('is_active')->default(true); // 有効/無効
            $table->boolean('is_editable')->default(true); // 管理画面で編集可能か
            $table->json('options')->nullable(); // 選択肢や補助情報（例: select用）
            $table->integer('sort_order')->default(0); // 表示順
            $table->foreignId('created_by')->nullable()->constrained('admins')->onDelete('set null')->comment('作成者');
            $table->foreignId('updated_by')->nullable()->constrained('admins')->onDelete('set null')->comment('更新者');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('system_settings');
    }
};
