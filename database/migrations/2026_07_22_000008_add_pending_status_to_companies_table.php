<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * QuoteResponseController::registerStore() で見込み客が自己登録した際、
     * Companyを承認待ち状態で作るはずが、statusのENUMに'pending'が無かったため
     * 'active'で作成されていた。結果としてOnboardingController::approve()の
     * $company->status === 'pending' というゲートが常に不成立になり、
     * 承認フローが機能していなかった。ENUMに'pending'を追加する。
     */
    public function up(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->enum('status', ['active', 'inactive', 'suspended', 'pending'])
                ->default('active')
                ->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->enum('status', ['active', 'inactive', 'suspended'])
                ->default('active')
                ->change();
        });
    }
};
