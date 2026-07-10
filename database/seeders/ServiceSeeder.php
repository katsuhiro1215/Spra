<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Service;
use App\Models\ServiceCategory;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $webCategory = ServiceCategory::where('slug', 'web-production')->first();
        $lpCategory = ServiceCategory::where('slug', 'landing-page')->first();
        $ecCategory = ServiceCategory::where('slug', 'ec-site-production')->first();
        $systemCategory = ServiceCategory::where('slug', 'system-development')->first();
        $saasCategory = ServiceCategory::where('slug', 'saas-development')->first();
        $mobileCategory = ServiceCategory::where('slug', 'mobile-app-development')->first();
        $designCategory = ServiceCategory::where('slug', 'design')->first();
        $excelCategory = ServiceCategory::where('slug', 'excel-productivity')->first();
        $marketingCategory = ServiceCategory::where('slug', 'digital-marketing-consulting')->first();
        $schoolCategory = ServiceCategory::where('slug', 'it-school')->first();

        $services = [
            // Webサイト制作カテゴリのサービス
            [
                'name' => 'Webサイト制作',
                'slug' => 'website-production',
                'service_category_id' => $webCategory->id,
                'description' => '企業の信頼性を高める高品質なコーポレートサイトを制作します。',
                'details' => "現代的なデザインと使いやすいUIで、企業の魅力を最大限に表現します。レスポンシブデザインに対応し、スマートフォンからデスクトップまで全てのデバイスで美しく表示されます。\n\nSEO対策も万全で、検索エンジンでの上位表示を目指します。CMS機能により、お客様自身で簡単に更新が可能です。",
                'icon' => 'building-office',
                'status' => 'active',
                'sort_order' => 1,
                'is_featured' => true,
            ],
            [
                'name' => 'Webサイト保守・運用',
                'slug' => 'website-maintenance',
                'service_category_id' => $webCategory->id,
                'description' => '企業の信頼性を高める高品質なコーポレートサイトの保守・運用を行います。',
                'details' => "現代的なデザインと使いやすいUIで、企業の魅力を最大限に表現します。レスポンシブデザインに対応し、スマートフォンからデスクトップまで全てのデバイスで美しく表示されます。\n\nSEO対策も万全で、検索エンジンでの上位表示を目指します。CMS機能により、お客様自身で簡単に更新が可能です。",
                'icon' => 'building-office',
                'status' => 'active',
                'sort_order' => 2,
                'is_featured' => true,
            ],
            [
                'name' => 'Webサイトコンテンツ運用',
                'slug' => 'website-content-management',
                'service_category_id' => $webCategory->id,
                'description' => '企業の信頼性を高める高品質なコンテンツの作成と運用改善を行います。',
                'details' => "現代的なデザインと使いやすいUIで、企業の魅力を最大限に表現します。レスポンシブデザインに対応し、スマートフォンからデスクトップまで全てのデバイスで美しく表示されます。\n\nSEO対策も万全で、検索エンジンでの上位表示を目指します。CMS機能により、お客様自身で簡単に更新が可能です。",
                'icon' => 'building-office',
                'status' => 'active',
                'sort_order' => 3,
                'is_featured' => false,
            ],
            // LP制作カテゴリのサービス
            [
                'name' => 'LP制作',
                'slug' => 'landing-page',
                'service_category_id' => $lpCategory->id,
                'description' => '企業の信頼性を高める高品質なランディングページを制作します。',
                'details' => "現代的なデザインと使いやすいUIで、企業の魅力を最大限に表現します。レスポンシブデザインに対応し、スマートフォンからデスクトップまで全てのデバイスで美しく表示されます。\n\nSEO対策も万全で、検索エンジンでの上位表示を目指します。CMS機能により、お客様自身で簡単に更新が可能です。",
                'icon' => 'document-text',
                'status' => 'active',
                'sort_order' => 4,
                'is_featured' => true,
            ],
            [
                'name' => 'LP保守・運用',
                'slug' => 'landing-page-maintenance',
                'service_category_id' => $lpCategory->id,
                'description' => '企業の信頼性を高める高品質なランディングページの保守・運用を行います。',
                'details' => "現代的なデザインと使いやすいUIで、企業の魅力を最大限に表現します。レスポンシブデザインに対応し、スマートフォンからデスクトップまで全てのデバイスで美しく表示されます。\n\nSEO対策も万全で、検索エンジンでの上位表示を目指します。CMS機能により、お客様自身で簡単に更新が可能です。",
                'icon' => 'document-text',
                'status' => 'active',
                'sort_order' => 5,
                'is_featured' => false,
            ],
            // ECサイト制作カテゴリのサービス
            [
                'name' => 'ECサイト構築',
                'slug' => 'ecommerce-development',
                'service_category_id' => $ecCategory->id,
                'description' => '売上向上を実現するECサイトを構築します。',
                'details' => "ユーザビリティを重視したECサイトで、購入率の向上を実現します。セキュアな決済システムと在庫管理機能を標準搭載。\n\n管理画面から商品登録、注文管理、顧客管理まで一元化できます。スマートフォンでのショッピング体験も最適化されています。",
                'icon' => 'shopping-cart',
                'status' => 'active',
                'sort_order' => 6,
                'is_featured' => true,
            ],
            [
                'name' => 'ECサイト保守・運用',
                'slug' => 'ecommerce-maintenance',
                'service_category_id' => $ecCategory->id,
                'description' => '売上向上を実現するECサイトの保守・運用を行います。',
                'details' => "現代的なデザインと使いやすいUIで、ECサイトの魅力を最大限に表現します。レスポンシブデザインに対応し、スマートフォンからデスクトップまで全てのデバイスで美しく表示されます。\n\nSEO対策も万全で、検索エンジンでの上位表示を目指します。CMS機能により、お客様自身で簡単に更新が可能です。",
                'icon' => 'shopping-cart',
                'status' => 'active',
                'sort_order' => 7,
                'is_featured' => true,
            ],
            // システム開発カテゴリのサービス
            [
                'name' => 'Webシステム開発',
                'slug' => 'web-system-development',
                'service_category_id' => $systemCategory->id,
                'description' => '業務効率化を実現するカスタムシステムを開発します。',
                'details' => "お客様の業務フローに合わせたオーダーメイドのシステムを開発します。既存システムとの連携も可能で、データの一元管理を実現します。\n\nクラウド対応により、どこからでもアクセス可能。セキュリティ対策も万全で、機密情報も安全に管理できます。",
                'icon' => 'clipboard-document-list',
                'status' => 'active',
                'sort_order' => 8,
                'is_featured' => true,
            ],
            [
                'name' => 'Webシステム保守・運用',
                'slug' => 'web-system-maintenance',
                'service_category_id' => $systemCategory->id,
                'description' => '業務効率化を実現するカスタムシステムの保守・運用を行います。',
                'details' => "お客様の業務フローに合わせたオーダーメイドのシステムの保守・運用を行います。既存システムとの連携も可能で、データの一元管理を実現します。\n\nクラウド対応により、どこからでもアクセス可能。セキュリティ対策も万全で、機密情報も安全に管理できます。",
                'icon' => 'clipboard-document-list',
                'status' => 'active',
                'sort_order' => 9,
                'is_featured' => true,
            ],
            [
                'name' => 'API開発',
                'slug' => 'api-development',
                'service_category_id' => $systemCategory->id,
                'description' => '業務効率化を実現するカスタムシステムのAPI開発を行います。',
                'details' => "お客様の業務フローに合わせたオーダーメイドのシステムのAPI開発を行います。既存システムとの連携も可能で、データの一元管理を実現します。\n\nクラウド対応により、どこからでもアクセス可能。セキュリティ対策も万全で、機密情報も安全に管理できます。",
                'icon' => 'clipboard-document-list',
                'status' => 'active',
                'sort_order' => 10,
                'is_featured' => false,
            ],
            // SaaS開発カテゴリのサービス
            [
                'name' => 'SaaS開発',
                'slug' => 'saas-development',
                'service_category_id' => $saasCategory->id,
                'description' => 'クラウドベースのSaaSソリューションを提供します。',
                'details' => "最新のクラウド技術を活用し、スケーラブルでセキュアなSaaSアプリケーションを開発します。ユーザー管理、課金機能、データ分析など、ビジネスに必要な機能を統合。",
                'icon' => 'cube',
                'status' => 'active',
                'sort_order' => 11,
                'is_featured' => false,
            ],
            [
                'name' => 'SaaS保守・運用',
                'slug' => 'saas-maintenance',
                'service_category_id' => $saasCategory->id,
                'description' => 'クラウドベースのSaaSソリューションの保守・運用を行います。',
                'details' => "最新のクラウド技術を活用し、スケーラブルでセキュアなSaaSアプリケーションの保守・運用を行います。ユーザー管理、課金機能、データ分析など、ビジネスに必要な機能を統合。",
                'icon' => 'cube',
                'status' => 'active',
                'sort_order' => 12,
                'is_featured' => false,
            ],
            // モバイル開発カテゴリのサービス
            [
                'name' => 'アプリ開発',
                'slug' => 'app-development',
                'service_category_id' => $mobileCategory->id,
                'description' => 'ユーザーフレンドリーなアプリを開発します。',
                'details' => "iOSおよびAndroid向けのネイティブアプリケーションを開発します。ユーザー体験を最優先に考え、直感的で使いやすいインターフェースを提供。\n\n最新の技術スタックを使用し、高速で安定したパフォーマンスを実現。アプリの公開後も、アップデートや機能追加のサポートを提供します。",
                'icon' => 'device-phone-mobile',
                'status' => 'active',
                'sort_order' => 13,
                'is_featured' => false,
            ],
            [
                'name' => 'アプリ保守・運用',
                'slug' => 'app-maintenance',
                'service_category_id' => $mobileCategory->id,
                'description' => 'ユーザーフレンドリーなアプリを保守・運用します。',
                'details' => "iOSおよびAndroid向けのネイティブアプリケーションの保守・運用を行います。ユーザー体験を最優先に考え、直感的で使いやすいインターフェースを提供。\n\n最新の技術スタックを使用し、高速で安定したパフォーマンスを維持。アプリの公開後も、アップデートや機能追加のサポートを提供します。",
                'icon' => 'device-phone-mobile',
                'status' => 'active',
                'sort_order' => 14,
                'is_featured' => false,
            ],
            // デザインカテゴリのサービス
            [
                'name' => 'UI/UXデザイン',
                'slug' => 'ui-ux-design',
                'service_category_id' => $designCategory->id,
                'description' => 'ユーザビリティを重視したUI/UXデザインを提供します。',
                'details' => "ユーザー体験を最優先に考えたUI/UXデザインを提供します。ユーザビリティテストを重ね、直感的で使いやすいインターフェースを実現。\n\nブランドアイデンティティを反映した一貫性のあるデザインシステムを構築します。",
                'icon' => 'paint-brush',
                'status' => 'active',
                'sort_order' => 15,
                'is_featured' => false,
            ],
            [
                'name' => 'グラフィックデザイン',
                'slug' => 'graphic-design',
                'service_category_id' => $designCategory->id,
                'description' => 'ロゴ・名刺・チラシ・パンフレットなどのグラフィックデザインを提供します。',
                'details' => "企業のブランド価値を高めるグラフィックデザインを提供します。ロゴ、名刺、チラシ、パンフレットなど、印刷物からデジタルまで幅広く対応。\n\nブランドガイドラインに基づき、一貫性のあるビジュアルコミュニケーションを実現します。",
                'icon' => 'paint-brush',
                'status' => 'active',
                'sort_order' => 16,
                'is_featured' => false,
            ],
            // Excel業務効率化カテゴリのサービス
            [
                'name' => 'Excel業務効率化',
                'slug' => 'excel-productivity',
                'service_category_id' => $excelCategory->id,
                'description' => 'Excel業務の効率化を支援します。',
                'details' => "複雑なExcel作業を自動化し、業務効率を大幅に向上させます。マクロやVBAを活用したカスタムソリューションを提供。\n\nデータ分析やレポート作成も効率化し、意思決定のスピードを加速させます。",
                'icon' => 'paint-brush',
                'status' => 'active',
                'sort_order' => 17,
                'is_featured' => false,
            ],
            // デジタルマーケティング及びコンサルティングカテゴリのサービス
            [
                'name' => 'デジタルマーケティング',
                'slug' => 'digital-marketing',
                'service_category_id' => $marketingCategory->id,
                'description' => 'SEO対策・SNS運用・Web広告運用などのマーケティング支援を行います。',
                'details' => "SEO対策、SNS運用、Web広告運用など、デジタルマーケティング全般をサポート。データ分析に基づいた戦略立案で、効果的なマーケティング施策を実施。\n\nブランド認知度の向上や売上増加を目指し、継続的な改善と最適化を行います。",
                'icon' => 'magnifying-glass',
                'status' => 'active',
                'sort_order' => 18,
                'is_featured' => false,
            ],
            [
                'name' => 'ITコンサルティング',
                'slug' => 'it-consulting',
                'service_category_id' => $marketingCategory->id,
                'description' => 'IT戦略立案・システム導入支援・DX推進のコンサルティングを提供します。',
                'details' => "企業のIT戦略立案からシステム導入支援、DX推進まで幅広くサポート。業務プロセスの最適化と効率化を実現し、競争力の向上を目指します。\n\n最新の技術トレンドを踏まえた提案で、企業の成長を加速させます。",
                'icon' => 'lightbulb',
                'status' => 'active',
                'sort_order' => 19,
                'is_featured' => false,
            ],
            // IT教室カテゴリのサービス
            [
                'name' => 'プログラミング教室',
                'slug' => 'programming-school',
                'service_category_id' => $schoolCategory->id,
                'description' => '初心者から上級者まで対応したプログラミング教室を提供します。',
                'details' => "初心者向けの基礎コースから、上級者向けの応用コースまで幅広く対応。個別指導やオンライン授業も可能で、学習スタイルに合わせた柔軟なカリキュラムを提供します。",
                'icon' => 'academic-cap',
                'status' => 'active',
                'sort_order' => 20,
                'is_featured' => false,
            ],
            [
                'name' => 'パソコン教室',
                'slug' => 'computer-school',
                'service_category_id' => $schoolCategory->id,
                'description' => '初心者から上級者まで対応したパソコン教室を提供します。',
                'details' => "初心者向けの基礎コースから、上級者向けの応用コースまで幅広く対応。個別指導やオンライン授業も可能で、学習スタイルに合わせた柔軟なカリキュラムを提供します。",
                'icon' => 'academic-cap',
                'status' => 'active',
                'sort_order' => 21,
                'is_featured' => false,
            ]
        ];

        foreach ($services as $service) {
            Service::firstOrCreate(
                ['slug' => $service['slug']],
                $service
            );
        }
    }
}
