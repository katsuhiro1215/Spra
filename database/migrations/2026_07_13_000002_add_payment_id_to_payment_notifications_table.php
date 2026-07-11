<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Admin が入金通知を確認した際に作成される実際のPaymentレコードとの紐付け
     */
    public function up(): void
    {
        Schema::table('payment_notifications', function (Blueprint $table) {
            $table->ulid('payment_id')->nullable()->after('invoice_id');
            $table->foreign('payment_id')->references('id')->on('payments')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payment_notifications', function (Blueprint $table) {
            $table->dropForeign(['payment_id']);
            $table->dropColumn('payment_id');
        });
    }
};
