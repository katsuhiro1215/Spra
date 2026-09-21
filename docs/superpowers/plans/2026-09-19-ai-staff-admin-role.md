# AI社員(Admin拡張) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `admins`テーブルに`ai_staff`ロールと`department`カラムを追加し、部署ベースのユニークメールでAI社員アカウントを作成できるようにする。初期10部署分のAI社員をシーダーで投入する。

**Architecture:** 既存のSpatie権限基盤(`Admin::ROLES`/`RESTRICTABLE_ROLES`/`RolePermissionSeeder`)にロールを1つ追加する形で乗せる。新規テーブルは作らず、`admins`テーブルへのカラム追加とenum拡張のみで完結させる。既存の`AdminService::createAdmin()`を再利用し、その上に部署ベースのメール発行を行う薄いラッパー`createAiStaff()`を追加する。

**Tech Stack:** Laravel 12 / MySQL / Spatie Laravel Permission / PHPUnit(クラスベース、Pest未使用)

**Spec:** `docs/superpowers/specs/2026-09-18-ai-staff-and-proposal-flow-design.md` の「1. AI社員(Admin拡張)」

## Global Constraints

- Spraは本番稼働中(`https://smartsprouts.jp`、実データあり)。マイグレーションはロールバック可能な形で作成し、既存の`admins`レコードに影響を与えないこと。
- ガード名は必ず`admins`を明示する(`Auth::guard('admins')`)。`admin`(単数形)との取り違えは過去に複数回実バグを起こしている(SPEC.md §7 K5/K29)。
- Spatie権限(ロール・パーミッション)を追加/変更したら`php artisan admin:sync-permissions`を実行する。`RolePermissionSeeder::run()`は既にこのコマンドを内部で呼んでいるため、シーダー経由なら追加対応不要。
- 作業は`feat/`ブランチを切って行う。mainへ直接コミットしない。ブランチは`origin/main`起点で作る。
- コミットメッセージは日本語で「なぜ」を意識する。

---

### Task 1: スキーマ拡張(`ai_staff`ロール・`department`カラム)とAdminモデル更新

**Files:**
- Create: `database/migrations/2026_09_19_010001_add_ai_staff_role_and_department_to_admins_table.php`
- Modify: `app/Models/Admin.php`
- Modify: `database/factories/AdminFactory.php`
- Test: `tests/Feature/Admin/AiStaffAdminModelTest.php`

**Interfaces:**
- Produces: `Admin::ROLES['ai_staff']`、`Admin::RESTRICTABLE_ROLES`に`'ai_staff'`を含む、`Admin::isAiStaff(): bool`、`admins.department`カラム(nullable string)、`AdminFactory::aiStaff(string $department = 'marketing'): static`

- [ ] **Step 1: 失敗するテストを書く**

```php
<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AiStaffAdminModelTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Admin保存時にbooted()フックがsyncRoles()を呼ぶため、対象ロールの
        // Spatie Roleレコードを先に用意しておく必要がある。
        $this->seed(\Database\Seeders\RolePermissionSeeder::class);
    }

    public function test_admin_can_be_created_with_ai_staff_role_and_department(): void
    {
        $admin = Admin::factory()->aiStaff('marketing')->create();

        $this->assertDatabaseHas('admins', [
            'id' => $admin->id,
            'role' => 'ai_staff',
            'department' => 'marketing',
        ]);
        $this->assertTrue($admin->fresh()->isAiStaff());
    }

    public function test_ai_staff_role_is_restrictable(): void
    {
        $this->assertContains('ai_staff', Admin::RESTRICTABLE_ROLES);
    }
}
```

- [ ] **Step 2: テストを実行し失敗を確認する**

Run: `php artisan test --filter=AiStaffAdminModelTest`
Expected: FAIL(`department`カラムが存在しない、または`role`のenumに`ai_staff`が無くDB例外、`aiStaff()`/`isAiStaff()`が未定義)

