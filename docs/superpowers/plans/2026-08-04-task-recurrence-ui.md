# タスク管理機能 — 繰り返し設定・タグUI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 既存のタスク管理機能に、繰り返し設定（頻度・曜日）とタグの入力UIを追加し、繰り返しタスク作成時に当日分が即座に一覧へ反映されるようにする。

**Architecture:** バックエンドは`TaskService::createTask()`に当日分即時生成のフックを追加し、`generateOccurrencesForTemplate()`の特殊除外分岐を撤廃して通常の重複排除ロジックに一本化する。フロントエンドは`TaskFormModal`に繰り返し設定・タグの入力欄を追加し、`useForm().transform()`で送信直前にAPIが期待する形（`recurrence_rule`オブジェクト、`tags`配列）へ変換する。

**Tech Stack:** Laravel 12 / Inertia.js + React / PHPUnit（バックエンドのみ自動テストあり、フロントエンドは`npm run build`で検証）

## Global Constraints

- 新規/既存実装のバックエンドはRepository/Service/Controllerの3層構造を維持する（既存の`TaskService`/`TaskRepository`を拡張するのみで新規クラスは作らない）。
- `recurrence_rule.byweekday`の値は3文字小文字の曜日表記（`mon`/`tue`/`wed`/`thu`/`fri`/`sat`/`sun`）で統一する（既存の`Carbon::format('D')`を小文字化する実装と一致させる）。
- コミットメッセージは日本語で「なぜ」を意識する。
- フロントエンドに自動テストの仕組みは無い。検証ゲートは`npm run build`の成功のみ。
- 本番環境は稼働中のため、`migrate:fresh`等の破壊的コマンドは実行しない（本タスクはマイグレーション追加なし）。

---

### Task 1: 繰り返しタスク当日分の即時生成 + 除外ロジックの簡素化

**Files:**
- Modify: `app/Services/TaskService.php`
- Modify: `tests/Unit/Services/TaskRecurrenceGenerationTest.php`
- Test: `tests/Unit/Services/TaskServiceTest.php`

**Interfaces:**
- Consumes: `TaskService::generateOccurrencesForTemplate(Task $template, int $horizonDays): int`（既存private、変更なし・呼び出し元を追加するのみ）
- Produces: `TaskService::createTask()`が、`recurrence_rule`を持ち`due_date`が今日のタスクを作成した際、当日分の子タスクを1件即時生成する

- [ ] **Step 1: 既存テストの期待値を更新（失敗させる）**

`tests/Unit/Services/TaskRecurrenceGenerationTest.php`の`test_generates_daily_occurrences_up_to_horizon_without_duplicates`を以下に書き換える（`Task::factory()`で直接テンプレートを作るため`createTask()`の即時生成フックは経由しない。当日分を含めて4件生成されるのが正しい挙動になる）。

```php
public function test_generates_daily_occurrences_up_to_horizon_without_duplicates(): void
{
    $admin = Admin::factory()->create();
    $template = Task::factory()->for($admin, 'creator')->create([
        'admin_id' => $admin->id,
        'due_date' => today(),
        'recurrence_rule' => ['freq' => 'daily'],
        'parent_task_id' => null,
    ]);

    $service = app(TaskService::class);
    $created = $service->generateUpcomingOccurrences(horizonDays: 3);

    $this->assertSame(4, $created);
    $this->assertSame(4, Task::where('parent_task_id', $template->id)->count());

    $createdAgain = $service->generateUpcomingOccurrences(horizonDays: 3);
    $this->assertSame(0, $createdAgain);
}
```

- [ ] **Step 2: テストを実行して失敗を確認**

Run: `docker exec spra-laravel.test-1 php artisan test --filter=TaskRecurrenceGenerationTest`
Expected: FAIL（現状のコードは3件しか生成しないため`assertSame(4, $created)`が失敗する）

- [ ] **Step 3: `generateOccurrencesForTemplate()`から除外分岐を削除**

`app/Services/TaskService.php`の`generateOccurrencesForTemplate()`内、以下の部分を変更する。

