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
    Schema::table('appointments', function (Blueprint $table) {
      $table->string('source')->default('web')->after('project_id')->comment('流入元: web, instagram');
      $table->string('external_reference')->nullable()->after('source')->comment('外部プラットフォームのユーザー識別子（InstagramのIGSID等）');
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::table('appointments', function (Blueprint $table) {
      $table->dropColumn(['source', 'external_reference']);
    });
  }
};
