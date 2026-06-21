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
        Schema::table('contracts', function (Blueprint $table) {
            // 請求設定
            $table->integer('billing_day')->default(10)->after('type')->comment('請求日（毎月何日に請求するか：1-31）');
            $table->integer('payment_due_days')->default(15)->after('billing_day')->comment('支払期限日数（請求日から何日後が期限か）');
            $table->boolean('auto_invoice_generation')->default(true)->after('payment_due_days')->comment('自動請求書生成フラグ');
            $table->timestamp('next_billing_date')->nullable()->after('auto_invoice_generation')->comment('次回請求予定日');
            $table->timestamp('last_invoiced_at')->nullable()->after('next_billing_date')->comment('最終請求日時');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('contracts', function (Blueprint $table) {
            $table->dropColumn([
                'billing_day',
                'payment_due_days',
                'auto_invoice_generation',
                'next_billing_date',
                'last_invoiced_at',
            ]);
        });
    }
};
