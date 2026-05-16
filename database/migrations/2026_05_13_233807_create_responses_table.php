<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * お問い合わせ返答テーブル (ULID)
     */
    public function up(): void
    {
        Schema::create('responses', function (Blueprint $table) {
            $table->ulid('id')->primary();

            // お問い合わせ参照
            $table->ulid('contact_id');
            $table->foreign('contact_id')->references('id')->on('contacts')->onDelete('cascade');

            // 返答テンプレート参照（任意）
            $table->ulid('response_template_id')->nullable();
            $table->foreign('response_template_id')->references('id')->on('response_templates')->onDelete('set null');

            // 返答者（管理者）
            $table->uuid('admin_id');
            $table->foreign('admin_id')->references('id')->on('admins')->onDelete('restrict');

            // 返答内容
            $table->string('subject');
            $table->longText('body');

            // ステータス管理
            $table->enum('status', ['draft', 'sent'])->default('draft');
            $table->timestamp('sent_at')->nullable();

            // メール送信情報
            $table->string('recipient_email');
            $table->string('recipient_name')->nullable();
            $table->text('send_error')->nullable();  // 送信エラーメッセージ

            $table->uuid('created_by')->nullable();
            $table->foreign('created_by')->references('id')->on('admins')->onDelete('set null');
            $table->timestamps();
            $table->softDeletes();

            $table->index(['contact_id', 'status']);
            $table->index(['admin_id', 'created_at']);
            $table->index('sent_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('responses');
    }
};
