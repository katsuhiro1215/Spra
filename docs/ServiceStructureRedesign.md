# サービス構造再設計案

## 📊 提案するテーブル構造

### 1. service_categories
```
サービスカテゴリー（大分類）
例: Webサイト制作、グラフィックデザイン、マーケティング
```

### 2. services
```
サービス（中分類）
例: 
- Webサイト制作 → 構築、保守運用
- グラフィックデザイン → ロゴデザイン、パンフレット制作
```

### 3. service_plans
```
サービスプラン
例:
- 構築 → シンプルプラン、スタンダードプラン、プレミアムプラン
- 保守運用 → シンプルプラン、スタンダードプラン
```

### 4. service_items
```
サービス項目（チェックボックス項目）
外部キー: service_plan_id（nullable）

item_type:
- 'included': プランに含まれる項目（基本料金、基本ページ数など）
- 'optional': プラン固有の追加オプション
- 'addon': 全プラン共通の追加項目（ロゴ、写真撮影など）※service_plan_id = NULL
```

### 5. quotes
```
見積もり
service_idやservice_plan_idは持たない
→ QuoteItemから辿れる
```

### 6. quote_items
```
見積明細
外部キー: service_item_id
- quantity: 数量
- unit_price: 見積作成時の単価（価格スナップショット）
- amount: 小計
```

## 🎯 具体例

### ホームページ表示
```
【Webサイト制作 - 構築】

┌─────────────────────────────────────┐
│ シンプルプラン ¥300,000             │
├─────────────────────────────────────┤
│ ✓ 基本5ページ                       │
│ ✓ お問い合わせフォーム              │
│ ✓ レスポンシブ対応                  │
│ ✓ 基本SEO設定                       │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ スタンダードプラン ¥500,000         │
├─────────────────────────────────────┤
│ ✓ 基本10ページ                      │
│ ✓ お問い合わせフォーム              │
│ ✓ ブログ機能                        │
│ ✓ レスポンシブ対応                  │
│ ✓ 詳細SEO設定                       │
└─────────────────────────────────────┘

【追加オプション（全プラン共通）】
□ ロゴデザイン +¥100,000
□ 写真撮影 +¥50,000
□ 追加ページ +¥10,000/ページ
□ SEO対策パッケージ +¥80,000
```

### データベース構造
```
service_categories
├─ id: "01HXXX"
└─ name: "Webサイト制作"

services
├─ id: "01HYYY"
├─ service_category_id: "01HXXX"
└─ name: "構築"

service_plans
├─ id: "01HZZZ1"
├─ service_id: "01HYYY"
├─ name: "シンプルプラン"
└─ base_price: 300000

├─ id: "01HZZZ2"
├─ service_id: "01HYYY"
├─ name: "スタンダードプラン"
└─ base_price: 500000

service_items
# シンプルプラン含まれる項目
├─ id: "01HAAA1"
├─ service_plan_id: "01HZZZ1"
├─ item_type: "included"
├─ name: "基本5ページ"
└─ price: 0

├─ id: "01HAAA2"
├─ service_plan_id: "01HZZZ1"
├─ item_type: "included"
├─ name: "お問い合わせフォーム"
└─ price: 0

# スタンダードプラン含まれる項目
├─ id: "01HAAA3"
├─ service_plan_id: "01HZZZ2"
├─ item_type: "included"
├─ name: "基本10ページ"
└─ price: 0

├─ id: "01HAAA4"
├─ service_plan_id: "01HZZZ2"
├─ item_type: "included"
├─ name: "ブログ機能"
└─ price: 0

# 全プラン共通の追加オプション（service_plan_id = NULL）
├─ id: "01HAAA5"
├─ service_plan_id: NULL  ← プランに紐付かない
├─ service_id: "01HYYY"   ← Serviceには紐付く
├─ item_type: "addon"
├─ name: "ロゴデザイン"
└─ price: 100000

├─ id: "01HAAA6"
├─ service_plan_id: NULL
├─ service_id: "01HYYY"
├─ item_type: "addon"
├─ name: "写真撮影"
└─ price: 50000
```

## 📝 見積もり作成フロー

### ステップ1: サービス選択
```
ユーザーが選択:
- Webサイト制作 > 構築 > スタンダードプラン
```

