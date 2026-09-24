# AI社員 日報（業務ログ・日次レポート） Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** AI社員（`admins.role = 'ai_staff'`）の業務アクション（タスク状態変更・返信作成・見積作成・提案書作成）を自動で記録し、毎朝8時に前日分をAI社員ごとの日報としてまとめ、Admin画面で閲覧できるようにする。

**Architecture:** 2つの新規テーブル（`ai_staff_activity_logs`＝随時ログ、`ai_staff_daily_reports`＝日次集計）。既存の4つの書き込み経路（Task/Response/Quote/Proposal）に`AiStaffActivityLogger`サービスの呼び出しを1行ずつ追加してログを溜め、毎朝8時のArtisanスケジュールコマンドが前日分を集計してAI社員ごとに1件の日報レコードを作る。日報本文はAI要約ではなく、ログを整形して並べるだけ（案A）。

**Tech Stack:** Laravel 12 / MySQL / Inertia.js + React（既存スタック、新規ライブラリ追加なし）

**Spec:** `docs/superpowers/specs/2026-09-24-ai-staff-daily-reports-design.md`

## Global Constraints

- 対象はAI社員限定（`admins.role = 'ai_staff'`、`Admin::isAiStaff()`で判定）。人間Adminの操作はログしない。
- 記録対象アクションは「タスク状態変更」「返信(Response)作成」「見積(Quote)作成」「提案書(Proposal)作成」の4種類のみ（スペック§3参照）。
- ログ記録処理の失敗は本処理（タスク更新・返信作成等）を止めない。try-catchで握りつぶし`Log::error`のみ残す。
- 新規テーブルはいずれも`admins`への外部キーを持つ。`admins.id`は**UUID**（`ulid`ではない、`database/migrations/*create_admins_table*.php`で確認済み）。新規テーブル自身の主キーは本リポジトリの既存ULID系モデルの慣例に合わせ`HasUlid`トレイトで発行する。
- 日報生成は案A（AI要約なし、ログの整形のみ）。AI要約生成（案B）は本計画のスコープ外。
- Git運用ルール（CLAUDE.md §9）に従い、新しいブランチ`feat/ai-staff-daily-reports`を`origin/main`起点で作成する。

## Review Focus

- 人間Admin（`role != 'ai_staff'`）がタスク状態変更・返信作成・見積作成・提案書作成を行った場合に、誤ってログが作成されないこと。
- タスクの担当者（`Task.admin_id`）がAI社員でも、ログイン中の操作者（`auth('admins')`）が人間である場合に、どちらを基準にログするかが曖昧にならないこと（本計画ではタスクは「担当者＝AI社員」基準、Response/Quote/Proposalは「作成者＝AI社員」基準と明記し、Task 3のテストで固定する）。
- 日次集計コマンドを同じ日付に対して複数回実行しても、日報レコードが重複作成されないこと（upsert）。
- 活動ログが0件のAI社員に対して、空の日報レコードが作られないこと。
- ログ記録処理（`AiStaffActivityLogger::log()`）が例外を投げても、呼び出し元の本処理（タスク更新等）が失敗しないこと。

---

### Task 1: 新規テーブル・モデルの作成

**Files:**
- Create: `database/migrations/2026_09_24_090001_create_ai_staff_activity_logs_table.php`
- Create: `database/migrations/2026_09_24_090002_create_ai_staff_daily_reports_table.php`
- Create: `app/Models/AiStaffActivityLog.php`
- Create: `app/Models/AiStaffDailyReport.php`
- Test: `tests/Unit/AiStaffActivityLogModelTest.php`

**Interfaces:**
- Produces: `AiStaffActivityLog::create(['admin_id' => string, 'action' => string, 'subject_type' => ?string, 'subject_id' => ?string, 'description' => string, 'occurred_at' => Carbon])`
- Produces: `AiStaffDailyReport::updateOrCreate(['admin_id' => string, 'report_date' => string], ['body' => string, 'activity_count' => int, 'generated_at' => Carbon])`
- Produces: `AiStaffActivityLog::ACTION_TASK_STATUS_CHANGED = 'task_status_changed'`、`ACTION_RESPONSE_CREATED = 'response_created'`、`ACTION_QUOTE_CREATED = 'quote_created'`、`ACTION_PROPOSAL_CREATED = 'proposal_created'`（後続タスクが使う定数）

