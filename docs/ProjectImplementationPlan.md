# Project実装計画書

## 1. 現在のビジネスフローとDB構造

### 1.1 全体フロー

```
お問い合わせ → 見積 → 契約 → プロジェクト → 請求・支払い
    ↓           ↓       ↓        ↓
ProjectInquiry  Quote  Contract  Project  →  Invoice → Payment
                  ↓       ↓        ↓
              QuoteItem   ↓    ProjectItem
                          ↓    ProjectMilestone
                   ContractDocument  ProjectUpdate
```

### 1.2 サービス定義構造

```
ServiceCategory (カテゴリ)
  └─ Service (サービス)
      └─ ServicePlan (プラン)
          └─ ServiceItem (項目)
```

### 1.3 プロジェクトフェーズの詳細フロー

```
1. お問い合わせ受付
   ProjectInquiry (status: new → in_discussion)
   ↓
2. 見積作成
   Quote (draft → sent → reviewed)
   └─ QuoteItem (複数のServiceItemから作成)
   ↓
3. 見積承認・契約
   Quote (approved) → Contract (draft → pending_signature → active)
   └─ ContractDocument (契約書PDF等)
   ↓
4. プロジェクト開始
   Contract → Project (planning → design → development → testing → review → completed)
   └─ ProjectCategory (管理用分類: Webサイト、システム開発等)
   └─ ProjectMilestone (マイルストーン管理)
   └─ ProjectUpdate (進捗報告)
   └─ ProjectItem (タスク・ガントチャート)
   ↓
5. 請求・入金
   Contract → Invoice → InvoiceItem
                      → Payment
```

---

## 2. 各テーブルの役割と必要性評価

### 2.1 ProjectCategory (プロジェクトカテゴリ)

**目的**: 管理者がプロジェクトを分類・管理しやすくする

**構造**:

- id, name, slug, description
- color, icon (UI表示用)
- is_active, sort_order
- 多対多リレーション (project_category_project)

**評価**: ✅ **必要**

- 理由:
    - 管理画面でのフィルタリング・検索に有用
    - プロジェクト一覧の視覚的な分類に役立つ
    - 統計・分析（カテゴリ別の売上、進捗等）が可能
- 例:
    - Webサイト制作
    - システム開発
    - アプリ開発
    - ECサイト
    - コーポレートサイト

**推奨実装**: CRUD + プロジェクト紐づけUI

---

### 2.2 ProjectInquiry (プロジェクト問い合わせ)

**目的**: 問い合わせ→見積→契約の入口管理

**構造**:

- inquiry_code, title, summary
- budget_min/max, desired_delivery_date
- status: new → in_discussion → estimated → contracted → cancelled
- user_id, company_id, assigned_admin_id
- quote_id (見積との紐づけ)

**現在の問題点**:

1. **Contactモデルとの重複**
    - 既存のContactモデルと役割が被る可能性
    - お問い合わせフォームからの流入をどう扱うか不明確

2. **フローの複雑化**
    - Contact → ProjectInquiry → Quote → Contract と長い
    - 単純な見積依頼の場合、ProjectInquiryが冗長

**評価**: ⚠️ **見直し推奨**

**3つの選択肢**:

#### 選択肢A: ProjectInquiryを廃止

```
Contact (お問い合わせ) → Quote (見積) → Contract → Project
```

- メリット: シンプル、既存Contactモデル活用
- デメリット: 詳細なヒアリング情報の管理が難しい

#### 選択肢B: ProjectInquiryを残す（現状維持）

```
Contact → ProjectInquiry (詳細ヒアリング) → Quote → Contract → Project
```

- メリット: 詳細管理、ステータス管理が明確
- デメリット: フロー複雑、Contact→ProjectInquiryの変換処理が必要

#### 選択肢C: Contactを拡張する（推奨）

```
Contact (type: inquiry, quote_request, support)
  - inquiry: 一般問い合わせ
  - quote_request: 見積依頼 (詳細項目を持つ)
  - support: サポート問い合わせ

Contact (quote_request) → Quote → Contract → Project
```

- メリット:
    - 一元管理、シンプル
    - 既存Contactインフラ活用
    - typeによる柔軟な対応
- デメリット:
    - Contactテーブルの肥大化
    - マイグレーション必要

**推奨アクション**:

1. まずは選択肢B（現状維持）でProject機能を完成させる
2. 運用後、選択肢Cへの統合を検討

---

### 2.3 Project (プロジェクト本体)

**目的**: プロジェクトの中心管理テーブル

**構造**:

- project_code, title, description, thumbnail
- inquiry_id, contract_id
- user_id, company_id, admin_id
- status: planning → design → development → testing → review → completed
- priority: low, medium, high, urgent
- start_date, estimated_end_date, actual_end_date
- is_client_visible (クライアント閲覧可否)
- client_visible_notes, internal_notes

