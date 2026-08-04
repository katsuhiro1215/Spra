<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * ヒアリング回答テーブル (ULID)
     */
    public function up(): void
    {
        Schema::create('hearing_answers', function (Blueprint $table) {
            $table->ulid('id')->primary();

            $table->ulid('hearing_id');
            $table->foreign('hearing_id')->references('id')->on('hearings')->onDelete('cascade');

            $table->ulid('hearing_template_item_id');
            $table->foreign('hearing_template_item_id')->references('id')->on('hearing_template_items')->onDelete('restrict');

            $table->text('answer_text')->nullable()->comment('text/number回答');
            $table->json('answer_options')->nullable()->comment('single_choice/multi_choice回答（選択値の配列）');

            $table->timestamps();

            $table->unique(['hearing_id', 'hearing_template_item_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hearing_answers');
    }
};