- [ ] **Step 3: マイグレーションを作成する**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * admins.role に AI社員用ロール 'ai_staff' を追加し、
     * 部署slugを保持する department カラムを追加する。
     */
    public function up(): void
    {
        DB::statement("ALTER TABLE admins MODIFY role ENUM('owner', 'super_admin', 'admin', 'editor', 'viewer', 'ai_staff') NOT NULL DEFAULT 'admin'");

        Schema::table('admins', function (Blueprint $table) {
            $table->string('department')->nullable()->after('role')
                ->comment('AI社員の部署slug(company/CLAUDE.mdの部署一覧に対応)。人間の管理者はnull');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // enumを縮小する前に、既存の ai_staff ロールを viewer へ退避させる。
        // MySQLはenum外の値を空文字に丸めるため、これを怠ると本番データが壊れる。
        DB::table('admins')->where('role', 'ai_staff')->update(['role' => 'viewer']);

        Schema::table('admins', function (Blueprint $table) {
            $table->dropColumn('department');
        });

        DB::statement("ALTER TABLE admins MODIFY role ENUM('owner', 'super_admin', 'admin', 'editor', 'viewer') NOT NULL DEFAULT 'admin'");
    }
};
```

- [ ] **Step 4: マイグレーションを実行する**

Run: `php artisan migrate`
Expected: 新規マイグレーションが正常に適用される(既存の`admins`レコード件数・内容に変化が無いことを`php artisan tinker`で`Admin::count()`を実行前後比較して確認)

- [ ] **Step 5: Adminモデルを更新する**

`app/Models/Admin.php`の変更点(既存コードへの追記・修正のみ、他のメソッドは変更しない):

```php
use Laravel\Sanctum\HasApiTokens;

class Admin extends Authenticatable
{
    use HasUuid, HasFactory, Notifiable, SoftDeletes, HasRoles, HasLoginLockout, HasTwoFactorAuthentication, HasApiTokens;

    protected $fillable = [
        'email',
        'password',
        'role',
        'department',
        'status',
        'last_login_at',
    ];

    public const ROLES = [
        'owner'       => 'オーナー',
        'super_admin' => 'スーパー管理者',
        'admin'       => '管理者',
        'editor'      => '編集者',
        'viewer'      => '閲覧者',
        'ai_staff'    => 'AI社員',
    ];

    public const RESTRICTABLE_ROLES = ['admin', 'editor', 'viewer', 'ai_staff'];

    public function isAiStaff(): bool
    {
        return $this->role === 'ai_staff';
    }
}
```

`HasApiTokens`は将来AI社員がAPIトークン経由でログイン・操作するための土台として追加する(今回はトレイト追加のみ、トークン発行エンドポイントは対象外)。

- [ ] **Step 6: AdminFactoryに`aiStaff()`ステートを追加する**

`database/factories/AdminFactory.php`に追記:

```php
public function aiStaff(string $department = 'marketing'): static
{
    return $this->state(fn(array $attributes) => [
        'role' => 'ai_staff',
        'department' => $department,
        'email' => "ai-{$department}@smartsprouts.jp",
    ]);
}
```

- [ ] **Step 7: テストを実行し成功を確認する**

Run: `php artisan test --filter=AiStaffAdminModelTest`
Expected: PASS

- [ ] **Step 8: コミット**

```bash
git add database/migrations/2026_09_19_010001_add_ai_staff_role_and_department_to_admins_table.php app/Models/Admin.php database/factories/AdminFactory.php tests/Feature/Admin/AiStaffAdminModelTest.php
git commit -m "feat: adminsテーブルにai_staffロールとdepartmentカラムを追加"
```

---

### Task 2: `ai_staff`ロールの権限を限定する

**Files:**
- Modify: `config/admin_permissions.php`
- Modify: `database/seeders/RolePermissionSeeder.php`
- Test: `tests/Feature/Admin/AiStaffRolePermissionSeederTest.php`

**Interfaces:**
- Consumes: Task 1の`Admin::RESTRICTABLE_ROLES`(既に`ai_staff`を含む)
- Produces: `config('admin_permissions.ai_staff_role_allowed_actions')` = `['index', 'show']`。`RolePermissionSeeder`実行後、guard `admins`のRole `ai_staff`が`index`/`show`系権限のみを持つ

- [ ] **Step 1: 失敗するテストを書く**

```php
<?php

namespace Tests\Feature\Admin;

use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class AiStaffRolePermissionSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_ai_staff_role_gets_only_configured_view_actions(): void
    {
        $this->seed(RolePermissionSeeder::class);

        $role = Role::where('name', 'ai_staff')->where('guard_name', 'admins')->firstOrFail();
        $permissionNames = $role->permissions->pluck('name');

        $this->assertTrue($permissionNames->isNotEmpty());
        $permissionNames->each(function (string $name) {
            $action = Str::afterLast($name, '.');
            $this->assertContains($action, ['index', 'show']);
        });
    }

    public function test_ai_staff_role_does_not_receive_destroy_permission(): void
    {
        $this->seed(RolePermissionSeeder::class);

        $role = Role::where('name', 'ai_staff')->where('guard_name', 'admins')->firstOrFail();
        $hasDestroy = $role->permissions->contains(
            fn($permission) => str_ends_with($permission->name, '.destroy')
        );

        $this->assertFalse($hasDestroy);
    }
}
```

- [ ] **Step 2: テストを実行し失敗を確認する**

Run: `php artisan test --filter=AiStaffRolePermissionSeederTest`
Expected: FAIL(`ai_staff`ロールに権限が1件も同期されていないため、1つ目のテストの`assertTrue($permissionNames->isNotEmpty())`で失敗)

- [ ] **Step 3: `config/admin_permissions.php`に許可アクションを追加する**

```php
'ai_staff_role_allowed_actions' => [
    'index',
    'show',
],
```

(`editor_role_allowed_actions`の直後に追記する。閲覧のみに絞った保守的な初期値とし、部署ごとに必要な操作権限は運用しながら追加する)

- [ ] **Step 4: `RolePermissionSeeder`に`ai_staff`用の権限同期処理を追加する**

`database/seeders/RolePermissionSeeder.php`の`editor`ロール処理の直後に追記:

```php
$aiStaffActions = config('admin_permissions.ai_staff_role_allowed_actions', []);
$aiStaffPermissions = $allPermissionNames->filter(function (string $name) use ($aiStaffActions) {
    $action = Str::afterLast($name, '.');

    return in_array($action, $aiStaffActions, true);
});
Role::where('name', 'ai_staff')->where('guard_name', 'admins')->first()
    ?->syncPermissions($aiStaffPermissions);
