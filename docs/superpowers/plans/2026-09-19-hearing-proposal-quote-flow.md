# ヒアリング→提案書→見積フロー拡張 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `Proposal`(提案書)モデルを新設し、`Hearing`→`Proposal`→`Quote`という経路と、`Hearing`→`Quote`を直接つなぐ経路の両方を1つのスキーマで表現できるようにする。提案書はオプショナルなステップとして扱う。あわせて、お問い合わせ→**概算見積もり**(既存の`EstimateSimulator`が作るQuote v1)→ヒアリング+提案書→**正式見積**(同じQuoteの新バージョン)→契約、という確定済みの全体フローが成立することを検証する。

**Architecture:** 新規`proposals`テーブルを追加し、`hearing_id`(nullable)・`contact_id`(nullable)で紐付ける。既存の`quotes`テーブルに`proposal_id`(nullable)を追加する。`hearings.quote_id`は既存のまま変更しないが、`hearings.appointment_id`(nullable)を新規追加し、契約前のゲストのまま予約できる既存の`/consultation`(`Public\AppointmentController`)発の`Appointment`と紐付けられるようにする(§2.3参照。ユーザー登録が無い前提のため`users`経由の紐付けはできない)。Repository/Service/Controller層は既存の`Task`ドメインと同じ`BaseRepository`/`BaseService`継承パターンに揃える。AIによる提案書生成ロジック自体(市況分析等)は本計画のスコープ外とし、まずは人間のAdminが提案書を作成・保存できるCRUD基盤を作る(AI生成は基盤ができた後の別タスク)。**「概算」と「正式」は別モデルを作らず、同じ`Quote`の`QuoteVersion`の違いとして表現する**(`EstimateSimulatorController`が作るv1はそのまま「概算」、ヒアリング・提案書を経て作る新バージョンが「正式」。詳細はSpec §2.2b参照)。

**Tech Stack:** Laravel 12 / Inertia.js / MySQL / PHPUnit(クラスベース)

**Spec:** `docs/superpowers/specs/2026-09-18-ai-staff-and-proposal-flow-design.md` の「2. お問い合わせ→ヒアリング→提案書→見積フローの拡張」

## Global Constraints

- Spraは本番稼働中(実データあり)。マイグレーションはロールバック可能な形で作成し、既存の`quotes`/`hearings`レコードに影響を与えないこと。
- ガード名は必ず`admins`を明示する。
- 新規実装は`BaseRepository`/`BaseService`を継承する(Repository=データアクセス、Service=ビジネスロジック、Controller=プレゼンテーション)。
- 作業は`feat/`ブランチを切って行う。mainへ直接コミットしない。
- 本計画はバックエンド(モデル・マイグレーション・API)のみを対象とする。Inertia/Reactの画面実装は別タスクとする(Feature testはInertiaのレスポンス形状のみを検証し、実際のReactページファイルの有無には依存しない)。

---

### Task 1: `proposals`テーブルと`Proposal`モデル、`Quote`への`proposal_id`追加

**Files:**
- Create: `database/migrations/2026_09_19_020001_create_proposals_table.php`
- Create: `app/Models/Proposal.php`
- Modify: `app/Models/Quote.php`
- Modify: `app/Models/Hearing.php`
- Test: `tests/Feature/Proposal/ProposalModelTest.php`

**Interfaces:**
- Produces: `Proposal`モデル(ULID主体、`hearing()`/`contact()`/`creator()`/`quotes()`リレーション)、`Quote::proposal(): BelongsTo`、`Hearing::proposals(): HasMany`

- [ ] **Step 1: 失敗するテストを書く**