- [ ] **Step 1: `ai_staff_activity_logs`マイグレーションを作成**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * AI社員の業務アクションを1件ずつ記録する随時ログ
     */
    public function up(): void
    {
        Schema::create('ai_staff_activity_logs', function (Blueprint $table) {
            $table->ulid('id')->primary();

            $table->uuid('admin_id');
            $table->foreign('admin_id')->references('id')->on('admins')->onDelete('cascade');

            $table->string('action');
            $table->string('subject_type')->nullable();
            $table->ulid('subject_id')->nullable();
            $table->text('description');
            $table->dateTime('occurred_at');

            $table->timestamp('created_at')->nullable();

            $table->index(['admin_id', 'occurred_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ai_staff_activity_logs');
    }
};
```

- [ ] **Step 2: `ai_staff_daily_reports`マイグレーションを作成**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * AI社員ごとの日次集計レポート（1AI社員×1日で1レコード）
     */
    public function up(): void
    {
        Schema::create('ai_staff_daily_reports', function (Blueprint $table) {
            $table->ulid('id')->primary();

            $table->uuid('admin_id');
            $table->foreign('admin_id')->references('id')->on('admins')->onDelete('cascade');

            $table->date('report_date');
            $table->text('body');
            $table->unsignedInteger('activity_count')->default(0);
            $table->dateTime('generated_at');

            $table->timestamps();

            $table->unique(['admin_id', 'report_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ai_staff_daily_reports');
    }
};
```

- [ ] **Step 3: マイグレーションを実行**

Run: `docker compose exec -T laravel.test php artisan migrate --path=database/migrations/2026_09_24_090001_create_ai_staff_activity_logs_table.php`
Run: `docker compose exec -T laravel.test php artisan migrate --path=database/migrations/2026_09_24_090002_create_ai_staff_daily_reports_table.php`
Expected: 両方とも`DONE`と表示される

- [ ] **Step 4: `AiStaffActivityLog`モデルを作成**

```php
<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AiStaffActivityLog extends Model
{
    use HasUlid;

    public $timestamps = false;

    protected $fillable = [
        'admin_id',
        'action',
        'subject_type',
        'subject_id',
        'description',
        'occurred_at',
    ];

    protected $casts = [
        'occurred_at' => 'datetime',
    ];

    public const ACTION_TASK_STATUS_CHANGED = 'task_status_changed';
    public const ACTION_RESPONSE_CREATED = 'response_created';
    public const ACTION_QUOTE_CREATED = 'quote_created';
    public const ACTION_PROPOSAL_CREATED = 'proposal_created';

    protected static function booted(): void
    {
        static::creating(function (self $log) {
            $log->created_at = $log->created_at ?? now();
        });
    }

    public function admin(): BelongsTo
    {
        return $this->belongsTo(Admin::class);
    }
}
```

- [ ] **Step 5: `AiStaffDailyReport`モデルを作成**

```php
<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AiStaffDailyReport extends Model
{
    use HasUlid;

    protected $fillable = [
        'admin_id',
        'report_date',
        'body',
        'activity_count',
        'generated_at',
    ];

    protected $casts = [
        'report_date' => 'date',
        'generated_at' => 'datetime',
    ];

    public function admin(): BelongsTo
    {
        return $this->belongsTo(Admin::class);
    }
}
```

- [ ] **Step 6: モデルの単体テストを作成**

```php
<?php

namespace Tests\Unit;

use App\Models\Admin;
use App\Models\AiStaffActivityLog;
use App\Models\AiStaffDailyReport;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AiStaffActivityLogModelTest extends TestCase
{
    use RefreshDatabase;

    public function test_activity_log_can_be_created_for_an_ai_staff_admin(): void
    {
        $admin = Admin::factory()->aiStaff('marketing')->create();

        $log = AiStaffActivityLog::create([
            'admin_id' => $admin->id,
            'action' => AiStaffActivityLog::ACTION_TASK_STATUS_CHANGED,
            'description' => 'テストログ',
            'occurred_at' => now(),
        ]);

        $this->assertDatabaseHas('ai_staff_activity_logs', ['id' => $log->id]);
        $this->assertTrue($log->admin->is($admin));
    }

    public function test_daily_report_enforces_one_row_per_admin_per_date(): void
    {
        $admin = Admin::factory()->aiStaff('marketing')->create();

        AiStaffDailyReport::create([
            'admin_id' => $admin->id,
            'report_date' => '2026-09-23',
            'body' => '1回目',
            'activity_count' => 1,
            'generated_at' => now(),
        ]);

        $this->expectException(\Illuminate\Database\QueryException::class);

        AiStaffDailyReport::create([
            'admin_id' => $admin->id,
            'report_date' => '2026-09-23',
            'body' => '2回目（重複のはず）',
            'activity_count' => 1,
            'generated_at' => now(),
        ]);
    }
}
```

- [ ] **Step 7: テストを実行して確認**

Run: `docker compose exec -T laravel.test php artisan test tests/Unit/AiStaffActivityLogModelTest.php`
Expected: `2 passed`

- [ ] **Step 8: Pintを実行してコミット**

```bash
./vendor/bin/pint --dirty
git add database/migrations/2026_09_24_090001_create_ai_staff_activity_logs_table.php \
        database/migrations/2026_09_24_090002_create_ai_staff_daily_reports_table.php \
        app/Models/AiStaffActivityLog.php app/Models/AiStaffDailyReport.php \
        tests/Unit/AiStaffActivityLogModelTest.php
git commit -m "feat: AI社員の活動ログ・日報テーブルを新設"
```

---

### Task 2: `AiStaffActivityLogger`サービスの作成

**Files:**
- Create: `app/Services/AiStaffActivityLogger.php`
- Test: `tests/Unit/AiStaffActivityLoggerTest.php`

**Interfaces:**
- Consumes: `AiStaffActivityLog`（Task 1で作成）
- Produces: `AiStaffActivityLogger::log(Admin $admin, string $action, string $description, ?Model $subject = null): void`（Task 3〜6が呼び出す）

- [ ] **Step 1: 失敗するテストを書く**

```php
<?php

namespace Tests\Unit;

use App\Models\Admin;
use App\Models\AiStaffActivityLog;
use App\Services\AiStaffActivityLogger;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AiStaffActivityLoggerTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_logs_an_action_for_an_ai_staff_admin(): void
    {
        $admin = Admin::factory()->aiStaff('marketing')->create();

        app(AiStaffActivityLogger::class)->log(
            $admin,
            AiStaffActivityLog::ACTION_TASK_STATUS_CHANGED,
            'タスク「テスト」をレビュー待ちに変更'
        );

        $this->assertDatabaseHas('ai_staff_activity_logs', [
            'admin_id' => $admin->id,
            'action' => AiStaffActivityLog::ACTION_TASK_STATUS_CHANGED,
            'description' => 'タスク「テスト」をレビュー待ちに変更',
        ]);
    }

    public function test_it_does_not_log_for_a_human_admin(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin']);

        app(AiStaffActivityLogger::class)->log(
            $admin,
            AiStaffActivityLog::ACTION_TASK_STATUS_CHANGED,
            'タスク「テスト」をレビュー待ちに変更'
        );

        $this->assertDatabaseCount('ai_staff_activity_logs', 0);
    }

    public function test_it_swallows_exceptions_and_does_not_rethrow(): void
    {
        $admin = Admin::factory()->aiStaff('marketing')->create();
        // action文字列がstring型カラムの上限(255文字)を超えると、素のcreate()なら
        // QueryExceptionが飛ぶ。呼び出し元の本処理を止めない設計になっているかを確認する。
        $tooLongAction = str_repeat('a', 300);

        app(AiStaffActivityLogger::class)->log($admin, $tooLongAction, 'テスト');

        $this->assertDatabaseCount('ai_staff_activity_logs', 0);
    }
}
```

- [ ] **Step 2: テストを実行して失敗を確認**

Run: `docker compose exec -T laravel.test php artisan test tests/Unit/AiStaffActivityLoggerTest.php`
Expected: FAIL（`AiStaffActivityLogger`クラスが存在しない）

- [ ] **Step 3: `AiStaffActivityLogger`を実装**

```php
<?php

namespace App\Services;

use App\Models\Admin;
use App\Models\AiStaffActivityLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

/**
 * AI社員の業務アクションを ai_staff_activity_logs へ記録する横断的な記録係。
 * BaseService（単一エンティティのCRUD想定）は継承しない。
 */
class AiStaffActivityLogger
{
    /**
     * @param  Admin  $admin  この操作の主体（人間Adminの場合は何もしない）
     * @param  string  $action  AiStaffActivityLog::ACTION_* のいずれか
     * @param  string  $description  一覧・日報にそのまま使える一言
     * @param  Model|null  $subject  対象レコード（Task/Response/Quote/Proposal）
     */
    public function log(Admin $admin, string $action, string $description, ?Model $subject = null): void
    {
        if (! $admin->isAiStaff()) {
            return;
        }

        try {
            AiStaffActivityLog::create([
                'admin_id' => $admin->id,
                'action' => $action,
                'subject_type' => $subject ? $subject::class : null,
                'subject_id' => $subject?->getKey(),
                'description' => $description,
                'occurred_at' => now(),
            ]);
        } catch (\Throwable $e) {
            Log::error('AI社員の活動ログ記録に失敗しました', [
                'admin_id' => $admin->id,
                'action' => $action,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
```

- [ ] **Step 4: テストを実行して成功を確認**

Run: `docker compose exec -T laravel.test php artisan test tests/Unit/AiStaffActivityLoggerTest.php`
Expected: `3 passed`

- [ ] **Step 5: Pintを実行してコミット**

```bash
./vendor/bin/pint --dirty
git add app/Services/AiStaffActivityLogger.php tests/Unit/AiStaffActivityLoggerTest.php
git commit -m "feat: AiStaffActivityLoggerサービスを追加"
```

---

### Task 3: タスク状態変更のログ記録

**Files:**
- Modify: `app/Http/Controllers/Admin/TaskController.php:69-76`（`updateStatus`メソッド）
- Test: `tests/Feature/Admin/TaskControllerTest.php`（既存ファイルに追記）

**Interfaces:**
- Consumes: `AiStaffActivityLogger::log()`（Task 2）、`AiStaffActivityLog::ACTION_TASK_STATUS_CHANGED`（Task 1）
- 方針: タスクは「担当者（`Task.admin_id`＝`$task->admin`）がAI社員かどうか」を基準にログする（操作者＝`auth('admins')`ではない）。人間の管理者がAI社員担当のタスクを操作してもログされる想定。Global Constraintsのレビュー観点参照。

- [ ] **Step 1: 失敗するテストを書く**（既存の`tests/Feature/Admin/TaskControllerTest.php`に追記）

```php
    public function test_updating_status_of_an_ai_staff_task_logs_the_activity(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);
        $aiStaff = Admin::factory()->aiStaff('marketing')->create(['status' => 'active']);
        $task = Task::factory()->for($admin, 'creator')->for($aiStaff, 'admin')->create([
            'title' => 'SNS投稿作成',
            'status' => 'in_progress',
        ]);

        $this->actingAs($admin, 'admins')
            ->patch(route('admin.task.status', $task), ['status' => 'review'])
            ->assertRedirect();

        $this->assertDatabaseHas('ai_staff_activity_logs', [
            'admin_id' => $aiStaff->id,
            'action' => \App\Models\AiStaffActivityLog::ACTION_TASK_STATUS_CHANGED,
            'subject_type' => Task::class,
            'subject_id' => $task->id,
        ]);
    }

    public function test_updating_status_of_a_human_admins_task_does_not_log_activity(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);
        $task = Task::factory()->for($admin, 'creator')->for($admin, 'admin')->create(['status' => 'in_progress']);

        $this->actingAs($admin, 'admins')
            ->patch(route('admin.task.status', $task), ['status' => 'review'])
            ->assertRedirect();

        $this->assertDatabaseCount('ai_staff_activity_logs', 0);
    }
```

- [ ] **Step 2: テストを実行して失敗を確認**

Run: `docker compose exec -T laravel.test php artisan test tests/Feature/Admin/TaskControllerTest.php --filter=test_updating_status_of_an_ai_staff_task_logs_the_activity`
Expected: FAIL（`ai_staff_activity_logs`にレコードが無い）

- [ ] **Step 3: `TaskController::updateStatus()`にログ呼び出しを追加**

`app/Http/Controllers/Admin/TaskController.php`のコンストラクタと`updateStatus`メソッドを以下のように変更する:

```php
use App\Models\AiStaffActivityLog;
use App\Services\AiStaffActivityLogger;

// ...

class TaskController extends Controller
{
    private const STATUS_LABELS = [
        'todo' => '未着手',
        'in_progress' => '対応中',
        'review' => 'レビュー待ち',
        'done' => '完了',
    ];

    public function __construct(
        private TaskService $service,
        private TaskCategoryService $categoryService,
        private AiStaffActivityLogger $activityLogger,
    ) {}

    // ...(index/show/store/updateは変更なし)...

    public function updateStatus(Request $request, Task $task): RedirectResponse
    {
        $request->validate(['status' => ['required', Rule::in(Task::STATUSES)]]);

        $status = $request->input('status');
        $this->service->updateStatus($task, $status);

        if ($task->admin) {
            $label = self::STATUS_LABELS[$status] ?? $status;
            $this->activityLogger->log(
                $task->admin,
                AiStaffActivityLog::ACTION_TASK_STATUS_CHANGED,
                "タスク「{$task->title}」を「{$label}」に変更",
                $task
            );
        }

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

- [ ] **Step 4: テストを実行して成功を確認**

Run: `docker compose exec -T laravel.test php artisan test tests/Feature/Admin/TaskControllerTest.php`
Expected: 全件`passed`（既存6件＋新規2件＝8件）

- [ ] **Step 5: Pintを実行してコミット**

```bash
./vendor/bin/pint --dirty
git add app/Http/Controllers/Admin/TaskController.php tests/Feature/Admin/TaskControllerTest.php
git commit -m "feat: AI社員担当タスクの状態変更を活動ログに記録"
```

---

### Task 4: 返信(Response)作成のログ記録

**Files:**
- Modify: `app/Http/Controllers/Admin/Contact/ResponseController.php:63-93`（`store`メソッド）
- Test: `tests/Feature/Admin/ResponseControllerActivityLogTest.php`

**Interfaces:**
- Consumes: `AiStaffActivityLogger::log()`（Task 2）、`AiStaffActivityLog::ACTION_RESPONSE_CREATED`（Task 1）
- 方針: Response/Quote/Proposalは「作成者（`auth('admins')->user()`）がAI社員かどうか」を基準にログする（Taskとは異なり、これらは`admin_id`/`created_by`が明示的に認証中の管理者になる）。

- [ ] **Step 1: 失敗するテストを書く**

```php
<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use App\Models\AiStaffActivityLog;
use App\Models\Contact;
use App\Models\ContactCategory;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ResponseControllerActivityLogTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
    }

    private function createContact(): Contact
    {
        $category = ContactCategory::create([
            'name' => '一般的な問い合わせ',
            'slug' => 'general-'.uniqid(),
            'sort_order' => 1,
            'is_active' => true,
        ]);

        return Contact::create([
            'contact_category_id' => $category->id,
            'name' => 'テスト太郎',
            'email' => 'response-log-test-'.uniqid().'@example.com',
            'message' => 'テストメッセージ',
            'status' => 'new',
            'source' => 'web',
        ]);
    }

    public function test_ai_staff_creating_a_response_logs_the_activity(): void
    {
        $aiStaff = Admin::factory()->aiStaff('support')->create(['status' => 'active']);
        $contact = $this->createContact();

        $this->actingAs($aiStaff, 'admins')
            ->post(route('admin.contact.response.store', $contact), [
                'subject' => 'ご返信',
                'body' => 'お問い合わせありがとうございます。',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('ai_staff_activity_logs', [
            'admin_id' => $aiStaff->id,
            'action' => AiStaffActivityLog::ACTION_RESPONSE_CREATED,
        ]);
    }

    public function test_human_admin_creating_a_response_does_not_log_activity(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);
        $contact = $this->createContact();

        $this->actingAs($admin, 'admins')
            ->post(route('admin.contact.response.store', $contact), [
                'subject' => 'ご返信',
                'body' => 'お問い合わせありがとうございます。',
            ])
            ->assertRedirect();

        $this->assertDatabaseCount('ai_staff_activity_logs', 0);
    }
}
```

- [ ] **Step 2: テストを実行して失敗を確認**

Run: `docker compose exec -T laravel.test php artisan test tests/Feature/Admin/ResponseControllerActivityLogTest.php --filter=test_ai_staff_creating_a_response_logs_the_activity`
Expected: FAIL

- [ ] **Step 3: `ResponseController::store()`にログ呼び出しを追加**

`app/Http/Controllers/Admin/Contact/ResponseController.php`のコンストラクタと`store`メソッドを変更:

```php
use App\Models\AiStaffActivityLog;
use App\Services\AiStaffActivityLogger;

// ...

class ResponseController extends Controller
{
    public function __construct(
        private ResponseService $responseService,
        private ContactService $contactService,
        private ResponseTemplateService $responseTemplateService,
        private AiStaffActivityLogger $activityLogger,
    ) {}

    // ...(index/createは変更なし)...

    public function store(ResponseRequest $request, Contact $contact)
    {
        $validated = $request->validated();

        try {
            $actor = auth('admins')->user();
            $data = [
                'contact_id' => $contact->id,
                'response_template_id' => $validated['response_template_id'] ?? null,
                'admin_id' => $actor->id,
                'subject' => $validated['subject'],
                'body' => $validated['body'],
                'recipient_email' => $contact->email,
                'recipient_name' => $contact->name,
                'status' => 'draft',
                'created_by' => $actor->id,
            ];

            $response = $this->responseService->createResponse($data);

            $this->activityLogger->log(
                $actor,
                AiStaffActivityLog::ACTION_RESPONSE_CREATED,
                "お問い合わせ「{$contact->subject}」への返信を作成",
                $response
            );

            // 即座に送信する場合
            if ($request->boolean('send_now')) {
                $this->responseService->sendResponse($response);
                return redirect()->route('admin.contact.show', $contact)
                    ->with('success', __('messages.sent', ['attribute' => '返答']));
            }

            return redirect()->route('admin.contact.show', $contact)
                ->with('success', __('messages.response.saved_as_draft'));
        } catch (\Exception $e) {
            return back()->with('error', __('messages.action_failed_detail', ['attribute' => '返答の保存', 'message' => $e->getMessage()]));
        }
    }
}
```

- [ ] **Step 4: テストを実行して成功を確認**

Run: `docker compose exec -T laravel.test php artisan test tests/Feature/Admin/ResponseControllerActivityLogTest.php`
Expected: `2 passed`

- [ ] **Step 5: Pintを実行してコミット**

```bash
./vendor/bin/pint --dirty
git add app/Http/Controllers/Admin/Contact/ResponseController.php tests/Feature/Admin/ResponseControllerActivityLogTest.php
git commit -m "feat: AI社員による返信作成を活動ログに記録"
```

---

### Task 5: 見積(Quote)作成のログ記録

**Files:**
- Modify: `app/Http/Controllers/Admin/Quote/QuoteController.php:117-147`（`store`メソッド）
- Test: `tests/Feature/Admin/QuoteControllerActivityLogTest.php`

**Interfaces:**
- Consumes: `AiStaffActivityLogger::log()`（Task 2）、`AiStaffActivityLog::ACTION_QUOTE_CREATED`（Task 1）

- [ ] **Step 1: 失敗するテストを書く**

```php
<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use App\Models\AiStaffActivityLog;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class QuoteControllerActivityLogTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
    }

    public function test_ai_staff_creating_a_quote_logs_the_activity(): void
    {
        $aiStaff = Admin::factory()->aiStaff('sales')->create(['status' => 'active']);
        $user = \App\Models\User::factory()->create();

        $this->actingAs($aiStaff, 'admins')
            ->post(route('admin.quote.store'), [
                'user_id' => $user->id,
                'title' => 'コーポレートサイト制作',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('ai_staff_activity_logs', [
            'admin_id' => $aiStaff->id,
            'action' => AiStaffActivityLog::ACTION_QUOTE_CREATED,
        ]);
    }

    public function test_human_admin_creating_a_quote_does_not_log_activity(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);
        $user = \App\Models\User::factory()->create();

        $this->actingAs($admin, 'admins')
            ->post(route('admin.quote.store'), [
                'user_id' => $user->id,
                'title' => 'コーポレートサイト制作',
            ])
            ->assertRedirect();

        $this->assertDatabaseCount('ai_staff_activity_logs', 0);
    }
}
```

- [ ] **Step 2: テストを実行して失敗を確認**

Run: `docker compose exec -T laravel.test php artisan test tests/Feature/Admin/QuoteControllerActivityLogTest.php --filter=test_ai_staff_creating_a_quote_logs_the_activity`
Expected: FAIL

- [ ] **Step 3: `QuoteController::store()`にログ呼び出しを追加**

`app/Http/Controllers/Admin/Quote/QuoteController.php`のコンストラクタに`AiStaffActivityLogger`を追加し（既存のコンストラクタ引数リストの末尾に`private AiStaffActivityLogger $activityLogger,`を追加）、`store`メソッドを変更:

```php
use App\Models\AiStaffActivityLog;
use App\Services\AiStaffActivityLogger;
use Illuminate\Support\Facades\Auth;

