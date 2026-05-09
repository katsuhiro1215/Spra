<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  /**
   * 契約書ファイルテーブル (ULID)
   */
  public function up(): void
  {
    Schema::create('contract_documents', function (Blueprint $table) {
      $table->ulid('id')->primary();
      $table->ulid('contract_id');
      $table->foreign('contract_id')->references('id')->on('contracts')->onDelete('cascade');
      $table->string('file_name');
      $table->string('file_path');
      $table->integer('file_size')->nullable();
      $table->string('mime_type')->nullable();
      $table->uuid('uploaded_by')->nullable();
      $table->foreign('uploaded_by')->references('id')->on('admins')->onDelete('set null');
      $table->timestamps();

      $table->index('contract_id');
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('contract_documents');
  }
};
