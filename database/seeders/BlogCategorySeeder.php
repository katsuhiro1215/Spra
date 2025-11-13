<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BlogCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('blog_categories')->insert([
            [
                'id' => 1,
                'name' => '未登録',
                'slug' => 'unregistered',
                'description' => 'デフォルトのカテゴリ',
                'color' => '#6B7280',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'id' => 2,
                'name' => 'お知らせ',
                'slug' => 'news',
                'description' => '最新のお知らせや更新情報',
                'color' => '#3B82F6',
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'id' => 3,
                'name' => '技術ブログ',
                'slug' => 'tech-blog',
                'description' => '技術的な記事やチュートリアル',
                'color' => '#10B981',
                'sort_order' => 3,
                'is_active' => true,
            ],
            [
                'id' => 4,
                'name' => 'イベント情報',
                'slug' => 'event-info',
                'description' => '開催予定のイベントやセミナー情報',
                'color' => '#F59E0B',
                'sort_order' => 4,
                'is_active' => true,
            ],
        ]);
    }
}
