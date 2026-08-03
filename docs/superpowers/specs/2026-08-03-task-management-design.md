# タスク管理機能 設計書

- 作成日: 2026-08-03
- 対象: Admin向けタスク管理機能（カンバン方式）
- 関連ドキュメント: SPEC.md（本設計の完了後に §5 へ追記予定）、TASKS.md（本設計の完了後にフェーズ2へ追記予定）

## 1. 背景・目的

現在、Facebook/Instagram/X/Threads/LinkedInへのSNS投稿を時間を決めて運用しているが、投稿時間帯を忘れがちという課題がある。Admin向け中央管理システムにタスク管理機能を追加し、以下を実現する。

- SNS投稿タスクを日時（時刻まで）指定で登録・管理できる
- SNS以外の汎用タスクも同じ仕組みで管理できる（カテゴリで分類）
- ダッシュボードに「今日やること」を表示し、担当Adminが見落とさないようにする
- 期限が近づいたら通知でリマインドする
- 毎日/毎週の定期投稿のような繰り返しタスクに対応する
- Admin詳細画面から、そのAdminの担当タスクを確認できる

本機能はカンバンボード（未着手・進行中・完了の3列、`@dnd-kit`でドラッグ&ドロップ）を中心としたUIとし、TickTickのような軽量なタスク管理体験を目指す。

対象は全Admin共通の1つのボード（担当者・カテゴリ・優先度でフィルタ可能）とする。個人ごとに完全分離されたボードにはしない。

## 2. スコープ外（本設計では扱わない）

以下はTASKS.mdフェーズ2候補として別途記録し、今回は実装しない。

- タスクへのコメント・添付ファイル
- 複数Adminによる共同担当（1タスク=1担当者のみ）
- 既存のシフト/予約カレンダー（`ScheduleDefault`/`AppointmentSlot`等）との統合表示
- カスタムステータス列（列数はモデル定数で固定の3列）

## 3. データモデル

### 3.1 `tasks` テーブル

新規エンティティのため、`Project`等と同様に **ULID主体**（`HasUlid`トレイト）を採用する。`admin_id`は既存の`admins`テーブルに合わせて**UUID**参照とする。

| カラム | 型 | 説明 |
|---|---|---|
| id | ulid, PK | |
| title | string | タスク名（例:「Instagram投稿」） |
| description | text, nullable | 詳細メモ |
| status | string(enum) | `todo` / `in_progress` / `done`。モデル定数 `STATUSES` |
| priority | string(enum) | `high` / `medium` / `low`、デフォルト `medium`。モデル定数 `PRIORITIES` |
| task_category_id | ulid, FK→task_categories, nullable | カテゴリ（未分類も許容） |
| tags | json, nullable | 自由入力タグの配列 |
| admin_id | uuid, FK→admins, nullable, onDelete: set null | 担当者。未割当タスクも許容 |
| created_by | uuid, FK→admins, onDelete: restrict相当（作成者は残す） | 作成者 |
| due_date | date | 期限日 |
| due_time | time, nullable | 期限時刻。未指定は終日タスク扱い |
| completed_at | datetime, nullable | 完了操作時に記録 |
| recurrence_rule | json, nullable | 繰り返し設定。例: `{"freq":"weekly","byweekday":["mon","thu"]}` / `{"freq":"daily"}` |
| parent_task_id | ulid, FK→tasks(self), nullable, onDelete: cascade | 繰り返し生成された実体タスクが親テンプレートを参照 |
| timestamps | | |
| soft deletes | | |

インデックス: `(admin_id, due_date)`、`(status)`、`(task_category_id)`

**繰り返しタスクの扱い**: `recurrence_rule`を持つタスクは「テンプレート」として扱い、それ自体はボード・一覧・ダッシュボードの対象外（`parent_task_id IS NULL AND recurrence_rule IS NOT NULL` は非表示）。日次バッチが翌日以降分の実体タスク（`parent_task_id`にテンプレートIDを持ち、`recurrence_rule`はnull）を事前生成する。これによりUI側はテンプレートと実体を区別するロジックを持たずに済む（`AppointmentSlotRecurrence`と同じ設計思想）。

### 3.2 `task_categories` テーブル

| カラム | 型 | 説明 |
|---|---|---|
| id | ulid, PK | |
| name | string, unique | 例:「SNS投稿」「事務」 |
| color | string, nullable | UIでのタグ色分け用（例: `#4F46E5`） |
| sort_order | integer, default 0 | 表示順 |
| timestamps | | |

初期データ（シーダー）としてSNS運用を想定した「SNS投稿」を1件投入する想定。

## 4. バックエンド構成

`CLAUDE.md`の規約に従い、Repository/Service/Controllerの3層構造を踏襲する。

- `app/Models/Task.php`, `app/Models/TaskCategory.php`
- `app/Repositories/TaskRepository.php extends BaseRepository`
- `app/Repositories/TaskCategoryRepository.php extends BaseRepository`
- `app/Services/TaskService.php extends BaseService`
  - ステータス変更時、`done`への遷移で`completed_at`をセット、それ以外への変更で`completed_at`をnullに戻す
  - 繰り返しタスクの実体生成ロジック（`generateUpcomingOccurrences()`等）
- `app/Services/TaskCategoryService.php extends BaseService`
- `app/Http/Controllers/Admin/TaskController.php`
  - `auth('admins')`を明示。`index`/`store`/`update`/`updateStatus`（カンバンD&D専用、`status`のみ更新）/`destroy`
