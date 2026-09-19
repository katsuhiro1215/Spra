# 過去の請求書・領収書アーカイブ(legacy_documents) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 過去(現行システム導入以前)に発行した請求書・領収書を、既存のInvoice/Payment/Receiptパイプラインに一切触れずに記録として登録・保管できる`legacy_documents`テーブルとAPIを追加する。

**Architecture:** 新規`legacy_documents`テーブルを単独で追加する。`invoices`/`receipts`/`payments`テーブルへの外部キーは持たず、クライアント名は自由記述(既存`User`/`Company`への紐付けは無し)、金額は合計のみを保持する。ファイルアップロードは既存の`ProjectFileService::upload()`と同じ`private`ディスク・`$file->store()`パターンを踏襲する。

**Tech Stack:** Laravel 12 / Inertia.js / MySQL / PHPUnit(クラスベース)

**Spec:** `docs/superpowers/specs/2026-09-18-ai-staff-and-proposal-flow-design.md` の「3. 過去の請求書・領収書のアーカイブ」

## Global Constraints

- Spraは本番稼働中(実データあり)。今回追加するテーブルは既存の`invoices`/`receipts`/`payments`テーブルに外部キーを一切張らないため、既存データへの影響はゼロ(新規テーブル追加のみ)。
- ガード名は必ず`admins`を明示する。
- 新規実装は`BaseRepository`/`BaseService`を継承する。
- ファイルアップロードは`private`ディスクを使う(`ProjectFileService`と同じ規約)。MIMEタイプ制限を必ず設ける(SPEC.md §6.1、K6の教訓)。
- 作業は`feat/`ブランチを切って行う。mainへ直接コミットしない。
- 本計画はバックエンドのみを対象とする。Inertia/Reactの画面実装は別タスクとする。

---

### Task 1: `legacy_documents`テーブルと`LegacyDocument`モデル

**Files:**
- Create: `database/migrations/2026_09_19_030001_create_legacy_documents_table.php`
- Create: `app/Models/LegacyDocument.php`
- Create: `database/factories/LegacyDocumentFactory.php`
- Test: `tests/Feature/LegacyDocument/LegacyDocumentModelTest.php`

**Interfaces:**
- Produces: `LegacyDocument`モデル(ULID主体、`document_type`/`client_name`/`issued_at`/`total_amount`/`disk`/`pdf_path`/`notes`/`created_by`、`creator()`リレーション)、`LegacyDocument::DOCUMENT_TYPES`定数

- [ ] **Step 1: 失敗するテストを書く**

```php
<?php

namespace Tests\Feature\LegacyDocument;

use App\Models\Admin;
use App\Models\LegacyDocument;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LegacyDocumentModelTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Admin保存時のbooted()フックがsyncRoles()を呼ぶため、Roleレコードを先に用意する。
        $this->seed(RolePermissionSeeder::class);
    }

    public function test_legacy_document_can_be_created_with_creator(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin']);

        $document = LegacyDocument::create([
            'document_type' => 'receipt',
            'client_name' => '株式会社サンプル',
            'issued_at' => '2024-03-15',
            'total_amount' => 330000,
            'notes' => '旧システム移行前の領収書',
            'created_by' => $admin->id,
        ]);

        $this->assertTrue($document->creator->is($admin));
        $this->assertSame('receipt', $document->document_type);
        $this->assertEquals(330000, $document->total_amount);
    }

    public function test_document_type_constant_lists_invoice_and_receipt(): void
    {
        $this->assertSame(['invoice', 'receipt'], LegacyDocument::DOCUMENT_TYPES);
    }
}
```

- [ ] **Step 2: テストを実行し失敗を確認する**

Run: `php artisan test --filter=LegacyDocumentModelTest`
Expected: FAIL(`legacy_documents`テーブル・`LegacyDocument`モデルが存在しない)