```php
<?php

namespace Tests\Feature\Proposal;

use App\Models\Admin;
use App\Models\Contact;
use App\Models\ContactCategory;
use App\Models\Hearing;
use App\Models\Proposal;
use App\Models\Quote;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProposalModelTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Admin保存時のbooted()フックがsyncRoles()を呼ぶため、Roleレコードを先に用意する。
        $this->seed(\Database\Seeders\RolePermissionSeeder::class);
    }

    /**
     * Quote/Contact/HearingにはHasFactoryが無いため、既存テスト
     * (tests/Feature/QuoteResponseRegistrationSyncTest.php等)と同じく
     * ::create()に必須項目を直接渡す方式に合わせる。
     */
    private function createContact(): Contact
    {
        $category = ContactCategory::create([
            'name' => '見積もり依頼',
            'slug' => 'quote-request-' . uniqid(),
            'sort_order' => 1,
            'is_active' => true,
        ]);

        return Contact::create([
            'contact_category_id' => $category->id,
            'name' => 'テスト太郎',
            'email' => 'proposal-test-' . uniqid() . '@example.com',
            'message' => 'テストメッセージ',
            'status' => 'new',
            'source' => 'web',
        ]);
    }

    private function createQuote(Admin $admin, array $overrides = []): Quote
    {
        return Quote::create(array_merge([
            'quote_number' => 'Q-TEST-' . uniqid(),
            'title' => 'テスト見積もり',
            'status' => 'draft',
            'created_by' => $admin->id,
        ], $overrides));
    }

    public function test_proposal_can_be_linked_to_hearing_and_contact(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin']);
        $contact = $this->createContact();
        $hearing = Hearing::create([
            'contact_id' => $contact->id,
            'title' => '初回ヒアリング',
            'created_by' => $admin->id,
        ]);

        $proposal = Proposal::create([
            'hearing_id' => $hearing->id,
            'contact_id' => $contact->id,
            'title' => 'コーポレートサイトリニューアル提案',
            'content' => '## 現状分析\n\n...',
            'status' => 'draft',
            'created_by' => $admin->id,
        ]);

        $this->assertTrue($proposal->hearing->is($hearing));
        $this->assertTrue($proposal->contact->is($contact));
        $this->assertTrue($proposal->creator->is($admin));
    }

    public function test_quote_can_reference_a_proposal(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin']);
        $proposal = Proposal::factory()->create(['created_by' => $admin->id]);

        $quote = $this->createQuote($admin, ['proposal_id' => $proposal->id]);

        $this->assertTrue($quote->proposal->is($proposal));
        $this->assertTrue($proposal->quotes->contains($quote));
    }

    public function test_quote_can_be_created_without_a_proposal(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin']);

        $quote = $this->createQuote($admin, ['proposal_id' => null]);

        $this->assertNull($quote->proposal);
    }
}
```

- [ ] **Step 2: テストを実行し失敗を確認する**

Run: `php artisan test --filter=ProposalModelTest`
Expected: FAIL(`proposals`テーブル・`Proposal`モデル・`quotes.proposal_id`が存在しない)

