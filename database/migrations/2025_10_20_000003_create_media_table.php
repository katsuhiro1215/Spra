<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * メディアライブラリテーブル (ULID)
     */
    public function up(): void
    {
        Schema::create('media', function (Blueprint $table) {
            $table->ulid('id')->primary();
            // 基本情報
            $table->string('title')->nullable()->comment('タイトル');
            $table->text('description')->nullable()->comment('説明');
            $table->string('alt_text')->nullable()->comment('画像の代替テキスト（SEO用）');
            $table->enum('type', ['image', 'video', '3d_model'])->default('image')->comment('メディアタイプ');
            // ファイル情報
            $table->string('mime_type')->comment('MIMEタイプ');
            $table->unsignedBigInteger('original_file_size')->comment('オリジナルファイルサイズ（バイト）');
            $table->string('original_hash', 64)->comment('SHA-256ハッシュ（重複検出用）');
            // オリジナルファイル（S3パス）
            $table->string('original_path')->comment('media/{tenant_id}/originals/2026/02/a8f9c2d3.webp');
            $table->string('original_filename')->comment('オリジナルファイル名');
            $table->unsignedInteger('original_width')->nullable()->comment('オリジナル幅（ピクセル）');
            $table->unsignedInteger('original_height')->nullable()->comment('オリジナル高さ（ピクセル）');
            // 動画用
            $table->unsignedInteger('duration')->nullable()->comment('動画の長さ（秒）');
            // 圧縮設定（アップロード時の実際の値）
            $table->unsignedTinyInteger('quality')->default(85)->comment('圧縮品質（1-100）');
            $table->string('format', 10)->default('webp')->comment('保存フォーマット');
            // ステータス・使用状況
            $table->boolean('is_processing')->default(false)->comment('バリアント生成中');
            $table->boolean('is_processed')->default(false)->comment('バリアント生成完了');
            $table->unsignedInteger('usage_count')->default(0)->comment('使用回数');
            $table->timestamp('last_used_at')->nullable()->comment('最終使用日時');
            // 監査用カラム
            $table->foreignUuid('created_by')->nullable()->constrained('admins')->nullOnDelete()->comment('作成者');
            $table->foreignUuid('updated_by')->nullable()->constrained('admins')->nullOnDelete()->comment('更新者');
            $table->timestamps();
            $table->softDeletes()->comment('論理削除（実ファイルは別途削除ジョブで処理）');
            // インデックス
            $table->index('original_hash');
            $table->index('usage_count');
            $table->index('created_at');
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
