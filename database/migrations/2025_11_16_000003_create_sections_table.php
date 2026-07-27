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
        Schema::create('sections', function (Blueprint $table) {
            $table->ulid('id')->primary()->comment('セクションID(ULID)');
            $table->ulid('page_id')->nullable();
            $table->foreign('page_id')->references('id')->on('pages')->cascadeOnDelete();
            $table->string('name')->comment('セクション名');
            $table->string('role')->default('main')->comment('役割(header/footer/main/sidebar等)');
            $table->json('content')->nullable()->comment('セクションコンテンツ(ブロックエディタ)');
            $table->unsignedInteger('sort_order')->default(0)->comment('表示順');
            $table->uuid('created_by')->nullable();
            $table->foreign('created_by')->references('id')->on('admins')->nullOnDelete();
            $table->uuid('updated_by')->nullable();
            $table->foreign('updated_by')->references('id')->on('admins')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sections');
    }
};
