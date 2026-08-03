# タスク管理機能 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Admin向けにカンバン式タスク管理機能（一覧・詳細・ダッシュボード連携・リマインダー・繰り返しタスク）を追加する。

**Architecture:** Repository/Service/Controllerの3層構造（`BaseRepository`/`BaseService`継承）でバックエンドを構築し、Inertia.js + Reactでカンバン（`@dnd-kit`）と詳細画面を実装する。繰り返しタスクは「`recurrence_rule`を持つテンプレート行」から日次バッチで実体タスク（`parent_task_id`で紐づく子行）を事前生成し、UI・ダッシュボードは常に実体化済みの通常タスクだけを見る設計とする。

**Tech Stack:** Laravel 12 / Inertia.js / React / `@dnd-kit/core` `@dnd-kit/sortable`（既存依存、追加インストール不要） / Spatie Permission / PHPUnit

## Global Constraints

- 新規Model/Migrationは**ULID主体**（`App\Models\Concerns\HasUlid`）。`admin_id`系の外部キーのみ既存`admins`テーブルに合わせて**UUID**。
- Controller/Middleware/FormRequestでは`admins`ガードを明示する（`auth('admins')` / `Auth::guard('admins')`）。
- 新規実装は`App\Repositories\BaseRepository`と`App\Services\BaseService`を継承する。
- ボタンは新規実装で必ず`@/Components/Buttons`の新`Button`/`CrudButton`/`IconButton`を使う。
- Spatie権限を追加したら`php artisan admin:sync-permissions`を実行して同期する。
- 金額計算・ステータス遷移を伴う変更は、変更範囲のFeature/Unitテストを追加する（本機能はステータス遷移・リマインダー送信を含むため対象）。
- 本番環境は稼働中のため、`migrate:fresh`等の破壊的コマンドは実行しない。通常の`php artisan migrate`のみを想定する。
- フロントエンドに自動テストの仕組み（Jest/Vitest）は導入されていないため、フロントエンドタスクの検証は開発サーバーでのブラウザ動作確認とする。

---

## 事前準備: 開発DBの確認

このリポジトリは開発環境のみで稼働している（本番未リリース）。作業ブランチで`php artisan migrate`を実行する前に、`.env`の`DB_DATABASE`が本番DBを指していないことを確認すること。

---

### Task 1: DBスキーマ（`task_categories` / `tasks`）

**Files:**
- Create: `database/migrations/2026_08_03_000001_create_task_categories_table.php`
- Create: `database/migrations/2026_08_03_000002_create_tasks_table.php`

**Interfaces:**
- Produces: `task_categories`テーブル（`id: ulid`, `name`, `color`, `sort_order`, timestamps）
- Produces: `tasks`テーブル（`id: ulid`, `title`, `description`, `status`, `priority`, `task_category_id: ulid nullable`, `tags: json nullable`, `admin_id: uuid nullable`, `created_by: uuid`, `due_date`, `due_time: time nullable`, `completed_at: datetime nullable`, `recurrence_rule: json nullable`, `parent_task_id: ulid nullable`, timestamps, soft deletes）

- [ ] **Step 1: `task_categories`マイグレーションを作成**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('task_categories', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('name')->unique()->comment('カテゴリ名');
            $table->string('color', 7)->nullable()->comment('UI表示用カラーコード（例: #4F46E5）');
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('task_categories');
    }
};
```

- [ ] **Step 2: `tasks`マイグレーションを作成**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('status', ['todo', 'in_progress', 'done'])->default('todo');
            $table->enum('priority', ['high', 'medium', 'low'])->default('medium');

            $table->ulid('task_category_id')->nullable();
            $table->foreign('task_category_id')->references('id')->on('task_categories')->onDelete('set null');

            $table->json('tags')->nullable();

            $table->uuid('admin_id')->nullable()->comment('担当者');
            $table->foreign('admin_id')->references('id')->on('admins')->onDelete('set null');

            $table->uuid('created_by')->comment('作成者');
            $table->foreign('created_by')->references('id')->on('admins')->onDelete('cascade');

            $table->date('due_date');
            $table->time('due_time')->nullable();
            $table->dateTime('completed_at')->nullable();

            $table->json('recurrence_rule')->nullable()->comment('繰り返しテンプレート行のみ設定される');

            $table->ulid('parent_task_id')->nullable()->comment('繰り返し実体タスクが参照するテンプレートID');
            $table->foreign('parent_task_id')->references('id')->on('tasks')->onDelete('cascade');

            $table->timestamps();
            $table->softDeletes();

            $table->index(['admin_id', 'due_date']);
            $table->index('status');
            $table->index('task_category_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
```

- [ ] **Step 3: マイグレーションを実行して確認**

Run: `php artisan migrate`
Expected: 2つのテーブルが作成される（`php artisan migrate:status`で`Ran`になっていることを確認）

- [ ] **Step 4: Commit**

```bash
git add database/migrations/2026_08_03_000001_create_task_categories_table.php database/migrations/2026_08_03_000002_create_tasks_table.php
git commit -m "feat: タスク管理用のtask_categories/tasksテーブルを追加"
```

---

### Task 2: `TaskCategory`/`Task`モデルとFactory

**Files:**
- Create: `app/Models/TaskCategory.php`
- Create: `app/Models/Task.php`
- Create: `database/factories/TaskCategoryFactory.php`
- Create: `database/factories/TaskFactory.php`
- Test: `tests/Unit/Models/TaskTest.php`

**Interfaces:**
- Consumes: Task 1のテーブルスキーマ
- Produces: `Task::STATUSES = ['todo', 'in_progress', 'done']`、`Task::PRIORITIES = ['high', 'medium', 'low']`、`Task::isDone(): bool`、リレーション `category()`, `admin()`, `creator()`, `parent()`, `occurrences()`

- [ ] **Step 1: 失敗するテストを書く（ステータス定数とヘルパー）**

```php
<?php

namespace Tests\Unit\Models;

use App\Models\Admin;
use App\Models\Task;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskTest extends TestCase
{
    use RefreshDatabase;

    public function test_is_done_reflects_status(): void
    {
        $admin = Admin::factory()->create();
        $task = Task::factory()->for($admin, 'creator')->create(['status' => 'todo']);

        $this->assertFalse($task->isDone());

        $task->status = 'done';
        $this->assertTrue($task->isDone());
    }

    public function test_uses_ulid_as_primary_key(): void
    {
        $admin = Admin::factory()->create();
        $task = Task::factory()->for($admin, 'creator')->create();

        $this->assertSame(26, strlen($task->id));
        $this->assertFalse($task->incrementing);
    }
}
```

- [ ] **Step 2: テストを実行して失敗を確認**

Run: `php artisan test --filter=TaskTest`
Expected: FAIL（`Task`クラスが存在しない）

- [ ] **Step 3: `TaskCategory`モデルを実装**

```php
<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TaskCategory extends Model
{
    use HasUlid, HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'name',
        'color',
        'sort_order',
    ];

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }
}
```

- [ ] **Step 4: `Task`モデルを実装**

```php
<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Task extends Model
{
    use HasUlid, HasFactory, SoftDeletes;

    protected $keyType = 'string';
    public $incrementing = false;

    public const STATUSES = ['todo', 'in_progress', 'done'];
    public const PRIORITIES = ['high', 'medium', 'low'];

    protected $fillable = [
        'title',
        'description',
        'status',
        'priority',
        'task_category_id',
        'tags',
        'admin_id',
        'created_by',
        'due_date',
        'due_time',
        'completed_at',
        'recurrence_rule',
        'parent_task_id',
    ];

    protected $casts = [
        'tags' => 'array',
        'recurrence_rule' => 'array',
        'due_date' => 'date',
        'completed_at' => 'datetime',
    ];

    public function isDone(): bool
    {
        return $this->status === 'done';
    }

    public function isRecurringTemplate(): bool
    {
        return $this->parent_task_id === null && $this->recurrence_rule !== null;
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(TaskCategory::class, 'task_category_id');
    }

    public function admin(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'admin_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'created_by');
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Task::class, 'parent_task_id');
    }

    public function occurrences(): HasMany
    {
        return $this->hasMany(Task::class, 'parent_task_id');
    }
}
```

- [ ] **Step 5: Factoryを実装**

```php
<?php
// database/factories/TaskCategoryFactory.php
namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class TaskCategoryFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->unique()->words(2, true),
            'color' => fake()->hexColor(),
            'sort_order' => 0,
        ];
    }
}
```

```php
<?php
// database/factories/TaskFactory.php
namespace Database\Factories;

use App\Models\Admin;
use Illuminate\Database\Eloquent\Factories\Factory;

class TaskFactory extends Factory
{
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(4),
            'description' => fake()->optional()->paragraph(),
            'status' => 'todo',
            'priority' => 'medium',
            'admin_id' => null,
            'created_by' => Admin::factory(),
            'due_date' => fake()->dateTimeBetween('now', '+2 weeks')->format('Y-m-d'),
            'due_time' => null,
        ];
    }
}
```

- [ ] **Step 6: テストを実行して成功を確認**

