<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * AI社員の業務アクションを1件ずつ記録する随時ログ
     */
    public function up(): void
    {
        Schema::create('ai_staff_activity_logs', function (Blueprint $table) {
            $table->ulid('id')->primary();

            $table->uuid('admin_id');
            $table->foreign('admin_id')->references('id')->on('admins')->onDelete('cascade');

            $table->string('action');
            $table->string('subject_type')->nullable();
            $table->ulid('subject_id')->nullable();
            $table->text('description');
            $table->dateTime('occurred_at');

            $table->timestamp('created_at')->nullable();

            $table->index(['admin_id', 'occurred_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ai_staff_activity_logs');
    }
};
