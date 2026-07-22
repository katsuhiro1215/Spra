<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * お客様の声テーブル (ULID)
     */
    public function up(): void
    {
        Schema::create('voices', function (Blueprint $table) {
            $table->ulid('id')->primary();

            $table->foreignUuid('user_id')->nullable()->constrained('users')->nullOnDelete()->comment('声を寄せたクライアント（登録アカウント）');
            $table->foreignUlid('service_id')->nullable()->constrained('services')->nullOnDelete()->comment('対象サービス');
            $table->foreignUlid('avatar_id')->nullable()->constrained('media')->nullOnDelete()->comment('表示用アバター画像');

            $table->string('author_name')->comment('表示名（未登録クライアントや匿名希望時にも使用）');
            $table->string('author_title')->nullable()->comment('役職');
            $table->string('company_name')->nullable()->comment('会社名');
            $table->unsignedTinyInteger('rating')->nullable()->comment('評価（1〜5）');
            $table->text('content')->comment('お客様の声本文');

            $table->boolean('is_featured')->default(false)->comment('トップページ等での優先表示');
            $table->boolean('is_published')->default(true)->comment('公開状態');
            $table->integer('sort_order')->default(0)->comment('表示順');

            $table->foreignUuid('created_by')->nullable()->constrained('admins')->nullOnDelete()->comment('作成者');
            $table->foreignUuid('updated_by')->nullable()->constrained('admins')->nullOnDelete()->comment('更新者');

            $table->timestamps();
            $table->softDeletes();

            $table->index(['is_published', 'sort_order']);
            $table->index(['service_id', 'is_published']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('voices');
    }
};