変更前:
```php
        // テンプレート自身のdue_dateはその日の実体を兼ねるため、既存扱いにして重複生成を防ぐ
        $existingDates = Task::where('parent_task_id', $template->id)
            ->pluck('due_date')
            ->map(fn ($date) => $date->format('Y-m-d'))
            ->push($template->due_date->format('Y-m-d'))
            ->all();
```

変更後:
```php
        $existingDates = Task::where('parent_task_id', $template->id)
            ->pluck('due_date')
            ->map(fn ($date) => $date->format('Y-m-d'))
            ->all();
```

- [ ] **Step 4: `createTask()`に当日分即時生成のフックを追加**

`app/Services/TaskService.php`の`createTask()`を以下に書き換える。

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

- [ ] **Step 5: 既存テストを実行して成功を確認**

Run: `docker exec spra-laravel.test-1 php artisan test --filter=TaskRecurrenceGenerationTest`
Expected: PASS（2件とも）

- [ ] **Step 6: 「作成時に当日分が即時生成される」テストを追加**

`tests/Unit/Services/TaskServiceTest.php`に以下のテストメソッドを追記する。

```php
    public function test_create_task_with_recurrence_rule_due_today_immediately_generates_todays_occurrence(): void
    {
        $admin = Admin::factory()->create();

        $service = app(TaskService::class);
        $template = $service->createTask([
            'title' => '毎日SNS投稿',
            'due_date' => today()->format('Y-m-d'),
            'admin_id' => $admin->id,
            'recurrence_rule' => ['freq' => 'daily'],
        ], $admin->id);

        $this->assertSame(1, Task::where('parent_task_id', $template->id)->count());

        $child = Task::where('parent_task_id', $template->id)->first();
        $this->assertSame(today()->format('Y-m-d'), $child->due_date->format('Y-m-d'));
    }

    public function test_create_task_without_recurrence_rule_does_not_generate_occurrences(): void
    {
        $admin = Admin::factory()->create();

        $service = app(TaskService::class);
        $task = $service->createTask([
            'title' => '単発タスク',
            'due_date' => today()->format('Y-m-d'),
            'admin_id' => $admin->id,
        ], $admin->id);

        $this->assertSame(0, Task::where('parent_task_id', $task->id)->count());
    }
```

`Task`のuse importが無ければ`use App\Models\Task;`を追記する。

- [ ] **Step 7: 新規テストを実行して成功を確認**

Run: `docker exec spra-laravel.test-1 php artisan test --filter=TaskServiceTest`
Expected: PASS（既存2件＋新規2件）

- [ ] **Step 8: Commit**

```bash
git add app/Services/TaskService.php tests/Unit/Services/TaskRecurrenceGenerationTest.php tests/Unit/Services/TaskServiceTest.php
git commit -m "$(cat <<'EOF'
fix: 繰り返しタスク作成当日分が一覧に表示されない問題を修正

テンプレート行はカンバンボード等の全一覧で除外される設計のため、
作成当日分の実体タスクが生成されないと、作成した繰り返しタスクが
その日は誰の目にも触れないという問題があった。createTask()で
due_dateが今日の繰り返しタスクは即時に当日分を生成するようにし、
併せて生成ロジックの特殊除外分岐を撤廃して通常の重複排除に一本化した。
EOF
)"
```

---

### Task 2: タグによる絞り込み（バックエンド）

**Files:**
- Modify: `app/Repositories/TaskRepository.php`
- Modify: `app/Http/Controllers/Admin/TaskController.php`
- Test: `tests/Unit/Repositories/TaskRepositoryTest.php`

**Interfaces:**
- Consumes: `Task.tags`カラム（既存、`json`キャストの配列）
- Produces: `TaskRepository::findForBoard(array $filters)`が`$filters['tag']`を受け取った場合、`tags`配列に該当タグを含むタスクのみに絞り込む

- [ ] **Step 1: 失敗するテストを書く**

`tests/Unit/Repositories/TaskRepositoryTest.php`に以下を追記する。

