<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  /**
   * お問い合わせテーブル (ULID)
   */
  public function up(): void
  {
    Schema::create('contacts', function (Blueprint $table) {
      $table->ulid('id')->primary();
      $table->string('name');
      $table->string('email');
      $table->string('phone')->nullable();
      $table->string('company')->nullable();
      $table->string('subject')->nullable();
      $table->longText('message');
      $table->enum('status', ['new', 'in_progress', 'replied', 'closed'])->default('new');
      $table->text('admin_notes')->nullable();
      $table->timestamp('replied_at')->nullable();
      $table->timestamps();
      $table->softDeletes();

      $table->index(['status', 'created_at']);
      $table->index('email');
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('contacts');
  }
};