// ...

    public function store(QuoteRequest $request)
    {
        $validated = $request->validated();

        // user_idとcontact_idのどちらか一方は必須
        if (empty($validated['user_id']) && empty($validated['contact_id'])) {
            return back()->withErrors([
                'user_id' => 'ユーザーまたはお問い合わせのいずれかを選択してください。',
                'contact_id' => 'ユーザーまたはお問い合わせのいずれかを選択してください。',
            ])->withInput();
        }

        try {
            // Quote + QuoteVersion v1 のみ作成（items は別途追加）
            $quoteData = [
                'user_id' => $validated['user_id'] ?? null,
                'contact_id' => $validated['contact_id'] ?? null,
                'company_id' => $validated['company_id'] ?? null,
                'title' => $validated['title'] ?? '無題の見積書',
                'requirements' => $validated['requirements'] ?? null,
                'status' => $validated['status'] ?? 'draft',
            ];

            // Quote作成（QuoteVersion v1 も自動作成される）
            $quote = $this->quoteService->createQuote($quoteData);

            $actor = Auth::guard('admins')->user();
            $this->activityLogger->log(
                $actor,
                AiStaffActivityLog::ACTION_QUOTE_CREATED,
                "見積「{$quote->title}」を作成",
                $quote
            );

            return redirect()->route('admin.quote.show', $quote)
                ->with('success', __('messages.quote.created_add_items'));
        } catch (\Exception $e) {
            return back()->with('error', __('messages.action_failed_detail', ['attribute' => '見積もりの作成', 'message' => $e->getMessage()]));
        }
    }