```php
    public function test_find_for_board_filters_by_tag(): void
    {
        $repository = app(TaskRepositoryInterface::class);
        $admin = Admin::factory()->create();

        $matching = Task::factory()->for($admin, 'creator')->create(['tags' => ['SNS', '投稿']]);
        Task::factory()->for($admin, 'creator')->create(['tags' => ['事務']]);

        $result = $repository->findForBoard(['tag' => 'SNS']);

        $this->assertCount(1, $result);
        $this->assertSame($matching->id, $result->first()->id);
    }
```

- [ ] **Step 2: テストを実行して失敗を確認**

Run: `docker exec spra-laravel.test-1 php artisan test --filter=TaskRepositoryTest`
Expected: FAIL（`tag`フィルタが未実装のため2件とも返る）

- [ ] **Step 3: `TaskRepository::findForBoard()`にタグフィルタを追加**

`app/Repositories/TaskRepository.php`の`findForBoard()`内、`priority`フィルタのブロックの直後に追記する。

```php
        if (!empty($filters['tag'])) {
            $query->whereJsonContains('tags', $filters['tag']);
        }
```

- [ ] **Step 4: `TaskController::index()`のフィルタ配列に`tag`を追加**

`app/Http/Controllers/Admin/TaskController.php`の`index()`内、`$filters`配列に追記する。

```php
        $filters = [
            'admin_id' => $request->input('admin_id'),
            'task_category_id' => $request->input('task_category_id'),
            'priority' => $request->input('priority'),
            'tag' => $request->input('tag'),
        ];
```

- [ ] **Step 5: テストを実行して成功を確認**

Run: `docker exec spra-laravel.test-1 php artisan test --filter=TaskRepositoryTest`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add app/Repositories/TaskRepository.php app/Http/Controllers/Admin/TaskController.php tests/Unit/Repositories/TaskRepositoryTest.php
git commit -m "feat: タスク一覧をタグで絞り込めるようにする"
```

---

### Task 3: フロントエンド — 繰り返し設定UI（`TaskFormModal`）

**Files:**
- Modify: `resources/js/Pages/Admin/Tasks/_components/TaskFormModal.jsx`

**Interfaces:**
- Consumes: `TaskRequest`の`recurrence_rule.freq`（`daily`/`weekly`）・`recurrence_rule.byweekday`（3文字小文字の曜日配列）
- Produces: フォーム送信時、繰り返し有効なら`recurrence_rule`オブジェクトを、無効なら`recurrence_rule: null`を送信する

- [ ] **Step 1: `TaskFormModal.jsx`に繰り返し設定用のstateとUIを追加**

`useForm`の初期データに`recurrenceEnabled`・`freq`・`byweekday`を追加し（送信直前に`transform()`で`recurrence_rule`へ変換するため、これらのキー自体はバックエンドに送らない）、`isEdit === false`の場合のみ繰り返し設定セクションを表示する。

```jsx
import React from "react";
import { useForm } from "@inertiajs/react";
import Modal from "@/Components/Layout/Modal";
import { FormGroup, TextInput, TextArea, SelectInput, Checkbox } from "@/Components/Forms";
import { Button, CrudButton } from "@/Components/Buttons";

const WEEKDAYS = [
    { value: "mon", label: "月" },
    { value: "tue", label: "火" },
    { value: "wed", label: "水" },
    { value: "thu", label: "木" },
    { value: "fri", label: "金" },
    { value: "sat", label: "土" },
    { value: "sun", label: "日" },
];

