<?php

namespace Database\Seeders;

use App\Models\PostCategory;
use Illuminate\Database\Seeder;

class PostCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        PostCategory::updateOrCreate(
            ['slug' => 'news'],
            [
                'name' => 'お知らせ',
                'description' => '最新のお知らせや更新情報',
                'is_active' => true,
                'sort_order' => 1,
            ],
        );

        PostCategory::updateOrCreate(
            ['slug' => 'blog'],
            [
                'name' => 'ブログ',
                'description' => '技術ブログ・コラム記事',
                'is_active' => true,
                'sort_order' => 2,
            ],
        );
    }
}
