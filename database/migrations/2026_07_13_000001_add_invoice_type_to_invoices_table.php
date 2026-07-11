<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * 請求書がその契約の何割を占めるか(着手金/中間金/完了金/一括/月額)を表す区分を追加
     */
    public function up(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            $table->enum('invoice_type', ['deposit', 'interim', 'final', 'full', 'monthly', 'other'])
                ->default('full')
                ->after('contract_id')
                ->comment('着手金/中間金/完了金/一括/月額/その他');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            $table->dropColumn('invoice_type');
        });
    }
};
