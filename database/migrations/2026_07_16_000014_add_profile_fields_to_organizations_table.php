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
        Schema::table('organizations', function (Blueprint $table) {
            $table->string('name_en')->nullable()->after('site_name')->comment('英語表記名');
            $table->string('representative_name')->nullable()->after('legal_name')->comment('代表者名');
            $table->text('business_description')->nullable()->after('representative_name')->comment('事業内容（改行区切り）');
            $table->unsignedInteger('employee_count')->nullable()->after('business_description')->comment('従業員数');
            $table->string('capital')->nullable()->after('employee_count')->comment('資本金');
            $table->date('established_date')->nullable()->after('capital')->comment('設立日');
            $table->string('business_hours')->nullable()->after('established_date')->comment('営業時間');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('organizations', function (Blueprint $table) {
            $table->dropColumn([
                'name_en',
                'representative_name',
                'business_description',
                'employee_count',
                'capital',
                'established_date',
                'business_hours',
            ]);
        });
    }
};
