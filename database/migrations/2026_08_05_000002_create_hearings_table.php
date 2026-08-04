<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * ヒアリングシートテーブル (ULID)
     * 初回商談・電話でのヒアリング内容を記録し、見積作成につなげる
     */
    public function up(): void
    {
        Schema::create('hearings', function (Blueprint $table) {
            $table->ulid('id')->primary();

            $table->ulid('contact_id')->nullable();
            $table->foreign('contact_id')->references('id')->on('contacts')->onDelete('cascade');

            $table->ulid('quote_id')->nullable();
            $table->foreign('quote_id')->references('id')->on('quotes')->onDelete('set null');

            $table->string('title');
            $table->text('notes')->nullable()->comment('ヒアリング全体の補足メモ');

            $table->uuid('created_by')->nullable();
            $table->foreign('created_by')->references('id')->on('admins')->onDelete('set null');

            $table->timestamps();
            $table->softDeletes();

            $table->index(['contact_id', 'created_at']);
            $table->index('quote_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hearings');
    }
};
