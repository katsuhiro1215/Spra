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
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // 会社名
            $table->enum('company_type', ['individual', 'corporate'])->default('individual'); // 個人/法人
            $table->string('legal_name')->nullable(); // 法人正式名称
            $table->string('registration_number')->nullable(); // 法人番号
            $table->string('tax_number')->nullable(); // 税務番号

            // 住所情報（日本の住所体系）
            $table->string('postal_code', 8)->nullable(); // 郵便番号
            $table->string('prefecture')->nullable(); // 都道府県
            $table->string('city')->nullable(); // 市区町村
            $table->string('district')->nullable(); // 地域名（町・字等）
            $table->string('address_other')->nullable(); // その他住所（番地・建物名等）

            // 連絡先情報
            $table->string('phone')->nullable(); // 電話番号
            $table->string('fax')->nullable(); // FAX番号
            $table->string('email')->nullable(); // 代表メールアドレス
            $table->string('website')->nullable(); // ウェブサイト

            // 代表者情報
            $table->string('representative_name')->nullable(); // 代表者名
            $table->string('representative_title')->nullable(); // 代表者役職
            $table->string('representative_email')->nullable(); // 代表者メール
            $table->string('representative_phone')->nullable(); // 代表者電話

            // ビジネス情報
            $table->text('business_description')->nullable(); // 事業内容
            $table->string('industry')->nullable(); // 業界
            $table->integer('employee_count')->nullable(); // 従業員数
            $table->decimal('capital', 15, 2)->nullable(); // 資本金
            $table->date('established_date')->nullable(); // 設立日

            // システム情報
            $table->enum('status', ['active', 'inactive', 'suspended'])->default('active');
            $table->text('notes')->nullable(); // 管理者メモ
            $table->json('metadata')->nullable(); // その他のメタデータ

            $table->timestamps();
            $table->softDeletes();

            // インデックス
            $table->index(['company_type', 'status']);
            $table->index('registration_number');
            $table->index('postal_code');
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