Run: `php artisan test --filter=TaskTest`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add app/Models/Task.php app/Models/TaskCategory.php database/factories/TaskFactory.php database/factories/TaskCategoryFactory.php tests/Unit/Models/TaskTest.php
git commit -m "feat: Task/TaskCategoryモデルとFactoryを追加"
```

---

### Task 3: Repository層

**Files:**
- Create: `app/Repositories/Contracts/TaskRepositoryInterface.php`
- Create: `app/Repositories/Contracts/TaskCategoryRepositoryInterface.php`
- Create: `app/Repositories/TaskRepository.php`
- Create: `app/Repositories/TaskCategoryRepository.php`
- Modify: `app/Providers/AppServiceProvider.php`（既存のリポジトリbind一覧に追記。既存の`ContractRepositoryInterface::class => ContractRepository::class`等の並びを確認し同じ書式で追加）
- Test: `tests/Unit/Repositories/TaskRepositoryTest.php`

**Interfaces:**
- Consumes: `Task`/`TaskCategory`モデル（Task 2）、`BaseRepositoryInterface`（`create`/`update`/`delete`/`paginate`/`findById`等）
- Produces: `TaskRepositoryInterface::findTodayForAdmin(string $adminId): \Illuminate\Support\Collection`、`TaskRepositoryInterface::findAssignedTo(string $adminId, int $limit = 10): \Illuminate\Support\Collection`、`TaskRepositoryInterface::findForBoard(array $filters): \Illuminate\Support\Collection`

`BaseRepository::findWithFilters()`は`search`/`status`キーのみを解釈する汎用実装のため、カンバンの`admin_id`/`task_category_id`/`priority`フィルタには使えない。そのため専用メソッド`findForBoard()`を追加する。

- [ ] **Step 1: 失敗するテストを書く**

```php
<?php

namespace Tests\Unit\Repositories;

use App\Models\Admin;
use App\Models\Task;
use App\Repositories\Contracts\TaskRepositoryInterface;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskRepositoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_find_today_for_admin_returns_only_that_admins_undone_tasks_due_today(): void
    {
        $repository = app(TaskRepositoryInterface::class);
        $admin = Admin::factory()->create();
        $otherAdmin = Admin::factory()->create();

        $today = Task::factory()->for($admin, 'admin')->create([
            'admin_id' => $admin->id,
            'due_date' => today(),
            'status' => 'todo',
        ]);
        Task::factory()->create(['admin_id' => $admin->id, 'due_date' => today()->addDay(), 'status' => 'todo']);
        Task::factory()->create(['admin_id' => $otherAdmin->id, 'due_date' => today(), 'status' => 'todo']);
        Task::factory()->create(['admin_id' => $admin->id, 'due_date' => today(), 'status' => 'done']);

        $result = $repository->findTodayForAdmin($admin->id);

        $this->assertCount(1, $result);
        $this->assertSame($today->id, $result->first()->id);
    }
}
```

- [ ] **Step 2: テストを実行して失敗を確認**

Run: `php artisan test --filter=TaskRepositoryTest`
Expected: FAIL（バインディング未登録 or メソッド未定義）

- [ ] **Step 3: インターフェースを実装**

```php
<?php
// app/Repositories/Contracts/TaskRepositoryInterface.php
namespace App\Repositories\Contracts;

use Illuminate\Support\Collection;

interface TaskRepositoryInterface extends BaseRepositoryInterface
{
    public function findTodayForAdmin(string $adminId): Collection;

    public function findAssignedTo(string $adminId, int $limit = 10): Collection;

    public function findForBoard(array $filters): Collection;
}
```

```php
<?php
// app/Repositories/Contracts/TaskCategoryRepositoryInterface.php
namespace App\Repositories\Contracts;

interface TaskCategoryRepositoryInterface extends BaseRepositoryInterface
{
}
```

- [ ] **Step 4: リポジトリ実装を追加**

```php
<?php
// app/Repositories/TaskRepository.php
namespace App\Repositories;

use App\Models\Task;
use App\Repositories\Contracts\TaskRepositoryInterface;
use Illuminate\Support\Collection;

class TaskRepository extends BaseRepository implements TaskRepositoryInterface
{
    protected function getModelClass(): string
    {
        return Task::class;
    }

    protected function getSearchableFields(): array
    {
        return ['title', 'description'];
    }

    protected function getSortableFields(): array
    {
        return ['due_date', 'priority', 'created_at'];
    }

    public function findTodayForAdmin(string $adminId): Collection
    {
        return Task::whereNull('parent_task_id')
            ->orWhereNotNull('parent_task_id')
            ->where('admin_id', $adminId)
            ->whereDate('due_date', today())
            ->where('status', '!=', 'done')
            ->whereNull('recurrence_rule')
            ->orderBy('due_time')
            ->get();
    }

    public function findAssignedTo(string $adminId, int $limit = 10): Collection
    {
        return Task::where('admin_id', $adminId)
            ->whereNull('recurrence_rule')
            ->where('status', '!=', 'done')
            ->orderBy('due_date')
            ->orderBy('due_time')
            ->limit($limit)
            ->get();
    }

    public function findForBoard(array $filters): Collection
    {
        $query = Task::whereNull('recurrence_rule')
            ->with(['category', 'admin']);

        if (!empty($filters['admin_id'])) {
            $query->where('admin_id', $filters['admin_id']);
        }

        if (!empty($filters['task_category_id'])) {
            $query->where('task_category_id', $filters['task_category_id']);
        }

        if (!empty($filters['priority'])) {
            $query->where('priority', $filters['priority']);
        }

        return $query->orderBy('due_date')->orderBy('due_time')->get();
    }
}
```

`findTodayForAdmin`の`whereNull('parent_task_id')->orWhereNotNull('parent_task_id')`は冗長なので削除し、単純に以下へ整理する（テンプレート行は`whereNull('recurrence_rule')`で既に除外されるため）:

```php
    public function findTodayForAdmin(string $adminId): Collection
    {
        return Task::where('admin_id', $adminId)
            ->whereDate('due_date', today())
            ->where('status', '!=', 'done')
            ->whereNull('recurrence_rule')
            ->orderBy('due_time')
            ->get();
    }
```

```php
<?php
// app/Repositories/TaskCategoryRepository.php
namespace App\Repositories;

use App\Models\TaskCategory;
use App\Repositories\Contracts\TaskCategoryRepositoryInterface;

class TaskCategoryRepository extends BaseRepository implements TaskCategoryRepositoryInterface
{
    protected function getModelClass(): string
    {
        return TaskCategory::class;
    }

    protected function getSearchableFields(): array
    {
        return ['name'];
    }

    protected function getSortableFields(): array
    {
        return ['name', 'sort_order'];
    }
}
```

- [ ] **Step 5: `AppServiceProvider`にバインディングを追加**

`app/Providers/AppServiceProvider.php`を開き、既存の`$this->app->bind(XxxRepositoryInterface::class, XxxRepository::class);`の並びに以下を追記する。

```php
$this->app->bind(\App\Repositories\Contracts\TaskRepositoryInterface::class, \App\Repositories\TaskRepository::class);
$this->app->bind(\App\Repositories\Contracts\TaskCategoryRepositoryInterface::class, \App\Repositories\TaskCategoryRepository::class);
```

- [ ] **Step 6: テストを実行して成功を確認**

Run: `php artisan test --filter=TaskRepositoryTest`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add app/Repositories/Contracts/TaskRepositoryInterface.php app/Repositories/Contracts/TaskCategoryRepositoryInterface.php app/Repositories/TaskRepository.php app/Repositories/TaskCategoryRepository.php app/Providers/AppServiceProvider.php tests/Unit/Repositories/TaskRepositoryTest.php
git commit -m "feat: Task/TaskCategoryのRepository層を追加"
```

---

### Task 4: `TaskCategoryService`とマスタ管理API

**Files:**
- Create: `app/Services/TaskCategoryService.php`
- Create: `app/Http/Requests/TaskCategoryRequest.php`
- Create: `app/Http/Controllers/Admin/TaskCategoryController.php`
- Create: `routes/admin/task.php`
- Modify: `routes/admin.php`（`require __DIR__ . '/admin/task.php';`を、既存の`require`群と同じインデント・グループ内に追記。挿入位置は`announcement.php`の直後が自然）
- Test: `tests/Feature/Admin/TaskCategoryControllerTest.php`

**Interfaces:**
- Consumes: `TaskCategoryRepositoryInterface`（Task 3）
- Produces: ルート`admin.task-category.{index,create,store,edit,update,destroy}`

- [ ] **Step 1: 失敗するテストを書く**

```php
<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskCategoryControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
    }

    public function test_super_admin_can_create_task_category(): void
    {
        $admin = Admin::factory()->create(['role' => 'super_admin', 'status' => 'active']);

        $this->actingAs($admin, 'admins')
            ->post(route('admin.task-category.store'), [
                'name' => 'SNS投稿',
                'color' => '#4F46E5',
            ])
            ->assertRedirect(route('admin.task-category.index'));

        $this->assertDatabaseHas('task_categories', ['name' => 'SNS投稿']);
    }
}
```

- [ ] **Step 2: テストを実行して失敗を確認**

Run: `php artisan test --filter=TaskCategoryControllerTest`
Expected: FAIL（ルート未定義）

- [ ] **Step 3: FormRequestを実装**

```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TaskCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $categoryId = $this->route('task_category')?->id;

        return [
            'name' => ['required', 'string', 'max:100', "unique:task_categories,name,{$categoryId}"],
            'color' => ['nullable', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'カテゴリ名を入力してください。',
            'name.unique' => 'このカテゴリ名は既に使用されています。',
            'color.regex' => 'カラーコードは#RRGGBB形式で入力してください。',
        ];
    }
}
```

