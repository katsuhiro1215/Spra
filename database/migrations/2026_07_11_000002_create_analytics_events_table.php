<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * 生イベントテーブル (ULID)
     * 公開サイトから収集するpageview等の匿名イベントログ
     */
    public function up(): void
    {
        Schema::create('analytics_events', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('session_id', 100)->nullable()->comment('セッション単位の匿名ID');
            $table->string('visitor_hash', 64)->nullable()->comment('IP+UA+日付等から生成した匿名訪問者ハッシュ(生IPは保存しない)');
            $table->string('event_type', 50)->default('pageview')->comment('イベント種別');
            $table->string('url', 2048)->comment('閲覧URL(パス)');
            $table->string('referrer_url', 2048)->nullable()->comment('リファラURL');
            $table->string('utm_source', 255)->nullable();
            $table->string('utm_medium', 255)->nullable();
            $table->string('utm_campaign', 255)->nullable();
            $table->string('utm_term', 255)->nullable();
            $table->string('utm_content', 255)->nullable();
            $table->string('device_type', 20)->nullable();
            $table->string('browser', 100)->nullable();
            $table->string('platform', 100)->nullable();
            $table->timestamp('occurred_at')->comment('発生日時');
            $table->timestamps();

            $table->index(['event_type', 'occurred_at']);
            $table->index('visitor_hash');
            $table->index('session_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('analytics_events');
    }
};