- [ ] **Step 3: マイグレーションを作成する**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * 提案書テーブル (ULID)
     * ヒアリング内容をもとにした提案書。ヒアリング→見積を直接つなぐ経路と、
     * ヒアリング→提案書→見積を経由する経路の両方をサポートするため、
     * hearing_id・quotes.proposal_id はいずれもnullableとする。
     */
    public function up(): void
    {
        Schema::create('proposals', function (Blueprint $table) {
            $table->ulid('id')->primary();

            $table->ulid('hearing_id')->nullable();
            $table->foreign('hearing_id')->references('id')->on('hearings')->onDelete('set null');

            $table->ulid('contact_id')->nullable();
            $table->foreign('contact_id')->references('id')->on('contacts')->onDelete('set null');

            $table->string('title');
            $table->longText('content')->nullable()->comment('AIまたは管理者が作成した分析・提案文面(Markdown)');
            $table->enum('status', ['draft', 'reviewing', 'sent'])->default('draft');

            $table->uuid('created_by')->nullable();
            $table->foreign('created_by')->references('id')->on('admins')->onDelete('set null');

            $table->timestamps();
            $table->softDeletes();

            $table->index('hearing_id');
            $table->index(['contact_id', 'created_at']);
        });

        Schema::table('quotes', function (Blueprint $table) {
            $table->ulid('proposal_id')->nullable()->after('contact_id');
            $table->foreign('proposal_id')->references('id')->on('proposals')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('quotes', function (Blueprint $table) {
            $table->dropForeign(['proposal_id']);
            $table->dropColumn('proposal_id');
        });

        Schema::dropIfExists('proposals');
    }
};
```

- [ ] **Step 4: マイグレーションを実行する**

Run: `php artisan migrate`
Expected: 正常に適用される。既存の`quotes`レコードは`proposal_id`が`null`のまま(nullable追加のため既存行への影響なし)

- [ ] **Step 5: `Proposal`モデルを作成する**

```php
<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Proposal extends Model
{
    use HasUlid, HasFactory, SoftDeletes;

    public const STATUSES = ['draft', 'reviewing', 'sent'];

    protected $fillable = [
        'hearing_id',
        'contact_id',
        'title',
        'content',
        'status',
        'created_by',
    ];

    public function hearing(): BelongsTo
    {
        return $this->belongsTo(Hearing::class);
    }

    public function contact(): BelongsTo
    {
        return $this->belongsTo(Contact::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'created_by');
    }

    public function quotes(): HasMany
    {
        return $this->hasMany(Quote::class);
    }
}
```

- [ ] **Step 6: `Quote`モデルに`proposal()`リレーションを追加する**

`app/Models/Quote.php`の`contact()`リレーションの直後に追記:

```php
public function proposal(): BelongsTo
{
    return $this->belongsTo(Proposal::class);
}
```

- [ ] **Step 7: `Hearing`モデルに`proposals()`リレーションを追加する**

`app/Models/Hearing.php`の`answers()`リレーションの直後に追記:

```php
public function proposals(): HasMany
{
    return $this->hasMany(Proposal::class);
}
```

(`use Illuminate\Database\Eloquent\Relations\HasMany;`は既にimport済みのため追加不要)

- [ ] **Step 8: `Proposal`用のFactoryを作成する**

```php
<?php

namespace Database\Factories;

use App\Models\Proposal;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<Proposal>
 */
class ProposalFactory extends Factory
{
    protected $model = Proposal::class;

    public function definition(): array
    {
        return [
            'title' => fake()->sentence(4),
            'content' => fake()->paragraphs(3, true),
            'status' => 'draft',
        ];
    }
}
```

- [ ] **Step 9: テストを実行し成功を確認する**

Run: `php artisan test --filter=ProposalModelTest`
Expected: PASS

- [ ] **Step 10: コミット**

```bash
git add database/migrations/2026_09_19_020001_create_proposals_table.php app/Models/Proposal.php app/Models/Quote.php app/Models/Hearing.php database/factories/ProposalFactory.php tests/Feature/Proposal/ProposalModelTest.php
git commit -m "feat: 提案書(Proposal)モデルを新設しHearing/Quoteと紐付け可能にする"
```

---

### Task 2: `ProposalRepository`/`ProposalService`

**Files:**
- Create: `app/Repositories/Contracts/ProposalRepositoryInterface.php`
- Create: `app/Repositories/ProposalRepository.php`
- Create: `app/Services/ProposalService.php`
- Modify: `app/Providers/AppServiceProvider.php`
- Test: `tests/Feature/Proposal/ProposalServiceTest.php`

**Interfaces:**
- Consumes: Task 1の`Proposal`モデル
- Produces: `ProposalService::createProposal(array $data, string $creatorId): Proposal`、`ProposalService::findByHearing(string $hearingId): \Illuminate\Support\Collection`

- [ ] **Step 1: 失敗するテストを書く**

```php
<?php

namespace Tests\Feature\Proposal;

use App\Models\Admin;
use App\Models\Hearing;
use App\Services\ProposalService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProposalServiceTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\RolePermissionSeeder::class);
    }

    private function createHearing(Admin $admin, string $title = 'テストヒアリング'): Hearing
    {
        return Hearing::create([
            'title' => $title,
            'created_by' => $admin->id,
        ]);
    }

    public function test_create_proposal_sets_creator_and_persists_content(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin']);
        $hearing = $this->createHearing($admin);

        $proposal = app(ProposalService::class)->createProposal([
            'hearing_id' => $hearing->id,
            'title' => '提案書タイトル',
            'content' => '本文',
        ], $admin->id);

        $this->assertSame($admin->id, $proposal->created_by);
        $this->assertSame('draft', $proposal->status);
        $this->assertDatabaseHas('proposals', [
            'id' => $proposal->id,
            'hearing_id' => $hearing->id,
            'title' => '提案書タイトル',
        ]);
    }

    public function test_find_by_hearing_returns_only_matching_proposals(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin']);
        $hearingA = $this->createHearing($admin, 'ヒアリングA');
        $hearingB = $this->createHearing($admin, 'ヒアリングB');

        $service = app(ProposalService::class);
        $service->createProposal(['hearing_id' => $hearingA->id, 'title' => 'A案'], $admin->id);
        $service->createProposal(['hearing_id' => $hearingB->id, 'title' => 'B案'], $admin->id);

        $results = $service->findByHearing($hearingA->id);

        $this->assertCount(1, $results);
        $this->assertSame('A案', $results->first()->title);
    }
}
```

- [ ] **Step 2: テストを実行し失敗を確認する**

Run: `php artisan test --filter=ProposalServiceTest`
Expected: FAIL(`App\Services\ProposalService`が存在しない)

- [ ] **Step 3: `ProposalRepositoryInterface`を作成する**

```php
<?php

namespace App\Repositories\Contracts;

use Illuminate\Support\Collection;

interface ProposalRepositoryInterface extends BaseRepositoryInterface
{
    public function findByHearing(string $hearingId): Collection;
}
```

- [ ] **Step 4: `ProposalRepository`を作成する**

```php
<?php

namespace App\Repositories;

use App\Models\Proposal;
use App\Repositories\Contracts\ProposalRepositoryInterface;
use Illuminate\Support\Collection;

class ProposalRepository extends BaseRepository implements ProposalRepositoryInterface
{
    protected function getModelClass(): string
    {
        return Proposal::class;
    }

    protected function getSearchableFields(): array
    {
        return ['title'];
    }

    protected function getSortableFields(): array
    {
        return ['created_at', 'status'];
    }

    public function findByHearing(string $hearingId): Collection
    {
        return Proposal::where('hearing_id', $hearingId)
            ->orderByDesc('created_at')
            ->get();
    }
}
```

- [ ] **Step 5: `ProposalService`を作成する**

```php
<?php

namespace App\Services;

use App\Models\Proposal;
use App\Repositories\Contracts\ProposalRepositoryInterface;
use Illuminate\Support\Collection;

class ProposalService extends BaseService
{
    public function __construct(ProposalRepositoryInterface $repository)
    {
        parent::__construct($repository);
    }

    protected function getEntityName(): string
    {
        return 'Proposal';
    }

