<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * 実績・ポートフォリオ（過去の制作物）テーブル (ULID)
     */
    public function up(): void
    {
        Schema::create('portfolios', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('title');
            $table->text('description')->nullable();
            $table->ulid('media_id')->nullable()->comment('カバー画像');
            $table->foreign('media_id')->references('id')->on('media')->nullOnDelete();
            $table->string('url')->nullable()->comment('制作物の公開URL');
            $table->date('completed_at')->nullable()->comment('制作完了日');
            $table->boolean('is_displayed')->default(true)->comment('Webサイトへの表示フラグ');
            $table->integer('sort_order')->default(0);
            $table->foreignUuid('created_by')->nullable()->constrained('admins')->nullOnDelete()->comment('作成者');
            $table->foreignUuid('updated_by')->nullable()->constrained('admins')->nullOnDelete()->comment('更新者');
            $table->timestamps();
            $table->softDeletes();

            $table->index(['is_displayed', 'sort_order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('portfolios');
    }
};
