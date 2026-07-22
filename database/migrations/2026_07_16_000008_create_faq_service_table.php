<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Faq ⇔ Service 中間テーブル (ULID)
     */
    public function up(): void
    {
        Schema::create('faq_service', function (Blueprint $table) {
            $table->ulid('faq_id');
            $table->foreign('faq_id')->references('id')->on('faqs')->onDelete('cascade');
            $table->ulid('service_id');
            $table->foreign('service_id')->references('id')->on('services')->onDelete('cascade');
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            $table->primary(['faq_id', 'service_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('faq_service');
    }
};