**評価**: ✅ **必須**

- 理由: システムの中核機能

**実装必須機能**:

1. CRUD操作（管理者）
2. 一覧表示（管理者・クライアント）
3. 詳細表示（進捗、マイルストーン、更新情報含む）
4. ステータス遷移管理
5. クライアント向け表示制御

---

### 2.4 ProjectMilestone (マイルストーン)

**目的**: プロジェクトの主要な区切り・目標管理

**構造**:

- project_id, title, description
- status: pending → in_progress → completed → skipped
- due_date, completed_at
- sort_order, is_client_visible

**評価**: ✅ **必須**

- 理由:
    - クライアントへの進捗可視化に重要
    - プロジェクト管理の要
    - ガントチャートの主要ポイント

**実装機能**:

1. マイルストーン作成・編集・削除
2. ステータス更新
3. 並び替え（ドラッグ&ドロップ）
4. 達成率表示
5. 通知機能（完了時）

---

### 2.5 ProjectUpdate (進捗報告)

**目的**: 管理者からクライアントへの定期的な進捗共有

**構造**:

- project_id, admin_id
- title, content (リッチテキスト)
- type: progress, issue, milestone, general
- is_client_visible, notified_at

**評価**: ✅ **必須**

- 理由:
    - クライアントとのコミュニケーション重要
    - 信頼関係構築
    - 進捗の透明性確保

**実装機能**:

1. 更新作成（リッチエディタ）
2. 画像・ファイル添付
3. クライアント通知（メール）
4. コメント機能（オプション）
5. タイムライン表示

---

### 2.6 ProjectItem (タスク・ガントチャート)

**目的**: 詳細なタスク管理とガントチャート表示

**構造**:

- project_id, quote_item_id, milestone_id
- parent_id (階層構造)
- name, description, type: task, milestone, group
- start_date, end_date, actual_start_date, actual_end_date
- estimated_hours, actual_hours
- status: not_started → in_progress → completed → on_hold → cancelled
- progress (0-100%)
- assigned_to, dependencies (JSON)
- category, tags

**評価**: ✅ **必須**（ガントチャート機能の核）

- 理由:
    - 詳細なスケジュール管理
    - ガントチャート表示の基盤
    - 工数管理

**実装機能**:

1. タスクCRUD
2. 階層構造管理（親子関係）
3. 依存関係設定
4. ドラッグ&ドロップでスケジュール調整
5. ガントチャート表示（フェーズ2）
6. 進捗率更新
7. 担当者割り当て

---

## 3. 実装の優先順位

### フェーズ1: 基本CRUD（必須）

**目標**: プロジェクト管理の基本機能を完成させる

#### 1.1 ProjectCategory (1-2日)

- [ ] モデル・マイグレーション確認
- [ ] CRUD実装 (Admin画面)
- [ ] アイコン・カラーピッカー
- [ ] プロジェクト紐づけUI

#### 1.2 Project本体 (3-5日)

- [ ] モデル・リレーション確認
- [ ] Index画面（一覧・検索・フィルタ）
- [ ] Create/Edit画面（FormGroup統一）
- [ ] Show画面（詳細・タブ切り替え）
    - 基本情報タブ
    - マイルストーンタブ
    - 更新情報タブ
    - タスクタブ（簡易版）
- [ ] ステータス遷移UI
- [ ] クライアント向けShow画面

#### 1.3 ProjectMilestone (2-3日)

- [ ] モデル確認
- [ ] Project詳細内でのCRUD
- [ ] ステータス更新UI
- [ ] 並び替え機能
- [ ] 進捗率表示

#### 1.4 ProjectUpdate (2-3日)

- [ ] モデル確認
- [ ] 更新作成フォーム（リッチエディタ）
- [ ] タイムライン表示
- [ ] クライアント通知機能
- [ ] クライアント向け表示

**フェーズ1合計**: 約8-13日

---

### フェーズ2: タスク管理・ガントチャート（重要）

**目標**: 詳細なタスク管理とガントチャート表示

#### 2.1 ProjectItem基本 (3-4日)

- [ ] モデル・リレーション確認
- [ ] タスクCRUD（Project詳細内）
- [ ] 階層構造表示（ツリービュー）
- [ ] ステータス・進捗更新
- [ ] 担当者割り当て

#### 2.2 ガントチャート表示 (5-7日)

- [ ] ガントチャートライブラリ選定
    - 候補: frappe-gantt, dhtmlxGantt, react-gantt-chart
- [ ] タスク表示
- [ ] マイルストーン表示
- [ ] 依存関係の可視化
- [ ] ドラッグ&ドロップ調整
- [ ] ズーム機能（日/週/月）
- [ ] 印刷・エクスポート

