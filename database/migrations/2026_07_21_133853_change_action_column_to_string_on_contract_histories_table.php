<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * actionはENUM(created/sent/signed/archived/cancelled/note_added)に固定されていたが、
     * 実際にはContractMailJob/ContractSignedNotificationJob/SendInvoiceJob等が
     * signature_notification・invoice_sent・reminder_sent等ENUM外の値を書き込んでおり、
     * DB側でエラーになっていた（履歴が保存できていなかった）。
     * 今後もaction値が随時追加される前提のため、ENUMではなく可変長文字列にする。
     */
    public function up(): void
    {
        Schema::table('contract_histories', function (Blueprint $table) {
            $table->string('action', 50)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('contract_histories', function (Blueprint $table) {
            $table->enum('action', ['created', 'sent', 'signed', 'archived', 'cancelled', 'note_added'])->change();
        });
    }
};
