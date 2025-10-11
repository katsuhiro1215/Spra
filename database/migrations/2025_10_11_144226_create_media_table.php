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
        Schema::create('media', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // ファイル名
            $table->string('original_name'); // 元のファイル名
            $table->string('filename'); // 保存されたファイル名（ユニーク）
            $table->string('path'); // ファイルパス
            $table->string('url'); // アクセスURL
            $table->string('disk')->default('public'); // ストレージディスク
            $table->string('mime_type'); // MIMEタイプ
            $table->enum('type', ['image', 'video', 'audio', 'document', 'other']); // メディアタイプ
            $table->bigInteger('size'); // ファイルサイズ（バイト）
            $table->json('dimensions')->nullable(); // 画像・動画の幅・高さ
            $table->json('metadata')->nullable(); // その他のメタデータ
            $table->string('alt_text')->nullable(); // 代替テキスト（SEO・アクセシビリティ用）
            $table->text('description')->nullable(); // 説明文
            $table->string('folder')->nullable(); // フォルダ分類
            $table->json('tags')->nullable(); // タグ
            $table->boolean('is_public')->default(true); // 公開設定
            $table->unsignedBigInteger('uploaded_by')->nullable(); // アップロード者
            $table->timestamps();

            $table->foreign('uploaded_by')->references('id')->on('admins')->onDelete('set null');
            $table->index(['type', 'is_public']);
            $table->index(['folder', 'type']);
            $table->index('mime_type');
            $table->fullText(['name', 'original_name', 'alt_text', 'description']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('media');
    }
};
