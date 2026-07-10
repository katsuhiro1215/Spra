# Project管理の完全フローガイド

## 📋 全体フロー

```
1. Project基本情報を登録
   ↓
2. ProjectVersion（Version1）を自動作成
   ↓
3. 新しいバージョンを作成する場合
   ├─ ContractItemから取り込む
   ├─ 既存バージョンからコピー
   └─ マイルストーンを自動生成
   ↓
4. ProjectItemを確認・編集
   ↓
5. ProjectMilestoneを調整
   ↓
6. ガントチャートで可視化・編集
```

## 1️⃣ Project基本情報登録

### ルート

- **新規作成**: `/admin/project/create`
- **Controller**: `ProjectController@create`, `ProjectController@store`
- **画面**: `resources/js/Pages/Admin/Project/Create.jsx`

### 登録項目

- プロジェクト名（必須）
- 契約（選択）
- ユーザー（必須）
- 企業
- 担当管理者
- 開始日・終了予定日
- ステータス・優先度
- 説明

### 自動生成される項目

- **project_code**: `PRJ-2025-00011234` 形式で自動生成
- **Version 1**: プロジェクト作成時に自動で作成され、`is_current = true` として設定

### 実装コード

```php
// app/Services/ProjectService.php
public function create(array $data): Project
{
    // プロジェクトコード自動生成
    $data['project_code'] = 'PRJ-' . date('Y') . '-' . ... ;

    // プロジェクト作成
    $project = $this->repository->create($data);

    // Version 1 自動作成（is_current = true）
    $versionData = [
        'version' => 1,
        'title' => sprintf('%s - Version 1', $project->title),
        'start_date' => $project->start_date,
        'estimated_end_date' => $project->estimated_end_date,
        'is_current' => true,
    ];
    $this->versionRepository->create($versionData);

    return $project;
}
```

---

## 2️⃣ Project詳細画面

### ルート

- **詳細表示**: `/admin/project/{project}`
- **Controller**: `ProjectController@show`
- **画面**: `resources/js/Pages/Admin/Project/Show.jsx`

### タブ構成

#### 📌 概要タブ

- プロジェクト基本情報
- **現在のバージョン情報** カード（NEW）
    - バージョン番号・タイトル
    - マイルストーン数・アイテム数
    - 「バージョン詳細」ボタン
    - 「ガントチャート」ボタン
- 関連契約情報
- クライアント向けノート
- 内部ノート

#### 📌 マイルストーンタブ

- 現在のバージョンのマイルストーン一覧を表示
- マイルストーンがない場合は「バージョンを作成」ボタンを表示

#### 📌 更新履歴タブ

- ProjectUpdatesを時系列で表示

#### 📌 ガントチャートタブ

- 現在のバージョンがあれば「ガントチャートを開く」ボタン
- なければ「バージョンを作成」ボタン

#### 📌 ファイルタブ

- 今後実装予定

### ヘッダーアクション

- **バージョン管理** ボタン → バージョン一覧へ（メインフロー導線）
- **戻る** ボタン → プロジェクト一覧へ

---

## 3️⃣ ProjectVersion管理

### ルート

- **一覧**: `/admin/project/{project}/versions`
- **作成**: `/admin/project/{project}/versions/create`
- **詳細**: `/admin/project/{project}/versions/{version}`
- **Controller**: `ProjectVersionController`

### Version作成フロー

#### 画面: `ProjectVersion/Create.jsx`

##### 基本情報入力

- タイトル（必須）
- 説明
- 開始日・終了日（プロジェクトの日付がデフォルト）
- 見積もり時間
- ステータス
- 修正理由

##### オプション1: 現在のバージョンからコピー

```jsx
<Checkbox
    checked={data.copy_from_current}
    label="現在のバージョン（v1）からマイルストーン・アイテムをコピーします"
/>
```

- 有効にすると、現在のバージョンのマイルストーンとアイテムが全てコピーされる

##### オプション2: ContractItemから取り込み（NEW）

