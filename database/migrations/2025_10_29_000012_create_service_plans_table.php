<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * サービスプランテーブル (ULID)
     */
    public function up(): void
    {
        Schema::create('service_plans', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('name');
            $table->string('slug')->unique();
            $table->ulid('service_id');
            $table->foreign('service_id')->references('id')->on('services')->onDelete('cascade');
            $table->text('description')->nullable();
            $table->text('details')->nullable();

            // 価格設定
            $table->decimal('base_price', 12, 2);
            $table->enum('billing_cycle', ['one_time', 'monthly', 'quarterly', 'yearly'])->default('one_time');
            $table->decimal('setup_fee', 12, 2)->default(0);

            // プラン設定
            $table->integer('max_revisions')->nullable();
            $table->integer('estimated_delivery_days')->nullable();

            // 表示設定
            $table->enum('status', ['active', 'inactive', 'suspended'])->default('active');
            $table->boolean('is_featured')->default(false);
            $table->integer('sort_order')->default(0);
            $table->string('color', 7)->default('#3B82F6');
            $table->string('badge_text')->nullable();
            $table->string('icon')->nullable();

            // 監査用カラム
            $table->foreignUuid('created_by')->nullable()->constrained('admins')->nullOnDelete()->comment('作成者');
            $table->foreignUuid('updated_by')->nullable()->constrained('admins')->nullOnDelete()->comment('更新者');
            $table->foreignUuid('deleted_by')->nullable()->constrained('admins')->nullOnDelete()->comment('削除者');
            $table->timestamps();
            $table->softDeletes();

            $table->index(['service_id', 'status']);
            $table->index(['is_featured', 'sort_order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('service_plans');
    }
};