- [ ] **Step 4: Serviceを実装**

```php
<?php

namespace App\Services;

use App\Models\TaskCategory;
use App\Repositories\Contracts\TaskCategoryRepositoryInterface;

class TaskCategoryService extends BaseService
{
    public function __construct(TaskCategoryRepositoryInterface $repository)
    {
        parent::__construct($repository);
    }

    protected function getEntityName(): string
    {
        return 'TaskCategory';
    }

    public function listAll(): \Illuminate\Support\Collection
    {
        return TaskCategory::orderBy('sort_order')->orderBy('name')->get();
    }
}
```

- [ ] **Step 5: Controllerを実装**

```php
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\TaskCategoryRequest;
use App\Models\TaskCategory;
use App\Services\TaskCategoryService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class TaskCategoryController extends Controller
{
    public function __construct(private TaskCategoryService $service) {}

    public function index(): Response
    {
        return Inertia::render('Admin/TaskCategories/Index', [
            'categories' => $this->service->listAll(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/TaskCategories/Create');
    }

    public function store(TaskCategoryRequest $request): RedirectResponse
    {
        $this->service->create($request->validated());

        return redirect()->route('admin.task-category.index')
            ->with('success', __('messages.created', ['attribute' => 'タスクカテゴリ']));
    }

    public function edit(TaskCategory $taskCategory): Response
    {
        return Inertia::render('Admin/TaskCategories/Edit', [
            'category' => $taskCategory,
        ]);
    }

    public function update(TaskCategoryRequest $request, TaskCategory $taskCategory): RedirectResponse
    {
        $this->service->update($taskCategory, $request->validated());

        return redirect()->route('admin.task-category.index')
            ->with('success', __('messages.updated', ['attribute' => 'タスクカテゴリ']));
    }

    public function destroy(TaskCategory $taskCategory): RedirectResponse
    {
        $this->service->delete($taskCategory);

        return redirect()->route('admin.task-category.index')
            ->with('success', __('messages.deleted', ['attribute' => 'タスクカテゴリ']));
    }
}
```

- [ ] **Step 6: ルートファイルを作成**

```php
<?php
// routes/admin/task.php
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Admin\TaskCategoryController;

// 認証・権限ミドルウェアは admin.php 側の親グループで適用済みのためここでは付与しない

Route::resource('task-category', TaskCategoryController::class)->parameters(['task-category' => 'task_category']);
```

`routes/admin.php`の`require __DIR__ . '/admin/announcement.php';`の直後に以下を追記する。

```php
    require __DIR__ . '/admin/task.php';
```

- [ ] **Step 7: 権限を同期**

Run: `php artisan admin:sync-permissions`
Expected: `task-category.index`等の権限がpermissionsテーブルに登録される

- [ ] **Step 8: テストを実行して成功を確認**

Run: `php artisan test --filter=TaskCategoryControllerTest`
Expected: PASS

- [ ] **Step 9: Commit**

```bash
git add app/Services/TaskCategoryService.php app/Http/Requests/TaskCategoryRequest.php app/Http/Controllers/Admin/TaskCategoryController.php routes/admin/task.php routes/admin.php tests/Feature/Admin/TaskCategoryControllerTest.php
git commit -m "feat: タスクカテゴリのマスタ管理APIを追加"
```

---

### Task 5: `TaskService`のCRUDとステータス遷移

**Files:**
- Create: `app/Services/TaskService.php`
- Test: `tests/Unit/Services/TaskServiceTest.php`

**Interfaces:**
- Consumes: `TaskRepositoryInterface`（Task 3）
- Produces: `TaskService::createTask(array $data, string $creatorId): Task`、`TaskService::updateStatus(Task $task, string $status): Task`、`TaskService::getTodayForAdmin(string $adminId): Collection`、`TaskService::getAssignedTo(string $adminId, int $limit = 10): Collection`、`TaskService::getForBoard(array $filters): Collection`

- [ ] **Step 1: 失敗するテストを書く**

```php
<?php

namespace Tests\Unit\Services;

use App\Models\Admin;
use App\Models\Task;
use App\Services\TaskService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_update_status_to_done_sets_completed_at(): void
    {
        $admin = Admin::factory()->create();
        $task = Task::factory()->for($admin, 'creator')->create(['status' => 'todo']);

        $service = app(TaskService::class);
        $updated = $service->updateStatus($task, 'done');

        $this->assertSame('done', $updated->status);
        $this->assertNotNull($updated->completed_at);
    }

    public function test_update_status_away_from_done_clears_completed_at(): void
    {
        $admin = Admin::factory()->create();
        $task = Task::factory()->for($admin, 'creator')->create([
            'status' => 'done',
            'completed_at' => now(),
        ]);

        $service = app(TaskService::class);
        $updated = $service->updateStatus($task, 'in_progress');

        $this->assertSame('in_progress', $updated->status);
        $this->assertNull($updated->completed_at);
    }
}
```

- [ ] **Step 2: テストを実行して失敗を確認**

Run: `php artisan test --filter=TaskServiceTest`
Expected: FAIL（`TaskService`が存在しない）

- [ ] **Step 3: `TaskService`を実装**

```php
<?php

namespace App\Services;

use App\Models\Task;
use App\Repositories\Contracts\TaskRepositoryInterface;
use Illuminate\Support\Collection;

class TaskService extends BaseService
{
    public function __construct(TaskRepositoryInterface $repository)
    {
        parent::__construct($repository);
    }

    protected function getEntityName(): string
    {
        return 'Task';
    }

    public function createTask(array $data, string $creatorId): Task
    {
        $data['created_by'] = $creatorId;
        $data['status'] ??= 'todo';
        $data['priority'] ??= 'medium';

        return $this->repository->create($data);
    }

    public function updateStatus(Task $task, string $status): Task
    {
        $data = ['status' => $status];
        $data['completed_at'] = $status === 'done' ? now() : null;

        return $this->repository->update($task, $data);
    }

    public function getTodayForAdmin(string $adminId): Collection
    {
        return $this->repository->findTodayForAdmin($adminId);
    }

    public function getAssignedTo(string $adminId, int $limit = 10): Collection
    {
        return $this->repository->findAssignedTo($adminId, $limit);
    }

    public function getForBoard(array $filters): Collection
    {
        return $this->repository->findForBoard($filters);
    }
}
```

- [ ] **Step 4: テストを実行して成功を確認**

Run: `php artisan test --filter=TaskServiceTest`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add app/Services/TaskService.php tests/Unit/Services/TaskServiceTest.php
git commit -m "feat: TaskServiceにCRUDとステータス遷移ロジックを追加"
```

---

### Task 6: `TaskController`（一覧・作成・更新・ステータス変更・削除）

**Files:**
- Create: `app/Http/Requests/TaskRequest.php`
- Create: `app/Http/Controllers/Admin/TaskController.php`
- Modify: `routes/admin/task.php`
- Test: `tests/Feature/Admin/TaskControllerTest.php`

**Interfaces:**
- Consumes: `TaskService`（Task 5）、`TaskCategoryService::listAll()`（Task 4）
- Produces: ルート`admin.task.{index,store,update,destroy}`、`admin.task.status`（PATCH、ボディ`{status}`）

- [ ] **Step 1: 失敗するテストを書く**

```php
<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use App\Models\Task;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
    }

    public function test_admin_can_create_task(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);

        $this->actingAs($admin, 'admins')
            ->post(route('admin.task.store'), [
                'title' => 'Instagram投稿',
                'due_date' => today()->toDateString(),
                'due_time' => '14:00',
                'priority' => 'high',
                'admin_id' => $admin->id,
            ])
            ->assertRedirect(route('admin.task.index'));

        $this->assertDatabaseHas('tasks', ['title' => 'Instagram投稿', 'priority' => 'high']);
    }

    public function test_updating_status_to_done_sets_completed_at(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);
        $task = Task::factory()->for($admin, 'creator')->create(['status' => 'todo']);

        $this->actingAs($admin, 'admins')
            ->patch(route('admin.task.status', $task), ['status' => 'done'])
            ->assertRedirect();

        $this->assertNotNull($task->fresh()->completed_at);
    }

    public function test_editor_cannot_delete_task(): void
    {
        $editor = Admin::factory()->create(['role' => 'editor', 'status' => 'active']);
        $task = Task::factory()->for($editor, 'creator')->create();

        $this->actingAs($editor, 'admins')
            ->delete(route('admin.task.destroy', $task))
            ->assertForbidden();
    }
}
```

- [ ] **Step 2: テストを実行して失敗を確認**

Run: `php artisan test --filter=TaskControllerTest`
Expected: FAIL（ルート未定義）

- [ ] **Step 3: FormRequestを実装**

```php
<?php

namespace App\Http\Requests;

