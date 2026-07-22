<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * MediaVariantモデルはHasUlidsを使う前提だが、作成時のマイグレーションで
     * idがbigint自動採番のまま残っており、ULID文字列を挿入できず
     * バリアント生成が常に失敗していた（media_variantsは常に空だったため
     * データ移行なしで安全に列の型を変更する）。
     */
    public function up(): void
    {
        Schema::table('media_variants', function (Blueprint $table) {
            $table->dropColumn('id');
        });

        Schema::table('media_variants', function (Blueprint $table) {
            $table->ulid('id')->primary()->first();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('media_variants', function (Blueprint $table) {
            $table->dropColumn('id');
        });

        Schema::table('media_variants', function (Blueprint $table) {
            $table->id()->first();
        });
    }
};
