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
        Schema::create('admin_employments', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('admin_id')->unique()->constrained('admins')->cascadeOnDelete()->comment('対象管理者');
            $table->enum('employment_type', ['full_time', 'contract', 'temp_staff', 'part_time'])
                ->default('full_time')
                ->comment('full_time=正社員, contract=契約社員, temp_staff=派遣社員, part_time=パート・アルバイト');
            $table->enum('pay_type', ['monthly', 'hourly'])
                ->default('monthly')
                ->comment('monthly=月給制, hourly=時給制');
            $table->decimal('base_salary', 10, 2)->nullable()->comment('月給制の場合の基本給（円）');
            $table->decimal('hourly_wage', 10, 2)->nullable()->comment('時給制の場合の時給（円）');
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
        Schema::dropIfExists('admin_employments');
    }
};
