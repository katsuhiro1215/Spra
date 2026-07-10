# Project 関連の構造リファクタリング計画

**目的**: Quote/Contract/Project を統一された Version 管理パターンで設計

**実施日**: 2026-07-10

## 📐 最終設計パターン

```
Quote
├─ QuoteVersion v1, v2... (提案内容の履歴)
│  └─ QuoteItem[] (その版の提案明細)
└─ current_version_id

Contract
├─ ContractVersion v1, v2... (契約内容の履歴)
│  └─ ContractItem[] (その版の契約明細)
└─ current_version_id

Project ⬅ 新設計
├─ ProjectVersion v1, v2... (計画・スケジュールのスナップショット)
│  ├─ ProjectMilestone[] (その版の成果物)
│  └─ ProjectItem[] (その版のタスク・ガント)
├─ ProjectUpdate (実績・進捗報告・日報) ← 計画との乖離を追跡
└─ current_version_id
```

## 🎯 各モデルの役割

| モデル               | 役割                               | 版管理        | 用途                              |
| -------------------- | ---------------------------------- | ------------- | --------------------------------- |
| Project              | プロジェクト親                     | ❌            | 基本情報 (contract_id, user_id)   |
| **ProjectVersion**   | 計画のスナップショット             | ✅ v1, v2...  | 計画変更履歴                      |
| **ProjectMilestone** | 成果物（版ごとに含まれる）         | ✅ 版内に複数 | 主要な成果物区切り                |
| **ProjectItem**      | タスク・ガント（版ごとに含まれる） | ✅ 版内に複数 | 細かい実行タスク                  |
| ProjectUpdate        | 実績・進捗・日報                   | ❌            | 進捗報告 (is_client_visible 支持) |

## ✅ 実装手順

### Phase 1: ファイル作成・削除（完了予定）

- [x] ProjectVersion モデル・マイグレーション生成済み
- [ ] ProjectVersion マイグレーション修正
- [ ] ProjectMilestone マイグレーション修正
- [ ] ProjectItem マイグレーション修正
- [ ] Project マイグレーション修正
- [ ] ProjectInquiry 関連ファイル削除（モデル、マイグレーション、リポジトリなど）

### Phase 2: モデル修正

- [ ] Project モデル修正
    - [ ] `inquiry_id` フィールド削除
    - [ ] `current_version_id` フィールド追加
    - [ ] リレーション修正: `versions()`, `currentVersion()`
    - [ ] `inquiry()` リレーション削除
- [ ] ProjectVersion モデル実装
    - [ ] HasUlid, HasFactory, SoftDeletes トレイト追加
    - [ ] fillable フィールド設定
    - [ ] casts 設定
    - [ ] リレーション: `project()`, `milestones()`, `items()`
- [ ] ProjectMilestone モデル修正
    - [ ] version_id フィールド参照を確認
    - [ ] リレーション: `version()`, `items()`
- [ ] ProjectItem モデル修正
    - [ ] version_id フィールド参照を確認
    - [ ] parent_id（親子関係）サポート確認
    - [ ] リレーション: `version()`, `parent()`, `children()`
- [ ] ProjectUpdate モデル確認
    - [ ] project_id のみ参照（version_id なし）

### Phase 3: マイグレーション作成

1. **project_versions テーブル** 新規
    - Fields: id, project_id, version, title, description, start_date, estimated_end_date, status, is_current, created_by, created_at, updated_at, deleted_at

2. **projects テーブル** 修正
    - 削除: inquiry_id フィールド + 外部キー
    - 追加: current_version_id フィールド + 外部キー
    - 削除: inquiry リレーション用インデックス

3. **project_milestones テーブル** 修正
    - 追加: version_id フィールド + 外部キー（ProjectVersion 参照）
    - 削除または更新: project_id の扱い

4. **project_items テーブル** 修正
    - 追加: version_id フィールド + 外部キー（ProjectVersion 参照）
    - 削除または更新: project_id の扱い

### Phase 4: リポジトリ・サービス層修正

- [ ] ProjectRepository 修正 (versions() 追加)
- [ ] ProjectService 修正 (createVersion() メソッド追加)
- [ ] ProjectVersionRepository 新規作成
- [ ] ProjectVersionService 新規作成

### Phase 5: コントローラー修正

- [ ] ProjectController 修正
- [ ] ProjectVersionController 実装
- [ ] ProjectMilestoneController 修正
- [ ] ProjectItemController 確認

### Phase 6: Request 修正

- [ ] ProjectRequest 修正
- [ ] ProjectVersionRequest 実装
- [ ] ProjectMilestoneRequest 修正
- [ ] ProjectItemRequest 修正

### Phase 7: ビュー層修正

- [ ] Project Create/Show/Edit コンポーネント修正
- [ ] ProjectVersion 関連コンポーネント作成
- [ ] ガントチャート表示コンポーネント修正

## 🗑️ 削除対象ファイル

**完全削除予定:**

- app/Models/ProjectInquiry.php
- database/migrations/2025_11_08_000022_create_project_inquiries_table.php
- app/Repositories/ProjectInquiryRepository.php
- app/Repositories/Contracts/ProjectInquiryRepositoryInterface.php
- app/Http/Controllers/Admin/Project/ProjectInquiryController.php (存在確認)
- app/Http/Requests/ProjectInquiryRequest.php (存在確認)
- resources/js/Pages/Admin/ProjectInquiries/\* (ビュー階層)

## 🔄 見積 → 契約 → プロジェクト化フロー

```
1. Quote v1 作成（提案内容）
   └─ QuoteVersion v1, QuoteItem[]

2. Quote 承認 → Contract v1 に変換
   └─ ContractVersion v1 を作成
   └─ QuoteVersion v1 から amount を引き継ぎ

3. Contract 署名 → Project v1 に展開
   ├─ ProjectVersion v1 を作成
   ├─ QuoteVersion v1 の データを基に ProjectItem 生成
   ├─ ProjectMilestone を定義
   └─ ProjectUpdate ログ開始

4. プロジェクト進行中に計画変更
   └─ ProjectVersion v2 を作成
   ├─ ProjectMilestone 再定義
   ├─ ProjectItem 再構成
   └─ ProjectVersion v1 → superseded に
```

## 📝 マイグレーション実行順序

1. project_versions テーブル作成（新規）
2. projects テーブル修正（inquiry_id 削除、current_version_id 追加）
3. project_milestones テーブル修正（version_id 追加）
4. project_items テーブル修正（version_id 追加）
5. project_inquiries テーブル削除（データ移行なし）

## ⚠️ 注意点

- **データ移行**: 既存 ProjectItem はすべて ProjectVersion v1 に割り当て
- **ProjectInquiry 廃止**: Contact + StoreContactRequest に統一
- **ProjectUpdate**: 版管理なし。プロジェクト全体のログとして機能
- **ProjectMilestone**: 版ごとに異なる可能性あり。version_id で参照

## 🎯 確認ポイント

- [ ] Sail環境で DB リセットしても OK？
- [ ] 既存データの扱い（テスト環境のみ？）
- [ ] ProjectInquiry 廃止後の問い合わせ流れ（Contact のみ？）
