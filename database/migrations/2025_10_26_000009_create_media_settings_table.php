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
        Schema::create('media_settings', function (Blueprint $table) {
            $table->ulid('id')->primary();

            // アップロード制限
            $table->unsignedInteger('max_file_size_kb')->default(5120)->comment('最大ファイルサイズ（KB）デフォルト5MB');
            $table->unsignedInteger('max_total_storage_mb')->default(1024)->comment('総容量制限（MB）デフォルト1GB');

            // 自動圧縮設定
            $table->boolean('auto_compress')->default(true)->comment('自動圧縮有効');
            $table->unsignedTinyInteger('compression_quality')->default(85)->comment('圧縮品質（1-100）');
            $table->string('output_format', 10)->default('webp')->comment('出力フォーマット');

            // 自動生成バリアントサイズ（WordPress方式）
            $table->unsignedInteger('large_width')->default(1024)->comment('Large幅');
            $table->unsignedInteger('large_height')->default(1024)->comment('Large高さ');
            $table->unsignedInteger('medium_width')->default(768)->comment('Medium幅');
            $table->unsignedInteger('medium_height')->default(768)->comment('Medium高さ');
            $table->unsignedInteger('small_width')->default(300)->comment('Small幅');
            $table->unsignedInteger('small_height')->default(300)->comment('Small高さ');

            // バリアント自動生成フラグ
            $table->boolean('generate_large')->default(true)->comment('Largeを自動生成');
            $table->boolean('generate_medium')->default(true)->comment('Mediumを自動生成');
            $table->boolean('generate_small')->default(true)->comment('Smallを自動生成');

            // 動画設定
            $table->boolean('allow_video_upload')->default(false)->comment('動画アップロード許可');
            $table->unsignedInteger('max_video_size_mb')->default(50)->comment('最大動画サイズ（MB）');
            $table->unsignedInteger('max_video_duration_seconds')->default(60)->comment('最大動画長（秒）');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('media_settings');
    }
};