```

- [ ] **Step 4: テストを実行して成功を確認**

Run: `docker compose exec -T laravel.test php artisan test tests/Feature/Admin/QuoteControllerActivityLogTest.php`
Expected: `2 passed`

- [ ] **Step 5: Pintを実行してコミット**

```bash
./vendor/bin/pint --dirty
git add app/Http/Controllers/Admin/Quote/QuoteController.php tests/Feature/Admin/QuoteControllerActivityLogTest.php
git commit -m "feat: AI社員による見積作成を活動ログに記録"
```

---

### Task 6: 提案書(Proposal)作成のログ記録

**Files:**
- Modify: `app/Http/Controllers/Admin/ProposalController.php:29-38`（`store`メソッド）
- Test: `tests/Feature/Admin/ProposalControllerTest.php`（既存ファイルに追記）

**Interfaces:**
- Consumes: `AiStaffActivityLogger::log()`（Task 2）、`AiStaffActivityLog::ACTION_PROPOSAL_CREATED`（Task 1）

- [ ] **Step 1: 失敗するテストを書く**（既存の`tests/Feature/Admin/ProposalControllerTest.php`に追記）

```php
    public function test_ai_staff_creating_a_proposal_logs_the_activity(): void
    {
        $aiStaff = Admin::factory()->aiStaff('sales')->create(['status' => 'active']);

        $this->actingAs($aiStaff, 'admins')->post(route('admin.proposal.store'), [
            'title' => 'AI社員作成の提案書',
        ]);

        $this->assertDatabaseHas('ai_staff_activity_logs', [
            'admin_id' => $aiStaff->id,
            'action' => \App\Models\AiStaffActivityLog::ACTION_PROPOSAL_CREATED,
        ]);
    }

    public function test_human_admin_creating_a_proposal_does_not_log_activity(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);

        $this->actingAs($admin, 'admins')->post(route('admin.proposal.store'), [
            'title' => '人間作成の提案書',
        ]);

        $this->assertDatabaseCount('ai_staff_activity_logs', 0);
    }
