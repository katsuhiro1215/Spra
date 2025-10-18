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
        Schema::table('users', function (Blueprint $table) {
            // 会社との関連
            $table->foreignId('company_id')->nullable()->after('id')->constrained()->cascadeOnDelete();

            // ユーザータイプ
            $table->enum('user_type', ['individual', 'corporate', 'employee'])->default('individual')->after('company_id');

            // 個人情報
            $table->string('first_name')->nullable()->after('name');
            $table->string('last_name')->nullable()->after('first_name');
            $table->string('display_name')->nullable()->after('last_name');
            $table->string('phone')->nullable()->after('email');
            $table->string('mobile_phone')->nullable()->after('phone');
            $table->date('birth_date')->nullable()->after('mobile_phone');
            $table->enum('gender', ['male', 'female', 'other', 'not_specified'])->nullable()->after('birth_date');

            // プロフィール情報
            $table->string('avatar')->nullable()->after('gender');
            $table->string('occupation')->nullable()->after('avatar');
            $table->string('department')->nullable()->after('occupation');
            $table->string('position')->nullable()->after('department');

            // 設定情報
            $table->string('preferred_language', 5)->default('ja')->after('position');
            $table->string('timezone')->default('Asia/Tokyo')->after('preferred_language');

            // ステータス
            $table->enum('status', ['active', 'inactive', 'suspended', 'pending'])->default('active')->after('timezone');
            $table->timestamp('last_login_at')->nullable()->after('email_verified_at');

            // 管理情報
            $table->text('notes')->nullable()->after('status'); // 管理者メモ
            $table->json('preferences')->nullable()->after('notes'); // ユーザー設定
            $table->json('metadata')->nullable()->after('preferences'); // その他のメタデータ

            // インデックス
            $table->index(['company_id', 'user_type']);
            $table->index(['status', 'user_type']);
            $table->index('last_login_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['company_id']);
            $table->dropColumn([
                'company_id',
                'user_type',
                'first_name',
                'last_name',
                'display_name',
                'phone',
                'mobile_phone',
                'birth_date',
                'gender',
                'avatar',
                'occupation',
                'department',
                'position',
                'preferred_language',
                'timezone',
                'status',
                'last_login_at',
                'notes',
                'preferences',
                'metadata',
            ]);
        });
    }
};
