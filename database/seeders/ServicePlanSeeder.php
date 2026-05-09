<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ServicePlan;
use App\Models\Service;

class ServicePlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // コーポレートサイト制作のプラン
        $corporateWebsite = Service::where('slug', 'corporate-website')->first();
        if ($corporateWebsite) {
            ServicePlan::create([
                'name' => 'ライトプラン',
                'slug' => 'corporate-light',
                'service_id' => $corporateWebsite->id,
                'description' => '小規模企業向けの基本的なコーポレートサイト',
                'details' => "5ページまでの構成で、企業の基本情報を掲載するシンプルなプランです。\n\n含まれるもの：\n- レスポンシブデザイン\n- 基本的なSEO対策\n- お問い合わせフォーム\n- 1ヶ月の無料保守",
                'base_price' => 300000,
                'billing_cycle' => 'one_time',
                'setup_fee' => 0,
                'max_revisions' => 2,
                'estimated_delivery_days' => 30,
                'status' => 'active',
                'is_featured' => false,
                'sort_order' => 1,
                'color' => '#3B82F6',
                'badge_text' => null,
                'icon' => null,
            ]);

            ServicePlan::create([
                'name' => 'スタンダードプラン',
                'slug' => 'corporate-standard',
                'service_id' => $corporateWebsite->id,
                'description' => '中規模企業向けの充実したコーポレートサイト',
                'details' => "10ページまでの構成で、企業の魅力を十分に伝えられるプランです。\n\n含まれるもの：\n- レスポンシブデザイン\n- SEO対策（詳細設定）\n- お問い合わせフォーム\n- ブログ機能\n- 3ヶ月の無料保守",
                'base_price' => 600000,
                'billing_cycle' => 'one_time',
                'setup_fee' => 0,
                'max_revisions' => 3,
                'estimated_delivery_days' => 45,
                'status' => 'active',
                'is_featured' => true,
                'sort_order' => 2,
                'color' => '#10B981',
                'badge_text' => '人気',
                'icon' => null,
            ]);

            ServicePlan::create([
                'name' => 'プレミアムプラン',
                'slug' => 'corporate-premium',
                'service_id' => $corporateWebsite->id,
                'description' => '大規模企業向けの本格的なコーポレートサイト',
                'details' => "20ページまでの構成で、多言語対応や高度な機能を含む本格的なプランです。\n\n含まれるもの：\n- 高度なデザイン\n- 詳細なSEO対策\n- 多言語対応（2言語）\n- CMS導入\n- 6ヶ月の無料保守",
                'base_price' => 1200000,
                'billing_cycle' => 'one_time',
                'setup_fee' => 100000,
                'max_revisions' => 5,
                'estimated_delivery_days' => 60,
                'status' => 'active',
                'is_featured' => false,
                'sort_order' => 3,
                'color' => '#8B5CF6',
                'badge_text' => null,
                'icon' => null,
            ]);
        }

        // ECサイト構築のプラン
        $ecommerce = Service::where('slug', 'ecommerce-development')->first();
        if ($ecommerce) {
            ServicePlan::create([
                'name' => 'スモールショッププラン',
                'slug' => 'ec-small',
                'service_id' => $ecommerce->id,
                'description' => '小規模ECサイト向けの基本プラン',
                'details' => "商品数50点までの小規模ECサイトに最適なプランです。",
                'base_price' => 500000,
                'billing_cycle' => 'one_time',
                'setup_fee' => 50000,
                'max_revisions' => 3,
                'estimated_delivery_days' => 45,
                'status' => 'active',
                'is_featured' => false,
                'sort_order' => 1,
                'color' => '#F59E0B',
                'badge_text' => null,
                'icon' => null,
            ]);

            ServicePlan::create([
                'name' => 'ビジネスプラン',
                'slug' => 'ec-business',
                'service_id' => $ecommerce->id,
                'description' => '中規模ECサイト向けの標準プラン',
                'details' => "商品数500点までの中規模ECサイトに対応。在庫管理や顧客管理機能も充実。",
                'base_price' => 1000000,
                'billing_cycle' => 'one_time',
                'setup_fee' => 100000,
                'max_revisions' => 4,
                'estimated_delivery_days' => 60,
                'status' => 'active',
                'is_featured' => true,
                'sort_order' => 2,
                'color' => '#EF4444',
                'badge_text' => 'おすすめ',
                'icon' => null,
            ]);

            ServicePlan::create([
                'name' => 'エンタープライズプラン',
                'slug' => 'ec-enterprise',
                'service_id' => $ecommerce->id,
                'description' => '大規模ECサイト向けのフルカスタマイズプラン',
                'details' => "商品数無制限の大規模ECサイトに対応。基幹システム連携も可能。",
                'base_price' => 2000000,
                'billing_cycle' => 'one_time',
                'setup_fee' => 200000,
                'max_revisions' => 5,
                'estimated_delivery_days' => 90,
                'status' => 'active',
                'is_featured' => false,
                'sort_order' => 3,
                'color' => '#6366F1',
                'badge_text' => null,
                'icon' => null,
            ]);
        }

        // ランディングページ制作のプラン
        $landingPage = Service::where('slug', 'landing-page')->first();
        if ($landingPage) {
            ServicePlan::create([
                'name' => 'シンプルLP',
                'slug' => 'lp-simple',
                'service_id' => $landingPage->id,
                'description' => '1ページ完結の基本的なランディングページ',
                'details' => "シンプルで効果的な1ページ構成のLPです。",
                'base_price' => 150000,
                'billing_cycle' => 'one_time',
                'setup_fee' => 0,
                'max_revisions' => 2,
                'estimated_delivery_days' => 14,
                'status' => 'active',
                'is_featured' => false,
                'sort_order' => 1,
                'color' => '#06B6D4',
                'badge_text' => null,
                'icon' => null,
            ]);

            ServicePlan::create([
                'name' => 'プロフェッショナルLP',
                'slug' => 'lp-professional',
                'service_id' => $landingPage->id,
                'description' => 'コンバージョン最適化されたランディングページ',
                'details' => "A/Bテスト対応で、継続的な改善が可能なLPです。",
                'base_price' => 300000,
                'billing_cycle' => 'one_time',
                'setup_fee' => 0,
                'max_revisions' => 3,
                'estimated_delivery_days' => 21,
                'status' => 'active',
                'is_featured' => true,
                'sort_order' => 2,
                'color' => '#EC4899',
                'badge_text' => '人気',
                'icon' => null,
            ]);
        }

        // 業務管理システムのプラン
        $businessSystem = Service::where('slug', 'business-management-system')->first();
        if ($businessSystem) {
            ServicePlan::create([
                'name' => 'ベーシックシステム',
                'slug' => 'bms-basic',
                'service_id' => $businessSystem->id,
                'description' => '小規模向けの基本的な業務管理システム',
                'details' => "5ユーザーまで利用可能な基本システムです。",
                'base_price' => 800000,
                'billing_cycle' => 'one_time',
                'setup_fee' => 100000,
                'max_revisions' => 3,
                'estimated_delivery_days' => 60,
                'status' => 'active',
                'is_featured' => false,
                'sort_order' => 1,
                'color' => '#14B8A6',
                'badge_text' => null,
                'icon' => null,
            ]);

            ServicePlan::create([
                'name' => 'スタンダードシステム',
                'slug' => 'bms-standard',
                'service_id' => $businessSystem->id,
                'description' => '中規模向けの標準的な業務管理システム',
                'details' => "20ユーザーまで利用可能で、カスタマイズにも対応。",
                'base_price' => 1500000,
                'billing_cycle' => 'one_time',
                'setup_fee' => 150000,
                'max_revisions' => 4,
                'estimated_delivery_days' => 90,
                'status' => 'active',
                'is_featured' => true,
                'sort_order' => 2,
                'color' => '#10B981',
                'badge_text' => 'おすすめ',
                'icon' => null,
            ]);

            ServicePlan::create([
                'name' => 'エンタープライズシステム',
                'slug' => 'bms-enterprise',
                'service_id' => $businessSystem->id,
                'description' => '大規模向けのフルカスタマイズシステム',
                'details' => "無制限ユーザー、基幹システム連携も対応。",
                'base_price' => 3000000,
                'billing_cycle' => 'one_time',
                'setup_fee' => 300000,
                'max_revisions' => 5,
                'estimated_delivery_days' => 120,
                'status' => 'active',
                'is_featured' => false,
                'sort_order' => 3,
                'color' => '#8B5CF6',
                'badge_text' => null,
                'icon' => null,
            ]);
        }

        // iOSアプリ開発のプラン
        $iosApp = Service::where('slug', 'ios-app-development')->first();
        if ($iosApp) {
            ServicePlan::create([
                'name' => 'ベーシックアプリ',
                'slug' => 'ios-basic',
                'service_id' => $iosApp->id,
                'description' => '基本機能を持ったシンプルなiOSアプリ',
                'details' => "5画面程度の基本的なアプリ開発です。",
                'base_price' => 800000,
                'billing_cycle' => 'one_time',
                'setup_fee' => 0,
                'max_revisions' => 3,
                'estimated_delivery_days' => 60,
                'status' => 'active',
                'is_featured' => false,
                'sort_order' => 1,
                'color' => '#3B82F6',
                'badge_text' => null,
                'icon' => null,
            ]);

            ServicePlan::create([
                'name' => 'スタンダードアプリ',
                'slug' => 'ios-standard',
                'service_id' => $iosApp->id,
                'description' => '充実した機能を持つiOSアプリ',
                'details' => "10画面程度で、サーバー連携やプッシュ通知にも対応。",
                'base_price' => 1500000,
                'billing_cycle' => 'one_time',
                'setup_fee' => 100000,
                'max_revisions' => 4,
                'estimated_delivery_days' => 90,
                'status' => 'active',
                'is_featured' => true,
                'sort_order' => 2,
                'color' => '#10B981',
                'badge_text' => '人気',
                'icon' => null,
            ]);
        }

        $this->command->info('ServicePlan seeder completed successfully!');
    }
}