use App\Models\Task;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'status' => ['nullable', Rule::in(Task::STATUSES)],
            'priority' => ['nullable', Rule::in(Task::PRIORITIES)],
            'task_category_id' => ['nullable', 'exists:task_categories,id'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string', 'max:50'],
            'admin_id' => ['nullable', 'exists:admins,id'],
            'due_date' => ['required', 'date'],
            'due_time' => ['nullable', 'date_format:H:i'],
            'recurrence_rule' => ['nullable', 'array'],
            'recurrence_rule.freq' => ['required_with:recurrence_rule', Rule::in(['daily', 'weekly'])],
            'recurrence_rule.byweekday' => ['nullable', 'array'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'タイトルを入力してください。',
            'due_date.required' => '期限日を入力してください。',
            'due_time.date_format' => '時刻はHH:MM形式で入力してください。',
        ];
    }
}
```

- [ ] **Step 4: `TaskController`を実装**

```php
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\TaskRequest;
use App\Models\Admin;
use App\Models\Task;
use App\Services\TaskCategoryService;
use App\Services\TaskService;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class TaskController extends Controller
{
    public function __construct(
        private TaskService $service,
        private TaskCategoryService $categoryService,
    ) {}

    public function index(Request $request): Response
    {
        $filters = [
            'admin_id' => $request->input('admin_id'),
            'task_category_id' => $request->input('task_category_id'),
            'priority' => $request->input('priority'),
        ];

        $tasks = $this->service->getForBoard(array_filter($filters));

        return Inertia::render('Admin/Tasks/Index', [
            'tasks' => $tasks,
            'categories' => $this->categoryService->listAll(),
            'admins' => Admin::where('status', 'active')->orderBy('email')->get(['id', 'email']),
            'filters' => $filters,
        ]);
    }

    public function store(TaskRequest $request): RedirectResponse
    {
        $this->service->createTask($request->validated(), Auth::guard('admins')->id());

        return redirect()->route('admin.task.index')
            ->with('success', __('messages.created', ['attribute' => 'タスク']));
    }

    public function update(TaskRequest $request, Task $task): RedirectResponse
    {
        $this->service->update($task, $request->validated());

        return redirect()->route('admin.task.index')
            ->with('success', __('messages.updated', ['attribute' => 'タスク']));
    }

    public function updateStatus(Request $request, Task $task): RedirectResponse
    {
        $request->validate(['status' => ['required', Rule::in(Task::STATUSES)]]);

        $this->service->updateStatus($task, $request->input('status'));

        return redirect()->back();
    }

    public function destroy(Task $task): RedirectResponse
    {
        $this->service->delete($task);

        return redirect()->route('admin.task.index')
            ->with('success', __('messages.deleted', ['attribute' => 'タスク']));
    }
}
```

`getRepository(): BaseRepositoryInterface`は`app/Services/BaseService.php:85`で既に定義されている（`TaskService`は`BaseService`を継承しているため追加実装は不要）。
- [ ] **Step 5: ルートを追記**

```php
// routes/admin/task.php に追記
use App\Http\Controllers\Admin\TaskController;

Route::resource('task', TaskController::class)->except(['create', 'edit', 'show']);
Route::patch('/task/{task}/status', [TaskController::class, 'updateStatus'])->name('task.status');
```

- [ ] **Step 6: 権限を同期**

Run: `php artisan admin:sync-permissions`

`config/admin_permissions.php`の`action_labels`に以下を追記する。

```php
'status' => 'ステータス変更',
```

- [ ] **Step 7: テストを実行して成功を確認**

Run: `php artisan test --filter=TaskControllerTest`
Expected: PASS

- [ ] **Step 8: Commit**

```bash
git add app/Http/Requests/TaskRequest.php app/Http/Controllers/Admin/TaskController.php app/Services/TaskService.php routes/admin/task.php config/admin_permissions.php tests/Feature/Admin/TaskControllerTest.php
git commit -m "feat: タスクのCRUD・ステータス変更APIを追加"
```

---

### Task 7: ダッシュボード「今日やること」統合

**Files:**
- Modify: `app/Http/Controllers/Admin/AdminDashboardController.php`
- Test: `tests/Feature/Admin/AdminDashboardTaskWidgetTest.php`

**Interfaces:**
- Consumes: `TaskService::getTodayForAdmin(string $adminId): Collection`（Task 5）

- [ ] **Step 1: 失敗するテストを書く**

```php
<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use App\Models\Task;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminDashboardTaskWidgetTest extends TestCase
{
    use RefreshDatabase;

    public function test_dashboard_shows_only_logged_in_admins_today_tasks(): void
    {
        $admin = Admin::factory()->create(['status' => 'active']);
        $otherAdmin = Admin::factory()->create(['status' => 'active']);

        $mine = Task::factory()->for($admin, 'creator')->create([
            'admin_id' => $admin->id,
            'due_date' => today(),
            'title' => 'X投稿',
        ]);
        Task::factory()->create(['admin_id' => $otherAdmin->id, 'due_date' => today()]);

        $response = $this->actingAs($admin, 'admins')->get(route('admin.dashboard'));

        $response->assertInertia(fn ($page) => $page
            ->has('todayTasks', 1)
            ->where('todayTasks.0.id', $mine->id));
    }
}
```

- [ ] **Step 2: テストを実行して失敗を確認**

Run: `php artisan test --filter=AdminDashboardTaskWidgetTest`
Expected: FAIL（`todayTasks`プロパティが存在しない）

- [ ] **Step 3: `AdminDashboardController`を修正**

`use App\Services\TaskService;`を追加し、コンストラクタインジェクションを追加、`index()`の戻り値に`'todayTasks' => $this->taskService->getTodayForAdmin(auth('admins')->id())`を追加する。

```php
use App\Services\TaskService;
// ...
class AdminDashboardController extends Controller
{
    private const ACTIVE_PROJECT_STATUSES = ['planning', 'design', 'development', 'testing', 'review'];

    public function __construct(private TaskService $taskService) {}

    public function index(): Response
    {
        return Inertia::render('AdminDashboard', [
            'queue' => $this->getActionQueue(),
            'kpis' => $this->getKpis(),
            'trends' => $this->getTrends(),
            'logs' => $this->getRecentLogs(),
            'todayTasks' => $this->taskService->getTodayForAdmin(auth('admins')->id()),
        ]);
    }
    // ...
```

- [ ] **Step 4: テストを実行して成功を確認**

Run: `php artisan test --filter=AdminDashboardTaskWidgetTest`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add app/Http/Controllers/Admin/AdminDashboardController.php tests/Feature/Admin/AdminDashboardTaskWidgetTest.php
git commit -m "feat: ダッシュボードに今日のタスクを追加"
```

---

### Task 8: Admin詳細画面「担当タスク」統合

**Files:**
- Modify: `app/Http/Controllers/Admin/Admin/AdminController.php`（`show`アクションに追記）
- Test: `tests/Feature/Admin/AdminShowAssignedTasksTest.php`

**Interfaces:**
- Consumes: `TaskService::getAssignedTo(string $adminId, int $limit = 10): Collection`（Task 5）

- [ ] **Step 1: 失敗するテストを書く**

```php
<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use App\Models\Task;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminShowAssignedTasksTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_show_page_includes_assigned_tasks(): void
    {
        $viewer = Admin::factory()->create(['role' => 'super_admin', 'status' => 'active']);
        $target = Admin::factory()->create(['status' => 'active']);
        $task = Task::factory()->for($viewer, 'creator')->create([
            'admin_id' => $target->id,
            'status' => 'todo',
        ]);

        $response = $this->actingAs($viewer, 'admins')->get(route('admin.admin.show', $target));

        $response->assertInertia(fn ($page) => $page
            ->has('assignedTasks', 1)
            ->where('assignedTasks.0.id', $task->id));
    }
}
```

- [ ] **Step 2: テストを実行して失敗を確認**

Run: `php artisan test --filter=AdminShowAssignedTasksTest`
Expected: FAIL

- [ ] **Step 3: `AdminController@show`を修正**

`app/Http/Controllers/Admin/Admin/AdminController.php`のコンストラクタに`TaskService`を注入し（既存のコンストラクタ注入プロパティの並びに追記）、`show`メソッド内の`return Inertia::render('Admin/Admin/Show', [...])`に`'assignedTasks'`キーを追加する。

```php
// コンストラクタに追加（既存の他サービス注入と同じ並びで）
private TaskService $taskService,
```

```php
        return Inertia::render('Admin/Admin/Show', [
            'admin' => $admin,
            'mediaList' => $mediaList,
            'permissionOverride' => $permissionOverride,
            'loginLogs' => $loginLogs,
            'employmentTypes' => collect(AdminEmployment::EMPLOYMENT_TYPES)
                ->map(fn ($label, $value) => ['value' => $value, 'label' => $label])
                ->values(),
            'payTypes' => collect(AdminEmployment::PAY_TYPES)
                ->map(fn ($label, $value) => ['value' => $value, 'label' => $label])
                ->values(),
            'assignedTasks' => $this->taskService->getAssignedTo($admin->id),
        ]);
```

`use App\Services\TaskService;`をファイル先頭のuse句に追加する。

- [ ] **Step 4: テストを実行して成功を確認**

Run: `php artisan test --filter=AdminShowAssignedTasksTest`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add app/Http/Controllers/Admin/Admin/AdminController.php tests/Feature/Admin/AdminShowAssignedTasksTest.php
git commit -m "feat: Admin詳細画面に担当タスク一覧を追加"
```

---

### Task 9: 繰り返しタスクの生成バッチ

**Files:**
- Modify: `app/Services/TaskService.php`
- Create: `app/Console/Commands/GenerateRecurringTasks.php`
- Modify: `routes/console.php`
- Test: `tests/Unit/Services/TaskRecurrenceGenerationTest.php`

**Interfaces:**
- Consumes: `Task::isRecurringTemplate()`（Task 2）
- Produces: `TaskService::generateUpcomingOccurrences(int $horizonDays = 14): int`

- [ ] **Step 1: 失敗するテストを書く**

```php
<?php

namespace Tests\Unit\Services;

use App\Models\Admin;
use App\Models\Task;
use App\Services\TaskService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskRecurrenceGenerationTest extends TestCase
{
    use RefreshDatabase;

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

        $this->assertSame(3, $created);
        $this->assertSame(3, Task::where('parent_task_id', $template->id)->count());

        $createdAgain = $service->generateUpcomingOccurrences(horizonDays: 3);
        $this->assertSame(0, $createdAgain);
    }
}
```

- [ ] **Step 2: テストを実行して失敗を確認**

Run: `php artisan test --filter=TaskRecurrenceGenerationTest`
Expected: FAIL（`generateUpcomingOccurrences`未定義）

- [ ] **Step 3: `TaskService`に生成ロジックを追加**

```php
// app/Services/TaskService.php に追記
use App\Models\Task;
use Carbon\Carbon;