- [ ] **Step 3: マイグレーションを作成する**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * 過去(現行システム導入以前)の請求書・領収書を記録として保管するテーブル。
     * 既存の invoices/receipts/payments とは意図的に外部キーを持たず、
     * 既存の請求パイプライン(金額整合性チェック)には一切影響しない。
     */
    public function up(): void
    {
        Schema::create('legacy_documents', function (Blueprint $table) {
            $table->ulid('id')->primary();

            $table->enum('document_type', ['invoice', 'receipt'])->comment('過去の書類種別');
            $table->string('client_name')->comment('クライアント名(自由記述。既存User/Companyとは紐付けない)');
            $table->date('issued_at')->comment('発行日');
            $table->decimal('total_amount', 12, 2)->comment('合計金額(明細分割はしない)');

            $table->string('disk')->default('private');
            $table->string('pdf_path')->nullable()->comment('スキャンPDFの保存パス(任意)');

            $table->text('notes')->nullable();

            $table->uuid('created_by')->nullable();
            $table->foreign('created_by')->references('id')->on('admins')->onDelete('set null');

            $table->timestamps();
            $table->softDeletes();

            $table->index(['document_type', 'issued_at']);
            $table->index('client_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('legacy_documents');
    }
};
```

- [ ] **Step 4: マイグレーションを実行する**

Run: `php artisan migrate`
Expected: 正常に適用される。既存の`invoices`/`receipts`/`payments`テーブルには一切変更が無い(外部キーを張っていないため)

- [ ] **Step 5: `LegacyDocument`モデルを作成する**

```php
<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class LegacyDocument extends Model
{
    use HasUlid, HasFactory, SoftDeletes;

    public const DOCUMENT_TYPES = ['invoice', 'receipt'];

    protected $fillable = [
        'document_type',
        'client_name',
        'issued_at',
        'total_amount',
        'disk',
        'pdf_path',
        'notes',
        'created_by',
    ];

    protected $casts = [
        'issued_at' => 'date:Y-m-d',
        'total_amount' => 'decimal:2',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'created_by');
    }
}
```

- [ ] **Step 6: Factoryを作成する**

```php
<?php

namespace Database\Factories;

use App\Models\LegacyDocument;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<LegacyDocument>
 */
class LegacyDocumentFactory extends Factory
{
    protected $model = LegacyDocument::class;

    public function definition(): array
    {
        return [
            'document_type' => fake()->randomElement(LegacyDocument::DOCUMENT_TYPES),
            'client_name' => fake()->company(),
            'issued_at' => fake()->date(),
            'total_amount' => fake()->randomFloat(2, 10000, 1000000),
        ];
    }
}
```

- [ ] **Step 7: テストを実行し成功を確認する**

Run: `php artisan test --filter=LegacyDocumentModelTest`
Expected: PASS

- [ ] **Step 8: コミット**

```bash
git add database/migrations/2026_09_19_030001_create_legacy_documents_table.php app/Models/LegacyDocument.php database/factories/LegacyDocumentFactory.php tests/Feature/LegacyDocument/LegacyDocumentModelTest.php
git commit -m "feat: 過去の請求書・領収書を記録するlegacy_documentsテーブルを追加"
```

---

### Task 2: `LegacyDocumentRepository`/`LegacyDocumentService`(アップロード処理)

**Files:**
- Create: `app/Repositories/Contracts/LegacyDocumentRepositoryInterface.php`
- Create: `app/Repositories/LegacyDocumentRepository.php`
- Create: `app/Services/LegacyDocumentService.php`
- Modify: `app/Providers/AppServiceProvider.php`
- Test: `tests/Feature/LegacyDocument/LegacyDocumentServiceTest.php`

**Interfaces:**
- Consumes: Task 1の`LegacyDocument`モデル
- Produces: `LegacyDocumentService::register(array $data, ?\Illuminate\Http\UploadedFile $file, ?string $creatorId): LegacyDocument`

- [ ] **Step 1: 失敗するテストを書く**

```php
<?php

namespace Tests\Feature\LegacyDocument;

use App\Models\Admin;
use App\Services\LegacyDocumentService;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class LegacyDocumentServiceTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
    }

    public function test_register_stores_uploaded_pdf_and_creates_record(): void
    {
        Storage::fake('private');
        $admin = Admin::factory()->create(['role' => 'admin']);

        $document = app(LegacyDocumentService::class)->register([
            'document_type' => 'invoice',
            'client_name' => '有限会社テスト',
            'issued_at' => '2023-11-01',
            'total_amount' => 550000,
        ], UploadedFile::fake()->create('old-invoice.pdf', 100, 'application/pdf'), $admin->id);

        $this->assertSame($admin->id, $document->created_by);
        $this->assertNotNull($document->pdf_path);
        Storage::disk('private')->assertExists($document->pdf_path);
    }

    public function test_register_without_a_file_leaves_pdf_path_null(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin']);

        $document = app(LegacyDocumentService::class)->register([
            'document_type' => 'receipt',
            'client_name' => '個人事業主サンプル',
            'issued_at' => '2022-06-10',
            'total_amount' => 88000,
        ], null, $admin->id);

        $this->assertNull($document->pdf_path);
    }
}
```

- [ ] **Step 2: テストを実行し失敗を確認する**

Run: `php artisan test --filter=LegacyDocumentServiceTest`
Expected: FAIL(`App\Services\LegacyDocumentService`が存在しない)

- [ ] **Step 3: `LegacyDocumentRepositoryInterface`を作成する**

```php
<?php

