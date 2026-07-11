<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * 外部サイト(WordPress等)からのお問い合わせAPI連携用クライアント管理テーブル
     */
    public function up(): void
    {
        Schema::create('contact_api_clients', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('name')->comment('連携先名（例: 公式サイト(WordPress)）');
            $table->string('api_key_hash')->unique()->comment('APIキーのハッシュ値（平文は保存しない）');
            $table->string('key_preview', 8)->comment('画面表示用のキー末尾数桁');
            $table->boolean('is_active')->default(true);
            $table->uuid('created_by')->nullable();
            $table->foreign('created_by')->references('id')->on('admins')->onDelete('set null');
            $table->timestamp('last_used_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contact_api_clients');
    }
};