```

- [ ] **Step 2: テストを実行して失敗を確認**

Run: `docker compose exec -T laravel.test php artisan test tests/Feature/Admin/ProposalControllerTest.php --filter=test_ai_staff_creating_a_proposal_logs_the_activity`
Expected: FAIL

- [ ] **Step 3: `ProposalController::store()`にログ呼び出しを追加**

`app/Http/Controllers/Admin/ProposalController.php`のコンストラクタに`AiStaffActivityLogger`を追加し、`store`メソッドを変更:

```php
use App\Models\AiStaffActivityLog;
use App\Services\AiStaffActivityLogger;
use Illuminate\Support\Facades\Auth;

// ...

    public function store(ProposalRequest $request): RedirectResponse
    {
        $proposal = $this->service->createProposal(
            $request->validated(),
            Auth::guard('admins')->id()
        );

        $this->activityLogger->log(
            Auth::guard('admins')->user(),
            AiStaffActivityLog::ACTION_PROPOSAL_CREATED,
            "提案書「{$proposal->title}」を作成",
            $proposal
        );

        return redirect()->route('admin.proposal.show', $proposal)
            ->with('success', __('messages.created', ['attribute' => '提案書']));
    }
```

（コンストラクタの引数リスト末尾に`private AiStaffActivityLogger $activityLogger,`を追加する）

- [ ] **Step 4: テストを実行して成功を確認**

Run: `docker compose exec -T laravel.test php artisan test tests/Feature/Admin/ProposalControllerTest.php`
Expected: 全件`passed`（既存4件＋新規2件＝6件）

- [ ] **Step 5: Pintを実行してコミット**

```bash
./vendor/bin/pint --dirty
git add app/Http/Controllers/Admin/ProposalController.php tests/Feature/Admin/ProposalControllerTest.php
git commit -m "feat: AI社員による提案書作成を活動ログに記録"
```

---

### Task 7: 日次集計Artisanコマンド

**Files:**
- Create: `app/Console/Commands/AiStaff/GenerateDailyReports.php`
- Test: `tests/Feature/Console/GenerateDailyReportsTest.php`

**Interfaces:**
- Consumes: `AiStaffActivityLog`（Task 1）、`AiStaffDailyReport`（Task 1）
- Produces: `php artisan ai-staff:generate-daily-reports {date?}`コマンド（Task 8のスケジュール登録から呼ばれる）

- [ ] **Step 1: 失敗するテストを書く**

```php
<?php

namespace Tests\Feature\Console;

