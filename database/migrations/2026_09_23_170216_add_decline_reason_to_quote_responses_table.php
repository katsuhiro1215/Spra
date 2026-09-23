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
        Schema::table('quote_responses', function (Blueprint $table) {
            $table->string('decline_reason')->nullable()->after('response_text')
                ->comment('response_type=declineの場合の辞退理由コード（price/timing/competitor/requirements_mismatch/other）');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('quote_responses', function (Blueprint $table) {
            $table->dropColumn('decline_reason');
        });
    }
};
