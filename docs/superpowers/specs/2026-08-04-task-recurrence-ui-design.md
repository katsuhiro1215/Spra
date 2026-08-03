# タスク管理機能 — 繰り返し設定・タグUI 設計書

- 作成日: 2026-08-04
- 対象: 既存のAdmin向けタスク管理機能（`docs/superpowers/specs/2026-08-03-task-management-design.md`）で未対応だった2点への対応
- 前提: `main`に既にマージ済みのタスク管理機能（Task/TaskCategoryモデル、Repository/Service/Controller、カンバンボードUI）を拡張する

## 1. 背景・目的

タスク管理機能の最終コードレビューで、以下2点が「バックエンド/バッチは完成しているが未対応」として発見され、フェーズ2扱いとしていた。

1. 繰り返し設定（`recurrence_rule`）・タグ（`tags`）はDBカラム・バリデーション・バッチ処理まで実装済みだが、`TaskFormModal`に入力UIが無く、UIから作成できない。
2. 繰り返しタスクを作成した当日分が、カンバンボード・ダッシュボード・リマインダーのどの一覧にも表示されない設計上のギャップがある（テンプレート行自体は全ての一覧クエリで`whereNull('recurrence_rule')`により除外され、かつ重複生成防止のためテンプレート自身の`due_date`分は子タスクとしても生成されないため）。

本設計では、この2点を解消する。

## 2. バックエンド変更

### 2.1 繰り返しタスク作成時の当日分即時生成

`app/Services/TaskService.php`の`createTask(array $data, string $creatorId): Task`を修正し、作成したタスクが`recurrence_rule`を持ち、かつ`due_date`が今日の場合、その場で`generateOccurrencesForTemplate($task, 0)`を呼び出して当日分の実体タスクを1件即時生成する。

```php
public function createTask(array $data, string $creatorId): Task
{
    $data['created_by'] = $creatorId;
    $data['status'] ??= 'todo';
    $data['priority'] ??= 'medium';

    $task = $this->repository->create($data);

    if ($task->recurrence_rule && $task->due_date->isToday()) {
        $this->generateOccurrencesForTemplate($task, 0);
    }

    return $task;
}
```

`due_date`が今日でない場合（将来日付を開始日とする繰り返し設定）は、既存の日次バッチ（`tasks:generate-recurring`、06:10実行）がカーソル`today()`から`horizonDays`日先まで走査する際に自然にカバーされるため、追加対応は不要とする。

### 2.2 生成ロジックの簡素化（テンプレート自身の`due_date`除外処理を撤廃）

`generateOccurrencesForTemplate()`内の「テンプレート自身の`due_date`を除外扱いにする」特殊分岐（`->push($template->due_date->format('Y-m-d'))`）を削除し、既存の子タスクの日付のみで重複判定する通常のロジックに一本化する。

```php
private function generateOccurrencesForTemplate(Task $template, int $horizonDays): int
{
    $rule = $template->recurrence_rule;
    $freq = $rule['freq'] ?? 'daily';
    $byWeekday = $rule['byweekday'] ?? null;

    $existingDates = Task::where('parent_task_id', $template->id)
        ->pluck('due_date')
        ->map(fn ($date) => $date->format('Y-m-d'))
        ->all();

    // 以下、日付走査ロジックは変更なし
    // ...
}
```

これにより、2.1の即時生成で当日分の子タスクが既に存在していれば、翌日以降のバッチ実行時は「既存の子タスクの日付と重複するため生成しない」という通常のロジックで自然にスキップされる。`Task::factory()`で直接テンプレート行を作成する既存のUnitテストのように`createTask()`を経由しない場合は、当日分の子タスクが存在しないため、バッチ実行時に当日分も含めて生成される（想定通りの挙動）。

### 2.3 タグによる絞り込み

`app/Repositories/TaskRepository.php`の`findForBoard(array $filters)`に、`tag`キーが指定された場合の絞り込みを追加する。

```php
if (!empty($filters['tag'])) {
    $query->whereJsonContains('tags', $filters['tag']);
}
```

`TaskController::index()`の`$filters`配列に`'tag' => $request->input('tag')`を追加する。

## 3. フロントエンド変更

### 3.1 `TaskFormModal.jsx` — 繰り返し設定UI（新規作成時のみ）

- 「繰り返しタスクにする」チェックボックス（`Checkbox`コンポーネント）を追加。`isEdit === false`の場合のみ表示する。
- ONの場合、頻度セレクト（毎日/毎週）を表示。
- 「毎週」選択時、曜日チェックボックス（月・火・水・木・金・土・日）を表示。内部的には`Task::recurrence_rule.byweekday`の値（`mon`/`tue`/`wed`/`thu`/`fri`/`sat`/`sun`の3文字小文字表記、`Carbon::format('D')`の小文字化と一致させる）にマッピングする。
- 送信時、`useForm().transform()`でチェック状態から`recurrence_rule`オブジェクト（`{freq: 'daily'}`または`{freq: 'weekly', byweekday: [...]}`）を組み立てる。OFFの場合は`recurrence_rule`キー自体を送信しない（`null`）。

既存タスクの編集時（`isEdit === true`）は繰り返し設定UIを表示しない。繰り返しテンプレート行自体はカンバンボード等の一覧に一切表示されない設計のため、「既存の繰り返しタスクの設定を編集する」UIは今回のスコープに含めない（テンプレート管理UIは別途フェーズ2候補とする）。

### 3.2 `TaskFormModal.jsx` — タグ入力UI

- カンマ区切りのテキスト入力欄（`TextInput`）を追加。表示用に`tagsInput`という独立したフォームフィールドで管理し、送信時に`useForm().transform()`でカンマ区切り文字列を`tags`配列（空白トリム・空文字除去）に変換する。
- 編集時は`task.tags`（配列）をカンマ区切り文字列に変換して初期表示する。

### 3.3 `TaskFilterBar.jsx` — タグ絞り込み

- タグ名によるテキスト入力の絞り込みフィールドを追加し、`onChange("tag", value)`で`Index.jsx`側のフィルタ状態に反映する。

## 4. テスト方針

- `TaskRecurrenceGenerationTest`: 既存の「daily, horizonDays:3」テストの期待値を3件→4件（当日分含む）に更新。
- 新規: `TaskService::createTask()`が`recurrence_rule`かつ`due_date`が今日の場合に当日分を即時生成することを検証するテストを追加（`TaskServiceTest`または新規ファイル）。
- 新規: `TaskRepository::findForBoard()`のタグフィルタを検証するテストを追加。
- フロントエンドは既存方針通り、自動テストは無く`npm run build`のみで検証する。

## 5. スコープ外

- 繰り返しテンプレート行そのものの一覧表示・編集UI（作成後に繰り返し設定を変更する手段）
- 将来日付を開始日とする繰り返し設定について、開始日より前に誤って生成されないことの追加保証（現状の日次バッチのカーソルは常に`today()`起点であり、`due_date`が将来の場合でも`today()`からの生成対象になり得るが、これは本設計の対象とする2点（当日分の即時生成・タグUI）とは別の既存の設計上の性質であり、今回は変更しない）
