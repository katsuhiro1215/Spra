<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Service ⇔ Media 中間テーブル (ULID)
     * サービスに複数のギャラリー画像を紐付ける
     */
    public function up(): void
    {
        Schema::create('service_media', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->ulid('service_id');
            $table->foreign('service_id')->references('id')->on('services')->onDelete('cascade');
            $table->ulid('media_id');
            $table->foreign('media_id')->references('id')->on('media')->onDelete('cascade');
            $table->integer('sort_order')->default(0);
            $table->boolean('is_primary')->default(false)->comment('一覧・カード表示に使う代表画像');
            $table->timestamps();

            $table->unique(['service_id', 'media_id'], 'service_media_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('service_media');
    }
};