    public function createProposal(array $data, string $creatorId): Proposal
    {
        $data['created_by'] = $creatorId;
        $data['status'] ??= 'draft';

        return $this->repository->create($data);
    }

    public function findByHearing(string $hearingId): Collection
    {
        return $this->repository->findByHearing($hearingId);
    }
}
```

- [ ] **Step 6: `AppServiceProvider`にリポジトリバインディングを追加する**

`app/Providers/AppServiceProvider.php`の`TaskRepositoryInterface`バインディングの直後に追記:

```php
$this->app->bind(\App\Repositories\Contracts\ProposalRepositoryInterface::class, \App\Repositories\ProposalRepository::class);
```

- [ ] **Step 7: テストを実行し成功を確認する**

Run: `php artisan test --filter=ProposalServiceTest`
Expected: PASS

- [ ] **Step 8: コミット**

```bash
git add app/Repositories/Contracts/ProposalRepositoryInterface.php app/Repositories/ProposalRepository.php app/Services/ProposalService.php app/Providers/AppServiceProvider.php tests/Feature/Proposal/ProposalServiceTest.php
git commit -m "feat: ProposalのRepository/Service層を追加"
```

---

### Task 3: 提案書作成API(`Admin\ProposalController`)

**Files:**
- Create: `app/Http/Requests/ProposalRequest.php`
- Create: `app/Http/Controllers/Admin/ProposalController.php`
- Create: `routes/admin/proposal.php`
- Modify: `routes/admin.php`
- Test: `tests/Feature/Admin/ProposalControllerTest.php`

**Interfaces:**
- Consumes: Task 2の`ProposalService`
- Produces: `POST /admin/proposal`(ルート名`admin.proposal.store`)、`GET /admin/proposal/{proposal}`(ルート名`admin.proposal.show`)

- [ ] **Step 1: 失敗するテストを書く**

```php
<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use App\Models\Hearing;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProposalControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\RolePermissionSeeder::class);
    }

    private function createHearing(Admin $admin): Hearing
    {
        return Hearing::create([
            'title' => 'テストヒアリング',
            'created_by' => $admin->id,
        ]);
    }

    public function test_admin_can_create_a_proposal_linked_to_a_hearing(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);
        $hearing = $this->createHearing($admin);

        $response = $this->actingAs($admin, 'admins')->post(route('admin.proposal.store'), [
            'hearing_id' => $hearing->id,
            'title' => 'ECサイト構築提案',
            'content' => '## 分析結果\n\n...',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('proposals', [
            'hearing_id' => $hearing->id,
            'title' => 'ECサイト構築提案',
            'created_by' => $admin->id,
        ]);
    }

    public function test_creating_a_proposal_without_hearing_id_succeeds(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);

        $response = $this->actingAs($admin, 'admins')->post(route('admin.proposal.store'), [
            'title' => 'ヒアリング無しの提案書',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('proposals', [
            'hearing_id' => null,
            'title' => 'ヒアリング無しの提案書',
        ]);
    }

    public function test_guest_cannot_create_a_proposal(): void
    {
        $response = $this->post(route('admin.proposal.store'), ['title' => 'テスト']);

        $response->assertRedirect(route('admin.login'));
    }
}
```

- [ ] **Step 2: テストを実行し失敗を確認する**

Run: `php artisan test --filter=ProposalControllerTest`
Expected: FAIL(ルート`admin.proposal.store`が存在しない)

- [ ] **Step 3: `ProposalRequest`を作成する**

```php
<?php

namespace App\Http\Requests;

use App\Models\Proposal;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProposalRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'hearing_id' => ['nullable', 'exists:hearings,id'],
            'contact_id' => ['nullable', 'exists:contacts,id'],
            'title' => ['required', 'string', 'max:255'],
            'content' => ['nullable', 'string'],
            'status' => ['nullable', Rule::in(Proposal::STATUSES)],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'タイトルを入力してください。',
        ];
    }
}
```

- [ ] **Step 4: `Admin\ProposalController`を作成する**

```php
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProposalRequest;
use App\Models\Proposal;
use App\Services\ProposalService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ProposalController extends Controller
{
    public function __construct(
        private ProposalService $service,
    ) {}

    public function show(Proposal $proposal): Response
    {
        $proposal->load(['hearing', 'contact', 'creator', 'quotes']);

        return Inertia::render('Admin/Proposals/Show', [
            'proposal' => $proposal,
        ]);
    }

    public function store(ProposalRequest $request): RedirectResponse
    {
        $proposal = $this->service->createProposal(
            $request->validated(),
            Auth::guard('admins')->id()
        );

        return redirect()->route('admin.proposal.show', $proposal)
            ->with('success', __('messages.created', ['attribute' => '提案書']));
    }
}
```

- [ ] **Step 5: ルートファイルを作成する**

`routes/admin/proposal.php`:

```php
<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Admin\ProposalController;

// 認証・権限ミドルウェアは admin.php 側の親グループで適用済みのためここでは付与しない

