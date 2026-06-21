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
            $table->string('pdf_path')->nullable()->after('notes')->comment('PDFファイルパス');
            $table->integer('resend_count')->default(0)->after('pdf_path')->comment('再送信回数');
            $table->timestamp('last_resent_at')->nullable()->after('resend_count')->comment('最終再送信日時');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            $table->dropColumn([
                'pdf_path',
                'resend_count',
                'last_resent_at',
            ]);
        });
    }
};