public function generateUpcomingOccurrences(int $horizonDays = 14): int
{
    $templates = Task::whereNull('parent_task_id')
        ->whereNotNull('recurrence_rule')
        ->get();

    $createdCount = 0;

    foreach ($templates as $template) {
        $createdCount += $this->generateOccurrencesForTemplate($template, $horizonDays);
    }

    return $createdCount;
}

private function generateOccurrencesForTemplate(Task $template, int $horizonDays): int
{
    $rule = $template->recurrence_rule;
    $freq = $rule['freq'] ?? 'daily';
    $byWeekday = $rule['byweekday'] ?? null;

    $existingDates = Task::where('parent_task_id', $template->id)
        ->pluck('due_date')
        ->map(fn ($date) => $date->format('Y-m-d'))
        ->all();

    $created = 0;
    $cursor = today();
    $until = today()->addDays($horizonDays);

    while ($cursor->lte($until)) {
        $matches = match ($freq) {
            'daily' => true,
            'weekly' => $byWeekday === null || in_array(strtolower($cursor->format('D')), array_map('strtolower', $byWeekday), true),
            default => false,
        };

        if ($matches && !in_array($cursor->format('Y-m-d'), $existingDates, true)) {
            $this->repository->create([
                'title' => $template->title,
                'description' => $template->description,
                'priority' => $template->priority,
                'task_category_id' => $template->task_category_id,
                'tags' => $template->tags,
                'admin_id' => $template->admin_id,
                'created_by' => $template->created_by,
                'due_date' => $cursor->format('Y-m-d'),
                'due_time' => $template->due_time,
                'parent_task_id' => $template->id,
                'status' => 'todo',
            ]);
            $created++;
        }

        $cursor->addDay();
    }

    return $created;
}
```

`Carbon`の`format('D')`は`Mon`/`Tue`のような3文字表記のため、`byweekday`の値は`['mon','tue',...]`の3文字小文字表記に統一する（設計書の例と一致）。

- [ ] **Step 4: Artisanコマンドを追加**

```php
<?php

namespace App\Console\Commands;

use App\Services\TaskService;
use Illuminate\Console\Command;

class GenerateRecurringTasks extends Command
{
    protected $signature = 'tasks:generate-recurring';

    protected $description = '繰り返しタスク設定から、先行生成分の実体タスクを穴埋めします';

    public function handle(TaskService $service)
    {
        $this->info('繰り返しタスクを生成しています...');

        $count = $service->generateUpcomingOccurrences();

        $this->info("{$count}件のタスクを生成しました。");

        return Command::SUCCESS;
    }
}
```

- [ ] **Step 5: `routes/console.php`にスケジュール登録**

既存の`$alertOnFailure(Schedule::command('appointments:generate-recurring-slots')->dailyAt('06:00'));`の直後に以下を追記する。

```php
$alertOnFailure(Schedule::command('tasks:generate-recurring')->dailyAt('06:10'));
```

- [ ] **Step 6: テストを実行して成功を確認**

Run: `php artisan test --filter=TaskRecurrenceGenerationTest`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add app/Services/TaskService.php app/Console/Commands/GenerateRecurringTasks.php routes/console.php tests/Unit/Services/TaskRecurrenceGenerationTest.php
git commit -m "feat: 繰り返しタスクの自動生成バッチを追加"
```

---

### Task 10: リマインダー通知

**Files:**
- Create: `app/Notifications/TaskDueReminder.php`
- Modify: `app/Services/TaskService.php`
- Create: `app/Console/Commands/SendTaskReminders.php`
- Modify: `routes/console.php`
- Test: `tests/Feature/TaskReminderTest.php`

**Interfaces:**
- Consumes: `Task`モデル（Task 2）、既存のDB通知チャンネル（`NotificationController`が既読処理する仕組み、`app/Notifications/PaymentReported.php`と同パターン）
- Produces: `TaskService::getTasksNeedingReminder(int $withinMinutes = 30): Collection`

- [ ] **Step 1: 失敗するテストを書く**

```php
<?php

namespace Tests\Feature;

use App\Models\Admin;
use App\Models\Task;
use App\Notifications\TaskDueReminder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class TaskReminderTest extends TestCase
{
    use RefreshDatabase;

    public function test_send_reminders_command_notifies_admin_for_tasks_due_soon(): void
    {
        Notification::fake();

        $admin = Admin::factory()->create(['status' => 'active']);
        $task = Task::factory()->for($admin, 'creator')->create([
            'admin_id' => $admin->id,
            'due_date' => today(),
            'due_time' => now()->addMinutes(15)->format('H:i'),
            'status' => 'todo',
        ]);

        $this->artisan('tasks:send-reminders')->assertExitCode(0);

        Notification::assertSentTo($admin, TaskDueReminder::class, function ($notification) use ($task) {
            return $notification->toArray($admin)['task_id'] === $task->id;
        });
    }
}
```

- [ ] **Step 2: テストを実行して失敗を確認**

Run: `php artisan test --filter=TaskReminderTest`
Expected: FAIL（コマンド・通知クラス未定義）

- [ ] **Step 3: 通知クラスを実装**

```php
<?php

namespace App\Notifications;

use App\Models\Task;
use Illuminate\Notifications\Notification;

class TaskDueReminder extends Notification
{
    public function __construct(private Task $task) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'title' => 'タスクの期限が近づいています',
            'message' => "「{$this->task->title}」の期限が近づいています。",
            'task_id' => $this->task->id,
            'url' => route('admin.task.index'),
        ];
    }
}
```

- [ ] **Step 4: `TaskService`に対象取得ロジックを追加**

```php
// app/Services/TaskService.php に追記
public function getTasksNeedingReminder(int $withinMinutes = 30): \Illuminate\Support\Collection
{
    $now = now();
    $windowEnd = $now->copy()->addMinutes($withinMinutes);

    return Task::whereNotNull('admin_id')
        ->whereNotNull('due_time')
        ->whereDate('due_date', today())
        ->where('status', '!=', 'done')
        ->whereNull('recurrence_rule')
        ->get()
        ->filter(function (Task $task) use ($now, $windowEnd) {
            $dueAt = \Carbon\Carbon::parse($task->due_date->format('Y-m-d') . ' ' . $task->due_time);

            return $dueAt->between($now, $windowEnd);
        });
}
```

- [ ] **Step 5: Artisanコマンドを追加**

```php
<?php

namespace App\Console\Commands;

use App\Services\TaskService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Notification;
use App\Notifications\TaskDueReminder;

class SendTaskReminders extends Command
{
    protected $signature = 'tasks:send-reminders {--minutes=30 : 期限の何分前を対象にするか}';

    protected $description = '期限が近いタスクの担当者へリマインダー通知を送信します';

    public function handle(TaskService $service)
    {
        $minutes = (int) $this->option('minutes');
        $tasks = $service->getTasksNeedingReminder($minutes);

        foreach ($tasks as $task) {
            Notification::send($task->admin, new TaskDueReminder($task));
        }

        $this->info("{$tasks->count()}件のリマインダーを送信しました。");

        return Command::SUCCESS;
    }
}
```

- [ ] **Step 6: `routes/console.php`にスケジュール登録**

15分おきに実行し、`--minutes=30`のデフォルト窓と組み合わせて期限30分前までに1回は捕捉できるようにする。

```php
$alertOnFailure(Schedule::command('tasks:send-reminders')->everyFifteenMinutes());
```

- [ ] **Step 7: テストを実行して成功を確認**

Run: `php artisan test --filter=TaskReminderTest`
Expected: PASS

- [ ] **Step 8: Commit**

```bash
git add app/Notifications/TaskDueReminder.php app/Services/TaskService.php app/Console/Commands/SendTaskReminders.php routes/console.php tests/Feature/TaskReminderTest.php
git commit -m "feat: タスク期限のリマインダー通知を追加"
```

---

### Task 11: フロントエンド — タスクカテゴリ管理画面

**Files:**
- Create: `resources/js/Pages/Admin/TaskCategories/Index.jsx`
- Create: `resources/js/Pages/Admin/TaskCategories/Create.jsx`
- Create: `resources/js/Pages/Admin/TaskCategories/Edit.jsx`
- Create: `resources/js/Pages/Admin/TaskCategories/_components/Form.jsx`

**Interfaces:**
- Consumes: `admin.task-category.{index,store,edit,update,destroy}`ルート（Task 4）

**参照実装:** `resources/js/Pages/Admin/Admin/Create.jsx`（`FormGroup`+`Button`/`CrudButton`+`PageHeader actions`配列の標準パターン）、`resources/js/Components/Layout/PageHeader.jsx`（`actions`は`{label, icon, variant, route}`の配列で、JSXは渡さない）。

