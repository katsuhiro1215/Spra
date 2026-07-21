<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  /**
   * reference_numbers（参照番号管理テーブル）は導入されたが一度も使われず、
   * 各エンティティ（Contract/Quote/Invoice/Receipt等）がそれぞれ独自に
   * 採番ロジックを実装しているため不要と判断し削除する。
   */
  public function up(): void
  {
    Schema::dropIfExists('reference_numbers');
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::create('reference_numbers', function (Blueprint $table) {
      $table->ulid('id')->primary();

      $table->string('prefix', 10)->comment('プレフィックス: LED, CTR, PRJ, INV, RCT, MNT, SUB');
      $table->char('year_month', 6)->comment('年月: YYYYMM形式');
      $table->unsignedInteger('sequence')->comment('連番: 0001から開始');
      $table->string('reference_number', 50)->unique()->comment('完全な参照番号: PRJ-202605-0001');

      $table->string('entity_type', 50)->comment('エンティティタイプ: Lead, Contract, Project等');
      $table->ulid('entity_id')->comment('関連エンティティのULID');

      $table->boolean('is_active')->default(true)->comment('アクティブ状態');

      $table->timestamps();
      $table->softDeletes();

      $table->index(['entity_type', 'entity_id'], 'idx_entity');
      $table->index('reference_number');
      $table->index(['prefix', 'year_month'], 'idx_prefix_year_month');
      $table->index(['is_active', 'deleted_at'], 'idx_active_status');
    });
  }
};