use App\Models\Admin;
use App\Models\AiStaffActivityLog;
use App\Models\AiStaffDailyReport;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GenerateDailyReportsTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_generates_one_report_per_ai_staff_with_activity_on_the_target_date(): void
    {
        $marketing = Admin::factory()->aiStaff('marketing')->create();
        $sales = Admin::factory()->aiStaff('sales')->create();
        $targetDate = '2026-09-23';

        AiStaffActivityLog::create([
            'admin_id' => $marketing->id,
            'action' => AiStaffActivityLog::ACTION_TASK_STATUS_CHANGED,
            'description' => 'タスクA完了',
            'occurred_at' => "{$targetDate} 09:00:00",
        ]);
        AiStaffActivityLog::create([
            'admin_id' => $marketing->id,
            'action' => AiStaffActivityLog::ACTION_RESPONSE_CREATED,
            'description' => '返信B作成',
            'occurred_at' => "{$targetDate} 15:30:00",
        ]);
        AiStaffActivityLog::create([
            'admin_id' => $sales->id,
            'action' => AiStaffActivityLog::ACTION_QUOTE_CREATED,
            'description' => '見積C作成',
            'occurred_at' => "{$targetDate} 11:00:00",
        ]);
        // 対象日でないログ（集計対象に含まれてはいけない）
        AiStaffActivityLog::create([
            'admin_id' => $marketing->id,
            'action' => AiStaffActivityLog::ACTION_TASK_STATUS_CHANGED,
            'description' => '別の日のログ',
            'occurred_at' => '2026-09-22 09:00:00',
        ]);

        $this->artisan("ai-staff:generate-daily-reports {$targetDate}")
            ->assertExitCode(0);

        $this->assertDatabaseCount('ai_staff_daily_reports', 2);

        $marketingReport = AiStaffDailyReport::where('admin_id', $marketing->id)
            ->where('report_date', $targetDate)
            ->firstOrFail();
        $this->assertSame(2, $marketingReport->activity_count);
        $this->assertStringContainsString('タスクA完了', $marketingReport->body);
        $this->assertStringContainsString('返信B作成', $marketingReport->body);

        $salesReport = AiStaffDailyReport::where('admin_id', $sales->id)
            ->where('report_date', $targetDate)
            ->firstOrFail();
        $this->assertSame(1, $salesReport->activity_count);
    }

    public function test_it_does_not_create_a_report_for_an_ai_staff_with_no_activity(): void
    {
        Admin::factory()->aiStaff('marketing')->create();

        $this->artisan('ai-staff:generate-daily-reports 2026-09-23')
            ->assertExitCode(0);

        $this->assertDatabaseCount('ai_staff_daily_reports', 0);
    }

    public function test_running_twice_for_the_same_date_does_not_duplicate_reports(): void
    {
        $admin = Admin::factory()->aiStaff('marketing')->create();
        AiStaffActivityLog::create([
            'admin_id' => $admin->id,
            'action' => AiStaffActivityLog::ACTION_TASK_STATUS_CHANGED,
            'description' => 'タスクA完了',
            'occurred_at' => '2026-09-23 09:00:00',
        ]);

        $this->artisan('ai-staff:generate-daily-reports 2026-09-23')->assertExitCode(0);
        $this->artisan('ai-staff:generate-daily-reports 2026-09-23')->assertExitCode(0);

        $this->assertDatabaseCount('ai_staff_daily_reports', 1);
    }

    public function test_it_defaults_to_yesterday_when_no_date_is_given(): void
    {
        $admin = Admin::factory()->aiStaff('marketing')->create();
        AiStaffActivityLog::create([
            'admin_id' => $admin->id,
            'action' => AiStaffActivityLog::ACTION_TASK_STATUS_CHANGED,
            'description' => 'タスクA完了',
            'occurred_at' => now()->subDay()->setTime(9, 0),
        ]);

        $this->artisan('ai-staff:generate-daily-reports')->assertExitCode(0);

        $this->assertDatabaseHas('ai_staff_daily_reports', [
            'admin_id' => $admin->id,
            'report_date' => now()->subDay()->toDateString(),
        ]);
    }
}
```

- [ ] **Step 2: テストを実行して失敗を確認**

Run: `docker compose exec -T laravel.test php artisan test tests/Feature/Console/GenerateDailyReportsTest.php`
Expected: FAIL（コマンドが存在しない）

- [ ] **Step 3: コマンドを実装**

```php
<?php

namespace App\Console\Commands\AiStaff;

use App\Models\AiStaffActivityLog;
use App\Models\AiStaffDailyReport;
use Carbon\Carbon;
use Illuminate\Console\Command;

class GenerateDailyReports extends Command
{
    protected $signature = 'ai-staff:generate-daily-reports {date? : 集計対象日(YYYY-MM-DD、省略時は前日)}';

    protected $description = 'AI社員の活動ログ(ai_staff_activity_logs)から、AI社員ごとの日報(ai_staff_daily_reports)を生成する';

    public function handle(): int
    {
        $date = $this->argument('date')
            ? Carbon::parse($this->argument('date'))->startOfDay()
            : now()->subDay()->startOfDay();

        $this->info("集計対象日: {$date->toDateString()}");

        $logs = AiStaffActivityLog::query()
            ->whereBetween('occurred_at', [$date->copy()->startOfDay(), $date->copy()->endOfDay()])
            ->orderBy('occurred_at')
            ->get()
            ->groupBy('admin_id');

        if ($logs->isEmpty()) {
            $this->line('対象日の活動ログがありません（日報は作成しません）');

            return self::SUCCESS;
        }

        foreach ($logs as $adminId => $adminLogs) {
            $body = $adminLogs
                ->map(fn (AiStaffActivityLog $log) => sprintf(
                    '[%s] %s',
                    $log->occurred_at->format('H:i'),
                    $log->description
                ))
                ->implode("\n");

            AiStaffDailyReport::updateOrCreate(
                ['admin_id' => $adminId, 'report_date' => $date->toDateString()],
                [
                    'body' => $body,
                    'activity_count' => $adminLogs->count(),
                    'generated_at' => now(),
                ]
            );

            $this->line("  admin_id={$adminId}: {$adminLogs->count()}件のログから日報を生成しました");
        }

        $this->info('日報の生成が完了しました。');

        return self::SUCCESS;
    }
}
```

- [ ] **Step 4: テストを実行して成功を確認**

Run: `docker compose exec -T laravel.test php artisan test tests/Feature/Console/GenerateDailyReportsTest.php`
Expected: `4 passed`

- [ ] **Step 5: Pintを実行してコミット**

```bash
./vendor/bin/pint --dirty
git add app/Console/Commands/AiStaff/GenerateDailyReports.php tests/Feature/Console/GenerateDailyReportsTest.php
git commit -m "feat: AI社員日報の日次集計コマンドを追加"
```

---

### Task 8: スケジュール登録

**Files:**
- Modify: `routes/console.php`

**Interfaces:**
- Consumes: `ai-staff:generate-daily-reports`コマンド（Task 7）

- [ ] **Step 1: `routes/console.php`に毎朝8時のスケジュールを追加**

既存の`analytics:aggregate-daily`の行の直後に追加する:

```php
// アクセス解析・業務KPIの日次集計（前日分）を毎日深夜2時に実行
$alertOnFailure(Schedule::command('analytics:aggregate-daily')->dailyAt('02:00'));

