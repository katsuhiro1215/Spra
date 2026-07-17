<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('point_catalog_items', function (Blueprint $table) {
            $table->ulid('id')->primary();

            $table->string('name');
            $table->integer('points_cost')->comment('交換に必要なポイント数');
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);

            $table->uuid('created_by')->nullable();
            $table->foreign('created_by')->references('id')->on('admins')->onDelete('set null');
            $table->uuid('updated_by')->nullable();
            $table->foreign('updated_by')->references('id')->on('admins')->onDelete('set null');

            $table->timestamps();
            $table->softDeletes();
        });

        DB::table('point_catalog_items')->insert([
            [
                'id' => (string) Str::ulid(),
                'name' => 'SEO簡易診断',
                'points_cost' => 500,
                'description' => '現在のサイトのSEO状況を簡易診断いたします。',
                'is_active' => true,
                'sort_order' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => (string) Str::ulid(),
                'name' => 'ホームページ改善レポート',
                'points_cost' => 1000,
                'description' => '現状サイトの改善点をまとめたレポートを作成いたします。',
                'is_active' => true,
                'sort_order' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => (string) Str::ulid(),
                'name' => 'オンライン相談30分',
                'points_cost' => 300,
                'description' => 'オンラインでのご相談を30分承ります。',
                'is_active' => true,
                'sort_order' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => (string) Str::ulid(),
                'name' => '追加ページ制作',
                'points_cost' => 2000,
                'description' => 'サイトへ追加ページを1ページ制作いたします。',
                'is_active' => true,
                'sort_order' => 4,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('point_catalog_items');
    }
};
