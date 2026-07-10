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
                'slug' => 'web-production',
                'description' => '企業サイト、コーポレートサイト、採用サイトなど、目的に応じたWebサイトをWordPressで制作。デザインから開発、運用・保守まで一貫してサポートします。オリジナル開発にも対応し、独自の機能を持つWebサイトを構築します。',
                'color' => '#0F4C81',
                'icon' => 'globe-alt',
                'status' => 'active',
                'sort_order' => 1,
            ],
            [
                'name' => 'LP制作',
                'slug' => 'landing-page',
                'description' => '成約率を最大化するランディングページを制作。広告運用やABテストにも対応し、継続的な改善をサポートします。',
                'color' => '#FF7500',
                'icon' => 'document-text',
                'status' => 'active',
                'sort_order' => 2,
            ],
            [
                'name' => 'ECサイト制作',
                'slug' => 'ec-site-production',
                'description' => 'ShopifyやWooCommerceを活用したECサイト構築。オリジナル開発にも対応し、売上アップを実現します。',
                'color' => '#1A1A1A',
                'icon' => 'shopping-cart',
                'status' => 'active',
                'sort_order' => 3,
            ],
            [
                'name' => 'システム開発',
                'slug' => 'system-development',
                'description' => '業務効率化を実現するWebアプリケーション・システムの開発を行います。',
                'color' => '#2A3342',
                'icon' => 'code-bracket',
                'status' => 'active',
                'sort_order' => 4,
            ],
            [
                'name' => 'SaaS開発',
                'slug' => 'saas-development',
                'description' => 'クラウド型のSaaSサービスの企画・開発・運用をサポートします。',
                'color' => '#3B82F6',
                'icon' => 'server',
                'status' => 'active',
                'sort_order' => 5,
            ],
            [
                'name' => 'モバイルアプリ開発',
                'slug' => 'mobile-app-development',
                'description' => 'iOS・Androidアプリの企画・開発・運用をサポートします。',
                'color' => '#F59E0B',
                'icon' => 'device-phone-mobile',
                'status' => 'active',
                'sort_order' => 6,
            ],
            [
                'name' => 'デザイン',
                'slug' => 'design',
                'description' => 'UI/UXデザイン、グラフィックデザイン、ブランディングなど、幅広いデザインサービスを提供します。',
                'color' => '#10B981',
                'icon' => 'cursor-arrow-ripple',
                'status' => 'active',
                'sort_order' => 7,
            ],
            [
                'name' => 'Excel業務効率化',
                'slug' => 'excel-productivity',
                'description' => 'Excel業務の効率化を支援します。',
                'color' => '#EF4444',
                'icon' => 'paint-brush',
                'status' => 'active',
                'sort_order' => 8,
            ],
            [
                'name' => 'デジタルマーケティング及びコンサルティング',
                'slug' => 'digital-marketing-consulting',
                'description' => 'SEO対策・SNS運用・Web広告運用などのマーケティング支援を行います。',
                'color' => '#8B5CF6',
                'icon' => 'megaphone',
                'status' => 'active',
                'sort_order' => 9,
            ],
            [
                'name' => 'IT教室',
                'slug' => 'it-school',
                'description' => '初心者から上級者まで対応したIT教室を提供します。',
                'color' => '#10B981',
                'icon' => 'academic-cap',
                'status' => 'active',
                'sort_order' => 10,
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