```

(`ai_staff`は`Admin::RESTRICTABLE_ROLES`に含まれるため、既存の`$bypassRoles`ループでは全権限バイパスの対象にならない。この処理が無いと`Role::firstOrCreate()`でロール自体は作られるが権限が1件も同期されない)

- [ ] **Step 5: テストを実行し成功を確認する**

Run: `php artisan test --filter=AiStaffRolePermissionSeederTest`
Expected: PASS

- [ ] **Step 6: コミット**

```bash
git add config/admin_permissions.php database/seeders/RolePermissionSeeder.php tests/Feature/Admin/AiStaffRolePermissionSeederTest.php
git commit -m "feat: ai_staffロールの権限を閲覧系アクションのみに限定する"
```

---

### Task 3: `AdminService::createAiStaff()` — 部署ベースのメール発行

**Files:**
- Modify: `app/Services/AdminService.php`
- Test: `tests/Feature/Admin/AiStaffCreationServiceTest.php`

**Interfaces:**
- Consumes: Task 1の`admins.department`カラム、Task 2の権限設定
- Produces: `AdminService::createAiStaff(string $department): array{admin: Admin, password: string}`(既存の`createAdmin()`と同じ戻り値シェイプ)

- [ ] **Step 1: 失敗するテストを書く**

```php
<?php

namespace Tests\Feature\Admin;

