<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ServiceType;
use App\Models\ServiceCategory;

class ServiceTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // サービスカテゴリーの取得
        $webDev = ServiceCategory::where('slug', 'web-development')->first();
        $systemDev = ServiceCategory::where('slug', 'system-development')->first();
        $mobileDev = ServiceCategory::where('slug', 'mobile-app-development')->first();
        $uiuxDesign = ServiceCategory::where('slug', 'ui-ux-design')->first();
        $marketing = ServiceCategory::where('slug', 'digital-marketing')->first();
        $consulting = ServiceCategory::where('slug', 'it-consulting')->first();
        $maintenance = ServiceCategory::where('slug', 'system-maintenance')->first();

        $serviceTypes = [
            // Webサイト制作
            [
                'service_category_id' => $webDev?->id,
                'name' => 'コーポレートサイト制作',
                'slug' => 'corporate-website',
                'description' => '企業の信頼性を高める高品質なコーポレートサイトを制作します。',
                'detailed_description' => '企業の顔となるコーポレートサイトを、ブランドイメージに合わせてデザイン・制作いたします。レスポンシブ対応、SEO対策、CMSによる更新システムも含まれます。',
                'product_name' => 'Spra Corporate',
                'version' => '1.0',
                'pricing_model' => 'fixed',
                'base_price' => 800000,
                'price_unit' => '式',
                'features' => ['レスポンシブデザイン', 'CMS導入', 'SEO対策', 'お問い合わせフォーム', 'SSL証明書設定'],
                'target_audience' => ['中小企業', '上場企業', 'スタートアップ'],
                'deliverables' => ['Webサイト一式', '管理画面', 'マニュアル', '保守サポート（3ヶ月）'],
                'technologies' => ['HTML5', 'CSS3', 'JavaScript', 'PHP', 'WordPress'],
                'estimated_delivery_days' => 45,
                'color' => '#3B82F6',
                'icon' => 'globe-alt',
                'sort_order' => 1,
                'is_active' => true,
                'is_featured' => true,
                'requires_consultation' => false,
            ],
            [
                'service_category_id' => $webDev?->id,
                'name' => 'ECサイト構築',
                'slug' => 'ecommerce-website',
                'description' => '売上向上を実現するECサイトを構築します。',
                'detailed_description' => 'オンライン販売に最適化されたECサイトを構築。決済システム、在庫管理、顧客管理機能を含む包括的なソリューションを提供します。',
                'product_name' => 'Spra Commerce',
                'version' => '2.1',
                'pricing_model' => 'custom',
                'base_price' => 1500000,
                'price_unit' => '式',
                'features' => ['商品管理システム', '決済システム連携', '在庫管理', '顧客管理', 'レポート機能'],
                'target_audience' => ['小売業', 'メーカー', 'サービス業'],
                'deliverables' => ['ECサイト一式', '管理システム', '運用マニュアル', '保守サポート（6ヶ月）'],
                'technologies' => ['PHP', 'Laravel', 'Vue.js', 'MySQL', 'Stripe'],
                'estimated_delivery_days' => 90,
                'color' => '#10B981',
                'icon' => 'shopping-cart',
                'sort_order' => 2,
                'is_active' => true,
                'is_featured' => true,
                'requires_consultation' => true,
                'consultation_note' => '商品規模や機能要件により価格が変動します。',
            ],
            [
                'service_category_id' => $webDev?->id,
                'name' => 'ランディングページ制作',
                'slug' => 'landing-page',
                'description' => 'コンバージョン率を最大化するランディングページを制作します。',
                'detailed_description' => '商品・サービスの魅力を最大限に伝え、コンバージョン率向上を目指したランディングページを制作します。',
                'product_name' => 'Spra Landing',
                'version' => '1.5',
                'pricing_model' => 'fixed',
                'base_price' => 300000,
                'price_unit' => 'ページ',
                'features' => ['高コンバージョンデザイン', 'A/Bテスト対応', 'フォーム最適化', 'アナリティクス設定'],
                'target_audience' => ['マーケティング担当者', '広告代理店', 'スタートアップ'],
                'deliverables' => ['ランディングページ', 'スマホ対応', 'アナリティクス設定'],
                'technologies' => ['HTML5', 'CSS3', 'JavaScript', 'Google Analytics'],
                'estimated_delivery_days' => 14,
                'color' => '#F59E0B',
                'icon' => 'cursor-arrow-rays',
                'sort_order' => 3,
                'is_active' => true,
                'is_featured' => false,
                'requires_consultation' => false,
            ],

            // システム開発
            [
                'service_category_id' => $systemDev?->id,
                'name' => '業務管理システム開発',
                'slug' => 'business-management-system',
                'description' => '業務効率化を実現するカスタム業務管理システムを開発します。',
                'detailed_description' => '企業の業務フローに合わせたオーダーメイドの業務管理システムを開発。生産性向上と業務効率化を実現します。',
                'product_name' => 'Spra Business',
                'version' => '3.0',
                'pricing_model' => 'custom',
                'base_price' => 2000000,
                'price_unit' => '式',
                'features' => ['顧客管理', '案件管理', '売上管理', 'レポート機能', 'ユーザー権限管理'],
                'target_audience' => ['中小企業', 'サービス業', '製造業'],
                'deliverables' => ['Webアプリケーション', '管理機能', 'ユーザーマニュアル', '保守サポート（1年）'],
                'technologies' => ['PHP', 'Laravel', 'React', 'MySQL', 'Docker'],
                'estimated_delivery_days' => 120,
                'color' => '#8B5CF6',
                'icon' => 'cog-6-tooth',
                'sort_order' => 4,
                'is_active' => true,
                'is_featured' => true,
                'requires_consultation' => true,
                'consultation_note' => '業務要件により開発規模が大きく変動します。',
            ],

            // モバイルアプリ開発
            [
                'service_category_id' => $mobileDev?->id,
                'name' => 'iOSアプリ開発',
                'slug' => 'ios-app-development',
                'description' => 'App Storeでの成功を目指すiOSアプリを開発します。',
                'detailed_description' => 'SwiftとSwiftUIを使用した高品質なiOSアプリを開発。App Storeの審査通過からリリース後のサポートまで包括的に対応します。',
                'product_name' => 'Spra iOS',
                'version' => '1.0',
                'pricing_model' => 'custom',
                'base_price' => 1200000,
                'price_unit' => '式',
                'features' => ['ネイティブアプリ', 'App Store申請サポート', 'プッシュ通知', 'オフライン対応'],
                'target_audience' => ['スタートアップ', '小売業', 'サービス業'],
                'deliverables' => ['iOSアプリ', 'App Store申請', 'ソースコード', '運用マニュアル'],
                'technologies' => ['Swift', 'SwiftUI', 'Core Data', 'Firebase'],
                'estimated_delivery_days' => 90,
                'color' => '#000000',
                'icon' => 'device-phone-mobile',
                'sort_order' => 5,
                'is_active' => true,
                'is_featured' => false,
                'requires_consultation' => true,
            ],

            // UI/UXデザイン
            [
                'service_category_id' => $uiuxDesign?->id,
                'name' => 'UI/UXデザイン設計',
                'slug' => 'ui-ux-design',
                'description' => 'ユーザビリティを重視したUI/UXデザインを提供します。',
                'detailed_description' => 'ユーザー体験を最適化するUI/UXデザインを設計。ユーザビリティテストとデザインシステム構築も含まれます。',
                'product_name' => 'Spra Design',
                'version' => '2.0',
                'pricing_model' => 'fixed',
                'base_price' => 500000,
                'price_unit' => '式',
                'features' => ['ユーザビリティテスト', 'プロトタイプ作成', 'デザインシステム', 'アクセシビリティ対応'],
                'target_audience' => ['スタートアップ', 'Webサービス', 'アプリ開発企業'],
                'deliverables' => ['デザインカンプ', 'プロトタイプ', 'デザインガイドライン'],
                'technologies' => ['Figma', 'Adobe XD', 'Sketch', 'InVision'],
                'estimated_delivery_days' => 30,
                'color' => '#EF4444',
                'icon' => 'paint-brush',
                'sort_order' => 6,
                'is_active' => true,
                'is_featured' => false,
                'requires_consultation' => false,
            ],

            // デジタルマーケティング
            [
                'service_category_id' => $marketing?->id,
                'name' => 'SEO対策サービス',
                'slug' => 'seo-optimization',
                'description' => '検索エンジンでの上位表示を実現するSEO対策を行います。',
                'detailed_description' => 'キーワード分析から内部対策、外部対策まで包括的なSEO対策を実施。継続的な改善により検索順位向上を目指します。',
                'product_name' => 'Spra SEO',
                'version' => '1.2',
                'pricing_model' => 'subscription',
                'base_price' => 100000,
                'price_unit' => '月',
                'features' => ['キーワード分析', '内部SEO対策', 'コンテンツ最適化', '競合分析', '月次レポート'],
                'target_audience' => ['EC事業者', 'コンテンツメディア', 'サービス業'],
                'deliverables' => ['SEO分析レポート', '対策提案書', '月次進捗レポート'],
                'technologies' => ['Google Analytics', 'Search Console', 'SEMrush', 'Ahrefs'],
                'estimated_delivery_days' => 180,
                'color' => '#059669',
                'icon' => 'magnifying-glass',
                'sort_order' => 7,
                'is_active' => true,
                'is_featured' => false,
                'requires_consultation' => false,
            ],

            // ITコンサルティング
            [
                'service_category_id' => $consulting?->id,
                'name' => 'DX推進コンサルティング',
                'slug' => 'dx-consulting',
                'description' => 'デジタルトランスフォーメーションの実現をサポートします。',
                'detailed_description' => '企業のDX推進を戦略立案から実行まで一貫してサポート。現状分析、ロードマップ作成、システム選定・導入支援を行います。',
                'product_name' => 'Spra DX',
                'version' => '1.0',
                'pricing_model' => 'custom',
                'base_price' => 1000000,
                'price_unit' => '式',
                'features' => ['現状分析', 'DX戦略立案', 'ロードマップ作成', 'システム選定', '導入支援'],
                'target_audience' => ['中小企業', '製造業', 'サービス業'],
                'deliverables' => ['現状分析レポート', 'DX戦略書', 'ロードマップ', '導入支援'],
                'technologies' => ['クラウドサービス', 'SaaS', 'RPA', 'AI/ML'],
                'estimated_delivery_days' => 90,
                'color' => '#7C3AED',
                'icon' => 'lightbulb',
                'sort_order' => 8,
                'is_active' => true,
                'is_featured' => false,
                'requires_consultation' => true,
            ],

            // システム保守・運用
            [
                'service_category_id' => $maintenance?->id,
                'name' => 'Webサイト保守・運用',
                'slug' => 'website-maintenance',
                'description' => 'Webサイトの安定稼働と継続的な改善をサポートします。',
                'detailed_description' => 'Webサイトのセキュリティ管理、パフォーマンス監視、定期的なアップデートにより、安定稼働を保証します。',
                'product_name' => 'Spra Maintenance',
                'version' => '1.3',
                'pricing_model' => 'subscription',
                'base_price' => 50000,
                'price_unit' => '月',
                'features' => ['セキュリティ監視', 'バックアップ取得', 'パフォーマンス監視', '定期アップデート', '24時間サポート'],
                'target_audience' => ['Webサイト運営者', 'EC事業者', '企業'],
                'deliverables' => ['監視レポート', 'セキュリティレポート', '月次作業報告'],
                'technologies' => ['WordPress', 'SSL', 'CDN', 'monitoring tools'],
                'estimated_delivery_days' => 365,
                'color' => '#F97316',
                'icon' => 'shield-check',
                'sort_order' => 9,
                'is_active' => true,
                'is_featured' => false,
                'requires_consultation' => false,
            ],
        ];

        foreach ($serviceTypes as $serviceType) {
            ServiceType::firstOrCreate(
                ['slug' => $serviceType['slug']],
                array_merge($serviceType, [
                    'created_by' => 1, // 管理者ID（存在する場合）
                    'published_at' => now(),
                ])
            );
        }
    }
}