```jsx
<Checkbox
    checked={data.import_from_contract}
    label={`契約アイテムから取り込む（${contractItems.length}件）`}
/>
```

- **条件**: Projectに契約が紐づいている場合のみ表示
- **動作**:
    - ContractItemsが自動的にProjectItemsとして追加される
    - 期間は均等に分割される（プロジェクト開始日〜終了日を分割）
    - `start_date` と `end_date` が自動計算される

##### オプション3: マイルストーン自動生成（NEW）

```jsx
<Checkbox
    checked={data.auto_generate_milestones}
    label="フェーズごとにマイルストーンを自動生成する"
/>

<SelectInput value={data.milestone_count}>
    <option value="2">2フェーズ</option>
    <option value="3">3フェーズ</option>
    <option value="4">4フェーズ</option>
    <option value="5">5フェーズ</option>
    <option value="6">6フェーズ</option>
</SelectInput>
```

**自動生成されるマイルストーン名**:

- 要件定義・設計
- 開発フェーズ1
- 開発フェーズ2
- テスト・QA
- リリース準備
- 本番リリース
- 運用保守

**期間の分割**:

- プロジェクト期間を `milestone_count` で均等分割
- 各マイルストーンに `due_date` が自動設定される

### バックエンド実装

```php
// app/Http/Controllers/Admin/Project/ProjectVersionController.php

public function create(Project $project): Response
{
    // ContractItemsを取得して渡す
    $contractItems = [];
    if ($project->contract_id) {
        $contract = $project->contract;
        if ($contract && $contract->currentVersion) {
            $contractItems = $contract->currentVersion->items;
        }
    }

    return Inertia::render('Admin/ProjectVersion/Create', [
        'project' => $project,
        'currentVersion' => $currentVersion,
        'contractItems' => $contractItems, // 追加
    ]);
}

public function store(ProjectVersionRequest $request, Project $project): RedirectResponse
{
    $newVersion = $this->repository->createNewVersion($project, $currentVersion, $versionData);

    // ContractItemsから取り込み
    if ($request->validated('import_from_contract') && $project->contract_id) {
        $contract = $project->contract;
        if ($contract && $contract->currentVersion) {
            $startDate = new \DateTime($newVersion->start_date ?? date('Y-m-d'));
            $endDate = new \DateTime($newVersion->estimated_end_date ?? date('Y-m-d', strtotime('+30 days')));
            $totalDays = $startDate->diff($endDate)->days;

            $itemCount = $contract->currentVersion->items->count();
            $daysPerItem = $itemCount > 0 ? floor($totalDays / $itemCount) : 0;

            foreach ($contract->currentVersion->items as $index => $contractItem) {
                $itemStartDate = clone $currentDate;
                $itemEndDate = clone $currentDate;
                $itemEndDate->modify("+{$daysPerItem} days");

                $newVersion->items()->create([
                    'service_item_id' => $contractItem->service_item_id,
                    'name' => $contractItem->name,
                    'description' => $contractItem->description,
                    'start_date' => $itemStartDate->format('Y-m-d'),
                    'end_date' => $itemEndDate->format('Y-m-d'),
                    'estimated_hours' => $contractItem->estimated_days * 8,
                    'status' => 'not_started',
                    'priority' => 'medium',
                ]);
            }
        }
    }

    // マイルストーン自動生成
    if ($request->validated('auto_generate_milestones')) {
        $milestoneCount = $request->validated('milestone_count') ?? 3;
        $this->generateMilestones($newVersion, $milestoneCount);
    }

    return redirect()
        ->route('admin.project.versions.show', [$project->id, $newVersion->id])
        ->with('success', 'バージョンを作成しました。');
}

private function generateMilestones(ProjectVersion $version, int $count): void
{
    $startDate = new \DateTime($version->start_date ?? date('Y-m-d'));
    $endDate = new \DateTime($version->estimated_end_date ?? date('Y-m-d', strtotime('+30 days')));
    $totalDays = $startDate->diff($endDate)->days;
    $daysPerPhase = floor($totalDays / $count);

    $phaseNames = [
        '要件定義・設計',
        '開発フェーズ1',
        '開発フェーズ2',
        'テスト・QA',
        'リリース準備',
        '本番リリース',
        '運用保守',
    ];

    $currentDate = clone $startDate;

    for ($i = 0; $i < $count; $i++) {
        $phaseEndDate = clone $currentDate;
        $phaseEndDate->modify("+{$daysPerPhase} days");

        if ($i === $count - 1) {
            $phaseEndDate = $endDate; // 最後は終了日まで
        }

        $version->milestones()->create([
            'title' => $phaseNames[$i] ?? "フェーズ " . ($i + 1),
            'due_date' => $phaseEndDate->format('Y-m-d'),
            'status' => 'pending',
            'sort_order' => $i,
        ]);

        $currentDate = clone $phaseEndDate;
    }
}
```