namespace App\Repositories\Contracts;

interface LegacyDocumentRepositoryInterface extends BaseRepositoryInterface
{
}
```

- [ ] **Step 4: `LegacyDocumentRepository`を作成する**

```php
<?php

namespace App\Repositories;

use App\Models\LegacyDocument;
use App\Repositories\Contracts\LegacyDocumentRepositoryInterface;

class LegacyDocumentRepository extends BaseRepository implements LegacyDocumentRepositoryInterface
{
    protected function getModelClass(): string
    {
        return LegacyDocument::class;
    }

    protected function getSearchableFields(): array
    {
        return ['client_name', 'notes'];
    }

    protected function getSortableFields(): array
    {
        return ['issued_at', 'total_amount', 'created_at'];
    }
}
```

- [ ] **Step 5: `LegacyDocumentService`を作成する**

```php
<?php

namespace App\Services;

use App\Models\LegacyDocument;
use App\Repositories\Contracts\LegacyDocumentRepositoryInterface;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class LegacyDocumentService extends BaseService
{
    public function __construct(LegacyDocumentRepositoryInterface $repository)
    {
        parent::__construct($repository);
    }

    protected function getEntityName(): string
    {
        return 'LegacyDocument';
    }

    public function register(array $data, ?UploadedFile $file, ?string $creatorId): LegacyDocument
    {
        return DB::transaction(function () use ($data, $file, $creatorId) {
            $disk = 'private';
            $path = $file ? $file->store('legacy-documents', $disk) : null;

            return $this->repository->create([
                'document_type' => $data['document_type'],
                'client_name' => $data['client_name'],
                'issued_at' => $data['issued_at'],
                'total_amount' => $data['total_amount'],
                'disk' => $disk,
                'pdf_path' => $path,
                'notes' => $data['notes'] ?? null,
                'created_by' => $creatorId,
            ]);
        });
    }

    /**
     * @param LegacyDocument $model
     */
    public function delete(mixed $model): bool
    {
        return DB::transaction(function () use ($model) {
            if ($model->pdf_path) {
                Storage::disk($model->disk)->delete($model->pdf_path);
            }

            return $this->repository->delete($model);
        });
    }
}
```

- [ ] **Step 6: `AppServiceProvider`にリポジトリバインディングを追加する**

`app/Providers/AppServiceProvider.php`の`TaskRepositoryInterface`バインディングの直後に追記:

```php
$this->app->bind(\App\Repositories\Contracts\LegacyDocumentRepositoryInterface::class, \App\Repositories\LegacyDocumentRepository::class);
```

- [ ] **Step 7: テストを実行し成功を確認する**

Run: `php artisan test --filter=LegacyDocumentServiceTest`
Expected: PASS

- [ ] **Step 8: コミット**

```bash
git add app/Repositories/Contracts/LegacyDocumentRepositoryInterface.php app/Repositories/LegacyDocumentRepository.php app/Services/LegacyDocumentService.php app/Providers/AppServiceProvider.php tests/Feature/LegacyDocument/LegacyDocumentServiceTest.php
git commit -m "feat: LegacyDocumentのRepository/Service層を追加(PDFアップロード対応)"
```

---

### Task 3: 登録API(`Admin\LegacyDocumentController`)

**Files:**
- Create: `app/Http/Requests/LegacyDocumentRequest.php`
- Create: `app/Http/Controllers/Admin/LegacyDocumentController.php`
- Create: `routes/admin/legacy-document.php`
- Modify: `routes/admin.php`
- Test: `tests/Feature/Admin/LegacyDocumentControllerTest.php`

**Interfaces:**
- Consumes: Task 2の`LegacyDocumentService`
- Produces: `GET /admin/legacy-document`(ルート名`admin.legacy-document.index`)、`POST /admin/legacy-document`(ルート名`admin.legacy-document.store`)

- [ ] **Step 1: 失敗するテストを書く**

```php
<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use App\Models\LegacyDocument;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class LegacyDocumentControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
    }

    public function test_admin_can_register_a_legacy_receipt_with_pdf(): void
    {
        Storage::fake('private');
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);

        $response = $this->actingAs($admin, 'admins')->post(route('admin.legacy-document.store'), [
            'document_type' => 'receipt',
            'client_name' => '株式会社アーカイブ',
            'issued_at' => '2023-01-20',
            'total_amount' => 220000,
            'file' => UploadedFile::fake()->create('receipt.pdf', 80, 'application/pdf'),
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('legacy_documents', [
            'document_type' => 'receipt',
            'client_name' => '株式会社アーカイブ',
            'created_by' => $admin->id,
        ]);

        $document = LegacyDocument::where('client_name', '株式会社アーカイブ')->firstOrFail();
        Storage::disk('private')->assertExists($document->pdf_path);
    }

    public function test_registration_rejects_disallowed_mime_type(): void
    {
        Storage::fake('private');
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);

        $response = $this->actingAs($admin, 'admins')->post(route('admin.legacy-document.store'), [
            'document_type' => 'invoice',
            'client_name' => 'テスト',
            'issued_at' => '2023-01-20',
            'total_amount' => 100000,
            'file' => UploadedFile::fake()->create('malicious.exe', 10, 'application/x-msdownload'),
        ]);

        $response->assertSessionHasErrors('file');
    }

    public function test_registration_without_file_still_succeeds(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);

        $response = $this->actingAs($admin, 'admins')->post(route('admin.legacy-document.store'), [
            'document_type' => 'invoice',
            'client_name' => 'ファイル無しクライアント',
            'issued_at' => '2021-05-05',
            'total_amount' => 50000,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('legacy_documents', [
            'client_name' => 'ファイル無しクライアント',
            'pdf_path' => null,
        ]);
    }

    public function test_guest_cannot_register_a_legacy_document(): void
    {
        $response = $this->post(route('admin.legacy-document.store'), ['client_name' => 'テスト']);

        $response->assertRedirect(route('admin.login'));
    }
}
```

- [ ] **Step 2: テストを実行し失敗を確認する**

Run: `php artisan test --filter=LegacyDocumentControllerTest`
Expected: FAIL(ルート`admin.legacy-document.store`が存在しない)

- [ ] **Step 3: `LegacyDocumentRequest`を作成する**

```php
<?php

