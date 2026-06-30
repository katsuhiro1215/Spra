<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * user_idをnullableに変更し、contact_idを追加
     *
     * 背景：
     * - 見積もり作成時点ではまだUserアカウントが存在しない場合がある
     * - お問い合わせ(Contact)から見積もりを作成する場合、User未作成
     * - Contract成立後にUser発行してQuoteを更新する
     *
     * ワークフロー：
     * 1. Contact → Quote作成(contact_id, user_id=null) → Contract → User発行 → Quote更新
     * 2. User → Quote作成(user_id, contact_id=null) → Contract
     */
    public function up(): void
    {
        Schema::table('quotes', function (Blueprint $table) {
            // user_idの外部キー制約を削除
            $table->dropForeign(['user_id']);

            // user_idをnullableに変更
            $table->uuid('user_id')->nullable()->change();

            // user_idの外部キー制約を再追加（onDelete: set null）
            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('set null');

            // contact_idを追加（お問い合わせからの見積もり作成用）
            $table->ulid('contact_id')->nullable()->after('user_id');
            $table->foreign('contact_id')
                ->references('id')
                ->on('contacts')
                ->onDelete('set null');

            $table->index('contact_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('quotes', function (Blueprint $table) {
            // contact_idを削除
            $table->dropForeign(['contact_id']);
            $table->dropIndex(['contact_id']);
            $table->dropColumn('contact_id');

            // user_idの外部キー制約を削除
            $table->dropForeign(['user_id']);

            // user_idをNOT NULLに戻す
            $table->uuid('user_id')->nullable(false)->change();

            // user_idの外部キー制約を再追加（元の状態）
            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');
        });
    }
};
