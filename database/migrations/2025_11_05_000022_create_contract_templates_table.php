<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * 契約書テンプレートテーブル (ULID)
     */
    public function up(): void
    {
        Schema::create('contract_templates', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('name')->comment('テンプレート名');
            $table->text('description')->nullable()->comment('説明');

            // テンプレート種別
            $table->enum('template_type', ['standard', 'monthly', 'annual', 'custom'])->default('standard');

            // 契約書テキスト
            $table->longText('terms_and_conditions')->nullable()->comment('契約条項テンプレート');
            $table->text('special_provisions')->nullable()->comment('特別条項テンプレート');

            // ステータス
            $table->enum('status', ['active', 'inactive'])->default('active');

            // 表示順
            $table->integer('sort_order')->default(0);

            // 管理情報
            $table->uuid('created_by')->nullable();
            $table->foreign('created_by')->references('id')->on('admins')->onDelete('set null');
            $table->uuid('updated_by')->nullable();
            $table->foreign('updated_by')->references('id')->on('admins')->onDelete('set null');

            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'sort_order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contract_templates');
    }
};
