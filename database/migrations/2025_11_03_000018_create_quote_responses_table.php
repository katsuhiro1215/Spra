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
            $table->foreign('quote_id')->references('id')->on('quotes')->onDelete('cascade');
            $table->string('token')->unique()->comment('Secure access token'); // for secure access without auth
            $table->uuid('user_id')->nullable()->comment('作成されたユーザーID');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
            $table->ulid('company_id')->nullable()->comment('作成された会社ID');
            $table->foreign('company_id')->references('id')->on('companies')->onDelete('set null');
            $table->string('email'); // customer email
            $table->string('response_type')->nullable()->comment('request, decline, revision_request, other'); // nullable until customer responds
            $table->text('response_text')->nullable(); // for "その他" response
            $table->timestamp('responded_at')->nullable();
            $table->timestamp('admin_notified_at')->nullable();
            $table->timestamps();

            // Indexes
            $table->index('quote_id');
            $table->index('token');
            $table->index('email');
            $table->index('user_id');
            $table->index('company_id');
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
