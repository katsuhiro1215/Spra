<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ServiceCategory;

class ServiceCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Webサイト制作',
                'slug' => 'web-development',
                'description' => 'レスポンシブデザインに対応したWebサイトの企画・制作を行います。',
                'color' => '#3B82F6',
                'icon' => 'globe-alt',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'システム開発',
                'slug' => 'system-development',
                'description' => '業務効率化を実現するWebアプリケーション・システムの開発を行います。',
                'color' => '#10B981',
                'icon' => 'code-bracket',
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'モバイルアプリ開発',
                'slug' => 'mobile-app-development',
                'description' => 'iOS・Androidアプリの企画・開発・運用をサポートします。',
                'color' => '#F59E0B',
                'icon' => 'device-phone-mobile',
                'sort_order' => 3,
                'is_active' => true,
            ],
            [
                'name' => 'UI/UXデザイン',
                'slug' => 'ui-ux-design',
                'description' => 'ユーザビリティを重視したUI/UXデザインを提供します。',
                'color' => '#EF4444',
                'icon' => 'paint-brush',
                'sort_order' => 4,
                'is_active' => true,
            ],
            [
                'name' => 'デジタルマーケティング',
                'slug' => 'digital-marketing',
                'description' => 'SEO対策・SNS運用・Web広告運用などのマーケティング支援を行います。',
                'color' => '#8B5CF6',
                'icon' => 'megaphone',
                'sort_order' => 5,
                'is_active' => true,
            ],
            [
                'name' => 'ITコンサルティング',
                'slug' => 'it-consulting',
                'description' => 'IT戦略立案・システム導入支援・DX推進のコンサルティングを提供します。',
                'color' => '#06B6D4',
                'icon' => 'lightbulb',
                'sort_order' => 6,
                'is_active' => true,
            ],
            [
                'name' => 'システム保守・運用',
                'slug' => 'system-maintenance',
                'description' => 'システムの安定稼働を支える保守・運用サービスを提供します。',
                'color' => '#F97316',
                'icon' => 'wrench-screwdriver',
                'sort_order' => 7,
                'is_active' => true,
            ],
        ];

        foreach ($categories as $category) {
            ServiceCategory::firstOrCreate(
                ['slug' => $category['slug']],
                $category
            );
        }
    }
}