Route::resource('proposal', ProposalController::class)->only(['show', 'store']);
```

- [ ] **Step 6: `routes/admin.php`にルートファイルを登録する**

`require __DIR__ . '/admin/quote.php';`の直後に追記:

```php
    /**************************************
     * 提案書
     **************************************/
    require __DIR__ . '/admin/proposal.php';
```

- [ ] **Step 7: テストを実行し成功を確認する**

Run: `php artisan test --filter=ProposalControllerTest`
Expected: PASS

- [ ] **Step 8: コミット**

```bash
git add app/Http/Requests/ProposalRequest.php app/Http/Controllers/Admin/ProposalController.php routes/admin/proposal.php routes/admin.php tests/Feature/Admin/ProposalControllerTest.php
git commit -m "feat: 提案書作成・閲覧APIを追加(Admin\\ProposalController)"
```

---

### Task 4: ヒアリング→(提案書)→見積の柔軟な経路を検証するEnd-to-Endテスト

**Files:**
- Test: `tests/Feature/Proposal/HearingProposalQuoteFlowTest.php`

**Interfaces:**
- Consumes: Task 1〜3の全成果物

- [ ] **Step 1: 失敗する(かもしれない)統合テストを書く**

```php
<?php

namespace Tests\Feature\Proposal;

use App\Models\Admin;
use App\Models\Contact;
use App\Models\ContactCategory;
use App\Models\Hearing;
use App\Models\Quote;
use App\Services\ProposalService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HearingProposalQuoteFlowTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\RolePermissionSeeder::class);
    }

    /**
     * Quote/Contact/HearingにはHasFactoryが無いため、既存テストと同じく
     * ::create()に必須項目を直接渡す方式に合わせる。
     */
    private function createContact(): Contact
    {
        $category = ContactCategory::create([
            'name' => '見積もり依頼',
            'slug' => 'quote-request-' . uniqid(),
            'sort_order' => 1,
            'is_active' => true,
        ]);

        return Contact::create([
            'contact_category_id' => $category->id,
            'name' => 'テスト太郎',
            'email' => 'flow-test-' . uniqid() . '@example.com',
            'message' => 'テストメッセージ',
            'status' => 'new',
            'source' => 'web',
        ]);
    }

    private function createHearing(Admin $admin, Contact $contact): Hearing
    {
        return Hearing::create([
            'contact_id' => $contact->id,
            'title' => 'テストヒアリング',
            'created_by' => $admin->id,
        ]);
    }

    private function createQuote(Admin $admin, array $overrides = []): Quote
    {
        return Quote::create(array_merge([
            'quote_number' => 'Q-FLOW-' . uniqid(),
            'title' => 'テスト見積もり',
            'status' => 'draft',
            'created_by' => $admin->id,
        ], $overrides));
    }

    public function test_simple_case_skips_proposal_from_hearing_to_quote(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin']);
        $contact = $this->createContact();
        $hearing = $this->createHearing($admin, $contact);

        $quote = $this->createQuote($admin, ['contact_id' => $contact->id, 'proposal_id' => null]);
        $hearing->update(['quote_id' => $quote->id]);

        $this->assertTrue($hearing->fresh()->quote->is($quote));
        $this->assertNull($quote->fresh()->proposal);
    }

    public function test_complex_case_routes_through_a_proposal(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin']);
        $contact = $this->createContact();
        $hearing = $this->createHearing($admin, $contact);

        $proposal = app(ProposalService::class)->createProposal([
            'hearing_id' => $hearing->id,
            'contact_id' => $contact->id,
            'title' => '複雑案件の提案書',
        ], $admin->id);

        $quote = $this->createQuote($admin, ['contact_id' => $contact->id, 'proposal_id' => $proposal->id]);

        $this->assertTrue($quote->proposal->is($proposal));
        $this->assertTrue($proposal->hearing->is($hearing));
    }

    public function test_quote_can_be_recreated_against_a_revised_proposal(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin']);
        $contact = $this->createContact();
        $hearing = $this->createHearing($admin, $contact);
        $proposalService = app(ProposalService::class);

        $firstProposal = $proposalService->createProposal([
            'hearing_id' => $hearing->id,
            'title' => '初版提案書',
        ], $admin->id);
        $this->createQuote($admin, ['proposal_id' => $firstProposal->id]);

        // 提案書を作り直し、新しい見積を紐付け直すケース
        $revisedProposal = $proposalService->createProposal([
            'hearing_id' => $hearing->id,
            'title' => '改訂版提案書',
        ], $admin->id);
        $secondQuote = $this->createQuote($admin, ['proposal_id' => $revisedProposal->id]);

        $this->assertCount(2, $hearing->fresh()->proposals);
        $this->assertTrue($secondQuote->proposal->is($revisedProposal));
    }
}
```

- [ ] **Step 2: テストを実行する**

Run: `php artisan test --filter=HearingProposalQuoteFlowTest`
Expected: PASS(Task 1〜3が正しく実装されていれば、追加実装なしでこの統合テストは通る。もし失敗する場合はTask 1〜3のどこかのリレーション定義に誤りがあるため、該当タスクに戻って修正する)

- [ ] **Step 3: コミット**

```bash
git add tests/Feature/Proposal/HearingProposalQuoteFlowTest.php
git commit -m "test: ヒアリング→提案書(任意)→見積の複数経路を検証するE2Eテストを追加"
```

---

### Task 5: 概算見積もり(EstimateSimulator)発のQuoteとヒアリング・提案書の接続を検証する

**Files:**
- Test: `tests/Feature/Proposal/EstimateSimulatorToProposalFlowTest.php`

**Interfaces:**
- Consumes: Task 1〜4の全成果物

**背景**: `EstimateSimulatorController::save()`(既存実装、変更不要)は、公開画面での概算見積もり送信時に`Contact`(`source='estimate_simulator'`)と、`status='draft'`の`Quote`＋`QuoteVersion`(v1、自動計算した金額・明細つき)をその場で作成する。今回確定した全体フロー(お問い合わせ→**概算見積もり**→ヒアリング+提案書→**正式見積**→契約)における「概算」はこのQuote v1そのものであり、「正式見積」は同じQuoteに対する新しいQuoteVersion(v2)として表現する。本タスクは、この既存のQuote作成結果に対してHearing・Proposalを後から紐付け、正式版のQuoteVersionを追加する一連の流れが、Task1〜4で作った仕組みだけで成立することを検証する(新規実装は無し、確認のみ)。

- [ ] **Step 1: 統合テストを書く**

```php
<?php

