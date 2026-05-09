<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  /**
   * システム設定テーブル (ULID)
   */
  public function up(): void
  {
    Schema::create('system_settings', function (Blueprint $table) {
      $table->ulid('id')->primary();
      $table->string('key')->unique();
      $table->longText('value')->nullable();
      $table->string('type')->default('string');
      $table->string('group')->nullable();
      $table->text('description')->nullable();
      $table->boolean('is_public')->default(false); // フロント公開可否
      $table->timestamps();

      $table->index('group');
      $table->index('is_public');
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('system_settings');
  }
};