### ステップ2: プラン内容表示
```
【スタンダードプラン ¥500,000】

含まれる内容:
✓ 基本10ページ
✓ お問い合わせフォーム
✓ ブログ機能
✓ レスポンシブ対応
✓ 詳細SEO設定
```

### ステップ3: 追加オプション選択
```
追加オプション:
☑ ロゴデザイン +¥100,000
☑ 写真撮影 +¥50,000
□ 追加ページ × 5 +¥50,000
□ SEO対策パッケージ +¥80,000
```

### ステップ4: 見積もり確定
```
quotes
├─ id: "01HQQQ"
├─ quote_number: "Q2026-001"
├─ base_amount: 650000
└─ total_amount: 715000 (税込)

quote_items
├─ quote_id: "01HQQQ"
├─ service_item_id: "01HZZZ2" (スタンダードプラン本体)
├─ description: "Webサイト構築 スタンダードプラン"
├─ quantity: 1
├─ unit_price: 500000
└─ amount: 500000

├─ quote_id: "01HQQQ"
├─ service_item_id: "01HAAA5"
├─ description: "ロゴデザイン"
├─ quantity: 1
├─ unit_price: 100000
└─ amount: 100000

├─ quote_id: "01HQQQ"
├─ service_item_id: "01HAAA6"
├─ description: "写真撮影"
├─ quantity: 1
├─ unit_price: 50000
└─ amount: 50000
```

## 🔑 重要な設計ポイント

### 1. ServiceItemの外部キー設計

```php
// service_items テーブル
$table->ulid('service_id');              // Service直下（必須）
$table->ulid('service_plan_id')->nullable(); // Plan固有項目の場合のみ

// パターン1: プラン固有項目
service_id = "構築"
service_plan_id = "スタンダードプラン"
item_type = "included"
name = "基本10ページ"

// パターン2: 全プラン共通追加オプション
service_id = "構築"
service_plan_id = NULL  ← プランに紐付かない
item_type = "addon"
name = "ロゴデザイン"
```

### 2. QuoteとServiceの関係

**Quoteテーブル自体にはservice_idもservice_plan_idも持たせない**

理由:
1. 1つの見積もりで複数のServicePlanを選べる
2. QuoteItem経由で全ての情報を辿れる
3. 柔軟性が高い

### 3. 価格のスナップショット

```php
// service_items: マスターデータの価格
$table->decimal('price', 12, 2);

// quote_items: 見積作成時の価格（スナップショット）
$table->decimal('unit_price', 12, 2);
```

**マスター価格を変更しても過去の見積もりに影響しない**

## 🎨 Quote Builder UI設計

### 画面構成

```
┌─────────────────────────────────────────────────┐
│ 見積もり作成                                     │
├─────────────────────────────────────────────────┤
│                                                 │
│ 【1. サービス選択】                              │
│ ○ Webサイト制作 > 構築                          │
│ ○ Webサイト制作 > 保守運用                      │
│ ○ グラフィックデザイン > ロゴデザイン           │
│                                                 │
│ ─────────────────────────────────────────       │
│                                                 │
│ 【2. プラン選択】                                │
│ [シンプル] [スタンダード★] [プレミアム]         │
│                                                 │
│ スタンダードプラン ¥500,000                     │
│ ✓ 基本10ページ                                  │
│ ✓ お問い合わせフォーム                          │
│ ✓ ブログ機能                                    │
│ ✓ レスポンシブ対応                              │
│                                                 │
│ ─────────────────────────────────────────       │
│                                                 │
│ 【3. 追加オプション】                            │
│ ☑ ロゴデザイン          +¥100,000              │
│ ☑ 写真撮影              +¥50,000               │
│ ☐ 追加ページ [5] ページ +¥50,000               │
│ ☐ SEO対策パッケージ     +¥80,000               │
│                                                 │
│ ─────────────────────────────────────────       │
│                                                 │
│ 【+ 別サービスを追加】                           │
│                                                 │
│ ─────────────────────────────────────────       │
│                                                 │
│ 【見積もりサマリー】                             │
│ スタンダードプラン    ¥500,000                  │
│ ロゴデザイン          ¥100,000                  │
│ 写真撮影              ¥50,000                   │
│ ─────────────────────                           │
│ 小計                  ¥650,000                  │
│ 消費税(10%)           ¥65,000                   │
│ ─────────────────────                           │
│ 合計                  ¥715,000                  │
│                                                 │
│ 推定工期: 約53日                                 │
│                                                 │
│           [見積もり作成]                         │
└─────────────────────────────────────────────────┘
```

