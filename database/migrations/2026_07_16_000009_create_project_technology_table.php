<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Project ⇔ Technology 中間テーブル（複合主キー）
     * このプロジェクトで実際に使用している技術を記録する
     */
    public function up(): void
    {
        Schema::create('project_technology', function (Blueprint $table) {
            $table->ulid('project_id');
            $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade');
            $table->ulid('technology_id');
            $table->foreign('technology_id')->references('id')->on('technologies')->onDelete('cascade');
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            $table->primary(['project_id', 'technology_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project_technology');
    }
};
