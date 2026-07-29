<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * プロジェクト添付ファイルテーブル (ULID)
     */
    public function up(): void
    {
        Schema::create('project_files', function (Blueprint $table) {
            $table->ulid('id')->primary();

            $table->ulid('project_id');
            $table->foreign('project_id')->references('id')->on('projects')->cascadeOnDelete();

            $table->uuid('uploaded_by')->nullable();
            $table->foreign('uploaded_by')->references('id')->on('admins')->nullOnDelete();

            $table->string('disk')->default('private')->comment('保存先ディスク（filesystems.php）');
            $table->string('path')->comment('ディスク内の保存パス');
            $table->string('original_filename')->comment('アップロード時のファイル名');
            $table->string('mime_type')->nullable();
            $table->unsignedBigInteger('file_size')->default(0)->comment('バイト単位');
            $table->text('description')->nullable();
            $table->boolean('is_client_visible')->default(false)->comment('クライアントに公開するか');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_files');
    }
};
