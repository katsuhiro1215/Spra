<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  /**
   * サイト設定テーブル (ULID)
   */
  public function up(): void
  {
    Schema::create('site_settings', function (Blueprint $table) {
      $table->ulid('id')->primary();
      $table->string('key')->unique();
      $table->longText('value')->nullable();
      $table->string('type')->default('string'); // string, json, boolean, integer
      $table->string('group')->nullable();       // general, seo, mail, etc.
      $table->text('description')->nullable();
      $table->timestamps();

      $table->index('group');
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('site_settings');
  }
};