namespace App\Http\Requests;

use App\Models\LegacyDocument;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class LegacyDocumentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::guard('admins')->check();
    }

    public function rules(): array
    {
        return [
            'document_type' => ['required', Rule::in(LegacyDocument::DOCUMENT_TYPES)],
            'client_name' => ['required', 'string', 'max:255'],
            'issued_at' => ['required', 'date'],
            'total_amount' => ['required', 'numeric', 'min:0'],
            'file' => ['nullable', 'file', 'max:20480', 'mimes:pdf,png,jpg,jpeg'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }

    public function messages(): array
    {
        return [
            'document_type.required' => '書類種別を選択してください。',
            'client_name.required' => 'クライアント名を入力してください。',
            'issued_at.required' => '発行日を入力してください。',
            'total_amount.required' => '合計金額を入力してください。',
        ];
    }
}
```

- [ ] **Step 4: `Admin\LegacyDocumentController`を作成する**

```php
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\LegacyDocumentRequest;
use App\Services\LegacyDocumentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class LegacyDocumentController extends Controller
{
    public function __construct(
        private LegacyDocumentService $service,
    ) {}

    public function index(Request $request): Response
    {
        $documents = $this->service->getPaginated([
            'document_type' => $request->input('document_type'),
        ], perPage: 20);

        return Inertia::render('Admin/LegacyDocuments/Index', [
            'documents' => $documents,
        ]);
    }

    public function store(LegacyDocumentRequest $request): RedirectResponse
    {
        $data = $request->validated();

        $this->service->register(
            $data,
            $request->file('file'),
            Auth::guard('admins')->id()
        );

        return redirect()->route('admin.legacy-document.index')
            ->with('success', __('messages.created', ['attribute' => '過去書類']));
    }
}
```

- [ ] **Step 5: ルートファイルを作成する**

`routes/admin/legacy-document.php`:

```php
<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Admin\LegacyDocumentController;

// 認証・権限ミドルウェアは admin.php 側の親グループで適用済みのためここでは付与しない

Route::resource('legacy-document', LegacyDocumentController::class)->only(['index', 'store']);
```

- [ ] **Step 6: `routes/admin.php`にルートファイルを登録する**

`require __DIR__ . '/admin/receipt.php';`の直後に追記:

```php
    /**************************************
     * 過去の請求書・領収書アーカイブ
     **************************************/
    require __DIR__ . '/admin/legacy-document.php';
```

- [ ] **Step 7: テストを実行し成功を確認する**

Run: `php artisan test --filter=LegacyDocumentControllerTest`
Expected: PASS

- [ ] **Step 8: コミット**

```bash
git add app/Http/Requests/LegacyDocumentRequest.php app/Http/Controllers/Admin/LegacyDocumentController.php routes/admin/legacy-document.php routes/admin.php tests/Feature/Admin/LegacyDocumentControllerTest.php
git commit -m "feat: 過去書類の登録・一覧APIを追加(Admin\\LegacyDocumentController)"
```

---

### Task 4: 既存の請求パイプラインからの分離を検証する

**Files:**
- Test: `tests/Feature/LegacyDocument/LegacyDocumentIsolationTest.php`

**Interfaces:**
- Consumes: Task 1〜3の全成果物、既存の`Invoice`/`Receipt`/`Payment`モデル

- [ ] **Step 1: 分離を検証するテストを書く**

```php
<?php

namespace Tests\Feature\LegacyDocument;

use App\Models\Admin;
use App\Models\Invoice;
use App\Models\Payment;
use App\Models\Receipt;
use App\Services\LegacyDocumentService;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LegacyDocumentIsolationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
    }

    public function test_registering_legacy_documents_does_not_touch_invoice_receipt_payment_tables(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin']);
        $service = app(LegacyDocumentService::class);

        $service->register([
            'document_type' => 'invoice',
            'client_name' => 'クライアントA',
            'issued_at' => '2020-04-01',
            'total_amount' => 100000,
        ], null, $admin->id);

        $service->register([
            'document_type' => 'receipt',
            'client_name' => 'クライアントB',
            'issued_at' => '2020-05-01',
            'total_amount' => 50000,
        ], null, $admin->id);

        $this->assertSame(0, Invoice::count());
        $this->assertSame(0, Receipt::count());
        $this->assertSame(0, Payment::count());
    }
}
```

- [ ] **Step 2: テストを実行し成功を確認する**

Run: `php artisan test --filter=LegacyDocumentIsolationTest`
Expected: PASS(`legacy_documents`が`invoices`/`receipts`/`payments`に外部キーを持たない設計のため、Task1〜3が正しく実装されていれば追加実装なしで通る)

- [ ] **Step 3: コミット**

```bash
git add tests/Feature/LegacyDocument/LegacyDocumentIsolationTest.php
git commit -m "test: 過去書類アーカイブが既存の請求パイプラインに影響しないことを検証するテストを追加"
```

---

## Self-Review

- **Spec対応**: 設計メモ§3.2(既存パイプラインと分離した新規テーブル、想定カラム)→Task1のマイグレーション・モデルで全カラムを反映。ファイルアップロードは想定通り`private`ディスク・PDF任意(必須にはしていない)。Task4で「既存の整合性ロジックには一切触れない」という要件を明示的にテストで検証した。§3.3の未決定事項(一覧統合可否・User/Company任意紐付け)は今回未着手のままスコープ外として明記。
- **プレースホルダー確認**: 全ステップに実コードあり。TODO/TBDなし。
- **型の一貫性**: `LegacyDocumentService::register(array $data, ?UploadedFile $file, ?string $creatorId): LegacyDocument`はTask2で定義し、Task3のコントローラで同じ引数順・型で呼んでいる。`LegacyDocument::DOCUMENT_TYPES`はTask1で定義しTask3の`LegacyDocumentRequest`で参照、値の食い違いなし。
