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
                'status' => 'active',
                'sort_order' => 1,
                'is_featured' => true,
            ],
            [
                'name' => 'ECサイト構築',
                'slug' => 'ecommerce-development',
                'service_category_id' => $webCategory->id,
                'description' => '売上向上を実現するECサイトを構築します。',
                'details' => "ユーザビリティを重視したECサイトで、購入率の向上を実現します。セキュアな決済システムと在庫管理機能を標準搭載。\n\n管理画面から商品登録、注文管理、顧客管理まで一元化できます。スマートフォンでのショッピング体験も最適化されています。",
                'icon' => 'shopping-cart',
                'status' => 'active',
                'sort_order' => 2,
                'is_featured' => true,
            ],
            [
                'name' => 'ランディングページ制作',
                'slug' => 'landing-page',
                'service_category_id' => $webCategory->id,
                'description' => 'コンバージョンを最大化するランディングページを制作します。',
                'details' => "マーケティング戦略に基づいた、効果的なランディングページを制作します。A/Bテストにも対応し、継続的な改善が可能です。",
                'icon' => 'document-text',
                'status' => 'active',
                'sort_order' => 3,
                'is_featured' => false,
            ],
            [
                'name' => '業務管理システム',
                'slug' => 'business-management-system',
                'service_category_id' => $systemCategory->id,
                'description' => '業務効率化を実現するカスタムシステムを開発します。',
                'details' => "お客様の業務フローに合わせたオーダーメイドのシステムを開発します。既存システムとの連携も可能で、データの一元管理を実現します。\n\nクラウド対応により、どこからでもアクセス可能。セキュリティ対策も万全で、機密情報も安全に管理できます。",
                'icon' => 'clipboard-document-list',
                'status' => 'active',
                'sort_order' => 1,
                'is_featured' => true,
            ],
            [
                'name' => '在庫管理システム',
                'slug' => 'inventory-management-system',
                'service_category_id' => $systemCategory->id,
                'description' => 'リアルタイムで在庫を管理できるシステムを構築します。',
                'details' => "バーコードやQRコード対応で、スムーズな在庫管理を実現。発注点管理や棚卸機能も充実しています。",
                'icon' => 'cube',
                'status' => 'active',
                'sort_order' => 2,
                'is_featured' => false,
            ],
            [
                'name' => 'iOSアプリ開発',
                'slug' => 'ios-app-development',
                'service_category_id' => $mobileCategory->id,
                'description' => 'ユーザーフレンドリーなiOSアプリを開発します。',
                'details' => "Appleのデザインガイドラインに準拠した美しいiOSアプリを開発します。ネイティブ開発により、高いパフォーマンスと快適な操作性を実現。\n\nApp Storeでの公開サポートも含め、企画から運用まで一貫してサポートします。",
                'icon' => 'device-phone-mobile',
                'status' => 'active',
                'sort_order' => 1,
                'is_featured' => true,
            ],
            [
                'name' => 'Androidアプリ開発',
                'slug' => 'android-app-development',
                'service_category_id' => $mobileCategory->id,
                'description' => '幅広いデバイスに対応したAndroidアプリを開発します。',
                'details' => "Kotlin/Javaを使用した高品質なAndroidアプリ開発。Google Playでの公開までサポートします。",
                'icon' => 'device-tablet',
                'status' => 'active',
                'sort_order' => 2,
                'is_featured' => false,
            ],
            [
                'name' => 'クロスプラットフォームアプリ',
                'slug' => 'cross-platform-app',
                'service_category_id' => $mobileCategory->id,
                'description' => 'iOS・Android両対応のアプリを効率的に開発します。',
                'details' => "React Native または Flutter を使用し、一つのコードベースでiOS・Android両方に対応。開発コストを抑えながら高品質なアプリを提供します。",
                'icon' => 'device-phone-mobile',
                'status' => 'active',
                'sort_order' => 3,
                'is_featured' => false,
            ],
            [
                'name' => 'UIデザイン',
                'slug' => 'ui-design',
                'service_category_id' => $designCategory->id,
                'description' => '美しく使いやすいUIデザインを提供します。',
                'details' => "ユーザー体験を最優先に考えたUIデザインを提供します。ユーザビリティテストを重ね、直感的で使いやすいインターフェースを実現。\n\nブランドアイデンティティを反映した一貫性のあるデザインシステムを構築します。",
                'icon' => 'paint-brush',
                'status' => 'active',
                'sort_order' => 1,
                'is_featured' => true,
            ],
            [
                'name' => 'UXリサーチ',
                'slug' => 'ux-research',
                'service_category_id' => $designCategory->id,
                'description' => 'データに基づいた UX 改善を提案します。',
                'details' => "ユーザーインタビューやユーザビリティテストを通じて、課題を発見し改善策を提案します。",
                'icon' => 'chart-bar',
                'status' => 'active',
                'sort_order' => 2,
                'is_featured' => false,
            ],
            [
                'name' => 'ブランディング',
                'slug' => 'branding',
                'service_category_id' => $designCategory->id,
                'description' => '企業のブランド価値を高めるデザインを提供します。',
                'details' => "ロゴデザインから、ビジュアルアイデンティティまで一貫したブランディングをサポートします。",
                'icon' => 'sparkles',
                'status' => 'active',
                'sort_order' => 3,
                'is_featured' => false,
            ],
            [
                'name' => 'SEO対策',
                'slug' => 'seo-optimization',
                'service_category_id' => $marketingCategory->id,
                'description' => '検索エンジンでの上位表示を実現します。',
                'details' => "最新のSEO手法を用いて、検索エンジンでの上位表示を実現します。キーワード分析から技術的SEO、コンテンツ最適化まで包括的にサポート。\n\n月次レポートにより効果を可視化し、継続的な改善を行います。",
                'icon' => 'magnifying-glass',
                'status' => 'active',
                'sort_order' => 1,
                'is_featured' => true,
            ],
            [
                'name' => 'SNS運用代行',
                'slug' => 'sns-management',
                'service_category_id' => $marketingCategory->id,
                'description' => '効果的なSNS運用で、ブランド認知度を向上させます。',
                'details' => "Instagram、Twitter、FacebookなどのSNSアカウントを効果的に運用。投稿企画から分析まで一貫してサポートします。",
                'icon' => 'chat-bubble-left-right',
                'status' => 'active',
                'sort_order' => 2,
                'is_featured' => false,
            ],
            [
                'name' => 'Web広告運用',
                'slug' => 'web-advertising',
                'service_category_id' => $marketingCategory->id,
                'description' => 'Google広告やSNS広告の運用を最適化します。',
                'details' => "データ分析に基づいた広告運用で、費用対効果を最大化。A/Bテストを繰り返し、継続的に改善します。",
                'icon' => 'megaphone',
                'status' => 'active',
                'sort_order' => 3,
                'is_featured' => false,
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