**フェーズ2合計**: 約8-11日

---

### フェーズ3: 高度な機能（オプション）

**目標**: ユーザビリティ向上

#### 3.1 通知・アラート (2-3日)

- [ ] マイルストーン期限アラート
- [ ] タスク遅延アラート
- [ ] 更新通知（メール・ダッシュボード）

#### 3.2 レポート・分析 (3-5日)

- [ ] プロジェクト進捗レポート
- [ ] カテゴリ別統計
- [ ] 工数実績vs見積もり
- [ ] ダッシュボード強化

#### 3.3 クライアントポータル強化 (3-4日)

- [ ] プロジェクト一覧
- [ ] 進捗確認
- [ ] コメント機能
- [ ] ファイル共有

**フェーズ3合計**: 約8-12日

---

## 4. 具体的な実装計画

### 4.1 ディレクトリ構造

```
app/
├── Models/
│   ├── Project.php ✅
│   ├── ProjectCategory.php
│   ├── ProjectInquiry.php ✅
│   ├── ProjectMilestone.php
│   ├── ProjectUpdate.php
│   └── ProjectItem.php
├── Http/
│   ├── Controllers/Admin/
│   │   ├── ProjectController.php
│   │   ├── ProjectCategoryController.php
│   │   ├── ProjectMilestoneController.php
│   │   ├── ProjectUpdateController.php
│   │   └── ProjectItemController.php
│   └── Requests/
│       ├── ProjectRequest.php
│       ├── ProjectMilestoneRequest.php
│       ├── ProjectUpdateRequest.php
│       └── ProjectItemRequest.php
├── Services/
│   ├── ProjectService.php
│   └── GanttChartService.php
└── Repositories/
    └── ProjectRepository.php

resources/js/Pages/Admin/Projects/
├── Index.jsx
├── Create.jsx
├── Edit.jsx
├── Show.jsx (タブ切り替え)
├── _components/
│   ├── ProjectsTable.jsx
│   ├── ProjectForm.jsx
│   ├── MilestoneList.jsx
│   ├── MilestoneForm.jsx
│   ├── UpdateTimeline.jsx
│   ├── UpdateForm.jsx
│   ├── TaskList.jsx
│   ├── TaskForm.jsx
│   └── GanttChart.jsx (フェーズ2)
└── Categories/
    ├── Index.jsx
    ├── Create.jsx
    └── Edit.jsx
```

### 4.2 UI/UXパターン（統一基準）

- **FormGroup**: すべてのフォームで使用
- **Card/CardHeader/CardBody**: セクション分け
- **Badge**: ステータス・カテゴリ表示
- **TabNavigation**: Show画面のタブ切り替え
- **Dark mode**: 全画面対応
- **アイコンボタン**: 詳細・編集・削除

### 4.3 主要なビュー構成

#### Project Index (一覧)

```jsx
- PageHeader + 検索・フィルター (Card)
  - 検索: プロジェクト名、クライアント名
  - フィルター: カテゴリ、ステータス、優先度、担当者
- ProjectsTable (カテゴリ・ステータス・進捗バッジ)
- Pagination
```

#### Project Show (詳細)

```jsx
タブ構成:
1. 概要
   - プロジェクト基本情報
   - クライアント情報
   - 契約情報
   - ステータス・優先度
   - 期間・進捗

2. マイルストーン
   - MilestoneList (カード表示 or リスト)
   - 各マイルストーン: タイトル、期限、ステータス、進捗
   - 追加・編集・削除ボタン

3. 更新情報
   - UpdateTimeline (時系列表示)
   - 各更新: タイトル、内容、タイプ、日時、投稿者
   - 新規投稿フォーム

4. タスク
   - TaskList (ツリービュー)
   - 階層構造、ステータス、担当者、期間
   - ガントチャート切り替えボタン

5. ファイル（オプション）
   - 契約書、デザイン、ドキュメント等

6. 履歴（オプション）
   - 変更履歴
```

### 4.4 クライアント向けビュー

```
resources/js/Pages/Client/Projects/
├── Index.jsx (自分のプロジェクト一覧)
├── Show.jsx (詳細・進捗確認)
└── _components/
    ├── MilestoneProgress.jsx (ビジュアル進捗)
    └── UpdateFeed.jsx (更新情報フィード)
```

---

## 5. ガントチャート連携構想

### 5.1 ガントチャートライブラリ候補

#### Option 1: frappe-gantt ⭐推奨

- 軽量、シンプル、React対応
- MIT License
- 依存関係表示対応
- カスタマイズ容易

#### Option 2: dhtmlxGantt

- 多機能、高性能
- 有料版あり（商用利用）
- 学習コスト高

#### Option 3: react-gantt-chart

