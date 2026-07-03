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
        Schema::table('invoices', function (Blueprint $table) {
            $table->ulid('invoice_template_id')->nullable()->after('contract_id')->comment('請求書テンプレート');
            $table->foreign('invoice_template_id')->references('id')->on('invoice_templates')->onDelete('set null');
            $table->unsignedTinyInteger('deposit_rate')->default(50)->after('tax_amount')->comment('着手金比率（パーセンテージ）');
            $table->decimal('deposit_amount', 12, 2)->after('deposit_rate')->comment('着手金額');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            $table->dropForeign(['invoice_template_id']);
            $table->dropColumn(['invoice_template_id', 'deposit_rate', 'deposit_amount']);
        });
    }
};
