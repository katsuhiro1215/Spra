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
        Schema::table('blogs', function (Blueprint $table) {
            // 既存の画像関連カラムを削除
            $table->dropColumn(['featured_image', 'gallery']);

            // Mediaテーブルとの関連を追加
            $table->unsignedBigInteger('featured_media_id')->nullable()->after('content');
            $table->foreign('featured_media_id')->references('id')->on('media')->onDelete('set null');
            $table->index('featured_media_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('blogs', function (Blueprint $table) {
            // 外部キー制約とカラムを削除
            $table->dropForeign(['featured_media_id']);
            $table->dropColumn('featured_media_id');

            // 元のカラムを復元
            $table->string('featured_image')->nullable()->after('content');
            $table->json('gallery')->nullable()->after('featured_image');
        });
    }
};