- `app/Http/Controllers/Admin/TaskCategoryController.php`（設定系の配下にマスタCRUD）

### 4.1 バッチ・通知

既存の`routes/console.php`のパターン（`$alertOnFailure(Schedule::command(...)->dailyAt(...))`）に倣い、以下を追加する。

- `php artisan tasks:generate-recurring`（`dailyAt('06:00')`付近、他の生成系ジョブと並べる）: 繰り返しテンプレートから翌日以降分の実体タスクを生成
- `php artisan tasks:send-reminders`（`dailyAt('08:30')`付近、`appointments:send-reminders`と同様の運用時間帯）: 当日期限で`due_time`が近い（例: 実行時刻から前後の対象時間帯）かつ未完了のタスクについて、担当Adminへ既存のLaravel DB通知（`Illuminate\Notifications`、`NotificationController`が既読処理する仕組み）でリマインドを送る

いずれも新規Artisanコマンドとして`app/Console/Commands/`配下に追加する。

### 4.2 権限

本リポジトリは`admin:sync-permissions`でルート定義から権限カタログを自動生成する方式のため、`TaskController`/`TaskCategoryController`のルートを`routes/admin.php`（または`routes/admin/*.php`の適切なファイル）に追加すれば権限は自動的に生成される。追加後、開発環境で`php artisan admin:sync-permissions`を実行して同期する（CLAUDE.md §2）。

## 5. フロントエンド構成（Inertia + React）

`resources/js/Pages/Admin/Tasks/` を新設する。

- `Index.jsx`: カンバンボード（`@dnd-kit/core` + `@dnd-kit/sortable`で3列D&D）と、テーブル表示への切替。担当者・カテゴリ・優先度・タグでのフィルタバーを持つ
- `Show.jsx`: タスク詳細（タイトル・説明・担当者・期限日時・優先度・カテゴリ/タグ・繰り返し設定）
- 新規作成・編集はモーダル形式（`_components/TaskFormModal.jsx`）とし、カンバン上での素早い操作を優先する
- `_components/TaskBoard.jsx`, `_components/TaskCard.jsx`, `_components/TaskFilterBar.jsx`, `_components/TaskFormModal.jsx`

ボタンは新規実装のため`@/Components/Buttons`の新`Button`/`CrudButton`/`IconButton`を使用する（CLAUDE.md §4）。

### 5.1 ダッシュボード統合

`AdminDashboardController::index()`に、ログイン中Admin（`auth('admins')->id()`）を担当者とする本日期限（`due_date = today`）かつ未完了のタスクを`due_time`昇順で取得する処理を追加し、`AdminDashboard.jsx`に「今日やること」ウィジェットとして表示する。既存の`getActionQueue()`（対応必要なもの一覧）とは別枠のセクションとする。

### 5.2 Admin詳細画面統合

`resources/js/Pages/Admin/Admin/Show.jsx`に、既存の`AdminBasicInfo`等と並ぶセクションとして「担当タスク」を追加する。`Admin/Admin/AdminController@show`にて、そのAdminが担当する未完了タスク（直近期限順、上限件数あり）を取得して渡す。

## 6. データフロー（カンバン操作時）

1. Adminがカードをドラッグして列を移動
2. フロントは`@dnd-kit`の`onDragEnd`で対象タスクIDと新`status`を検知し、`TaskController@updateStatus`へPATCHリクエスト
3. `TaskService`が`status`を更新し、`done`遷移なら`completed_at`をセット
4. Inertiaの部分リロード（`only: ['tasks']`等）でボードを再取得し、他ユーザーの変更も含めた最新状態を反映

## 7. エラーハンドリング

- `admin_id`が削除されたAdminを参照していた場合（論理削除）でも一覧取得は失敗しない（`admin_id`はnullable、削除時は`onDelete: set null`）
- 繰り返しテンプレートの`recurrence_rule`が不正な形式の場合、生成バッチは該当テンプレートをスキップしログに記録する（既存の`$alertOnFailure`ラッパーで失敗を検知）
- カンバンのステータス更新APIは楽観的UI更新を行わず、レスポンス確定後に反映する（同時操作によるステータス不整合を避けるため）

## 8. テスト方針

CLAUDE.md §6の方針（触った箇所から順次テストを追加）に従い、以下を最低限のFeatureテストとして追加する。

- タスクのステータス遷移（`todo`→`in_progress`→`done`で`completed_at`が正しくセット/クリアされること）
- 担当者ごとの「今日やること」抽出ロジック（`due_date`・担当者・完了状態での絞り込み）
- 繰り返しタスクの生成バッチ（`weekly`/`daily`ルールから正しい日付の実体タスクが作られること、既に生成済みの日付には重複生成しないこと）
- 権限（`admins`ガードでの`TaskController`アクセス制御、`PermissionEnforcementTest`パターンに準拠）

## 9. ドキュメント更新

実装完了後、以下を更新する（CLAUDE.md §8）。

- SPEC.md §5にタスク管理機能のドメイン仕様を追記
- TASKS.mdに完了タスクとして記録し、本設計でスコープ外とした項目（コメント機能・複数担当者・カレンダー統合等）をフェーズ2候補として追記
- 必要であれば`docs/`配下に実装ガイドを追加し、SPEC.md §9の索引に追記