// AI社員の日報（前日分の活動ログ集計）を毎日午前8時に生成
$alertOnFailure(Schedule::command('ai-staff:generate-daily-reports')->dailyAt('08:00'));
```

- [ ] **Step 2: スケジュール一覧に登録されたことを確認**

Run: `docker compose exec -T laravel.test php artisan schedule:list`
Expected: 出力に`ai-staff:generate-daily-reports`と`08:00`が含まれる

- [ ] **Step 3: コミット**

```bash
git add routes/console.php
git commit -m "feat: AI社員日報生成コマンドを毎朝8時にスケジュール登録"
```

---

### Task 9: Admin用コントローラー・ルート

**Files:**
- Create: `app/Http/Controllers/Admin/AiStaffDailyReportController.php`
- Create: `routes/admin/ai-staff-daily-report.php`
- Modify: `routes/admin.php`（新規ルートファイルのrequire追加）
- Test: `tests/Feature/Admin/AiStaffDailyReportControllerTest.php`

**Interfaces:**
- Consumes: `AiStaffDailyReport`（Task 1）
- Produces: `GET /admin/ai-staff-daily-reports`（`admin.ai-staff-daily-reports.index`）、`GET /admin/ai-staff-daily-reports/{aiStaffDailyReport}`（`admin.ai-staff-daily-reports.show`）— Task 10のReactページが利用する

- [ ] **Step 1: `routes/admin.php`で新規ルートファイルがrequireされているか確認し、無ければ追加**

`routes/admin.php`を読み、既存の`require __DIR__.'/admin/task.php';`のような行の並びに合わせて、以下の行を追加する:

```php
require __DIR__.'/admin/ai-staff-daily-report.php';
```

- [ ] **Step 2: ルートファイルを作成**

```php
<?php

use App\Http\Controllers\Admin\AiStaffDailyReportController;
use Illuminate\Support\Facades\Route;

// 認証・権限ミドルウェアは admin.php 側の親グループで適用済みのためここでは付与しない

Route::resource('ai-staff-daily-reports', AiStaffDailyReportController::class)
    ->only(['index', 'show'])
    ->parameters(['ai-staff-daily-reports' => 'aiStaffDailyReport']);
```

- [ ] **Step 3: 失敗するテストを書く**

```php
<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use App\Models\AiStaffDailyReport;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AiStaffDailyReportControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
    }

    public function test_admin_can_view_the_daily_report_list(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);
        $aiStaff = Admin::factory()->aiStaff('marketing')->create();
        AiStaffDailyReport::create([
            'admin_id' => $aiStaff->id,
            'report_date' => '2026-09-23',
            'body' => "[09:00] タスクA完了",
            'activity_count' => 1,
            'generated_at' => now(),
        ]);

        $response = $this->actingAs($admin, 'admins')->get(route('admin.ai-staff-daily-reports.index'));

        $response->assertInertia(fn ($page) => $page
            ->component('Admin/AiStaffDailyReports/Index')
            ->has('reports.data', 1)
        );
    }

    public function test_admin_can_view_a_single_daily_report(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);
        $aiStaff = Admin::factory()->aiStaff('marketing')->create();
        $report = AiStaffDailyReport::create([
            'admin_id' => $aiStaff->id,
            'report_date' => '2026-09-23',
            'body' => "[09:00] タスクA完了",
            'activity_count' => 1,
            'generated_at' => now(),
        ]);

        $response = $this->actingAs($admin, 'admins')->get(route('admin.ai-staff-daily-reports.show', $report));

        $response->assertInertia(fn ($page) => $page
            ->component('Admin/AiStaffDailyReports/Show')
            ->where('report.id', $report->id)
        );
    }

    public function test_guest_cannot_view_the_daily_report_list(): void
    {
        $response = $this->get(route('admin.ai-staff-daily-reports.index'));

        $response->assertRedirect(route('admin.login'));
    }
}
```

- [ ] **Step 4: テストを実行して失敗を確認**

Run: `docker compose exec -T laravel.test php artisan test tests/Feature/Admin/AiStaffDailyReportControllerTest.php`
Expected: FAIL（コントローラーが存在しない）

- [ ] **Step 5: コントローラーを実装**

```php
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AiStaffDailyReport;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AiStaffDailyReportController extends Controller
{
    public function index(Request $request): Response
    {
        $query = AiStaffDailyReport::with('admin')
            ->orderByDesc('report_date');

        if ($request->filled('admin_id')) {
            $query->where('admin_id', $request->input('admin_id'));
        }

        if ($request->filled('report_date')) {
            $query->where('report_date', $request->input('report_date'));
        }

        return Inertia::render('Admin/AiStaffDailyReports/Index', [
            'reports' => $query->paginate(20)->withQueryString(),
            'filters' => $request->only(['admin_id', 'report_date']),
            'aiStaffAdmins' => \App\Models\Admin::where('role', 'ai_staff')
                ->orderBy('department')
                ->get(['id', 'email', 'department']),
        ]);
    }

    public function show(AiStaffDailyReport $aiStaffDailyReport): Response
    {
        $aiStaffDailyReport->load('admin');

        $activityLogs = \App\Models\AiStaffActivityLog::where('admin_id', $aiStaffDailyReport->admin_id)
            ->whereBetween('occurred_at', [
                $aiStaffDailyReport->report_date->copy()->startOfDay(),
                $aiStaffDailyReport->report_date->copy()->endOfDay(),
            ])
            ->orderBy('occurred_at')
            ->get();

        return Inertia::render('Admin/AiStaffDailyReports/Show', [
            'report' => $aiStaffDailyReport,
            'activityLogs' => $activityLogs,
        ]);
    }
}
```

- [ ] **Step 6: 権限カタログを同期**

Run: `docker compose exec -T laravel.test php artisan admin:sync-permissions`
Expected: 新しい`ai-staff-daily-reports.index`/`ai-staff-daily-reports.show`権限が登録される（`config/admin_permissions.php`の`editor_role_allowed_actions`/`ai_staff_role_allowed_actions`に既に`index`/`show`が含まれているため、追加の権限設定変更は不要）

- [ ] **Step 7: テストを実行して成功を確認**

Run: `docker compose exec -T laravel.test php artisan test tests/Feature/Admin/AiStaffDailyReportControllerTest.php`
Expected: `3 passed`

- [ ] **Step 8: Pintを実行してコミット**

```bash
./vendor/bin/pint --dirty
git add app/Http/Controllers/Admin/AiStaffDailyReportController.php \
        routes/admin/ai-staff-daily-report.php routes/admin.php \
        tests/Feature/Admin/AiStaffDailyReportControllerTest.php
