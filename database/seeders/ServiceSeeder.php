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
        $webCategory = ServiceCategory::where('slug', 'web-development')->first();
        $systemCategory = ServiceCategory::where('slug', 'system-development')->first();
        $mobileCategory = ServiceCategory::where('slug', 'mobile-app-development')->first();
        $designCategory = ServiceCategory::where('slug', 'ui-ux-design')->first();
        $marketingCategory = ServiceCategory::where('slug', 'digital-marketing')->first();

        $services = [
            [
                'name' => 'コーポレートサイト制作',
                'slug' => 'corporate-website',
                'service_category_id' => $webCategory->id,
                'description' => '企業の信頼性を高める高品質なコーポレートサイトを制作します。',
                'details' => "現代的なデザインと使いやすいUIで、企業の魅力を最大限に表現します。レスポンシブデザインに対応し、スマートフォンからデスクトップまで全てのデバイスで美しく表示されます。\n\nSEO対策も万全で、検索エンジンでの上位表示を目指します。CMS機能により、お客様自身で簡単に更新が可能です。",
                'icon' => 'building-office',
                'features' => [
                    'レスポンシブデザイン',
                    'CMS機能',
                    'SEO対策',
                    '問い合わせフォーム',
                    'SSL対応',
                    '高速表示'
                ],
                'pricing' => [
                    [
                        'name' => 'ベーシック',
                        'price' => 300000,
                        'description' => '5ページまでの基本構成'
                    ],
                    [
                        'name' => 'スタンダード',
                        'price' => 500000,
                        'description' => '10ページまで + CMS機能'
                    ],
                    [
                        'name' => 'プレミアム',
                        'price' => 800000,
                        'description' => '無制限ページ + カスタム機能'
                    ]
                ],
                'demo_links' => [
                    [
                        'name' => 'デモサイト',
                        'url' => 'https://demo.example.com/corporate'
                    ]
                ],
                'technologies' => ['HTML5', 'CSS3', 'JavaScript', 'PHP', 'MySQL', 'WordPress'],
                'status' => 'active',
                'sort_order' => 1,
                'is_featured' => true,
                'is_active' => true,
            ],
            [
                'name' => 'ECサイト構築',
                'slug' => 'ecommerce-development',
                'service_category_id' => $webCategory->id,
                'description' => '売上向上を実現するECサイトを構築します。',
                'details' => "ユーザビリティを重視したECサイトで、購入率の向上を実現します。セキュアな決済システムと在庫管理機能を標準搭載。\n\n管理画面から商品登録、注文管理、顧客管理まで一元化できます。スマートフォンでのショッピング体験も最適化されています。",
                'icon' => 'shopping-cart',
                'features' => [
                    '商品管理システム',
                    '決済システム連携',
                    '在庫管理',
                    '顧客管理',
                    'クーポン機能',
                    'レビュー機能'
                ],
                'pricing' => [
                    [
                        'name' => 'スタンダード',
                        'price' => 800000,
                        'description' => '基本的なEC機能'
                    ],
                    [
                        'name' => 'プロ',
                        'price' => 1200000,
                        'description' => '高度な分析機能付き'
                    ]
                ],
                'technologies' => ['Laravel', 'Vue.js', 'MySQL', 'Stripe', 'AWS'],
                'status' => 'active',
                'sort_order' => 2,
                'is_featured' => true,
                'is_active' => true,
            ],
            [
                'name' => '業務管理システム',
                'slug' => 'business-management-system',
                'service_category_id' => $systemCategory->id,
                'description' => '業務効率化を実現するカスタムシステムを開発します。',
                'details' => "お客様の業務フローに合わせたオーダーメイドのシステムを開発します。既存システムとの連携も可能で、データの一元管理を実現します。\n\nクラウド対応により、どこからでもアクセス可能。セキュリティ対策も万全で、機密情報も安全に管理できます。",
                'icon' => 'clipboard-document-list',
                'features' => [
                    'カスタマイズ可能',
                    'クラウド対応',
                    'データ分析機能',
                    'ユーザー権限管理',
                    'API連携',
                    '自動バックアップ'
                ],
                'pricing' => [
                    [
                        'name' => '要見積',
                        'price' => 0,
                        'description' => 'ご要件に応じてお見積もり'
                    ]
                ],
                'technologies' => ['Laravel', 'React', 'PostgreSQL', 'Docker', 'AWS'],
                'status' => 'active',
                'sort_order' => 1,
                'is_featured' => false,
                'is_active' => true,
            ],
            [
                'name' => 'iOSアプリ開発',
                'slug' => 'ios-app-development',
                'service_category_id' => $mobileCategory->id,
                'description' => 'ユーザーフレンドリーなiOSアプリを開発します。',
                'details' => "Appleのデザインガイドラインに準拠した美しいiOSアプリを開発します。ネイティブ開発により、高いパフォーマンスと快適な操作性を実現。\n\nApp Storeでの公開サポートも含め、企画から運用まで一貫してサポートします。",
                'icon' => 'device-phone-mobile',
                'features' => [
                    'ネイティブ開発',
                    'プッシュ通知',
                    'オフライン対応',
                    'App Store最適化',
                    '分析機能',
                    'サポート体制'
                ],
                'pricing' => [
                    [
                        'name' => 'シンプル',
                        'price' => 600000,
                        'description' => '基本機能のアプリ'
                    ],
                    [
                        'name' => 'スタンダード',
                        'price' => 1000000,
                        'description' => '中程度の機能を持つアプリ'
                    ]
                ],
                'demo_links' => [
                    [
                        'name' => 'App Store',
                        'url' => 'https://apps.apple.com/jp/app/demo'
                    ]
                ],
                'technologies' => ['Swift', 'SwiftUI', 'Core Data', 'Firebase'],
                'status' => 'active',
                'sort_order' => 1,
                'is_featured' => true,
                'is_active' => true,
            ],
            [
                'name' => 'UIデザイン',
                'slug' => 'ui-design',
                'service_category_id' => $designCategory->id,
                'description' => '美しく使いやすいUIデザインを提供します。',
                'details' => "ユーザー体験を最優先に考えたUIデザインを提供します。ユーザビリティテストを重ね、直感的で使いやすいインターフェースを実現。\n\nブランドアイデンティティを反映した一貫性のあるデザインシステムを構築します。",
                'icon' => 'paint-brush',
                'features' => [
                    'ユーザビリティテスト',
                    'デザインシステム',
                    'プロトタイプ作成',
                    'レスポンシブ対応',
                    'アクセシビリティ',
                    'ブランディング'
                ],
                'pricing' => [
                    [
                        'name' => 'ベーシック',
                        'price' => 200000,
                        'description' => '基本的なUIデザイン'
                    ],
                    [
                        'name' => 'プレミアム',
                        'price' => 400000,
                        'description' => 'デザインシステム込み'
                    ]
                ],
                'technologies' => ['Figma', 'Adobe XD', 'Sketch', 'Principle'],
                'status' => 'active',
                'sort_order' => 1,
                'is_featured' => false,
                'is_active' => true,
            ],
            [
                'name' => 'SEO対策',
                'slug' => 'seo-optimization',
                'service_category_id' => $marketingCategory->id,
                'description' => '検索エンジンでの上位表示を実現します。',
                'details' => "最新のSEO手法を用いて、検索エンジンでの上位表示を実現します。キーワード分析から技術的SEO、コンテンツ最適化まで包括的にサポート。\n\n月次レポートにより効果を可視化し、継続的な改善を行います。",
                'icon' => 'magnifying-glass',
                'features' => [
                    'キーワード分析',
                    '技術的SEO',
                    'コンテンツ最適化',
                    '競合分析',
                    '月次レポート',
                    '継続サポート'
                ],
                'pricing' => [
                    [
                        'name' => '月額',
                        'price' => 100000,
                        'description' => '継続的なSEO対策'
                    ],
                    [
                        'name' => '初期設定',
                        'price' => 300000,
                        'description' => '包括的な初期設定'
                    ]
                ],
                'technologies' => ['Google Analytics', 'Search Console', 'SEMrush', 'Screaming Frog'],
                'status' => 'active',
                'sort_order' => 1,
                'is_featured' => false,
                'is_active' => true,
            ],
        ];

        foreach ($services as $service) {
            Service::firstOrCreate(
                ['slug' => $service['slug']],
                $service
            );
        }
    }
}