---

## 4️⃣ ProjectVersion詳細画面

### ルート

- **詳細**: `/admin/project/{project}/versions/{version}`
- **Controller**: `ProjectVersionController@show`
- **画面**: `resources/js/Pages/Admin/ProjectVersion/Show.jsx`

### ヘッダーアクション（NEW）

- **ガントチャート** ボタン（主要アクション）
- **編集** ボタン
- **バージョン一覧へ戻る** ボタン

### 表示セクション

1. **バージョン基本情報**
    - バージョン番号、タイトル、説明
    - ステータス、作成日時、作成者
    - 「現在に設定」ボタン（is_current でない場合）
    - 「削除」ボタン（is_current でない場合）

2. **マイルストーン一覧**
    - タイトル、期限、ステータス
    - 作成・編集・削除ボタン

3. **ProjectItems一覧**
    - タイトル、開始日〜終了日、ステータス、優先度
    - 作成・編集・削除ボタン
    - 進捗バー（完了率）

4. **更新履歴**
    - ProjectUpdates表示

---

## 5️⃣ ProjectItem管理

### ルート

- **作成**: `/admin/project/{project}/versions/{version}/items/create`
- **編集**: `/admin/project/{project}/versions/{version}/items/{item}/edit`
- **Controller**: `ProjectItemController`

### 作成画面の特徴

#### 画面: `ProjectItem/Create.jsx`

- **パターン**: items配列を管理（ContractItemsと同じパターン）
- **Form component**: `ProjectItem/_components/Form.jsx` を使用

#### ContractItemインポート機能

```jsx
<ModalButton label="契約アイテムから追加">
    <ContractItemsTable
        items={contractItems}
        onSelect={(selectedIds) => handleAddContractItems(selectedIds)}
    />
</ModalButton>
```

**動作**:

1. モーダルでContractItemsを表示
2. 複数選択可能
3. 「適用」で選択したアイテムがフォームに追加される
4. 各アイテムは個別に編集可能（アコーディオン形式）
5. 不要なアイテムは削除可能

#### バックエンド実装

```php
// app/Http/Controllers/Admin/Project/ProjectItemController.php

public function store(ProjectItemRequest $request, Project $project, ProjectVersion $version): RedirectResponse
{
    $data = $request->validated();

    foreach ($data['items'] as $itemData) {
        $itemData['project_version_id'] = $version->id;
        $itemData['name'] = $itemData['title'];
        unset($itemData['title']);

        // デフォルト値設定
        $itemData['status'] = $itemData['status'] ?? 'not_started';
        $itemData['priority'] = $itemData['priority'] ?? 'medium';

        ProjectItem::create($itemData);
    }

    return back()->with('success', count($data['items']) . ' 個のアイテムを追加しました。');
}
```

#### バリデーション

```php
// app/Http/Requests/ProjectItemRequest.php

'items' => ['required', 'array', 'min:1'],
'items.*.title' => ['required', 'string', 'max:255'],
'items.*.start_date' => ['required', 'date'],
'items.*.end_date' => ['required', 'date', 'after_or_equal:items.*.start_date'],
'items.*.status' => ['required', 'in:not_started,in_progress,completed,on_hold,cancelled'],
'items.*.priority' => ['nullable', 'in:low,medium,high,urgent'],
```

