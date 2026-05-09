<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ServiceItem;
use App\Models\Service;
use App\Models\ServicePlan;

class ServiceItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // コーポレートサイト制作のアイテム
        $corporateWebsite = Service::where('slug', 'corporate-website')->first();
        if ($corporateWebsite) {
            $lightPlan = ServicePlan::where('slug', 'corporate-light')->first();
            $standardPlan = ServicePlan::where('slug', 'corporate-standard')->first();
            $premiumPlan = ServicePlan::where('slug', 'corporate-premium')->first();

            // ライトプランの項目
            if ($lightPlan) {
                ServiceItem::create([
                    'service_id' => $corporateWebsite->id,
                    'service_plan_id' => $lightPlan->id,
                    'item_type' => 'plan_base',
                    'name' => 'ライトプラン基本料金',
                    'description' => '5ページまでの基本的なコーポレートサイト制作',
                    'price' => 300000,
                    'estimated_days' => 30,
                    'is_required' => true,
                    'sort_order' => 1,
                    'status' => 'active',
                ]);

                ServiceItem::create([
                    'service_id' => $corporateWebsite->id,
                    'service_plan_id' => $lightPlan->id,
                    'item_type' => 'included',
                    'name' => 'レスポンシブデザイン',
                    'description' => 'スマートフォン・タブレット対応',
                    'price' => 0,
                    'estimated_days' => 0,
                    'is_required' => true,
                    'sort_order' => 2,
                    'status' => 'active',
                ]);

                ServiceItem::create([
                    'service_id' => $corporateWebsite->id,
                    'service_plan_id' => $lightPlan->id,
                    'item_type' => 'included',
                    'name' => '基本的なSEO対策',
                    'description' => 'メタタグ設定・構造化データ',
                    'price' => 0,
                    'estimated_days' => 0,
                    'is_required' => true,
                    'sort_order' => 3,
                    'status' => 'active',
                ]);

                ServiceItem::create([
                    'service_id' => $corporateWebsite->id,
                    'service_plan_id' => $lightPlan->id,
                    'item_type' => 'optional',
                    'name' => '追加ページ制作（1ページ）',
                    'description' => '5ページを超える追加ページ',
                    'price' => 30000,
                    'estimated_days' => 3,
                    'is_required' => false,
                    'sort_order' => 10,
                    'status' => 'active',
                ]);
            }

            // スタンダードプランの項目
            if ($standardPlan) {
                ServiceItem::create([
                    'service_id' => $corporateWebsite->id,
                    'service_plan_id' => $standardPlan->id,
                    'item_type' => 'plan_base',
                    'name' => 'スタンダードプラン基本料金',
                    'description' => '10ページまでの充実したコーポレートサイト制作',
                    'price' => 600000,
                    'estimated_days' => 45,
                    'is_required' => true,
                    'sort_order' => 1,
                    'status' => 'active',
                ]);

                ServiceItem::create([
                    'service_id' => $corporateWebsite->id,
                    'service_plan_id' => $standardPlan->id,
                    'item_type' => 'included',
                    'name' => 'レスポンシブデザイン',
                    'description' => 'スマートフォン・タブレット対応',
                    'price' => 0,
                    'estimated_days' => 0,
                    'is_required' => true,
                    'sort_order' => 2,
                    'status' => 'active',
                ]);

                ServiceItem::create([
                    'service_id' => $corporateWebsite->id,
                    'service_plan_id' => $standardPlan->id,
                    'item_type' => 'included',
                    'name' => '詳細なSEO対策',
                    'description' => 'キーワード調査・内部対策・外部対策',
                    'price' => 0,
                    'estimated_days' => 0,
                    'is_required' => true,
                    'sort_order' => 3,
                    'status' => 'active',
                ]);

                ServiceItem::create([
                    'service_id' => $corporateWebsite->id,
                    'service_plan_id' => $standardPlan->id,
                    'item_type' => 'included',
                    'name' => 'ブログ機能',
                    'description' => 'お知らせやブログ記事の投稿機能',
                    'price' => 0,
                    'estimated_days' => 0,
                    'is_required' => true,
                    'sort_order' => 4,
                    'status' => 'active',
                ]);

                ServiceItem::create([
                    'service_id' => $corporateWebsite->id,
                    'service_plan_id' => $standardPlan->id,
                    'item_type' => 'optional',
                    'name' => '追加ページ制作（1ページ）',
                    'description' => '10ページを超える追加ページ',
                    'price' => 40000,
                    'estimated_days' => 3,
                    'is_required' => false,
                    'sort_order' => 10,
                    'status' => 'active',
                ]);
            }

            // プレミアムプランの項目
            if ($premiumPlan) {
                ServiceItem::create([
                    'service_id' => $corporateWebsite->id,
                    'service_plan_id' => $premiumPlan->id,
                    'item_type' => 'plan_base',
                    'name' => 'プレミアムプラン基本料金',
                    'description' => '20ページまでの本格的なコーポレートサイト制作',
                    'price' => 1200000,
                    'estimated_days' => 60,
                    'is_required' => true,
                    'sort_order' => 1,
                    'status' => 'active',
                ]);

                ServiceItem::create([
                    'service_id' => $corporateWebsite->id,
                    'service_plan_id' => $premiumPlan->id,
                    'item_type' => 'included',
                    'name' => '高度なデザイン',
                    'description' => 'オリジナルイラスト・アニメーション含む',
                    'price' => 0,
                    'estimated_days' => 0,
                    'is_required' => true,
                    'sort_order' => 2,
                    'status' => 'active',
                ]);

                ServiceItem::create([
                    'service_id' => $corporateWebsite->id,
                    'service_plan_id' => $premiumPlan->id,
                    'item_type' => 'included',
                    'name' => '多言語対応（2言語）',
                    'description' => '日本語+英語または他言語',
                    'price' => 0,
                    'estimated_days' => 0,
                    'is_required' => true,
                    'sort_order' => 3,
                    'status' => 'active',
                ]);

                ServiceItem::create([
                    'service_id' => $corporateWebsite->id,
                    'service_plan_id' => $premiumPlan->id,
                    'item_type' => 'included',
                    'name' => 'CMS導入',
                    'description' => '管理画面からの簡単更新機能',
                    'price' => 0,
                    'estimated_days' => 0,
                    'is_required' => true,
                    'sort_order' => 4,
                    'status' => 'active',
                ]);

                ServiceItem::create([
                    'service_id' => $corporateWebsite->id,
                    'service_plan_id' => $premiumPlan->id,
                    'item_type' => 'optional',
                    'name' => '追加言語対応',
                    'description' => '3言語目以降の追加',
                    'price' => 150000,
                    'estimated_days' => 7,
                    'is_required' => false,
                    'sort_order' => 10,
                    'status' => 'active',
                ]);
            }

            // コーポレートサイト制作の全プラン共通オプション（addon）
            ServiceItem::create([
                'service_id' => $corporateWebsite->id,
                'service_plan_id' => null,
                'item_type' => 'addon',
                'name' => 'SSL証明書取得代行',
                'description' => 'HTTPS化のためのSSL証明書取得',
                'price' => 30000,
                'estimated_days' => 1,
                'is_required' => false,
                'sort_order' => 1,
                'status' => 'active',
            ]);

            ServiceItem::create([
                'service_id' => $corporateWebsite->id,
                'service_plan_id' => null,
                'item_type' => 'addon',
                'name' => 'Google Analytics設定',
                'description' => 'アクセス解析ツールの設定',
                'price' => 20000,
                'estimated_days' => 1,
                'is_required' => false,
                'sort_order' => 2,
                'status' => 'active',
            ]);

            ServiceItem::create([
                'service_id' => $corporateWebsite->id,
                'service_plan_id' => null,
                'item_type' => 'addon',
                'name' => 'サーバー・ドメイン設定代行',
                'description' => 'サーバー契約・ドメイン取得の代行',
                'price' => 50000,
                'estimated_days' => 2,
                'is_required' => false,
                'sort_order' => 3,
                'status' => 'active',
            ]);

            ServiceItem::create([
                'service_id' => $corporateWebsite->id,
                'service_plan_id' => null,
                'item_type' => 'addon',
                'name' => '保守サポート（月額）',
                'description' => '無料保守期間後の月額サポート',
                'price' => 10000,
                'estimated_days' => 0,
                'is_required' => false,
                'sort_order' => 4,
                'status' => 'active',
            ]);
        }

        // ECサイト構築のアイテム
        $ecommerce = Service::where('slug', 'ecommerce-development')->first();
        if ($ecommerce) {
            $smallPlan = ServicePlan::where('slug', 'ec-small')->first();
            $businessPlan = ServicePlan::where('slug', 'ec-business')->first();

            // スモールショッププランの項目
            if ($smallPlan) {
                ServiceItem::create([
                    'service_id' => $ecommerce->id,
                    'service_plan_id' => $smallPlan->id,
                    'item_type' => 'plan_base',
                    'name' => 'スモールショッププラン基本料金',
                    'description' => '商品数50点までの小規模ECサイト構築',
                    'price' => 500000,
                    'estimated_days' => 45,
                    'is_required' => true,
                    'sort_order' => 1,
                    'status' => 'active',
                ]);

                ServiceItem::create([
                    'service_id' => $ecommerce->id,
                    'service_plan_id' => $smallPlan->id,
                    'item_type' => 'included',
                    'name' => '商品管理機能',
                    'description' => '商品登録・編集・削除機能',
                    'price' => 0,
                    'estimated_days' => 0,
                    'is_required' => true,
                    'sort_order' => 2,
                    'status' => 'active',
                ]);

                ServiceItem::create([
                    'service_id' => $ecommerce->id,
                    'service_plan_id' => $smallPlan->id,
                    'item_type' => 'included',
                    'name' => '決済システム連携',
                    'description' => 'クレジットカード・コンビニ決済対応',
                    'price' => 0,
                    'estimated_days' => 0,
                    'is_required' => true,
                    'sort_order' => 3,
                    'status' => 'active',
                ]);

                ServiceItem::create([
                    'service_id' => $ecommerce->id,
                    'service_plan_id' => $smallPlan->id,
                    'item_type' => 'optional',
                    'name' => '商品数拡張（+50点）',
                    'description' => '登録可能商品数を50点追加',
                    'price' => 50000,
                    'estimated_days' => 0,
                    'is_required' => false,
                    'sort_order' => 10,
                    'status' => 'active',
                ]);
            }

            // ビジネスプランの項目
            if ($businessPlan) {
                ServiceItem::create([
                    'service_id' => $ecommerce->id,
                    'service_plan_id' => $businessPlan->id,
                    'item_type' => 'plan_base',
                    'name' => 'ビジネスプラン基本料金',
                    'description' => '商品数500点までの中規模ECサイト構築',
                    'price' => 1000000,
                    'estimated_days' => 60,
                    'is_required' => true,
                    'sort_order' => 1,
                    'status' => 'active',
                ]);

                ServiceItem::create([
                    'service_id' => $ecommerce->id,
                    'service_plan_id' => $businessPlan->id,
                    'item_type' => 'included',
                    'name' => '在庫管理機能',
                    'description' => 'リアルタイム在庫管理・自動発注',
                    'price' => 0,
                    'estimated_days' => 0,
                    'is_required' => true,
                    'sort_order' => 2,
                    'status' => 'active',
                ]);

                ServiceItem::create([
                    'service_id' => $ecommerce->id,
                    'service_plan_id' => $businessPlan->id,
                    'item_type' => 'included',
                    'name' => '顧客管理機能',
                    'description' => '会員管理・購入履歴管理',
                    'price' => 0,
                    'estimated_days' => 0,
                    'is_required' => true,
                    'sort_order' => 3,
                    'status' => 'active',
                ]);

                ServiceItem::create([
                    'service_id' => $ecommerce->id,
                    'service_plan_id' => $businessPlan->id,
                    'item_type' => 'optional',
                    'name' => 'メールマガジン機能',
                    'description' => '会員へのメール配信機能',
                    'price' => 100000,
                    'estimated_days' => 5,
                    'is_required' => false,
                    'sort_order' => 10,
                    'status' => 'active',
                ]);
            }

            // ECサイトの全プラン共通オプション（addon）
            ServiceItem::create([
                'service_id' => $ecommerce->id,
                'service_plan_id' => null,
                'item_type' => 'addon',
                'name' => '配送業者連携',
                'description' => 'ヤマト・佐川等の配送システム連携',
                'price' => 80000,
                'estimated_days' => 3,
                'is_required' => false,
                'sort_order' => 1,
                'status' => 'active',
            ]);

            ServiceItem::create([
                'service_id' => $ecommerce->id,
                'service_plan_id' => null,
                'item_type' => 'addon',
                'name' => 'ポイントシステム',
                'description' => '購入金額に応じたポイント付与機能',
                'price' => 150000,
                'estimated_days' => 7,
                'is_required' => false,
                'sort_order' => 2,
                'status' => 'active',
            ]);

            ServiceItem::create([
                'service_id' => $ecommerce->id,
                'service_plan_id' => null,
                'item_type' => 'addon',
                'name' => 'クーポン機能',
                'description' => '割引クーポンの発行・管理機能',
                'price' => 100000,
                'estimated_days' => 5,
                'is_required' => false,
                'sort_order' => 3,
                'status' => 'active',
            ]);
        }

        // ランディングページ制作のアイテム
        $landingPage = Service::where('slug', 'landing-page')->first();
        if ($landingPage) {
            $simplePlan = ServicePlan::where('slug', 'lp-simple')->first();
            $proPlan = ServicePlan::where('slug', 'lp-professional')->first();

            if ($simplePlan) {
                ServiceItem::create([
                    'service_id' => $landingPage->id,
                    'service_plan_id' => $simplePlan->id,
                    'item_type' => 'plan_base',
                    'name' => 'シンプルLP基本料金',
                    'description' => '1ページ完結のシンプルなランディングページ',
                    'price' => 150000,
                    'estimated_days' => 14,
                    'is_required' => true,
                    'sort_order' => 1,
                    'status' => 'active',
                ]);

                ServiceItem::create([
                    'service_id' => $landingPage->id,
                    'service_plan_id' => $simplePlan->id,
                    'item_type' => 'included',
                    'name' => 'レスポンシブデザイン',
                    'description' => 'スマートフォン最適化',
                    'price' => 0,
                    'estimated_days' => 0,
                    'is_required' => true,
                    'sort_order' => 2,
                    'status' => 'active',
                ]);
            }

            if ($proPlan) {
                ServiceItem::create([
                    'service_id' => $landingPage->id,
                    'service_plan_id' => $proPlan->id,
                    'item_type' => 'plan_base',
                    'name' => 'プロフェッショナルLP基本料金',
                    'description' => 'A/Bテスト対応のプロ仕様LP',
                    'price' => 300000,
                    'estimated_days' => 21,
                    'is_required' => true,
                    'sort_order' => 1,
                    'status' => 'active',
                ]);

                ServiceItem::create([
                    'service_id' => $landingPage->id,
                    'service_plan_id' => $proPlan->id,
                    'item_type' => 'included',
                    'name' => 'A/Bテスト設定',
                    'description' => '複数パターンの効果測定',
                    'price' => 0,
                    'estimated_days' => 0,
                    'is_required' => true,
                    'sort_order' => 2,
                    'status' => 'active',
                ]);
            }

            // LP共通オプション
            ServiceItem::create([
                'service_id' => $landingPage->id,
                'service_plan_id' => null,
                'item_type' => 'addon',
                'name' => '広告運用サポート',
                'description' => 'Google/Facebook広告の運用支援',
                'price' => 50000,
                'estimated_days' => 0,
                'is_required' => false,
                'sort_order' => 1,
                'status' => 'active',
            ]);
        }
    }
}
