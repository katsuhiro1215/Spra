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
        Schema::create('organization_histories', function (Blueprint $table) {
            $table->ulid('id')->primary()->comment('組織沿革ID(ULID)');
            $table->ulid('organization_id');
            $table->foreign('organization_id')->references('id')->on('organizations')->cascadeOnDelete();
            $table->date('event_date')->comment('出来事の年月');
            $table->string('title', 255)->comment('タイトル');
            $table->text('description')->nullable()->comment('説明');
            $table->integer('sort_order')->default(0)->comment('表示順');
            $table->boolean('is_published')->default(true)->comment('公開状態');
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
        Schema::dropIfExists('organization_histories');
    }
};
