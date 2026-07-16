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
        Schema::create('organizations', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('name');
            $table->string('site_name')->nullable()->comment('サイト表示名');
            $table->string('name_en')->nullable()->comment('英語表記名');
            $table->string('logo_path', 500)->nullable()->comment('ロゴ画像パス（public直下）');
            $table->string('legal_name')->nullable();           // 法人正式名称
            $table->string('representative_name')->nullable()->comment('代表者名');
            $table->text('business_description')->nullable()->comment('事業内容（改行区切り）');
            $table->unsignedInteger('employee_count')->nullable()->comment('従業員数');
            $table->string('capital')->nullable()->comment('資本金');
            $table->date('established_date')->nullable()->comment('設立日');
            $table->string('business_hours')->nullable()->comment('営業時間');
            $table->string('registration_number')->nullable();  // 法人番号
            $table->string('tax_number')->nullable();           // 税務番号
            $table->string('phone')->nullable();
            $table->string('fax')->nullable();
            $table->string('email')->nullable();
            $table->string('website')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('organizations');
    }
};