- React専用
- 軽量だがカスタマイズ限定的

**推奨**: frappe-gantt（React wrapper作成）

### 5.2 ガントチャート機能要件

1. **タスク表示**
    - ProjectItemをバーで表示
    - 階層構造（親子関係）
    - マイルストーンをひし形で表示

2. **依存関係**
    - dependencies JSONを解析
    - 矢印で依存関係表示

3. **インタラクション**
    - ドラッグで期間調整
    - クリックで詳細表示
    - ズーム（日/週/月/年）

4. **進捗表示**
    - バー内に進捗率表示
    - 色分け（未着手/進行中/完了）

5. **フィルター**
    - 担当者別
    - カテゴリ別
    - ステータス別

6. **エクスポート**
    - PNG画像
    - PDF
    - Excel（オプション）

### 5.3 データフロー

```javascript
// ProjectItemsをガントチャート用に変換
const ganttData = projectItems.map((item) => ({
    id: item.id,
    name: item.name,
    start: item.start_date,
    end: item.end_date,
    progress: item.progress,
    dependencies: item.dependencies,
    custom_class: getStatusClass(item.status),
}));

<GanttChart data={ganttData} />;
```

---

## 6. テスト・品質保証計画

### 6.1 単体テスト

- モデルテスト（リレーション・スコープ）
- サービスクラステスト

### 6.2 機能テスト

- CRUD操作
- ステータス遷移
- 権限チェック（admin/client）

### 6.3 E2Eテスト

- プロジェクト作成→マイルストーン追加→更新投稿
- ガントチャート操作

---

## 7. マイルストーン & スケジュール

### Week 1-2: フェーズ1基礎

- ProjectCategory CRUD
- Project CRUD基本

### Week 3-4: フェーズ1完成

- ProjectMilestone実装
- ProjectUpdate実装
- クライアント向け表示

### Week 5-6: フェーズ2開始

- ProjectItem基本実装
- 階層構造・依存関係

### Week 7-8: ガントチャート

- ライブラリ統合
- ドラッグ&ドロップ
- エクスポート機能

### Week 9-10: 最終調整

- 通知機能
- レポート・分析
- バグフィックス・最適化

---

## 8. 推奨事項 & 判断ポイント

### 8.1 ProjectInquiryについて

**判断**:

- ✅ 短期: 現状維持（すでにテーブル存在）
- ⏭️ 長期: Contact拡張への統合を検討

**理由**:

- まずはProject機能完成を優先
- 運用後、実際のフローを確認してから統合判断

### 8.2 実装の開始順序

**推奨**:

1. ProjectCategory（簡単・すぐ終わる）
2. Project本体（中核機能）
3. ProjectMilestone（クライアント向け重要）
4. ProjectUpdate（コミュニケーション）
5. ProjectItem（複雑・時間かかる）
6. ガントチャート（最後・付加価値）

### 8.3 Invoice連携

**Project完成後に実装**:

- Contract → Invoice生成
- マイルストーン達成時に自動請求
- 進捗率に応じた分割請求

---

## 9. 結論 & 次のアクション

### 9.1 総評

- 現在のDB設計は**非常に良好**
- ProjectMilestone、ProjectUpdate、ProjectItemはすべて**必須**
- ProjectCategoryも管理用として**有用**
- ProjectInquiryは**現状維持**（後で見直し）

### 9.2 即座に開始可能な実装

1. ✅ ProjectCategory CRUD（1-2日）
2. ✅ Project CRUD（3-5日）
3. ✅ ProjectMilestone（2-3日）
4. ✅ ProjectUpdate（2-3日）

**合計**: 約2-3週間で基本機能完成

### 9.3 決定事項

- [ ] ProjectInquiry: 現状維持 or Contact統合？
- [ ] ガントチャートライブラリ: frappe-gantt使用？
- [ ] フェーズ1のみ先行実装？ or 全機能一括？
- [ ] クライアントポータルの優先度？

---

## 10. 質問 & 確認事項

1. **ProjectInquiryの扱い**
    - A: 現状維持（そのまま使用）
    - B: 後で統合（今は実装しない）
    - C: 即座に統合（Contact拡張）

2. **実装範囲**
    - A: フェーズ1のみ（基本CRUD）
    - B: フェーズ2まで（ガントチャート含む）
    - C: 全機能一括（レポート・通知も）

3. **クライアントポータル**
    - A: 管理画面優先（クライアント画面は後）
    - B: 同時並行
    - C: クライアント画面優先

4. **ガントチャートライブラリ**
    - A: frappe-gantt
    - B: dhtmlxGantt
    - C: 自作（要検討）

---

**作成日**: 2026年5月6日  
**バージョン**: 1.0  
**ステータス**: レビュー待ち