- [ ] **Step 1: `_components/Form.jsx`（name/colorの共通フォーム）を実装**

```jsx
import React from "react";
import { FormGroup, TextInput } from "@/Components/Forms";
import { Button, CrudButton } from "@/Components/Buttons";

export default function Form({ data, setData, errors, onSubmit, processing, submitLabel, cancelRoute }) {
    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <FormGroup label="カテゴリ名" htmlFor="name" required error={errors.name}>
                <TextInput
                    id="name"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                />
            </FormGroup>
            <FormGroup label="カラー" htmlFor="color" error={errors.color}>
                <input
                    id="color"
                    type="color"
                    value={data.color || "#4F46E5"}
                    onChange={(e) => setData("color", e.target.value)}
                    className="h-10 w-16 rounded border border-gray-300"
                />
            </FormGroup>
            <div className="flex items-center justify-end gap-4">
                <Button variant="secondary" href={route(cancelRoute)}>
                    キャンセル
                </Button>
                <CrudButton type="submit" action="store" loading={processing}>
                    {submitLabel}
                </CrudButton>
            </div>
        </form>
    );
}
```

- [ ] **Step 2: `Index.jsx`を実装**

```jsx
import React from "react";
import { Head, Link, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { Card } from "@/Components/Card";
import { IconButton } from "@/Components/Buttons";
import { PlusIcon, TrashIcon, PencilIcon } from "@heroicons/react/24/outline";

export default function Index({ categories }) {
    const handleDelete = (category) => {
        if (confirm(`「${category.name}」を削除しますか？`)) {
            router.delete(route("admin.task-category.destroy", category.id));
        }
    };

    const headerActions = [
        {
            label: "新規作成",
            icon: PlusIcon,
            variant: "primary",
            route: route("admin.task-category.create"),
        },
    ];

    return (
        <AdminAuthenticatedLayout
            header={<PageHeader title="タスクカテゴリ" description="タスクの分類マスタを管理します" actions={headerActions} />}
        >
            <Head title="タスクカテゴリ" />
            <FlashMessage />
            <Card>
                <div className="divide-y">
                    {categories.map((category) => (
                        <div key={category.id} className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-2">
                                <span
                                    className="h-3 w-3 rounded-full"
                                    style={{ backgroundColor: category.color || "#9CA3AF" }}
                                />
                                <span>{category.name}</span>
                            </div>
                            <div className="flex gap-2">
                                <Link href={route("admin.task-category.edit", category.id)}>
                                    <IconButton icon={<PencilIcon className="h-4 w-4" />} />
                                </Link>
                                <IconButton
                                    icon={<TrashIcon className="h-4 w-4" />}
                                    variant="danger-text"
                                    onClick={() => handleDelete(category)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </AdminAuthenticatedLayout>
    );
}
```

- [ ] **Step 3: `Create.jsx`/`Edit.jsx`を実装**

```jsx
// Create.jsx
import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { Card, CardBody } from "@/Components/Card";
import Form from "./_components/Form";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({ name: "", color: "#4F46E5" });

    const submit = (e) => {
        e.preventDefault();
        post(route("admin.task-category.store"));
    };

    return (
        <AdminAuthenticatedLayout header={<PageHeader title="タスクカテゴリ作成" />}>
            <Head title="タスクカテゴリ作成" />
            <div className="max-w-xl">
                <Card>
                    <CardBody>
                        <Form
                            data={data}
                            setData={setData}
                            errors={errors}
                            onSubmit={submit}
                            processing={processing}
                            submitLabel="作成"
                            cancelRoute="admin.task-category.index"
                        />
                    </CardBody>
                </Card>
            </div>
        </AdminAuthenticatedLayout>
    );
}
```

```jsx
// Edit.jsx
import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { Card, CardBody } from "@/Components/Card";
import Form from "./_components/Form";

export default function Edit({ category }) {
    const { data, setData, put, processing, errors } = useForm({
        name: category.name,
        color: category.color || "#4F46E5",
    });

    const submit = (e) => {
        e.preventDefault();
        put(route("admin.task-category.update", category.id));
    };

    return (
        <AdminAuthenticatedLayout header={<PageHeader title="タスクカテゴリ編集" />}>
            <Head title="タスクカテゴリ編集" />
            <div className="max-w-xl">
                <Card>
                    <CardBody>
                        <Form
                            data={data}
                            setData={setData}
                            errors={errors}
                            onSubmit={submit}
                            processing={processing}
                            submitLabel="更新"
                            cancelRoute="admin.task-category.index"
                        />
                    </CardBody>
                </Card>
            </div>
        </AdminAuthenticatedLayout>
    );
}
```

- [ ] **Step 4: ブラウザで動作確認**

Run: `npm run dev`（別ターミナルで`php artisan serve`が起動している前提）
手順: `/admin/task-categories`にアクセスし、作成・編集・削除が動作することを確認する。

- [ ] **Step 5: Commit**

```bash
git add resources/js/Pages/Admin/TaskCategories
git commit -m "feat: タスクカテゴリ管理画面を追加"
```

---

### Task 12: フロントエンド — タスクカンバンボード（一覧）

**Files:**
- Create: `resources/js/Pages/Admin/Tasks/Index.jsx`
- Create: `resources/js/Pages/Admin/Tasks/_components/TaskBoard.jsx`
- Create: `resources/js/Pages/Admin/Tasks/_components/TaskColumn.jsx`
- Create: `resources/js/Pages/Admin/Tasks/_components/TaskCard.jsx`
- Create: `resources/js/Pages/Admin/Tasks/_components/TaskFilterBar.jsx`

**Interfaces:**
- Consumes: `admin.task.index`が返す`tasks`（`{id,title,status,priority,due_date,due_time,category,admin}[]`）、`admin.task.status`ルート（Task 6）
- Produces: `TaskCard`は`{task}` propを受け取るプレゼンテーショナルコンポーネント。`TaskColumn`は`{status, label, tasks}`。`TaskBoard`は`{tasks, onStatusChange}`。

- [ ] **Step 1: `TaskCard.jsx`を実装**

```jsx
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const PRIORITY_LABEL = { high: "高", medium: "中", low: "低" };
const PRIORITY_COLOR = { high: "bg-red-100 text-red-700", medium: "bg-yellow-100 text-yellow-700", low: "bg-gray-100 text-gray-600" };

export default function TaskCard({ task }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="cursor-grab rounded border bg-white p-3 shadow-sm"
        >
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{task.title}</span>
                <span className={`rounded px-2 py-0.5 text-xs ${PRIORITY_COLOR[task.priority]}`}>
                    {PRIORITY_LABEL[task.priority]}
                </span>
            </div>
            <div className="mt-2 text-xs text-gray-500">
                {task.due_date}
                {task.due_time ? ` ${task.due_time.slice(0, 5)}` : ""}
            </div>
            {task.category && (
                <span
                    className="mt-2 inline-block rounded-full px-2 py-0.5 text-xs text-white"
                    style={{ backgroundColor: task.category.color || "#9CA3AF" }}
                >
                    {task.category.name}
                </span>
            )}
            {task.admin && <div className="mt-1 text-xs text-gray-400">{task.admin.email}</div>}
        </div>
    );
}
```

- [ ] **Step 2: `TaskColumn.jsx`を実装**

```jsx
import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import TaskCard from "./TaskCard";

export default function TaskColumn({ status, label, tasks }) {
    const { setNodeRef } = useDroppable({ id: status });

    return (
        <div className="flex w-72 flex-col rounded bg-gray-50 p-2">
            <h3 className="mb-2 text-sm font-semibold text-gray-700">
                {label}（{tasks.length}）
            </h3>
            <div ref={setNodeRef} className="flex min-h-[100px] flex-col gap-2">
                <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                    {tasks.map((task) => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                </SortableContext>
            </div>
        </div>
    );
}
```

- [ ] **Step 3: `TaskBoard.jsx`を実装**

```jsx
import React from "react";
import { DndContext, closestCorners } from "@dnd-kit/core";
import TaskColumn from "./TaskColumn";

const COLUMNS = [
    { status: "todo", label: "未着手" },
    { status: "in_progress", label: "進行中" },
    { status: "done", label: "完了" },
];

export default function TaskBoard({ tasks, onStatusChange }) {
    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over) return;

        const task = tasks.find((t) => t.id === active.id);
        const newStatus = COLUMNS.some((c) => c.status === over.id)
            ? over.id
            : tasks.find((t) => t.id === over.id)?.status;

        if (task && newStatus && task.status !== newStatus) {
            onStatusChange(task.id, newStatus);
        }
    };

    return (
        <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
            <div className="flex gap-4 overflow-x-auto">
                {COLUMNS.map((column) => (
                    <TaskColumn
                        key={column.status}
                        status={column.status}
                        label={column.label}
                        tasks={tasks.filter((t) => t.status === column.status)}
                    />
                ))}
            </div>
        </DndContext>
    );
}
```

- [ ] **Step 4: `TaskFilterBar.jsx`を実装**

```jsx
import React from "react";
import { SelectInput } from "@/Components/Forms";

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
        </div>
    );
}
```

- [ ] **Step 5: `Index.jsx`で組み立て**

`PageHeader`の`actions`は`{label, icon, variant, route}`の配列で渡す（`resources/js/Pages/Admin/Admin/Create.jsx`の`headerActions`と同じ形式。JSXをそのまま渡す実装は存在しないので使わない）。

