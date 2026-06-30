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
    Schema::create('quote_responses', function (Blueprint $table) {
      $table->ulid('id')->primary();
      $table->ulid('quote_id');
      $table->string('token')->unique(); // for secure access without auth
      $table->string('email'); // customer email
      $table->string('response_type')->nullable(); // request, decline, revision_request, other (nullable until customer responds)
      $table->text('response_text')->nullable(); // for "その他" response
      $table->timestamp('responded_at')->nullable();
      $table->timestamp('admin_notified_at')->nullable();
      $table->timestamps();

      // Indexes
      $table->index('quote_id');
      $table->index('token');
      $table->index('email');

      // Foreign key
      $table->foreign('quote_id')->references('id')->on('quotes')->onDelete('cascade');
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('quote_responses');
  }
};
