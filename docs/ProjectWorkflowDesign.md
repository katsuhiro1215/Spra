# プロジェクト管理システム - ワークフロー設計書

## 📌 概要

クライアントからの依頼受付 → 見積もり作成 → 契約締結 → プロジェクト管理 → タスク実行までを一気通貫で管理するシステム。

## 🔄 全体ワークフロー

```
┌─────────────────┐
│  1. 問い合わせ   │ ProjectInquiry
└────────┬────────┘
         ↓
┌─────────────────┐
│  2. 見積もり作成 │ Quote + QuoteItems
│                 │ ← ServiceTypePriceItems（チェックボックス選択）
└────────┬────────┘
         ↓
┌─────────────────┐
│  3. 見積もり承認 │ Quote.status = 'approved'
└────────┬────────┘
         ↓
┌─────────────────┐
│  4. 契約締結     │ Contract
└────────┬────────┘
         ↓
┌─────────────────┐
│  5. プロジェクト │ Project
│     自動生成     │
└────────┬────────┘
         ↓
┌─────────────────┐
│  6. タスク生成   │ ProjectItems（ガントチャート用）
│                 │ ← QuoteItems → ServiceTypePriceItems.task_templates
└────────┬────────┘
         ↓
┌─────────────────┐
│  7. タスク実行   │ ガントチャートで進捗管理
└─────────────────┘
```

---

## 1️⃣ 見積もり作成画面（Quote Builder）

### 画面構成

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 見積もり作成                            ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ クライアント情報                         ┃
┃ 会社名: [株式会社サンプル           ]  ┃
┃ 担当者: [山田太郎                   ]  ┃
┃ Email:  [yamada@example.com         ]  ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ サービス選択                            ┃
┃ サービスタイプ: [Webサイト構築 ▼]      ┃
┃ プラン:         [スタンダード ▼]       ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ 基本項目（必須）                        ┃
┃ ☑ 基本料金（設計・開発・WordPress）     ┃
┃    ¥300,000 × 1式                      ┃
┃    └ タスク: 要件定義(5日), デザイン(10日), ┃
┃              開発(15日), テスト(5日)   ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ オプション項目                          ┃
┃ ☑ 写真撮影                              ┃
┃    ¥50,000 × 1式                       ┃
┃    └ タスク: 撮影準備(2日), 撮影(1日), ┃
┃              編集(3日)                 ┃
┃                                        ┃
┃ ☑ ロゴデザイン                          ┃
┃    ¥100,000 × 1式                      ┃
┃    └ タスク: ヒアリング(2日), 初稿(5日), ┃
┃              修正(5日), 確定(2日)      ┃
┃                                        ┃
┃ ☐ 追加ページ                            ┃
┃    ¥10,000 × [5]ページ                 ┃
┃    └ タスク: 1ページあたり2日          ┃
┃                                        ┃
┃ ☐ SEO対策                               ┃
┃    ¥80,000 × 1式                       ┃
┃    └ タスク: キーワード調査(3日), ...  ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ 合計                                    ┃
┃ 小計:      ¥450,000                    ┃
┃ 消費税(10%): ¥45,000                   ┃
┃ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ┃
┃ 合計:      ¥495,000                    ┃
┃                                        ┃
┃ 予定工期: 約45営業日                    ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ [プレビュー] [下書き保存] [見積もり送信] ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

### 処理フロー

1. **ServiceType選択** → ServiceTypePriceItemsを取得
2. **チェックボックスで項目選択**
    - `is_required = true` の項目は必須チェック
    - `is_optional = true` の項目は任意選択
3. **数量入力**（ページ数など）
4. **自動計算**
    - 小計 = Σ(unit_price × quantity)
    - 税額 = 小計 × tax_rate
    - 合計 = 小計 + 税額
    - 予定工期 = Σ(estimated_days)
5. **保存** → Quote + QuoteItems作成

---

## 2️⃣ データ連携フロー

### Quote作成時

```php
// ServiceTypePriceItem → QuoteItem
foreach ($selectedPriceItems as $priceItem) {
    QuoteItem::create([
        'quote_id' => $quote->id,
        'service_type_price_item_id' => $priceItem->id,
        'category' => $priceItem->category,
        'description' => $priceItem->name,
        'quantity' => $input['quantity'],
        'unit_price' => $priceItem->price,
        'amount' => $priceItem->price * $input['quantity'],
    ]);
}
```

### Contract → Project生成時

```php
$project = Project::create([
    'project_code' => 'PRJ-' . date('Ymd') . '-' . $contract->id,
    'user_id' => $contract->user_id,
    'company_id' => $contract->company_id,
    'title' => $contract->title,
    'status' => 'planning',
    'start_date' => $contract->start_date,
]);
```

### Project → ProjectItems生成時

```php
// QuoteItemsからProjectItemsを自動生成
$quote = $contract->quote;
$startDate = Carbon::parse($project->start_date);

foreach ($quote->items as $quoteItem) {
    $priceItem = $quoteItem->servicePriceItem;

    // task_templatesからタスクを生成
    if ($priceItem && $priceItem->task_templates) {
        $taskTemplates = json_decode($priceItem->task_templates, true);

        foreach ($taskTemplates as $template) {
            ProjectItem::create([
                'project_id' => $project->id,
                'quote_item_id' => $quoteItem->id,
                'name' => $template['name'],
                'type' => 'task',
                'start_date' => $startDate->toDateString(),
                'end_date' => $startDate->copy()->addDays($template['duration_days'])->toDateString(),
                'estimated_hours' => $template['duration_days'] * 8,
                'category' => $priceItem->task_category,
                'status' => 'not_started',
                'progress' => 0,
            ]);

            $startDate->addDays($template['duration_days']);
        }
    }
}
```