git commit -m "feat: AI社員日報のAdmin一覧・詳細エンドポイントを追加"
```

---

### Task 10: Admin用React画面・ナビゲーション

**Files:**
- Create: `resources/js/Pages/Admin/AiStaffDailyReports/Index.jsx`
- Create: `resources/js/Pages/Admin/AiStaffDailyReports/Show.jsx`
- Modify: `resources/js/Components/NavItems/AdminNavItems.jsx`

**Interfaces:**
- Consumes: Task 9で作成した`admin.ai-staff-daily-reports.index`/`admin.ai-staff-daily-reports.show`ルートと、それぞれが返すInertia props（`reports`/`filters`/`aiStaffAdmins`、`report`/`activityLogs`）

- [ ] **Step 1: 一覧ページを作成**

```jsx
import React from "react";
import { Head, Link, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { Card } from "@/Components/Card";
import { Badge } from "@/Components/Badges";

export default function Index({ reports, filters, aiStaffAdmins }) {
    const handleFilterChange = (key, value) => {
        router.get(
            route("admin.ai-staff-daily-reports.index"),
            { ...filters, [key]: value || undefined },
            { preserveState: true, replace: true },
        );
    };

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="AI社員 日報"
                    description="AI社員の日々の活動を日付・担当者別に確認できます"
                    breadcrumbs={["AI社員 日報"]}
                />
            }
        >
            <Head title="AI社員 日報" />

            <div className="space-y-4">
                <Card>
                    <div className="flex flex-wrap gap-3 p-4">
                        <select
                            className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm px-3 py-2"
                            value={filters.admin_id || ""}
                            onChange={(e) =>
                                handleFilterChange("admin_id", e.target.value)
                            }
                        >
                            <option value="">全AI社員</option>
                            {aiStaffAdmins.map((admin) => (
                                <option key={admin.id} value={admin.id}>
                                    {admin.department ?? admin.email}
                                </option>
                            ))}
                        </select>
                        <input
                            type="date"
                            className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm px-3 py-2"
                            value={filters.report_date || ""}
                            onChange={(e) =>
                                handleFilterChange(
                                    "report_date",
                                    e.target.value,
                                )
                            }
                        />
                    </div>
                </Card>

                <Card>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                            <thead>
                                <tr>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                                        日付
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                                        AI社員
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                                        活動件数
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                                        操作
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {reports.data.map((report) => (
                                    <tr
                                        key={report.id}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-800"
                                    >
                                        <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                                            {report.report_date}
                                        </td>
                                        <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                                            {report.admin?.department ??
                                                report.admin?.email}
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge variant="secondary">
                                                {report.activity_count}件
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Link
                                                href={route(
                                                    "admin.ai-staff-daily-reports.show",
                                                    report.id,
                                                )}
                                                className="text-indigo-600 dark:text-indigo-400 hover:underline"
                                            >
                                                詳細
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                {reports.data.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
                                        >
                                            該当する日報がありません
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </AdminAuthenticatedLayout>
    );
}
```

- [ ] **Step 2: 詳細ページを作成**

```jsx
import React from "react";
import { Head, Link } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { Card } from "@/Components/Card";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function Show({ report, activityLogs }) {
    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title={`AI社員 日報 - ${report.report_date}`}
                    description={
                        report.admin?.department ?? report.admin?.email
                    }
                    breadcrumbs={["AI社員 日報", report.report_date]}
                    actions={[
                        {
                            label: "一覧に戻る",
                            icon: ArrowLeftIcon,
                            variant: "ghost",
                            route: route(
                                "admin.ai-staff-daily-reports.index",
                            ),
                        },
                    ]}
                />
            }
        >
            <Head title={`AI社員 日報 - ${report.report_date}`} />

            <div className="space-y-4">
                <Card>
                    <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            日報本文
                        </h3>
                        <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 font-sans">
                            {report.body}
                        </pre>
                    </div>
                </Card>

                <Card>
                    <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            活動ログ（{activityLogs.length}件）
                        </h3>
                        <ul className="space-y-2">
                            {activityLogs.map((log) => (
                                <li
                                    key={log.id}
                                    className="text-sm text-gray-700 dark:text-gray-300 border-l-2 border-gray-200 dark:border-gray-700 pl-3"
                                >
                                    <span className="text-gray-400 dark:text-gray-500 mr-2">
                                        {new Date(
                                            log.occurred_at,
                                        ).toLocaleTimeString("ja-JP", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </span>
                                    {log.description}
                                </li>
                            ))}
                        </ul>
                    </div>
                </Card>
            </div>
        </AdminAuthenticatedLayout>
    );
}
```

- [ ] **Step 3: ナビゲーションに追加**

`resources/js/Components/NavItems/AdminNavItems.jsx`の「管理者管理」セクション（`currentPath: ["admin.admin.*", "admin.attendance.*"]`）を以下のように変更する:

```js
        // 管理者管理
        {
            name: "管理者",
            href: "admin.admin.index",
            icon: "M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z",
            currentPath: [
                "admin.admin.*",
                "admin.attendance.*",
                "admin.ai-staff-daily-reports.*",
            ],
            children: [
                { name: "管理者", href: "admin.admin.index" },
                {
                    name: "権限",
                    href: "admin.permissions.index",
                    ownerOnly: true,
                },
                { name: "勤怠管理", href: "admin.attendance.index" },
                { name: "シフト管理", href: "admin.attendance.shifts.index" },
                { name: "給与計算", href: "admin.payroll.index" },
                {
                    name: "AI社員 日報",
                    href: "admin.ai-staff-daily-reports.index",
                },
            ],
        },
```

- [ ] **Step 4: フロントエンドをビルド**

Run（ホスト側で実行、Dockerコンテナ内のesbuildはプラットフォーム不一致のため使わない）: `npm run build`
Expected: `✓ built`とエラー無しで終了

- [ ] **Step 5: バックエンドのテストを再実行して回帰が無いことを確認**

Run: `docker compose exec -T laravel.test php artisan test tests/Feature/Admin/AiStaffDailyReportControllerTest.php`
Expected: `3 passed`（Inertiaコンポーネント名の参照が正しいことの確認を兼ねる）

- [ ] **Step 6: コミット**

```bash
git add resources/js/Pages/Admin/AiStaffDailyReports/Index.jsx \
        resources/js/Pages/Admin/AiStaffDailyReports/Show.jsx \
        resources/js/Components/NavItems/AdminNavItems.jsx
git commit -m "feat: AI社員日報の閲覧画面とナビゲーションを追加"
```

---

## 最終確認

全タスク完了後、以下を実行してから`superpowers:finishing-a-development-branch`スキルでブランチを統合する:

```bash
docker compose exec -T laravel.test php artisan test
./vendor/bin/pint --dirty
npm run build
```

あわせて、CLAUDE.md §8のドキュメント更新ルールに従い、`docs/superpowers/specs/2026-09-24-ai-staff-daily-reports-design.md`に「実装済み」の追記と、`SPEC.md`への簡潔な参照（新規ドメイン節または§1のAI社員関連箇所）を追加すること。
