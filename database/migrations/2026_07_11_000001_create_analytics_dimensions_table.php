<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * ディメンションマスタ (ULID)
     * ページ・流入元・キーワード等の表記ゆれを防ぐための正規化テーブル
     */
    public function up(): void
    {
        Schema::create('analytics_dimensions', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('type', 50)->comment('ディメンション種別(page/referrer/keyword/device/browser等)');
            $table->string('code', 255)->comment('正規化キー(type内で一意)');
            $table->string('label', 255)->comment('表示名');
            $table->ulid('parent_id')->nullable()->comment('親ディメンション(階層化用)');
            $table->foreign('parent_id')->references('id')->on('analytics_dimensions')->nullOnDelete();
            $table->json('metadata')->nullable()->comment('分類ルール等の付加情報');
            $table->timestamps();

            $table->unique(['type', 'code']);
            $table->index('type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('analytics_dimensions');
    }
};
