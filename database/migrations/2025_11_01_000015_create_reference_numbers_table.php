<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * 参照番号管理テーブル (ULID)
     *
     * 各エンティティ(Lead, Contract, Project, Invoice等)に対して
     * 人間が読みやすい一意の参照番号を発行・管理する
     */
    public function up(): void
    {
        Schema::create('reference_numbers', function (Blueprint $table) {
            $table->ulid('id')->primary();

            // 参照番号の構成要素
            $table->string('prefix', 10)->comment('プレフィックス: LED, CTR, PRJ, INV, RCT, MNT, SUB');
            $table->char('year_month', 6)->comment('年月: YYYYMM形式');
            $table->unsignedInteger('sequence')->comment('連番: 0001から開始');
            $table->string('reference_number', 50)->unique()->comment('完全な参照番号: PRJ-202605-0001');

            // エンティティ情報
            $table->string('entity_type', 50)->comment('エンティティタイプ: Lead, Contract, Project等');
            $table->ulid('entity_id')->comment('関連エンティティのULID');

            // 状態管理
            $table->boolean('is_active')->default(true)->comment('アクティブ状態');

            // タイムスタンプ
            $table->timestamps();
            $table->softDeletes();

            // インデックス
            $table->index(['entity_type', 'entity_id'], 'idx_entity');
            $table->index('reference_number');
            $table->index(['prefix', 'year_month'], 'idx_prefix_year_month');
            $table->index(['is_active', 'deleted_at'], 'idx_active_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reference_numbers');
    }
};
