<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Admin(運営)からUserへ配信するお知らせ (ULID)
     * メール＋ダッシュボード通知の両方で配信する。配信操作自体は
     * is_published/published_at/sent_at をまとめて更新するので、
     * is_published=true かつ sent_at=null という状態は発生しない想定。
     */
    public function up(): void
    {
        Schema::create('announcements', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('title');
            $table->longText('body');
            $table->enum('audience', ['all', 'active_contract'])
                ->default('active_contract')
                ->comment('配信対象: all=全ユーザー, active_contract=契約中のユーザー');
            $table->boolean('is_published')->default(false)->comment('配信済みかどうか');
            $table->timestamp('published_at')->nullable();
            $table->timestamp('sent_at')->nullable()->comment('メール・通知を実際に配信した日時');
            $table->unsignedInteger('recipient_count')->nullable()->comment('配信時点の対象人数');

            $table->uuid('created_by')->nullable();
            $table->foreign('created_by')->references('id')->on('admins')->nullOnDelete();
            $table->uuid('updated_by')->nullable();
            $table->foreign('updated_by')->references('id')->on('admins')->nullOnDelete();
            $table->uuid('deleted_by')->nullable();
            $table->foreign('deleted_by')->references('id')->on('admins')->nullOnDelete();

            $table->timestamps();
            $table->softDeletes();

            $table->index(['is_published', 'published_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('announcements');
    }
};