## 📊 クエリ例

### 見積もり作成画面用データ取得

```php
// 1. サービス一覧取得
$services = Service::with('serviceCategory')
    ->where('is_active', true)
    ->get();

// 2. 選択されたServiceのプラン取得
$plans = ServicePlan::where('service_id', $serviceId)
    ->with(['items' => function($query) {
        $query->where('item_type', 'included')
              ->orderBy('sort_order');
    }])
    ->get();

// 3. 追加オプション取得
$addons = ServiceItem::where('service_id', $serviceId)
    ->whereNull('service_plan_id')
    ->where('item_type', 'addon')
    ->orderBy('sort_order')
    ->get();
```

### 見積もり詳細取得

```php
$quote = Quote::with([
    'items.serviceItem.servicePlan.service.serviceCategory'
])->findOrFail($id);

foreach ($quote->items as $item) {
    echo $item->serviceItem->servicePlan->name; // スタンダードプラン
    echo $item->serviceItem->name;              // ロゴデザイン
    echo $item->unit_price;                     // 100000
}
```

## ⚠️ 注意点

### 1. プラン本体もServiceItemとして登録する
```php
// スタンダードプラン自体をServiceItemとして登録
ServiceItem::create([
    'service_plan_id' => $standardPlan->id,
    'item_type' => 'plan_base',  // 新しいタイプ
    'name' => 'スタンダードプラン基本料金',
    'price' => 500000,
    'is_required' => true,
]);
```

### 2. 推定工期の計算
```php
// service_itemsにestimated_daysを追加
$table->integer('estimated_days')->nullable();

// 見積もり作成時に合計工期を計算
$totalDays = $quote->items->sum(function($item) {
    return $item->serviceItem->estimated_days * $item->quantity;
});
```

### 3. task_templatesの配置
```php
// service_itemsにtask_templatesを追加
$table->json('task_templates')->nullable();

// プロジェクト作成時に各QuoteItemのtask_templatesを展開
```

## 🚀 実装順序

### Phase 1: テーブル再構築
1. 既存テーブルのバックアップ
2. 新しいマイグレーション作成
3. 既存データの移行スクリプト

### Phase 2: Seeder作成
1. ServiceCategorySeeder
2. ServiceSeeder
3. ServicePlanSeeder
4. ServiceItemSeeder（サンプルデータ）

### Phase 3: Quote Builder UI
1. サービス選択画面
2. プラン選択画面
3. オプション選択画面
4. 見積もりプレビュー

### Phase 4: 自動化
1. Quote → Project変換
2. QuoteItem → ProjectItem生成
3. ガントチャート連携

## 🤔 よくある質問

### Q: なぜservice_itemsにservice_idとservice_plan_idの両方を持たせるのか？

A: 
- `service_id`: 必須。全プラン共通オプションの親を示す
- `service_plan_id`: nullable。プラン固有項目のみ設定

これにより以下が可能：
```php
// プラン固有項目の取得
ServiceItem::where('service_plan_id', $planId)->get();

// 全プラン共通オプションの取得
ServiceItem::where('service_id', $serviceId)
           ->whereNull('service_plan_id')
           ->get();
```

### Q: ServicePlanのbase_priceとServiceItemのpriceの関係は？

A:
- `ServicePlan.base_price`: プラン全体の価格（表示用）
- `ServiceItem.price`: 
  - item_type='plan_base': base_priceと同じ（QuoteItem登録用）
  - item_type='included': 0（プラン料金に含まれる）
  - item_type='addon': 追加料金

### Q: 複数のServiceを1つの見積もりに入れられるか？

A: はい。QuoteItemに異なるservice_item_idを追加すれば可能
```
Quote
├─ QuoteItem: Webサイト構築（スタンダード）
├─ QuoteItem: ロゴデザイン
├─ QuoteItem: 保守運用（シンプル）← 別のService
└─ QuoteItem: 写真撮影
```
