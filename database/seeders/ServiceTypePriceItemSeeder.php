<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ServiceType;
use App\Models\ServiceTypePriceItem;

class ServiceTypePriceItemSeeder extends Seeder
{
  /**
   * Run the database seeds.
   */
  public function run(): void
  {
    // コーポレートサイト制作の価格内訳 (合計: 800,000円)
    $corporateWebsite = ServiceType::where('slug', 'corporate-website')->first();
    if ($corporateWebsite) {
      $corporatePriceItems = [
        [
          'category' => 'design',
          'name' => 'Webデザイン設計',
          'description' => 'トップページ + 下層ページ5ページのデザイン制作',
          'price' => 180000,
          'unit' => '式',
          'quantity' => 1,
          'sort_order' => 1,
        ],
        [
          'category' => 'coding',
          'name' => 'HTML/CSSコーディング',
          'description' => 'レスポンシブ対応コーディング（6ページ分）',
          'price' => 240000,
          'unit' => '式',
          'quantity' => 1,
          'sort_order' => 2,
        ],
        [
          'category' => 'coding',
          'name' => 'CMS構築',
          'description' => 'WordPressによるCMS構築・カスタマイズ',
          'price' => 150000,
          'unit' => '式',
          'quantity' => 1,
          'sort_order' => 3,
        ],
        [
          'category' => 'infrastructure',
          'name' => 'サーバー環境構築',
          'description' => 'レンタルサーバー設定・SSL証明書導入',
          'price' => 80000,
          'unit' => '式',
          'quantity' => 1,
          'sort_order' => 4,
        ],
        [
          'category' => 'content',
          'name' => 'お問い合わせフォーム',
          'description' => 'お問い合わせフォーム制作・設定',
          'price' => 60000,
          'unit' => '式',
          'quantity' => 1,
          'sort_order' => 5,
        ],
        [
          'category' => 'testing',
          'name' => '動作確認・検証',
          'description' => 'クロスブラウザ確認・スマホ対応確認',
          'price' => 50000,
          'unit' => '式',
          'quantity' => 1,
          'sort_order' => 6,
        ],
        [
          'category' => 'management',
          'name' => 'プロジェクト管理',
          'description' => '進行管理・品質管理・納期管理',
          'price' => 40000,
          'unit' => '式',
          'quantity' => 1,
          'sort_order' => 7,
        ],
      ];

      foreach ($corporatePriceItems as $item) {
        ServiceTypePriceItem::create(array_merge($item, [
          'service_type_id' => $corporateWebsite->id,
        ]));
      }
    }

    // ECサイト構築の価格内訳 (合計: 1,500,000円)
    $ecommerceSite = ServiceType::where('slug', 'ecommerce-website')->first();
    if ($ecommerceSite) {
      $ecommercePriceItems = [
        [
          'category' => 'design',
          'name' => 'ECサイトデザイン',
          'description' => 'ユーザビリティを重視したECサイトデザイン',
          'price' => 300000,
          'unit' => '式',
          'quantity' => 1,
          'sort_order' => 1,
        ],
        [
          'category' => 'coding',
          'name' => 'ECシステム構築',
          'description' => 'Laravel + Stripeによる決済システム構築',
          'price' => 600000,
          'unit' => '式',
          'quantity' => 1,
          'sort_order' => 2,
        ],
        [
          'category' => 'coding',
          'name' => '管理画面開発',
          'description' => '商品管理・注文管理・顧客管理画面',
          'price' => 350000,
          'unit' => '式',
          'quantity' => 1,
          'sort_order' => 3,
        ],
        [
          'category' => 'infrastructure',
          'name' => 'サーバー環境構築',
          'description' => 'クラウドサーバー設定・セキュリティ対策',
          'price' => 150000,
          'unit' => '式',
          'quantity' => 1,
          'sort_order' => 4,
        ],
        [
          'category' => 'testing',
          'name' => '決済テスト・検証',
          'description' => '決済フロー確認・セキュリティテスト',
          'price' => 100000,
          'unit' => '式',
          'quantity' => 1,
          'sort_order' => 5,
        ],
      ];

      foreach ($ecommercePriceItems as $item) {
        ServiceTypePriceItem::create(array_merge($item, [
          'service_type_id' => $ecommerceSite->id,
        ]));
      }
    }

    // ランディングページ制作の価格内訳 (合計: 300,000円)
    $landingPage = ServiceType::where('slug', 'landing-page')->first();
    if ($landingPage) {
      $landingPriceItems = [
        [
          'category' => 'design',
          'name' => 'LPデザイン設計',
          'description' => 'コンバージョン重視のランディングページデザイン',
          'price' => 120000,
          'unit' => 'ページ',
          'quantity' => 1,
          'sort_order' => 1,
        ],
        [
          'category' => 'coding',
          'name' => 'コーディング',
          'description' => 'レスポンシブ対応・高速化対応',
          'price' => 100000,
          'unit' => 'ページ',
          'quantity' => 1,
          'sort_order' => 2,
        ],
        [
          'category' => 'coding',
          'name' => 'フォーム設置',
          'description' => 'コンバージョンフォーム制作・設定',
          'price' => 50000,
          'unit' => '式',
          'quantity' => 1,
          'sort_order' => 3,
        ],
        [
          'category' => 'testing',
          'name' => 'A/Bテスト設定',
          'description' => 'Google Optimizeによる A/Bテスト設定',
          'price' => 30000,
          'unit' => '式',
          'quantity' => 1,
          'sort_order' => 4,
        ],
      ];

      foreach ($landingPriceItems as $item) {
        ServiceTypePriceItem::create(array_merge($item, [
          'service_type_id' => $landingPage->id,
        ]));
      }
    }
  }
}
