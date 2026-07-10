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
        Schema::create('invoice_templates', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('name')->comment('テンプレート名');
            $table->text('notice_text')->comment('案内文（「今回のご請求額は...」など）');
            $table->text('terms')->nullable()->comment('支払い条件');
            $table->text('additional_notes')->nullable()->comment('追加注記');
            $table->boolean('is_active')->default(true)->comment('有効/無効');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoice_templates');
    }
};