namespace Tests\Feature\Proposal;

use App\Models\Admin;
use App\Models\Contact;
use App\Models\ContactCategory;
use App\Models\Hearing;
use App\Models\Quote;
use App\Services\ProposalService;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EstimateSimulatorToProposalFlowTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
    }

    /**
     * EstimateSimulatorController::save()が実際に作るのと同じ形(Contact + Quote(draft) + QuoteVersion v1)を
     * ここでは直接組み立てる。EstimateSimulatorController自体のテストはスコープ外(既存実装で変更なし)。
     */
    private function createEstimateSimulatorQuote(Admin $admin): Quote
    {
        $category = ContactCategory::create([
            'name' => '見積もり依頼',
            'slug' => 'quote-request-' . uniqid(),
            'sort_order' => 1,
            'is_active' => true,
        ]);

        $contact = Contact::create([
            'contact_category_id' => $category->id,
            'name' => '概算見積もりテスト太郎',
            'email' => 'estimate-flow-' . uniqid() . '@example.com',
            'message' => '見積もりシミュレーターから送信されました。',
            'status' => 'new',
            'source' => 'estimate_simulator',
        ]);

        $quote = Quote::create([
            'quote_number' => 'Q-ESTIMATE-' . uniqid(),
            'contact_id' => $contact->id,
            'title' => 'コーポレートサイト制作(概算)',
            'status' => 'draft',
            'created_by' => $admin->id,
        ]);

        $version = $quote->versions()->create([
            'version' => 1,
            'title' => $quote->title,
            'base_amount' => 500000,
            'discount_amount' => 0,
            'tax_rate' => 10,
            'tax_amount' => 50000,
            'total_amount' => 550000,
            'status' => 'draft',
            'is_current' => true,
            'created_by' => $admin->id,
        ]);
        $quote->update(['current_version_id' => $version->id]);

        return $quote->fresh();
    }

    public function test_hearing_can_be_linked_back_to_the_estimate_simulator_quote(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin']);
        $quote = $this->createEstimateSimulatorQuote($admin);

        $hearing = Hearing::create([
            'contact_id' => $quote->contact_id,
            'quote_id' => $quote->id,
            'title' => '概算見積もり後のヒアリング',
            'created_by' => $admin->id,
        ]);

        $this->assertTrue($hearing->quote->is($quote));
        $this->assertTrue($quote->fresh()->contact->hearings->contains($hearing));
    }

    public function test_formal_quote_version_is_created_on_the_same_quote_after_proposal(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin']);
        $quote = $this->createEstimateSimulatorQuote($admin);

        $hearing = Hearing::create([
            'contact_id' => $quote->contact_id,
            'quote_id' => $quote->id,
            'title' => '概算見積もり後のヒアリング',
            'created_by' => $admin->id,
        ]);

        $proposal = app(ProposalService::class)->createProposal([
            'hearing_id' => $hearing->id,
            'contact_id' => $quote->contact_id,
            'title' => 'コーポレートサイト制作 提案書',
            'content' => '## 現状分析\n\n...',
        ], $admin->id);

        // 概算(v1)は据え置いたまま、Proposalの内容を反映した正式版(v2)を同じQuoteに追加する。
        // custom_specificationsはjsonキャストのため、Proposal本文をそのまま配列で包んで保存する
        // (転記時のデータ形状そのものは実装時に確定させる未決定事項)。
        $quote->update(['proposal_id' => $proposal->id]);
        $formalVersion = $quote->versions()->create([
            'version' => 2,
            'title' => $quote->title,
            'requirements' => 'ヒアリング・提案書の内容を反映した正式要件',
            'custom_specifications' => ['proposal_content' => $proposal->content],
            'base_amount' => 480000,
            'discount_amount' => 0,
            'tax_rate' => 10,
            'tax_amount' => 48000,
            'total_amount' => 528000,
            'status' => 'draft',
            'is_current' => true,
            'revision_reason' => 'ヒアリング・提案書を踏まえた正式見積への改訂',
            'created_by' => $admin->id,
        ]);
        $quote->update(['current_version_id' => $formalVersion->id]);

        $this->assertCount(2, $quote->versions);
        $this->assertTrue($quote->fresh()->proposal->is($proposal));
        $this->assertSame(2, $quote->fresh()->currentVersion->version);
        $this->assertSame(
            $proposal->content,
            $quote->fresh()->currentVersion->custom_specifications['proposal_content']
        );
    }
}
```

- [ ] **Step 2: テストを実行し成功を確認する**

Run: `php artisan test --filter=EstimateSimulatorToProposalFlowTest`
Expected: PASS(`Contact::hearings()`・`Quote::versions()`・Task1〜4で作ったリレーションだけで成立するため、追加実装は不要)

- [ ] **Step 3: コミット**

```bash
git add tests/Feature/Proposal/EstimateSimulatorToProposalFlowTest.php
git commit -m "test: 概算見積もり(EstimateSimulator)発のQuoteとヒアリング・提案書の接続を検証"
```

---

### Task 6: ヒアリングを`/consultation`発のゲスト予約(Appointment)に紐付ける

**Files:**
- Create: `database/migrations/2026_09_19_020002_add_appointment_id_to_hearings_table.php`
- Modify: `app/Models/Hearing.php`
- Test: `tests/Feature/Proposal/HearingAppointmentLinkTest.php`

**Interfaces:**
- Produces: `hearings.appointment_id`(nullable)、`Hearing::appointment(): BelongsTo`

**背景**: 契約前のクライアントはユーザー登録していない。`appointments.user_id`はnullableで、`guest_name`/`guest_email`/`guest_phone`という「アカウントなしの一般クライアント用」の項目がすでに用意されており、`/consultation`(ログイン不要の公開ページ、`Public\AppointmentController`)経由でゲストのまま予約できる導線が実装済み。ヒアリングの日程調整はこの既存の予約機構を主経路とする(ユーザー確認済み、2026-09-19)。新規の予約モデルは作らず、`hearings`から既存の`appointments`を参照するだけで済ませる。

- [ ] **Step 1: 失敗するテストを書く**

```php
<?php