```jsx
import React from "react";
import { Head, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { FlashMessage } from "@/Components/Notifications";
import { Squares2X2Icon } from "@heroicons/react/24/outline";
import TaskBoard from "./_components/TaskBoard";
import TaskFilterBar from "./_components/TaskFilterBar";

export default function Index({ tasks, categories, admins, filters }) {
    const handleFilterChange = (key, value) => {
        router.get(route("admin.task.index"), { ...filters, [key]: value }, { preserveState: true, preserveScroll: true });
    };

    const handleStatusChange = (taskId, status) => {
        router.patch(route("admin.task.status", taskId), { status }, { preserveScroll: true });
    };

    // 「新規作成」ボタンはTask 13でモーダル開閉のstateと一緒に追加する
    const headerActions = [
        {
            label: "カテゴリ管理",
            icon: Squares2X2Icon,
            variant: "secondary",
            route: route("admin.task-category.index"),
        },
    ];

    return (
        <AdminAuthenticatedLayout
            header={<PageHeader title="タスク管理" description="SNS投稿を含むタスクをカンバンで管理します" actions={headerActions} />}
        >
            <Head title="タスク管理" />
            <FlashMessage />
            <TaskFilterBar filters={filters} categories={categories} admins={admins} onChange={handleFilterChange} />
            <TaskBoard tasks={tasks} onStatusChange={handleStatusChange} />
        </AdminAuthenticatedLayout>
    );
}
```

- [ ] **Step 6: ブラウザで動作確認**

Run: `npm run dev`
手順: `/admin/tasks`にアクセスし、カードをドラッグして列を移動→リロード後も状態が保持されていることを確認する。

- [ ] **Step 7: Commit**

```bash
git add resources/js/Pages/Admin/Tasks/Index.jsx resources/js/Pages/Admin/Tasks/_components
git commit -m "feat: タスクカンバンボード画面を追加"
```

---

### Task 13: フロントエンド — タスク作成/編集モーダル

**Files:**
- Create: `resources/js/Pages/Admin/Tasks/_components/TaskFormModal.jsx`
- Modify: `resources/js/Pages/Admin/Tasks/Index.jsx`
- Modify: `resources/js/Pages/Admin/Tasks/_components/TaskCard.jsx`（クリックで編集モーダルを開くハンドラを追加）
- Modify: `resources/js/Pages/Admin/Tasks/_components/TaskColumn.jsx`（`onCardClick`を`TaskCard`まで伝播）
- Modify: `resources/js/Pages/Admin/Tasks/_components/TaskBoard.jsx`（`onCardClick`を`TaskColumn`まで伝播）

**Interfaces:**
- Consumes: `admin.task.store` / `admin.task.update`ルート（Task 6）

**参照実装:** `resources/js/Components/Layout/Modal.jsx`（`show`/`onClose`/`maxWidth`propsを持つ。中身は自由なJSXで、フッターも含めて自前で組む）。`TextArea`は`@/Components/Forms`からエクスポートされている（`Textarea`ではない）。

- [ ] **Step 1: `TaskFormModal.jsx`を実装**

```jsx
import React from "react";
import { useForm } from "@inertiajs/react";
import Modal from "@/Components/Layout/Modal";
import { FormGroup, TextInput, TextArea, SelectInput } from "@/Components/Forms";
import { Button, CrudButton } from "@/Components/Buttons";

export default function TaskFormModal({ show, onClose, task, categories, admins }) {
    const isEdit = Boolean(task);
    const { data, setData, post, put, processing, errors, reset } = useForm({
        title: task?.title || "",
        description: task?.description || "",
        priority: task?.priority || "medium",
        task_category_id: task?.category?.id || "",
        admin_id: task?.admin?.id || "",
        due_date: task?.due_date || "",
        due_time: task?.due_time?.slice(0, 5) || "",
    });

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

- [ ] **Step 2: `TaskCard.jsx`にクリックハンドラを追加**

```jsx
// TaskCard.jsx の props に onClick を追加し、ルート要素へ付与する
export default function TaskCard({ task, onClick }) {
    // ...
    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={() => onClick?.(task)}
            className="cursor-grab rounded border bg-white p-3 shadow-sm"
        >
            {/* 既存内容は変更なし */}
        </div>
    );
}
```

`TaskColumn.jsx`と`TaskBoard.jsx`にも`onCardClick`propを追加し、`TaskCard`まで橋渡しする。

```jsx
// TaskColumn.jsx: props に onCardClick を追加し、TaskCard へ渡す
export default function TaskColumn({ status, label, tasks, onCardClick }) {
    const { setNodeRef } = useDroppable({ id: status });

    return (
        <div className="flex w-72 flex-col rounded bg-gray-50 p-2">
            <h3 className="mb-2 text-sm font-semibold text-gray-700">
                {label}（{tasks.length}）
            </h3>
            <div ref={setNodeRef} className="flex min-h-[100px] flex-col gap-2">
                <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                    {tasks.map((task) => (
                        <TaskCard key={task.id} task={task} onClick={onCardClick} />
                    ))}
                </SortableContext>
            </div>
        </div>
    );
}
```

```jsx
// TaskBoard.jsx: props に onCardClick を追加し、各 TaskColumn へ渡す
export default function TaskBoard({ tasks, onStatusChange, onCardClick }) {
    // handleDragEnd は変更なし
    return (
        <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
            <div className="flex gap-4 overflow-x-auto">
                {COLUMNS.map((column) => (
                    <TaskColumn
                        key={column.status}
                        status={column.status}
                        label={column.label}
                        tasks={tasks.filter((t) => t.status === column.status)}
                        onCardClick={onCardClick}
                    />
                ))}
            </div>
        </DndContext>
    );
}
```

- [ ] **Step 3: `Index.jsx`にモーダル状態を追加**

```jsx
// Index.jsx に追記
import { useState } from "react";
import TaskFormModal from "./_components/TaskFormModal";

// コンポーネント内
const [editingTask, setEditingTask] = useState(null);
const [showModal, setShowModal] = useState(false);

const openCreateModal = () => {
    setEditingTask(null);
    setShowModal(true);
};

const openEditModal = (task) => {
    setEditingTask(task);
    setShowModal(true);
};

// headerActions の配列に「新規作成」を追加（PageHeaderはactionにonClickがあればそちらを優先して呼ぶ）
const headerActions = [
    {
        label: "カテゴリ管理",
        icon: Squares2X2Icon,
        variant: "secondary",
        route: route("admin.task-category.index"),
    },
    {
        label: "新規作成",
        icon: PlusIcon,
        variant: "primary",
        onClick: openCreateModal,
    },
];
```

`import { PlusIcon, Squares2X2Icon } from "@heroicons/react/24/outline";`のうち`PlusIcon`を追加する。`<TaskBoard tasks={tasks} onStatusChange={handleStatusChange} />`を`<TaskBoard tasks={tasks} onStatusChange={handleStatusChange} onCardClick={openEditModal} />`に変更する（`onCardClick`はStep 2で`TaskCard`/`TaskColumn`/`TaskBoard`に追加した伝播経路を通る）。JSXの末尾（`</AdminAuthenticatedLayout>`の直前）に以下を配置する。

```jsx
<TaskFormModal
    show={showModal}
    onClose={() => setShowModal(false)}
    task={editingTask}
    categories={categories}
    admins={admins}
/>
```

- [ ] **Step 4: ブラウザで動作確認**

Run: `npm run dev`
手順: `/admin/tasks`で「新規作成」からタスクを追加し、カードクリックで編集モーダルが開き更新できることを確認する。

- [ ] **Step 5: Commit**

```bash
git add resources/js/Pages/Admin/Tasks
git commit -m "feat: タスク作成・編集モーダルを追加"
```

---

### Task 14: フロントエンド — タスク詳細ページ

**Files:**
- Create: `resources/js/Pages/Admin/Tasks/Show.jsx`
- Modify: `app/Http/Controllers/Admin/TaskController.php`（`show`アクションを追加）
- Modify: `routes/admin/task.php`

**Interfaces:**
- Consumes: `TaskService`/`TaskCategoryService`（既存）

- [ ] **Step 1: `TaskController@show`を追加**

```php
// app/Http/Controllers/Admin/TaskController.php に追記
public function show(Task $task): Response
{
    $task->load(['category', 'admin', 'creator']);

    return Inertia::render('Admin/Tasks/Show', [
        'task' => $task,
    ]);
}
```

- [ ] **Step 2: ルートを追加**

```php
// routes/admin/task.php: Route::resource の except から 'show' を除外
Route::resource('task', TaskController::class)->except(['create', 'edit']);
```

- [ ] **Step 3: `Show.jsx`を実装**

```jsx
import React from "react";
import { Head } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const STATUS_LABEL = { todo: "未着手", in_progress: "進行中", done: "完了" };
const PRIORITY_LABEL = { high: "高", medium: "中", low: "低" };

