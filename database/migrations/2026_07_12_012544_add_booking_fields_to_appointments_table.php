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
        Schema::table('appointments', function (Blueprint $table) {
            // 一般クライアント（アカウントなし）の連絡先
            $table->string('guest_name')->nullable()->after('user_id')->comment('ゲスト氏名（アカウントなしの一般クライアント用）');
            $table->string('guest_email')->nullable()->after('guest_name')->comment('ゲストメールアドレス');
            $table->string('guest_phone')->nullable()->after('guest_email')->comment('ゲスト電話番号');

            // 会議形式
            $table->enum('location_type', ['in_person', 'online'])->default('online')->after('description')->comment('会議形式: in_person=対面, online=オンライン');
            $table->enum('meeting_tool', ['zoom', 'teams', 'google_meet', 'other'])->nullable()->after('location_type')->comment('Web会議ツール');
            $table->string('meeting_url')->nullable()->after('meeting_tool')->comment('会議URL（確定後に管理者が設定）');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->dropColumn([
                'guest_name',
                'guest_email',
                'guest_phone',
                'location_type',
                'meeting_tool',
                'meeting_url',
            ]);
        });
    }
};