namespace Tests\Feature\Proposal;

use App\Models\Admin;
use App\Models\Appointment;
use App\Models\AppointmentSlot;
use App\Models\Contact;
use App\Models\ContactCategory;
use App\Models\Hearing;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HearingAppointmentLinkTest extends TestCase
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
            'name' => '見積もり依頼',
            'slug' => 'quote-request-' . uniqid(),
            'sort_order' => 1,
            'is_active' => true,
        ]);

        return Contact::create([
            'contact_category_id' => $category->id,
            'name' => 'ゲストテスト太郎',
            'email' => 'guest-appointment-' . uniqid() . '@example.com',
            'message' => 'テストメッセージ',
            'status' => 'new',
            'source' => 'web',
        ]);
    }

    /**
     * /consultation(Public\AppointmentController::store)が実際に作るのと同じ形
     * (AppointmentSlot + Appointment、user_id=null・guest_name/guest_emailあり)を
     * ここでは直接組み立てる。Public\AppointmentController自体のテストはスコープ外。
     */
    private function createGuestAppointment(): Appointment
    {
        $slot = AppointmentSlot::create([
            'date' => now()->addDays(3)->format('Y-m-d'),
            'start_time' => '14:00:00',
            'end_time' => '14:30:00',
            'slot_type' => 'consultation',
        ]);

        return Appointment::create([
            'appointment_slot_id' => $slot->id,
            'user_id' => null,
            'guest_name' => 'ゲストテスト太郎',
            'guest_email' => 'guest-appointment-test@example.com',
            'subject' => '無料相談(ヒアリング日程)',
            'location_type' => 'online',
            'status' => 'pending',
        ]);
    }

    public function test_hearing_can_be_linked_to_a_guest_appointment_without_a_user_account(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin']);
        $contact = $this->createContact();
        $appointment = $this->createGuestAppointment();

        $hearing = Hearing::create([
            'contact_id' => $contact->id,
            'appointment_id' => $appointment->id,
            'title' => '無料相談予約に紐づくヒアリング',
            'created_by' => $admin->id,
        ]);

        $this->assertTrue($hearing->appointment->is($appointment));
        $this->assertNull($hearing->appointment->user_id);
        $this->assertSame('ゲストテスト太郎', $hearing->appointment->guest_name);
    }

    public function test_hearing_can_still_be_created_without_an_appointment(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin']);
        $contact = $this->createContact();

        $hearing = Hearing::create([
            'contact_id' => $contact->id,
            'appointment_id' => null,
            'title' => '電話で日程調整したヒアリング',
            'created_by' => $admin->id,
        ]);

        $this->assertNull($hearing->appointment);
    }
}
```

- [ ] **Step 2: テストを実行し失敗を確認する**

Run: `php artisan test --filter=HearingAppointmentLinkTest`
Expected: FAIL(`hearings.appointment_id`カラムが存在しない)

- [ ] **Step 3: マイグレーションを作成する**

`appointments.id`は(Quote/Contact/Hearingとは異なり)ULIDではなく通常のauto-increment整数(`$table->id()`、`app/Models/Appointment.php`に`HasUlid`トレイトが無いことを確認済み)のため、`foreignId`を使う。

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * ヒアリングと、既存のゲスト予約導線(/consultation、Public\AppointmentController)で
     * 作られたAppointmentを紐付けるためのカラムを追加する。
     * 契約前のクライアントはユーザー登録していないため、appointments.user_idではなく
     * この直接参照でヒアリングの日程を追跡する。
     */
    public function up(): void
    {
        Schema::table('hearings', function (Blueprint $table) {
            $table->foreignId('appointment_id')->nullable()->after('quote_id')
                ->constrained('appointments')->nullOnDelete()
                ->comment('/consultation等で予約されたヒアリング日程(任意。電話等の手動調整の場合はnull)');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('hearings', function (Blueprint $table) {
            $table->dropConstrainedForeignId('appointment_id');
        });
    }
};
```

