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
        Schema::create('contract_signatures', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->ulid('contract_id');
            $table->uuid('signed_by_user')->nullable();
            $table->uuid('signed_by_admin')->nullable();
            $table->longText('signature_image')->nullable();
            $table->enum('signature_type', ['user', 'admin'])->comment('Who signed: user or admin');
            $table->enum('method', ['canvas', 'upload', 'typed'])->default('canvas')->comment('How it was signed');
            $table->string('ip_address')->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamp('signed_at')->nullable();
            $table->enum('status', ['pending', 'signed', 'verified', 'rejected'])->default('pending');
            $table->json('metadata')->nullable()->comment('Additional metadata (rejected_reason, verification_notes)');
            $table->softDeletes();
            $table->timestamps();

            // Indices
            $table->index('contract_id');
            $table->index('signed_by_user');
            $table->index('signed_by_admin');
            $table->index('status');
            $table->index('created_at');

            // Foreign Keys
            $table->foreign('contract_id')->references('id')->on('contracts')->onDelete('cascade');
            $table->foreign('signed_by_user')->references('id')->on('users')->onDelete('set null');
            $table->foreign('signed_by_admin')->references('id')->on('admins')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contract_signatures');
    }
};
