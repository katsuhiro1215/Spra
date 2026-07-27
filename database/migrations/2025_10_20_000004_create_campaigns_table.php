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
        Schema::create('campaigns', function (Blueprint $table) {
            $table->ulid('id')->primary();

            $table->string('name');
            $table->string('code', 50)->unique()->comment('見積もりに紐付ける識別コード');
            $table->text('description')->nullable();
            $table->ulid('media_id')->nullable()->comment('サムネイル画像のメディアID');
            $table->foreign('media_id')->references('id')->on('media')->nullOnDelete();

            $table->enum('discount_type', ['percentage', 'fixed'])->comment('percentage: 定率(%) / fixed: 固定額(円)');
            $table->decimal('discount_value', 12, 2);
            $table->unsignedInteger('usage_limit')->nullable()->comment('適用可能な上限件数（nullは無制限）');
            $table->unsignedInteger('used_count')->default(0)->comment('成約により消費された件数');

            $table->dateTime('starts_at');
            $table->dateTime('ends_at');
            $table->boolean('is_active')->default(true)->comment('期間内でも手動で停止できるフラグ');

            $table->uuid('created_by')->nullable();
            $table->foreign('created_by')->references('id')->on('admins')->onDelete('set null');
            $table->uuid('updated_by')->nullable();
            $table->foreign('updated_by')->references('id')->on('admins')->onDelete('set null');

            $table->timestamps();
            $table->softDeletes();

            $table->index(['starts_at', 'ends_at']);
            $table->index(['is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('campaigns');
    }
};