- [ ] **Step 4: マイグレーションを実行する**

Run: `php artisan migrate`
Expected: 正常に適用される。既存の`hearings`レコードは`appointment_id`が`null`のまま(nullable追加のため既存行への影響なし)

- [ ] **Step 5: `Hearing`モデルに`appointment()`リレーションを追加する**

`app/Models/Hearing.php`の`quote()`リレーションの直後に追記し、`$fillable`に`appointment_id`を追加する:

```php
protected $fillable = [
    'contact_id',
    'quote_id',
    'appointment_id',
    'title',
    'notes',
    'created_by',
];
```

```php
public function appointment(): BelongsTo
{
    return $this->belongsTo(Appointment::class);
}
```

- [ ] **Step 6: テストを実行し成功を確認する**

Run: `php artisan test --filter=HearingAppointmentLinkTest`
Expected: PASS

- [ ] **Step 7: コミット**

```bash
git add database/migrations/2026_09_19_020002_add_appointment_id_to_hearings_table.php app/Models/Hearing.php tests/Feature/Proposal/HearingAppointmentLinkTest.php
git commit -m "feat: ヒアリングを/consultation発のゲスト予約(Appointment)に紐付けられるようにする"
```

---

## Self-Review

- **Spec対応**: 設計メモ§2.2(提案書はオプショナル)→Task4の`test_simple_case_skips_proposal_from_hearing_to_quote`で明示的に検証。§2.2b(2026-09-19追記、概算→正式の全体フロー)→Task5で、EstimateSimulator発のQuoteにヒアリング・提案書を後付けし、同じQuoteの新バージョンとして正式見積を作る一連の流れを検証。§2.3(スキーマ)→Task1(`proposals`・`quotes.proposal_id`)、Task6(`hearings.appointment_id`)。§2.4の未決定事項のうち「バージョニング」は今回`ProposalVersion`を作らず「新しいProposalレコードを作り直す」形で妥協的に解決(Task4の`test_quote_can_be_recreated_against_a_revised_proposal`で経路として動くことのみ確認、厳密な版管理はスコープ外)。「AI生成のトリガー」「出力形式」は本計画では未着手(Architecture節に明記の通りスコープ外)。「ヒアリング→Quote転記機能」(TASKS.md §3.7の既存タスク)は、Task5で`custom_specifications`への転記経路として実質的に統合を確認した。「ユーザー登録していない契約前クライアントの日程調整」(2026-09-19追記の論点)は、Task6で`/consultation`の既存ゲスト予約機構への直接参照として解決した。
- **プレースホルダー確認**: Task6含め全ステップに実コードあり。TODO/TBDなし。
- **型の一貫性**: `Hearing::appointment(): BelongsTo`はTask6で新規定義。`Appointment`/`AppointmentSlot`のフィールド名(`appointment_slot_id`/`guest_name`/`guest_email`/`subject`/`location_type`等)は実際のマイグレーション定義から転記しており、他タスクとの命名齟齬なし。
- **プレースホルダー確認**: 全ステップに実コードあり。TODO/TBDなし。
- **型の一貫性**: `ProposalService::createProposal(array $data, string $creatorId): Proposal`はTask2で定義し、Task3のコントローラ・Task4のテストで同じシグネチャで呼んでいる。`Proposal::STATUSES`はTask1で定義しTask3の`ProposalRequest`で参照、値の食い違いなし。
