<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
  /**
   * ServicePlan選択時のプラン割引行など、特定のServiceItemに紐付かない
   * 明細行を保存できるようにする（外部キー自体は維持し、NULL値のみ許可する）
   */
  public function up(): void
  {
    DB::statement('ALTER TABLE quote_items MODIFY service_id CHAR(26) NULL');
    DB::statement('ALTER TABLE quote_items MODIFY service_item_id CHAR(26) NULL');
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    DB::statement('ALTER TABLE quote_items MODIFY service_id CHAR(26) NOT NULL');
    DB::statement('ALTER TABLE quote_items MODIFY service_item_id CHAR(26) NOT NULL');
  }
};