use App\Services\AdminService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class AiStaffCreationServiceTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\RolePermissionSeeder::class);
    }

    public function test_create_ai_staff_generates_department_based_email_and_role(): void
    {
        Mail::fake();

        $result = app(AdminService::class)->createAiStaff('marketing');

        $this->assertSame('ai-marketing@smartsprouts.jp', $result['admin']->email);
        $this->assertSame('ai_staff', $result['admin']->role);
        $this->assertSame('marketing', $result['admin']->department);
        $this->assertNotEmpty($result['password']);
        $this->assertDatabaseHas('admins', [
            'email' => 'ai-marketing@smartsprouts.jp',
            'role' => 'ai_staff',
            'department' => 'marketing',
        ]);
    }
}
```

- [ ] **Step 2: テストを実行し失敗を確認する**

Run: `php artisan test --filter=AiStaffCreationServiceTest`
Expected: FAIL(`createAiStaff`メソッドが存在しない)

- [ ] **Step 3: `AdminService::createAdmin()`が`department`を保存するよう修正する**

`app/Services/AdminService.php`の`createAdmin()`内、`$this->repository->create([...])`の呼び出しを以下に修正:

```php
$admin = $this->repository->create([
    'email'      => $data['email'],
    'password'   => Hash::make($randomPassword),
    'role'       => $data['role'],
    'department' => $data['department'] ?? null,
    'status'     => 'active',
]);
```

- [ ] **Step 4: `createAiStaff()`メソッドを追加する**

`AdminService`クラスに追記(`createAdmin()`の直後):

```php
/**
 * AI社員を作成する(部署slugからメールアドレスを自動発行する)
 *
 * @param string $department 部署slug(例: marketing, creative)
 * @return array{admin: Admin, password: string}
 */
public function createAiStaff(string $department): array
{
    return $this->createAdmin([
        'email'      => "ai-{$department}@smartsprouts.jp",
        'role'       => 'ai_staff',
        'department' => $department,
    ]);
}
```

- [ ] **Step 5: テストを実行し成功を確認する**

Run: `php artisan test --filter=AiStaffCreationServiceTest`
Expected: PASS

- [ ] **Step 6: 既存のAdminService関連テストが壊れていないか確認する**

Run: `php artisan test --filter=AdminService`
Expected: PASS(既存の`createAdmin()`利用箇所は`department`未指定でも`?? null`によりnullが入るだけで、既存の挙動を壊さない)

- [ ] **Step 7: コミット**

```bash
git add app/Services/AdminService.php tests/Feature/Admin/AiStaffCreationServiceTest.php
git commit -m "feat: AdminServiceにAI社員作成メソッドを追加(部署ベースのメール自動発行)"
```

---

### Task 4: 初期10部署分のAI社員シーダー

**Files:**
- Create: `database/seeders/AiStaffSeeder.php`
- Test: `tests/Feature/Admin/AiStaffSeederTest.php`

**Interfaces:**
- Consumes: Task 3の`AdminService::createAiStaff(string $department)`
- Produces: `AiStaffSeeder::DEPARTMENTS`(10部署slugの配列)、`AiStaffSeeder`実行で10件のAI社員Adminレコードが作成される(冪等)

部署slugは`company/CLAUDE.md`の部署一覧(秘書室を除く、2026-09-18時点で稼働中の10部署)に対応させる: `marketing`, `creative`, `articles`, `tech-blog`, `ai-tools`, `spra`, `forge`, `nara-next`, `office`, `katsuooool`。

- [ ] **Step 1: 失敗するテストを書く**

```php
<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use Database\Seeders\AiStaffSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class AiStaffSeederTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // AiStaffSeederが作成する各AdminのsyncRoles()呼び出しが解決できるよう、
        // 先にSpatieのRoleレコードを用意しておく。
        $this->seed(\Database\Seeders\RolePermissionSeeder::class);
    }

    public function test_seeder_creates_ten_ai_staff_with_expected_departments(): void
    {
        Mail::fake();

        $this->seed(AiStaffSeeder::class);

        $aiStaff = Admin::where('role', 'ai_staff')->get();

        $this->assertCount(10, $aiStaff);
        $this->assertEqualsCanonicalizing(
            AiStaffSeeder::DEPARTMENTS,
            $aiStaff->pluck('department')->all()
        );
    }

    public function test_seeder_is_idempotent_when_run_twice(): void
    {
        Mail::fake();

        $this->seed(AiStaffSeeder::class);
        $this->seed(AiStaffSeeder::class);

        $this->assertSame(10, Admin::where('role', 'ai_staff')->count());
    }
}
```

- [ ] **Step 2: テストを実行し失敗を確認する**

Run: `php artisan test --filter=AiStaffSeederTest`
Expected: FAIL(`Database\Seeders\AiStaffSeeder`クラスが存在しない)

- [ ] **Step 3: `AiStaffSeeder`を作成する**

```php
<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Services\AdminService;
use Illuminate\Database\Seeder;

