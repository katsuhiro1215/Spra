<?php

namespace Database\Seeders;

use App\Models\ContactCategory;
use Illuminate\Database\Seeder;

class ContactCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => '一般的な問い合わせ',
                'slug' => 'general',
                'description' => '一般的な問い合わせに関するカテゴリです。',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'お見積りに関する問い合わせ',
                'slug' => ContactCategory::SLUG_QUOTE_REQUEST,
                'description' => 'お見積りに関する問い合わせに関するカテゴリです。',
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'name' => '技術的な問い合わせ',
                'slug' => 'technical',
                'description' => '技術的な問い合わせに関するカテゴリです。',
                'sort_order' => 3,
                'is_active' => true,
            ],
            [
                'name' => '営業関連の問い合わせ',
                'slug' => 'sales',
                'description' => '営業関連の問い合わせに関するカテゴリです。',
                'sort_order' => 4,
                'is_active' => true,
            ],
            [
                'name' => 'サポート関連の問い合わせ',
                'slug' => 'support',
                'description' => 'サポート関連の問い合わせに関するカテゴリです。',
                'sort_order' => 5,
                'is_active' => true,
            ],
            [
                'name' => 'Atlas利用申込み',
                'slug' => ContactCategory::SLUG_ATLAS_APPLY,
                'description' => 'Atlas会員制サービスの利用申込みに関するカテゴリです。',
                'sort_order' => 6,
                'is_active' => true,
            ],
        ];

        foreach ($categories as $category) {
            ContactCategory::create($category);
        }
    }
}
