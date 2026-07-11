<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * 会社テーブル (ULID)
     */
    public function up(): void
    {
        Schema::create('companies', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUuid('media_id')->nullable()->constrained('media')->nullOnDelete()->comment('会社画像(ロゴ)のメディアID(UUID)');
            $table->string('name');
            $table->enum('company_type', ['individual', 'corporate'])->default('individual');
            $table->string('legal_name')->nullable();           // 法人正式名称
            $table->string('registration_number')->nullable();  // 法人番号
            $table->string('tax_number')->nullable();           // 税務番号
            // 連絡先情報
            $table->string('phone')->nullable();
            $table->string('fax')->nullable();
            $table->string('email')->nullable();
            $table->string('website')->nullable();
            // 代表者情報
            $table->string('representative_name')->nullable();
            $table->string('representative_title')->nullable();
            $table->string('representative_email')->nullable();
            $table->string('representative_phone')->nullable();
            // ビジネス情報
            $table->text('business_description')->nullable();
            $table->string('industry')->nullable();
            $table->integer('employee_count')->nullable();
            $table->decimal('capital', 15, 2)->nullable();
            $table->date('established_date')->nullable();
            // システム情報
            $table->enum('status', ['active', 'inactive', 'suspended'])->default('active');
            $table->text('notes')->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->index(['company_type', 'status']);
            $table->index('registration_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('companies');
    }
};