export default function Show({ task }) {
    const headerActions = [
        {
            label: "一覧に戻る",
            icon: ArrowLeftIcon,
            variant: "secondary",
            route: route("admin.task.index"),
        },
    ];

    return (
        <AdminAuthenticatedLayout header={<PageHeader title={task.title} actions={headerActions} />}>
            <Head title={task.title} />
            <dl className="grid grid-cols-2 gap-4 rounded border p-4">
                <div>
                    <dt className="text-xs text-gray-500">ステータス</dt>
                    <dd>{STATUS_LABEL[task.status]}</dd>
                </div>
                <div>
                    <dt className="text-xs text-gray-500">優先度</dt>
                    <dd>{PRIORITY_LABEL[task.priority]}</dd>
                </div>
                <div>
                    <dt className="text-xs text-gray-500">期限</dt>
                    <dd>{task.due_date}{task.due_time ? ` ${task.due_time.slice(0, 5)}` : ""}</dd>
                </div>
                <div>
                    <dt className="text-xs text-gray-500">担当者</dt>
                    <dd>{task.admin?.email || "未割当"}</dd>
                </div>
                <div>
                    <dt className="text-xs text-gray-500">カテゴリ</dt>
                    <dd>{task.category?.name || "未分類"}</dd>
                </div>
                <div className="col-span-2">
                    <dt className="text-xs text-gray-500">説明</dt>
                    <dd className="whitespace-pre-wrap">{task.description || "-"}</dd>
                </div>
            </dl>
        </AdminAuthenticatedLayout>
    );
}
```

- [ ] **Step 4: `TaskCard`のクリックで詳細ページへ遷移するか編集モーダルを開くかを決定**

Task 13で編集モーダルへのクリックを実装済みのため、詳細ページへの導線は一覧の各カードに小さな「詳細」リンク（`<Link href={route('admin.task.show', task.id)}>`）を追加する形で共存させる。`TaskCard.jsx`に以下を追記する。

```jsx
// TaskCard.jsx 末尾に追記
<Link
    href={route("admin.task.show", task.id)}
    onClick={(e) => e.stopPropagation()}
    className="mt-2 block text-xs text-indigo-600 hover:underline"
>
    詳細を見る
</Link>
```

- [ ] **Step 5: ブラウザで動作確認**

Run: `npm run dev`
手順: `/admin/tasks`のカードから「詳細を見る」をクリックし、`/admin/tasks/{id}`で詳細が表示されることを確認する。

- [ ] **Step 6: Commit**

```bash
git add app/Http/Controllers/Admin/TaskController.php routes/admin/task.php resources/js/Pages/Admin/Tasks/Show.jsx resources/js/Pages/Admin/Tasks/_components/TaskCard.jsx
git commit -m "feat: タスク詳細ページを追加"
```

---

### Task 15: フロントエンド — ダッシュボード/Admin詳細画面へのウィジェット組み込み

**Files:**
- Modify: `resources/js/Pages/AdminDashboard.jsx`
- Modify: `resources/js/Pages/Admin/Admin/Show.jsx`
- Create: `resources/js/Pages/Admin/Admin/_components/AdminAssignedTasks.jsx`
- Create: `resources/js/Components/Tasks/TodayTaskList.jsx`

**Interfaces:**
- Consumes: `todayTasks`（Task 7）、`assignedTasks`（Task 8）

**参照実装:** `resources/js/Pages/AdminDashboard.jsx`（実体のexport名は`Dashboard`で、`{queue, kpis, trends, logs}`を受け取り、`Card`コンポーネントでタイル状に表示する構成）。`resources/js/Pages/Admin/Admin/Show.jsx`（`activeTab`のstateと`tabs`配列・`renderTabContent()`のswitch文でタブ切り替えするUIのため、新しいセクションではなく新しいタブとして追加する）。

- [ ] **Step 1: 共通の`TodayTaskList.jsx`を実装**

```jsx
import React from "react";
import { Link } from "@inertiajs/react";
import { Badge } from "@/Components/Badges";

const PRIORITY_VARIANT = { high: "danger", medium: "warning", low: "secondary" };
const PRIORITY_LABEL = { high: "高", medium: "中", low: "低" };

export default function TodayTaskList({ tasks, emptyLabel = "本日期限のタスクはありません" }) {
    if (tasks.length === 0) {
        return <p className="text-sm text-gray-400 dark:text-gray-500">{emptyLabel}</p>;
    }

    return (
        <ul className="divide-y divide-gray-100 dark:divide-gray-700">
            {tasks.map((task) => (
                <li key={task.id} className="flex items-center justify-between py-2">
                    <Link
                        href={route("admin.task.show", task.id)}
                        className="text-sm text-gray-900 hover:underline dark:text-gray-100"
                    >
                        {task.due_time ? `${task.due_time.slice(0, 5)} ` : ""}
                        {task.title}
                    </Link>
                    <Badge variant={PRIORITY_VARIANT[task.priority]}>{PRIORITY_LABEL[task.priority]}</Badge>
                </li>
            ))}
        </ul>
    );
}
```

- [ ] **Step 2: `AdminDashboard.jsx`にウィジェットを追加**

`resources/js/Pages/AdminDashboard.jsx`の`export default function Dashboard({ queue = [], kpis = [], trends = [], logs = {} })`に`todayTasks = []`を追加し、`import TodayTaskList from "@/Components/Tasks/TodayTaskList";`を追記する。既存の「要対応キュー」セクション（`{/* 要対応キュー */}`のコメントがある`<div>`ブロック）の直前に、同じ`Card`パターンで以下を挿入する。

```jsx
{/* 今日やること */}
<div>
    <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
        今日やること
    </h2>
    <Card>
        <CardBody>
            <TodayTaskList tasks={todayTasks} />
        </CardBody>
    </Card>
</div>
```

- [ ] **Step 3: `AdminAssignedTasks.jsx`を実装し、`Admin/Admin/Show.jsx`にタブとして追加**

```jsx
// resources/js/Pages/Admin/Admin/_components/AdminAssignedTasks.jsx
import React from "react";
import { Card, CardBody } from "@/Components/Card";
import TodayTaskList from "@/Components/Tasks/TodayTaskList";

export default function AdminAssignedTasks({ tasks }) {
    return (
        <Card>
            <CardBody>
                <TodayTaskList tasks={tasks} emptyLabel="担当中のタスクはありません" />
            </CardBody>
        </Card>
    );
}
```

`resources/js/Pages/Admin/Admin/Show.jsx`に以下の変更を加える。

```jsx
// import 追加
import AdminAssignedTasks from "./_components/AdminAssignedTasks";
```

```jsx
// export default function Show({...}) の props に assignedTasks = [] を追加
export default function Show({
    admin,
    mediaList = [],
    permissionOverride = null,
    loginLogs = [],
    employmentTypes = [],
    payTypes = [],
    assignedTasks = [],
}) {
```

```jsx
// tabs 配列に追加（「設定」タブの前に挿入）
{
    key: "tasks",
    label: "担当タスク",
    count: assignedTasks.length,
},
```

```jsx
// renderTabContent() の switch に追加
case "tasks":
    return <AdminAssignedTasks tasks={assignedTasks} />;
```

- [ ] **Step 4: ブラウザで動作確認**

Run: `npm run dev`
手順: `/admin/dashboard`で「今日やること」に本日期限の自分のタスクが表示されること、`/admin/admins/{id}`の「担当タスク」タブで対象Adminの担当タスクが表示されることを確認する。

- [ ] **Step 5: Commit**

```bash
git add resources/js/Components/Tasks/TodayTaskList.jsx resources/js/Pages/AdminDashboard.jsx resources/js/Pages/Admin/Admin/Show.jsx resources/js/Pages/Admin/Admin/_components/AdminAssignedTasks.jsx
git commit -m "feat: ダッシュボードとAdmin詳細に今日のタスクウィジェットを組み込み"
```

---

### Task 16: 権限確認・全体テスト実行

**Files:**
- Modify: なし（確認のみ）

- [ ] **Step 1: 権限カタログを最終同期**

Run: `php artisan admin:sync-permissions`
Expected: `task.*` / `task-category.*`権限が登録される

- [ ] **Step 2: 関連する全Feature/Unitテストを実行**

Run: `php artisan test --filter=Task`
Expected: 全件PASS

- [ ] **Step 3: 既存のPermissionEnforcementTestを含む全体テストを実行**

Run: `php artisan test`
Expected: 全件PASS（既存テストにリグレッションがないことを確認）

- [ ] **Step 4: フロントエンドのビルド確認**

Run: `npm run build`
Expected: ビルドエラーなし

---

### Task 17: ドキュメント更新

**Files:**
- Modify: `SPEC.md`
- Modify: `TASKS.md`

**Interfaces:**
- Consumes: なし

- [ ] **Step 1: SPEC.md §5にタスク管理機能のドメイン仕様を追記**

`tasks`/`task_categories`テーブル構成、ステータス遷移、繰り返しタスクの生成方式、リマインダーの送信条件を、既存の他ドメイン節と同じ粒度で追記する。

- [ ] **Step 2: TASKS.mdを更新**

完了した本機能をフェーズ2の完了項目として記録し、スコープ外とした以下をフェーズ2の新規候補として追記する。

- タスクへのコメント・添付ファイル
- 複数Admin共同担当
- 既存シフト/予約カレンダーとの統合表示
- カスタムステータス列

- [ ] **Step 3: Commit**

```bash
git add SPEC.md TASKS.md
git commit -m "docs: タスク管理機能のドキュメントを更新"
```

---

## 実装後の確認（PR作成前）

- `php artisan test` が全件PASSしていること
- `npm run build` が成功すること
- `php artisan admin:sync-permissions` を実行済みであること
- 開発環境のブラウザで、カンバンD&D・今日やることウィジェット・Admin詳細の担当タスク・カテゴリ管理の一連の動作を確認していること
