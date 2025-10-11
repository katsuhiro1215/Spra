<?php

namespace Database\Seeders;

use App\Models\FaqCategory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FaqCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => '一般',
                'slug' => 'general',
                'description' => '一般的なよくある質問',
                'color' => '#6B7280',
                'icon' => 'QuestionMarkCircleIcon',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'name' => '料金・プラン',
                'slug' => 'pricing',
                'description' => '料金体系やプランに関する質問',
                'color' => '#10B981',
                'icon' => 'CurrencyYenIcon',
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'name' => '契約・お支払い',
                'slug' => 'contract',
                'description' => '契約内容やお支払いに関する質問',
                'color' => '#3B82F6',
                'icon' => 'DocumentTextIcon',
                'sort_order' => 3,
                'is_active' => true,
            ],
            [
                'name' => 'サポート',
                'slug' => 'support',
                'description' => 'サポート体制やアフターフォローに関する質問',
                'color' => '#8B5CF6',
                'icon' => 'LifebuoyIcon',
                'sort_order' => 4,
                'is_active' => true,
            ],
            [
                'name' => '開発プロセス',
                'slug' => 'process',
                'description' => '開発の流れや進め方に関する質問',
                'color' => '#F59E0B',
                'icon' => 'Cog6ToothIcon',
                'sort_order' => 5,
                'is_active' => true,
            ],
            [
                'name' => '技術・仕様',
                'slug' => 'technical',
                'description' => '技術的な内容や仕様に関する質問',
                'color' => '#EF4444',
                'icon' => 'CodeBracketIcon',
                'sort_order' => 6,
                'is_active' => true,
            ],
        ];

        foreach ($categories as $category) {
            FaqCategory::updateOrCreate(
                ['slug' => $category['slug']],
                $category
            );
        }
    }
}
