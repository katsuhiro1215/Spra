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
        Schema::create('holidays', function (Blueprint $table) {
            $table->id();
            $table->date('date')->unique()->comment('祝日の日付');
            $table->string('name')->comment('祝日名');
            $table->enum('type', ['national', 'international'])->default('national')->comment('祝日の種類');
            $table->string('color', 7)->nullable()->comment('祝日の色（HEXコード）');
            $table->boolean('is_recurring')->default(false)->comment('毎年繰り返すか');
            $table->text('description')->nullable()->comment('説明');
            // 監査用カラム
            $table->foreignUuid('created_by')->nullable()->constrained('admins')->nullOnDelete()->comment('作成者');
            $table->foreignUuid('updated_by')->nullable()->constrained('admins')->nullOnDelete()->comment('更新者');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('holidays');
    }
};