---

## 3️⃣ ガントチャート連携

### ProjectItemsをガントチャートに表示

```javascript
// /admin/projects/{id}/gantt でガントチャート表示
const tasks = projectItems.map(item => ({
    id: item.id,
    name: item.name,
    startDate: item.start_date,
    endDate: item.end_date,
    status: item.status,
    progress: item.progress,
    assignee: item.assignedTo?.name,
    priority: item.priority,
    children: item.children || [],
}));

<GanttChart tasks={tasks} ... />
```

### タスク更新時の同期

- ガントチャートでのドラッグ → ProjectItem更新
- 進捗率変更 → ProjectItem.progress更新
- 親プロジェクトの進捗 = 子タスクの加重平均

---

## 4️⃣ ServiceTypePriceItem設定例

```php
// Seederで初期データ投入
ServiceTypePriceItem::create([
    'service_type_id' => $webSiteType->id,
    'category' => 'design',
    'name' => '基本料金（設計・開発・WordPress）',
    'description' => 'Webサイトの基本構築費用',
    'price' => 300000,
    'unit' => '式',
    'is_required' => true,
    'is_optional' => false,
    'task_templates' => json_encode([
        ['name' => '要件定義', 'duration_days' => 5, 'progress_weight' => 10],
        ['name' => 'デザイン作成', 'duration_days' => 10, 'progress_weight' => 30],
        ['name' => 'フロントエンド開発', 'duration_days' => 10, 'progress_weight' => 30],
        ['name' => 'WordPress構築', 'duration_days' => 5, 'progress_weight' => 20],
        ['name' => 'テスト・納品', 'duration_days' => 5, 'progress_weight' => 10],
    ]),
    'estimated_days' => 35,
    'task_category' => 'development',
    'sort_order' => 1,
]);

ServiceTypePriceItem::create([
    'service_type_id' => $webSiteType->id,
    'category' => 'design',
    'name' => 'ロゴデザイン',
    'description' => 'オリジナルロゴの制作',
    'price' => 100000,
    'unit' => '式',
    'is_required' => false,
    'is_optional' => true,
    'task_templates' => json_encode([
        ['name' => 'ヒアリング・コンセプト決定', 'duration_days' => 2, 'progress_weight' => 15],
        ['name' => 'ラフ案作成', 'duration_days' => 3, 'progress_weight' => 25],
        ['name' => '初稿提出', 'duration_days' => 2, 'progress_weight' => 20],
        ['name' => '修正対応', 'duration_days' => 5, 'progress_weight' => 30],
        ['name' => '最終確定・納品', 'duration_days' => 2, 'progress_weight' => 10],
    ]),
    'estimated_days' => 14,
    'task_category' => 'design',
    'sort_order' => 2,
]);
```

---

## 5️⃣ 実装する画面一覧

### Admin側

1. **見積もり管理**
    - `/admin/quotes` - 見積もり一覧
    - `/admin/quotes/create` - 見積もり作成（Quote Builder）
    - `/admin/quotes/{id}` - 見積もり詳細・編集
    - `/admin/quotes/{id}/pdf` - PDF出力

2. **契約管理**
    - `/admin/contracts` - 契約一覧
    - `/admin/contracts/create` - 契約作成
    - `/admin/contracts/{id}` - 契約詳細

3. **プロジェクト管理**
    - `/admin/projects` - プロジェクト一覧
    - `/admin/projects/{id}` - プロジェクト詳細
    - `/admin/projects/{id}/gantt` - ガントチャート（既存）
    - `/admin/projects/{id}/items` - タスク一覧・編集

4. **マスタ管理**
    - `/admin/service-types/{id}/price-items` - 価格項目管理

### Client側（オプション）

1. **見積もり確認**
    - `/my/quotes/{id}` - 見積もり確認・承認

2. **プロジェクト進捗**
    - `/my/projects/{id}` - プロジェクト進捗確認
    - `/my/projects/{id}/timeline` - 簡易ガントチャート（読み取り専用）

---

## 6️⃣ 実装優先順位

### Phase 1: 基本機能（最優先）

1. ✅ マイグレーション実行
2. ⬜ Quote Builder画面作成
3. ⬜ ServiceTypePriceItem Seeder作成
4. ⬜ Quote → Contract → Project 自動生成

### Phase 2: タスク管理

5. ⬜ ProjectItems自動生成ロジック
6. ⬜ ガントチャートとProjectItemsの連携
7. ⬜ タスク進捗更新機能

### Phase 3: 改善・最適化

8. ⬜ PDF見積もり出力
9. ⬜ クライアント側進捗確認画面
10. ⬜ メール通知機能

---

## 💡 メリット

1. **開発者視点**
    - チェックするだけで見積もり完成
    - 価格計算の自動化
    - タスクの自動生成でプロジェクト立ち上げが高速

2. **クライアント視点**
    - 見積もりが視覚的でわかりやすい
    - プロジェクト進捗がリアルタイムで確認可能
    - 透明性の高いプロジェクト管理

3. **ビジネス視点**
    - 見積もり → 契約 → プロジェクトの一気通貫管理
    - データの一貫性確保
    - レポート・分析が容易

---

## 🔧 技術スタック

- **Backend**: Laravel 11
- **Frontend**: React 18 + Inertia.js
- **UI**: Tailwind CSS + Heroicons
- **Charts**: 既存のGanttChart コンポーネント
- **PDF**: DomPDF or Snappy