---

## 6️⃣ ガントチャート表示

### ルート

- **表示**: `/admin/project/{project}/gantt`
- **画面**: `resources/js/Pages/Admin/Projects/GanttChart/Index.jsx`

### アクセス導線

1. **Project詳細画面** → 「概要」タブ → 現在のバージョンカード → 「ガントチャート」ボタン
2. **Project詳細画面** → 「ガントチャート」タブ → 「ガントチャートを開く」ボタン
3. **ProjectVersion詳細画面** → ヘッダーの「ガントチャート」ボタン

### 表示内容

- 現在のバージョン（is_current = true）のProjectItemsを可視化
- マイルストーンをグループとして表示
- ドラッグ＆ドロップで期間調整（今後実装）
- インライン編集（今後実装）

---

## 🔄 データフロー図

```
Project
  ├─ project_code (自動生成: PRJ-2025-00011234)
  ├─ start_date, estimated_end_date
  └─ contract_id (optional)

     ↓ 自動作成

ProjectVersion (Version 1)
  ├─ version = 1
  ├─ is_current = true
  ├─ start_date, estimated_end_date (Projectから継承)
  └─ 新規作成時のオプション:
      ├─ import_from_contract → ContractItems から ProjectItems 生成
      ├─ copy_from_current → 既存バージョンをコピー
      └─ auto_generate_milestones → マイルストーン自動生成

         ↓

ProjectMilestone (自動生成)
  ├─ title (要件定義・設計、開発フェーズ1、等)
  ├─ due_date (均等分割計算)
  └─ sort_order

         ↓

ProjectItem
  ├─ name (ContractItemからコピー or 手動入力)
  ├─ start_date, end_date (均等分割 or 手動設定)
  ├─ service_item_id (ContractItemから継承)
  ├─ milestone_id (optional)
  └─ status, priority

         ↓

GanttChart（可視化）
```

---

## ✅ 実装済み機能

1. ✅ Project基本情報登録 → Version 1自動作成
2. ✅ Project詳細画面に「現在のバージョン」カード表示
3. ✅ ProjectVersion作成時にContractItemsから取り込み
4. ✅ ProjectVersion作成時にマイルストーン自動生成
5. ✅ ProjectItem複数作成（items配列パターン）
6. ✅ ContractItem選択モーダル（アコーディオン表示）
7. ✅ ガントチャートへの明確な導線
8. ✅ マイルストーンタブに現在のバージョンのマイルストーン表示
9. ✅ 更新履歴タブにProjectUpdates表示

---

## 🚧 今後の実装予定

1. ❌ ガントチャート内でのドラッグ＆ドロップ編集
2. ❌ マイルストーンのドラッグ＆ドロップ並び替え
3. ❌ ProjectItemのドラッグ＆ドロップ並び替え
4. ❌ ファイルアップロード機能
5. ❌ ProjectUpdate作成フォーム

---

## 📝 まとめ

### 正しいフロー

```
1. Projectを作成（基本情報入力）
   → Version 1が自動作成される

2. Project詳細画面を確認
   → 「バージョン管理」ボタンでバージョン一覧へ

3. 新しいバージョンを作成
   ✅ ContractItemから取り込む（チェック）
   ✅ マイルストーン自動生成（フェーズ数を選択）
   → 保存

4. ProjectVersion詳細画面で確認
   → ProjectItemsが自動作成されている
   → マイルストーンが自動生成されている
   → 必要に応じて個別編集

5. ガントチャートで可視化
   → ドラッグ＆ドロップで調整（今後実装）
```

### 重要ポイント

- **ContractItem取り込み**: `Contract → ContractVersion → ContractItem` の3階層構造を理解する
- **期間自動分割**: ProjectItemsとMilestonesは期間を均等分割して自動計算
- **マイルストーン自動生成**: フェーズ数を選択すると、名前と期限が自動設定される
- **現在のバージョン**: `is_current = true` のバージョンがガントチャートに表示される
