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
    Schema::table('user_login_histories', function (Blueprint $table) {
      // type カラムを device の後に追加
      $table->enum('type', ['login', 'logout', 'failed_login', 'forced_logout', 'session_expired'])
        ->default('login')
        ->after('device');

      // device_type と browser_version をサポートするカラムを追加
      $table->string('device_type')->nullable()->after('type');
      $table->string('browser_version')->nullable()->after('browser');
      $table->string('platform_version')->nullable()->after('platform');

      // login_method カラムを追加
      $table->string('login_method')->nullable()->after('type');

      // is_successful, logged_in_at, login_duration を追加
      $table->boolean('is_successful')->default(true)->after('is_success');
      $table->unsignedInteger('login_duration')->nullable()->after('logged_out_at');
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::table('user_login_histories', function (Blueprint $table) {
      $table->dropColumn([
        'type',
        'device_type',
        'browser_version',
        'platform_version',
        'login_method',
        'is_successful',
        'login_duration',
      ]);
    });
  }
};
