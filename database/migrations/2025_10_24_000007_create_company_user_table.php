<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  /**
   * ユーザーと会社の中間テーブル (多対多)
   */
  public function up(): void
  {
    Schema::create('company_user', function (Blueprint $table) {
      $table->ulid('id')->primary();
      $table->uuid('user_id');
      $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
      $table->ulid('company_id');
      $table->foreign('company_id')->references('id')->on('companies')->onDelete('cascade');
      $table->enum('role', ['owner', 'member', 'employee'])->default('member');
      $table->boolean('is_primary')->default(false); // メイン所属会社
      $table->timestamp('joined_at')->nullable();
      $table->timestamp('left_at')->nullable();
      $table->timestamps();

      $table->unique(['user_id', 'company_id']);
      $table->index(['user_id', 'is_primary']);
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('company_user');
  }
};
