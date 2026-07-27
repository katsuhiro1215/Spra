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
        Schema::create('media_variants', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('media_id')->constrained('media')->cascadeOnDelete()->comment('メディアID');

            // バリアント種類（WordPress方式）
            $table->enum('size', ['large', 'medium', 'small', 'custom'])->comment('large=1024px, medium=768px, small=300px');
            $table->string('custom_name')->nullable()->comment('customの場合の識別名');

            // ファイル情報
            $table->string('path')->comment('media/{tenant_id}/variants/2026/02/a8f9c2d3_large.webp');
            $table->unsignedBigInteger('file_size')->comment('ファイルサイズ（バイト）');
            $table->unsignedInteger('width')->comment('幅（ピクセル）');
            $table->unsignedInteger('height')->comment('高さ（ピクセル）');

            // トリミング設定
            $table->unsignedInteger('crop_x')->nullable()->comment('トリミング開始X座標');
            $table->unsignedInteger('crop_y')->nullable()->comment('トリミング開始Y座標');
            $table->unsignedInteger('crop_width')->nullable()->comment('トリミング幅');
            $table->unsignedInteger('crop_height')->nullable()->comment('トリミング高さ');
            $table->enum('crop_position', ['center', 'top', 'bottom', 'left', 'right'])->default('center')->comment('トリミング位置');

            // 処理設定
            $table->unsignedTinyInteger('quality')->default(85)->comment('圧縮品質（1-100）');
            $table->boolean('maintain_aspect_ratio')->default(true)->comment('アスペクト比維持');

            $table->timestamps();

            // インデックス
            $table->index('media_id');
            $table->unique(['media_id', 'size', 'custom_name'], 'media_variant_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('media_variants');
    }
};