class AiStaffSeeder extends Seeder
{
    /**
     * company/CLAUDE.md記載の部署一覧(秘書室を除く、稼働中の10部署)に
     * 対応するAI社員を作成する。
     */
    public const DEPARTMENTS = [
        'marketing',
        'creative',
        'articles',
        'tech-blog',
        'ai-tools',
        'spra',
        'forge',
        'nara-next',
        'office',
        'katsuooool',
    ];

    public function run(): void
    {
        $service = app(AdminService::class);

        foreach (self::DEPARTMENTS as $department) {
            $alreadyExists = Admin::where('role', 'ai_staff')
                ->where('department', $department)
                ->exists();

            if ($alreadyExists) {
                continue;
            }

            $service->createAiStaff($department);
        }
    }
}
```

- [ ] **Step 4: テストを実行し成功を確認する**

Run: `php artisan test --filter=AiStaffSeederTest`
Expected: PASS

- [ ] **Step 5: コミット**

```bash
git add database/seeders/AiStaffSeeder.php tests/Feature/Admin/AiStaffSeederTest.php
git commit -m "feat: 初期10部署分のAI社員シーダーを追加"
```

**注意(本番投入時)**: このシーダーを本番で`php artisan db:seed --class=AiStaffSeeder`として実行すると、実際にメール送信(`AdminCreatedMail`)が飛ぶ。本番実行前にメール送信先・内容(自動生成パスワードの扱い)をユーザーと確認すること。`migrate:fresh`は絶対に使わない(過去にNARA NEXTでseeder未記録のDBデータを消失させた実例あり)。

**注意(本番投入の実行順序)**: `Admin::booted()`はAdmin保存時に`syncRoles([$admin->role])`を呼ぶため、対象ロールに対応するSpatieの`Role`レコードが先に存在しないと`RoleDoesNotExist`例外で失敗する。本番投入は必ず次の順序で行う: (1) `php artisan migrate`(`ai_staff`ロール値・`department`カラムを追加) → (2) `php artisan db:seed --class=RolePermissionSeeder`(`ai_staff`の`Role`レコード作成・権限同期。内部で`admin:sync-permissions`相当の処理も行う) → (3) 任意で`php artisan db:seed --class=AiStaffSeeder`(実際にAI社員Adminを作成)。(2)を飛ばして(3)を先に実行すると`RoleDoesNotExist`で必ず失敗する。

---

## Self-Review

- **Spec対応**: 設計メモ§1.3(スキーマ)→Task1、§1.4(権限)→Task2、§1.5(メール発行)→Task3、§1.6(給与情報を作らない)→`admin_employments`に一切触れていないため対応済み(明記のみ、コード変更不要)。§1.7の未決定事項のうち「初期10部署の一覧」はTask4で`company/CLAUDE.md`の現行部署一覧に基づき確定した。ロール値・権限セット詳細・Sanctumトークン運用は引き続き未決定のまま(スコープ外として明記)。
- **プレースホルダー確認**: 全タスクのコードは実際の値・実装で記述済み。「TODO」「後で実装」は無し。
- **型の一貫性**: `createAiStaff()`の戻り値`array{admin: Admin, password: string}`はTask3で定義し、Task4のシーダーはその戻り値を使わず素通りで呼ぶのみのため不整合なし。`Admin::isAiStaff()`はTask1で定義しTask1のテスト内でのみ使用、後続タスクとの命名齟齬なし。