export default function TaskFormModal({ show, onClose, task, categories, admins }) {
    const isEdit = Boolean(task);
    const { data, setData, post, put, processing, errors, reset, transform } = useForm({
        title: task?.title || "",
        description: task?.description || "",
        priority: task?.priority || "medium",
        task_category_id: task?.category?.id || "",
        admin_id: task?.admin?.id || "",
        due_date: task?.due_date || "",
        due_time: task?.due_time?.slice(0, 5) || "",
        tagsInput: (task?.tags || []).join(", "),
        recurrenceEnabled: false,
        freq: "daily",
        byweekday: [],
    });

    transform((formData) => {
        const { recurrenceEnabled, freq, byweekday, tagsInput, ...rest } = formData;

        return {
            ...rest,
            tags: tagsInput
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean),
            recurrence_rule: recurrenceEnabled
                ? { freq, ...(freq === "weekly" ? { byweekday } : {}) }
                : null,
        };
    });

    const toggleWeekday = (value) => {
        setData(
            "byweekday",
            data.byweekday.includes(value)
                ? data.byweekday.filter((d) => d !== value)
                : [...data.byweekday, value],
        );
    };

    const submit = (e) => {
        e.preventDefault();
        const options = {
            onSuccess: () => {
                reset();
                onClose();
            },
        };

        if (isEdit) {
            put(route("admin.task.update", task.id), options);
        } else {
            post(route("admin.task.store"), options);
        }
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="lg">
            <form onSubmit={submit} className="space-y-6 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {isEdit ? "タスク編集" : "タスク作成"}
                </h2>
                <FormGroup label="タイトル" htmlFor="title" required error={errors.title}>
                    <TextInput id="title" value={data.title} onChange={(e) => setData("title", e.target.value)} />
                </FormGroup>
                <FormGroup label="説明" htmlFor="description" error={errors.description}>
                    <TextArea id="description" value={data.description} onChange={(e) => setData("description", e.target.value)} />
                </FormGroup>
                <div className="grid grid-cols-2 gap-4">
                    <FormGroup label="期限日" htmlFor="due_date" required error={errors.due_date}>
                        <TextInput id="due_date" type="date" value={data.due_date} onChange={(e) => setData("due_date", e.target.value)} />
                    </FormGroup>
                    <FormGroup label="期限時刻" htmlFor="due_time" error={errors.due_time}>
                        <TextInput id="due_time" type="time" value={data.due_time} onChange={(e) => setData("due_time", e.target.value)} />
                    </FormGroup>
                </div>
                <FormGroup label="優先度" htmlFor="priority" error={errors.priority}>
                    <SelectInput
                        id="priority"
                        value={data.priority}
                        onChange={(e) => setData("priority", e.target.value)}
                        options={[{ value: "high", label: "高" }, { value: "medium", label: "中" }, { value: "low", label: "低" }]}
                    />
                </FormGroup>
                <FormGroup label="カテゴリ" htmlFor="task_category_id" error={errors.task_category_id}>
                    <SelectInput
                        id="task_category_id"
                        value={data.task_category_id}
                        onChange={(e) => setData("task_category_id", e.target.value)}
                        options={[{ value: "", label: "未分類" }, ...categories.map((c) => ({ value: c.id, label: c.name }))]}
                    />
                </FormGroup>
                <FormGroup label="担当者" htmlFor="admin_id" error={errors.admin_id}>
                    <SelectInput
                        id="admin_id"
                        value={data.admin_id}
                        onChange={(e) => setData("admin_id", e.target.value)}
                        options={[{ value: "", label: "未割当" }, ...admins.map((a) => ({ value: a.id, label: a.email }))]}
                    />
                </FormGroup>
                <FormGroup label="タグ" htmlFor="tagsInput" error={errors.tags}>
                    <TextInput
                        id="tagsInput"
                        value={data.tagsInput}
                        onChange={(e) => setData("tagsInput", e.target.value)}
                        placeholder="カンマ区切りで入力（例: SNS, 投稿）"
                    />
                </FormGroup>
                {!isEdit && (
                    <div className="space-y-3 rounded border border-gray-200 p-4 dark:border-gray-700">
                        <Checkbox
                            id="recurrenceEnabled"
                            checked={data.recurrenceEnabled}
                            onChange={(e) => setData("recurrenceEnabled", e.target.checked)}
                            label="繰り返しタスクにする"
                        />
                        {data.recurrenceEnabled && (
                            <>
                                <FormGroup label="頻度" htmlFor="freq" error={errors["recurrence_rule.freq"]}>
                                    <SelectInput
                                        id="freq"
                                        value={data.freq}
                                        onChange={(e) => setData("freq", e.target.value)}
                                        options={[{ value: "daily", label: "毎日" }, { value: "weekly", label: "毎週" }]}
                                    />
                                </FormGroup>
                                {data.freq === "weekly" && (
                                    <FormGroup label="曜日" htmlFor="byweekday">
                                        <div className="flex flex-wrap gap-3">
                                            {WEEKDAYS.map((day) => (
                                                <Checkbox
                                                    key={day.value}
                                                    id={`byweekday-${day.value}`}
                                                    checked={data.byweekday.includes(day.value)}
                                                    onChange={() => toggleWeekday(day.value)}
                                                    label={day.label}
                                                />
                                            ))}
                                        </div>
                                    </FormGroup>
                                )}
                            </>
                        )}
                    </div>
                )}
                <div className="flex justify-end gap-3">
                    <Button type="button" variant="secondary" onClick={onClose}>キャンセル</Button>
                    <CrudButton type="submit" action={isEdit ? "update" : "store"} loading={processing}>
                        {isEdit ? "更新" : "作成"}
                    </CrudButton>
                </div>
            </form>
        </Modal>
    );
}
```

- [ ] **Step 2: `npm run build`で検証**

Run: `npm run build`
Expected: ビルドエラーなし

- [ ] **Step 3: Commit**

```bash
git add resources/js/Pages/Admin/Tasks/_components/TaskFormModal.jsx
git commit -m "feat: タスク作成モーダルに繰り返し設定・タグ入力UIを追加"
```

---

### Task 4: フロントエンド — タグ絞り込みUI（`TaskFilterBar`）

**Files:**
- Modify: `resources/js/Pages/Admin/Tasks/_components/TaskFilterBar.jsx`

**Interfaces:**
- Consumes: `onChange(key, value)`（既存、`Index.jsx`から渡される）

- [ ] **Step 1: `TaskFilterBar.jsx`にタグ入力欄を追加**

```jsx
import React from "react";
import { SelectInput, TextInput } from "@/Components/Forms";

export default function TaskFilterBar({ filters, categories, admins, onChange }) {
    return (
        <div className="mb-4 flex gap-3">
            <SelectInput
                value={filters.admin_id || ""}
                onChange={(e) => onChange("admin_id", e.target.value)}
                options={[{ value: "", label: "すべての担当者" }, ...admins.map((a) => ({ value: a.id, label: a.email }))]}
            />
            <SelectInput
                value={filters.task_category_id || ""}
                onChange={(e) => onChange("task_category_id", e.target.value)}
                options={[{ value: "", label: "すべてのカテゴリ" }, ...categories.map((c) => ({ value: c.id, label: c.name }))]}
            />
            <SelectInput
                value={filters.priority || ""}
                onChange={(e) => onChange("priority", e.target.value)}
                options={[
                    { value: "", label: "すべての優先度" },
                    { value: "high", label: "高" },
                    { value: "medium", label: "中" },
                    { value: "low", label: "低" },
                ]}
            />
            <TextInput
                value={filters.tag || ""}
                onChange={(e) => onChange("tag", e.target.value)}
                placeholder="タグで絞り込み"
            />
        </div>
    );
}
```

- [ ] **Step 2: `npm run build`で検証**

Run: `npm run build`
Expected: ビルドエラーなし

- [ ] **Step 3: Commit**

```bash
git add resources/js/Pages/Admin/Tasks/_components/TaskFilterBar.jsx
git commit -m "feat: タスク一覧のタグ絞り込みUIを追加"
```

---

## 実装後の確認（PR作成前）

- `docker exec spra-laravel.test-1 php artisan test --filter=Task` が全件PASSしていること
- `npm run build` が成功すること
- 開発環境のブラウザで、繰り返しタスク作成→当日分がボードに表示されること、タグ絞り込みが動作することを確認していること（可能であれば）
