# 書類番号採番方式統一・手動編集機能 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 契約書/見積書/請求書/領収書の採番フォーマットを `{PREFIX}-{YYYYMM}-{4桁連番}` に統一し、下書き/未送付状態に限り番号をAdmin編集画面から手動修正できるようにする。

**Architecture:** 新規サービス`ReferenceNumberService`に採番ロジックを一本化し、既存4箇所の`generate*Number()`メソッドをこのサービスを呼ぶ薄いラッパーに置き換える。番号の手動編集は、各エンティティの既存の更新経路（Controller内`Request::validate()`またはFormRequest）にバリデーションルールを追加する形で対応する。新規テーブルは作らない。

**Tech Stack:** Laravel 12（既存の`DB::transaction`/`lockForUpdate`/`withTrashed`パターンを使用）、Inertia.js + React（既存の`FormGroup`/`TextInput`パターンを使用）

**Spec:** `docs/superpowers/specs/2026-08-21-reference-number-unification-design.md`

## Global Constraints

- フォーマット: `{PREFIX}-{YYYYMM}-{4桁連番}`（例: `CTR-202608-0002`）。プレフィックスは `CTR`（契約）/`QTE`（見積）/`INV`（請求）/`RCP`（領収）
- 過去に発行済みの番号（旧フォーマット）は遡って変換しない
- 番号編集は「値が変更された場合のみ」新フォーマットの正規表現 `/^[A-Z]{3}-\d{6}-\d{4}$/` を適用する（変更していない旧フォーマットの番号のまま他の項目だけ保存するケースを壊さないため）
- 番号編集はユニーク制約（自分自身は`ignore()`）を常に適用する
- 番号編集は各エンティティが「下書き/未送付」状態の場合のみ許可する。それ以外の状態では、送信された番号フィールドの値を無視する
- 全てのタスクの完了条件は「該当するFeature/Unitテストがパスすること」。各タスクの最後に `docker exec spra-laravel.test-1 php artisan test --filter=<TestClass>` を実行して確認する

---

## Task 1: ReferenceNumberService の新規作成

**Files:**
- Create: `app/Services/ReferenceNumberService.php`
- Test: `tests/Unit/Services/ReferenceNumberServiceTest.php`

**Interfaces:**
- Produces: `ReferenceNumberService::generate(string $modelClass, string $column, string $prefix): string` — 後続タスクで4つの`generate*Number()`メソッドから呼び出される

- [ ] **Step 1: 失敗するテストを書く**

`tests/Unit/Services/ReferenceNumberServiceTest.php` を新規作成する。

```php
<?php

namespace Tests\Unit\Services;

use App\Models\Admin;
use App\Models\Contract;
use App\Models\User;
use App\Services\ReferenceNumberService;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class ReferenceNumberServiceTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    private function makeContract(Admin $admin, User $user, string $contractNumber): Contract
    {
        return Contract::create([
            'contract_number' => $contractNumber,
            'user_id' => $user->id,
            'title' => 'テスト契約',
            'start_date' => now()->toDateString(),
            'created_by' => $admin->id,
        ]);
    }

    public function test_generates_first_number_of_the_month_with_sequence_0001(): void
    {
        $service = app(ReferenceNumberService::class);

        $number = $service->generate(Contract::class, 'contract_number', 'CTR');

        $expectedPrefix = 'CTR-' . now()->format('Ym') . '-0001';
        $this->assertSame($expectedPrefix, $number);
    }

    public function test_increments_sequence_based_on_existing_records_in_the_same_month(): void
    {
        $admin = Admin::factory()->create();
        $user = User::factory()->create();
        $yearMonth = now()->format('Ym');
        $this->makeContract($admin, $user, "CTR-{$yearMonth}-0001");
        $this->makeContract($admin, $user, "CTR-{$yearMonth}-0002");

        $service = app(ReferenceNumberService::class);
        $number = $service->generate(Contract::class, 'contract_number', 'CTR');

        $this->assertSame("CTR-{$yearMonth}-0003", $number);
    }

    public function test_ignores_numbers_from_a_different_month_or_different_prefix(): void
    {
        $admin = Admin::factory()->create();
        $user = User::factory()->create();
        // 前月分・旧フォーマット（無視されるべき）
        $this->makeContract($admin, $user, 'CTR-202607-0099');
        $this->makeContract($admin, $user, 'C2026070099');

        $service = app(ReferenceNumberService::class);
        $number = $service->generate(Contract::class, 'contract_number', 'CTR');

        $expected = 'CTR-' . now()->format('Ym') . '-0001';
        $this->assertSame($expected, $number);
    }

    public function test_considers_soft_deleted_records_to_avoid_duplicate_numbers(): void
    {
        $admin = Admin::factory()->create();
        $user = User::factory()->create();
        $yearMonth = now()->format('Ym');
        $contract = $this->makeContract($admin, $user, "CTR-{$yearMonth}-0001");
        $contract->delete();

        $service = app(ReferenceNumberService::class);
        $number = $service->generate(Contract::class, 'contract_number', 'CTR');

        $this->assertSame("CTR-{$yearMonth}-0002", $number);
    }
}
```

- [ ] **Step 2: テストを実行して失敗を確認する**

Run: `docker exec spra-laravel.test-1 php artisan test --filter=ReferenceNumberServiceTest`
Expected: FAIL（`App\Services\ReferenceNumberService`クラスが存在しないためエラー）

- [ ] **Step 3: 最小限の実装を書く**

`app/Services/ReferenceNumberService.php` を新規作成する。

```php
<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;

class ReferenceNumberService
{
    /**
     * {prefix}-{YYYYMM}-{4桁連番} 形式の番号を採番する。
     *
     * 同一プレフィックス・同一年月の範囲内で排他ロックしながら最大値を求め、
     * 論理削除済みの行も含めて重複を避ける（$modelClassはSoftDeletesを
     * 使っているモデルを想定し、withTrashed()を呼ぶ）。
     *
     * @param string $modelClass 対象Eloquentモデルのクラス名（例: Contract::class）
     * @param string $column 番号を保持するカラム名（例: 'contract_number'）
     * @param string $prefix 3文字のプレフィックス（例: 'CTR'）
     */
    public function generate(string $modelClass, string $column, string $prefix): string
    {
        $searchPrefix = $prefix . '-' . now()->format('Ym') . '-';

        return DB::transaction(function () use ($modelClass, $column, $searchPrefix) {
            $lastNumber = $modelClass::withTrashed()
                ->where($column, 'like', "{$searchPrefix}%")
                ->lockForUpdate()
                ->orderByDesc($column)
                ->value($column);

            $sequence = $lastNumber
                ? ((int) substr($lastNumber, strlen($searchPrefix))) + 1
                : 1;

            return sprintf('%s%04d', $searchPrefix, $sequence);
        });
    }
}
```

- [ ] **Step 4: テストを実行して成功を確認する**

Run: `docker exec spra-laravel.test-1 php artisan test --filter=ReferenceNumberServiceTest`
Expected: PASS（4件）

- [ ] **Step 5: コミット**

```bash
git add app/Services/ReferenceNumberService.php tests/Unit/Services/ReferenceNumberServiceTest.php
git commit -m "feat: 書類番号の共通採番サービスReferenceNumberServiceを追加"
```

---

## Task 2: Contract の採番を ReferenceNumberService に置き換え

**Files:**
- Modify: `app/Repositories/ContractRepository.php:120-138`（`generateContractNumber()`）
- Test: `tests/Unit/Repositories/ContractRepositoryGenerateNumberTest.php`

**Interfaces:**
- Consumes: `ReferenceNumberService::generate(string $modelClass, string $column, string $prefix): string`（Task 1で定義）
- Produces: `ContractRepository::generateContractNumber(): string` の戻り値フォーマットが `CTR-{YYYYMM}-{4桁}` に変わる（呼び出し元の`ContractService::createContract()`からのシグネチャは変更なし）

- [ ] **Step 1: 失敗するテストを書く**

`tests/Unit/Repositories/ContractRepositoryGenerateNumberTest.php` を新規作成する。

```php
<?php

namespace Tests\Unit\Repositories;

use App\Repositories\ContractRepository;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContractRepositoryGenerateNumberTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    public function test_generates_a_number_in_the_new_ctr_format(): void
    {
        $number = app(ContractRepository::class)->generateContractNumber();

        $expected = 'CTR-' . now()->format('Ym') . '-0001';
        $this->assertSame($expected, $number);
    }
}
```

- [ ] **Step 2: テストを実行して失敗を確認する**

Run: `docker exec spra-laravel.test-1 php artisan test --filter=ContractRepositoryGenerateNumberTest`
Expected: FAIL（現状は`C{YYYYMM}{4桁}`形式を返すため`CTR-...`と一致しない）

- [ ] **Step 3: 実装を置き換える**

`app/Repositories/ContractRepository.php` の`generateContractNumber()`（120〜138行目）を以下に置き換える。

```php
public function generateContractNumber(): string
{
    return app(\App\Services\ReferenceNumberService::class)
        ->generate(Contract::class, 'contract_number', 'CTR');
}
```

- [ ] **Step 4: テストを実行して成功を確認する**

Run: `docker exec spra-laravel.test-1 php artisan test --filter=ContractRepositoryGenerateNumberTest`
Expected: PASS

- [ ] **Step 5: コミット**

```bash
git add app/Repositories/ContractRepository.php tests/Unit/Repositories/ContractRepositoryGenerateNumberTest.php
git commit -m "fix: Contractの採番をReferenceNumberServiceに統一し排他ロック・論理削除考慮を追加"
```

---

## Task 3: Quote の採番を ReferenceNumberService に置き換え

**Files:**
- Modify: `app/Repositories/QuoteRepository.php:119-137`（`generateQuoteNumber()`）
- Test: `tests/Unit/Repositories/QuoteRepositoryGenerateNumberTest.php`

**Interfaces:**
- Consumes: `ReferenceNumberService::generate()`（Task 1）
- Produces: `QuoteRepository::generateQuoteNumber(): string` の戻り値フォーマットが `QTE-{YYYYMM}-{4桁}` に変わる

- [ ] **Step 1: 失敗するテストを書く**

`tests/Unit/Repositories/QuoteRepositoryGenerateNumberTest.php` を新規作成する。

```php
<?php

namespace Tests\Unit\Repositories;

use App\Repositories\QuoteRepository;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class QuoteRepositoryGenerateNumberTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    public function test_generates_a_number_in_the_new_qte_format(): void
    {
        $number = app(QuoteRepository::class)->generateQuoteNumber();

        $expected = 'QTE-' . now()->format('Ym') . '-0001';
        $this->assertSame($expected, $number);
    }
}
```

- [ ] **Step 2: テストを実行して失敗を確認する**

Run: `docker exec spra-laravel.test-1 php artisan test --filter=QuoteRepositoryGenerateNumberTest`
Expected: FAIL

- [ ] **Step 3: 実装を置き換える**

`app/Repositories/QuoteRepository.php` の`generateQuoteNumber()`（119〜137行目）を以下に置き換える。旧実装が持っていた「見積シミュレーター経由の番号を誤って拾わない」対策コメントは、新フォーマットが固定長の`-`区切りであるため`ReferenceNumberService`側の`like`条件だけで代替できる（新フォーマットに対して`substr`で連番部分を切り出す際、シミュレーター由来の番号はプレフィックス自体が一致しないため`like`条件で除外される）。

```php
public function generateQuoteNumber(): string
{
    return app(\App\Services\ReferenceNumberService::class)
        ->generate(Quote::class, 'quote_number', 'QTE');
}
```

- [ ] **Step 4: テストを実行して成功を確認する**

Run: `docker exec spra-laravel.test-1 php artisan test --filter=QuoteRepositoryGenerateNumberTest`
Expected: PASS

- [ ] **Step 5: コミット**

```bash
git add app/Repositories/QuoteRepository.php tests/Unit/Repositories/QuoteRepositoryGenerateNumberTest.php
git commit -m "fix: Quoteの採番をReferenceNumberServiceに統一"
```

---

## Task 4: Invoice の採番を ReferenceNumberService に置き換え（年単位→年月単位）

**Files:**
- Modify: `app/Services/InvoiceService.php:278-296`（`generateInvoiceNumber()`）
- Test: `tests/Unit/Services/InvoiceServiceGenerateNumberTest.php`

**Interfaces:**
- Consumes: `ReferenceNumberService::generate()`（Task 1）
- Produces: `InvoiceService::generateInvoiceNumber(): string` の戻り値フォーマットが `INV-{YYYYMM}-{4桁}` に変わる（従来は`INV{YYYY}-{4桁}`で年単位リセットだったが、年月単位リセットに変わる）

- [ ] **Step 1: 失敗するテストを書く**

`tests/Unit/Services/InvoiceServiceGenerateNumberTest.php` を新規作成する。

```php
<?php

namespace Tests\Unit\Services;

use App\Services\InvoiceService;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InvoiceServiceGenerateNumberTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    public function test_generates_a_number_in_the_new_inv_format_reset_per_month(): void
    {
        $number = app(InvoiceService::class)->generateInvoiceNumber();

        $expected = 'INV-' . now()->format('Ym') . '-0001';
        $this->assertSame($expected, $number);
    }
}
```

- [ ] **Step 2: テストを実行して失敗を確認する**

Run: `docker exec spra-laravel.test-1 php artisan test --filter=InvoiceServiceGenerateNumberTest`
Expected: FAIL（現状は`INV{YYYY}-{4桁}`形式）

- [ ] **Step 3: 実装を置き換える**

`app/Services/InvoiceService.php` の`generateInvoiceNumber()`（278〜296行目）を以下に置き換える。

```php
public function generateInvoiceNumber(): string
{
    return app(ReferenceNumberService::class)
        ->generate(Invoice::class, 'invoice_number', 'INV');
}
```

ファイル冒頭のuse文に `use App\Services\ReferenceNumberService;` を追加する（同じ`App\Services`名前空間内なので実際には完全修飾名`\App\Services\ReferenceNumberService`のままでも動くが、他の3タスクとの一貫性のため、Invoiceだけ`app()`呼び出しの完全修飾名を使わずuse文を追加する形で統一する）。

- [ ] **Step 4: テストを実行して成功を確認する**

Run: `docker exec spra-laravel.test-1 php artisan test --filter=InvoiceServiceGenerateNumberTest`
Expected: PASS

- [ ] **Step 5: 既存の月次請求書自動生成テストに影響が無いことを確認する**

Run: `docker exec spra-laravel.test-1 php artisan test --filter=MonthlyInvoiceGenerationTest`
Expected: PASS（invoice_numberの具体的なフォーマットをアサートしていないため影響なしのはず。もしフォーマットに依存したアサーションで失敗する場合は、そのテストの期待値を新フォーマットに合わせて修正する）

- [ ] **Step 6: コミット**

```bash
git add app/Services/InvoiceService.php tests/Unit/Services/InvoiceServiceGenerateNumberTest.php
git commit -m "fix: Invoiceの採番をReferenceNumberServiceに統一し年月単位のリセットに変更"
```

---

## Task 5: Receipt の採番を ReferenceNumberService に置き換え（年単位→年月単位）

**重要**: `generateReceiptNumber()`は`app/Services/ReceiptService.php`（133〜150行目、`issueReceipt()`が使う）だけでなく、`app/Http/Controllers/Admin/ReceiptController.php`（305〜322行目、`store()`が使う）にも**全く同じロジックが独立して重複実装されている**（コピペにより2箇所に分岐してしまったデッドコード）。この2つの発行経路（Adminが手動で領収書作成する`store()`と、支払い確認後に自動発行される`issueReceipt()`）が別々の採番ロジックを持ったまま個別にインクリメントするため、本来一本化すべき連番が経路によって食い違うリスクがある。本タスクで両方とも`ReferenceNumberService`呼び出しに統一する。

**Files:**
- Modify: `app/Services/ReceiptService.php:133-150`（`generateReceiptNumber()`）
- Modify: `app/Http/Controllers/Admin/ReceiptController.php:130-169`（`store()`）, `:305-322`（`generateReceiptNumber()`を削除）
- Test: `tests/Unit/Services/ReceiptServiceGenerateNumberTest.php`
- Test: `tests/Feature/Admin/ReceiptStoreGenerateNumberTest.php`

**Interfaces:**
- Consumes: `ReferenceNumberService::generate()`（Task 1）
- Produces: `ReceiptService::generateReceiptNumber(): string` の戻り値フォーマットが `RCP-{YYYYMM}-{4桁}` に変わる。`ReceiptController::store()`経由で作成した領収書も同じ`ReferenceNumberService`を通るようになる

- [ ] **Step 1: 失敗するテストを書く**

`tests/Unit/Services/ReceiptServiceGenerateNumberTest.php` を新規作成する。`generateReceiptNumber()`は`private`なので、`Receipt::create()`を通じて公開APIから間接的に検証する。

```php
<?php

namespace Tests\Unit\Services;

use App\Models\Admin;
use App\Models\Invoice;
use App\Models\User;
use App\Services\ReceiptService;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReceiptServiceGenerateNumberTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    public function test_created_receipt_gets_a_number_in_the_new_rcp_format(): void
    {
        $admin = Admin::factory()->create();
        $user = User::factory()->create();
        $invoice = Invoice::create([
            'invoice_number' => 'INV-' . now()->format('Ym') . '-9999',
            'user_id' => $user->id,
            'issue_date' => now()->toDateString(),
            'due_date' => now()->addDays(30)->toDateString(),
            'status' => 'paid',
            'subtotal' => 100000,
            'tax_rate' => 10,
            'tax_amount' => 10000,
            'total_amount' => 110000,
        ]);

        $this->actingAs($admin, 'admins');
        $receipt = app(ReceiptService::class)->issueReceipt($invoice);

        $expectedPrefix = 'RCP-' . now()->format('Ym') . '-';
        $this->assertStringStartsWith($expectedPrefix, $receipt->receipt_number);
    }
}
```

- [ ] **Step 2: テストを実行して失敗を確認する**

Run: `docker exec spra-laravel.test-1 php artisan test --filter=ReceiptServiceGenerateNumberTest`
Expected: FAIL（現状は`RCP{YYYY}-{4桁}`形式のため`RCP-YYYYMM-`から始まらない）

- [ ] **Step 3: 実装を置き換える**

`app/Services/ReceiptService.php` の`generateReceiptNumber()`（133〜150行目）を以下に置き換える。

```php
private function generateReceiptNumber(): string
{
    return app(ReferenceNumberService::class)
        ->generate(Receipt::class, 'receipt_number', 'RCP');
}
```

ファイル冒頭に `use App\Services\ReferenceNumberService;` を追加する（同一名前空間内の別クラスへの参照だが、他タスクと表記を揃えるため明示的にuse文を追加する）。

- [ ] **Step 4: テストを実行して成功を確認する**

Run: `docker exec spra-laravel.test-1 php artisan test --filter=ReceiptServiceGenerateNumberTest`
Expected: PASS

- [ ] **Step 5: ReceiptController側の重複実装に対する失敗するテストを書く**

`tests/Feature/Admin/ReceiptStoreGenerateNumberTest.php` を新規作成する。

```php
<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use App\Models\Invoice;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReceiptStoreGenerateNumberTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    public function test_manually_created_receipt_gets_a_number_in_the_new_rcp_format(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);
        $user = User::factory()->create();
        $invoice = Invoice::create([
            'invoice_number' => 'INV-' . now()->format('Ym') . '-9998',
            'user_id' => $user->id,
            'issue_date' => now()->toDateString(),
            'due_date' => now()->addDays(30)->toDateString(),
            'status' => 'paid',
            'subtotal' => 100000,
            'tax_rate' => 10,
            'tax_amount' => 10000,
            'total_amount' => 110000,
        ]);

        $this->actingAs($admin, 'admins')->post(route('admin.receipt.store'), [
            'invoice_id' => $invoice->id,
            'user_id' => $user->id,
            'amount' => 100000,
            'tax_amount' => 10000,
            'total_amount' => 110000,
            'status' => 'draft',
        ]);

        $expectedPrefix = 'RCP-' . now()->format('Ym') . '-';
        $this->assertDatabaseHas('receipts', ['invoice_id' => $invoice->id]);
        $receiptNumber = \App\Models\Receipt::where('invoice_id', $invoice->id)->value('receipt_number');
        $this->assertStringStartsWith($expectedPrefix, $receiptNumber);
    }
}
```

- [ ] **Step 6: テストを実行して失敗を確認する**

Run: `docker exec spra-laravel.test-1 php artisan test --filter=ReceiptStoreGenerateNumberTest`
Expected: FAIL（`ReceiptController`の重複した`generateReceiptNumber()`が旧`RCP{YYYY}-{4桁}`形式のまま）

- [ ] **Step 7: ReceiptController の重複実装を置き換える**

`app/Http/Controllers/Admin/ReceiptController.php` の305〜322行目にある`private function generateReceiptNumber(): string`メソッド全体を削除する。130行目の`store()`メソッド内、149行目の

```php
    $receiptNumber = $this->generateReceiptNumber();
```

を以下に置き換える。

```php
    $receiptNumber = app(\App\Services\ReferenceNumberService::class)
        ->generate(Receipt::class, 'receipt_number', 'RCP');
```

- [ ] **Step 8: テストを実行して成功を確認する**

Run: `docker exec spra-laravel.test-1 php artisan test --filter=ReceiptStoreGenerateNumberTest`
Expected: PASS

- [ ] **Step 9: コミット**

```bash
git add app/Services/ReceiptService.php app/Http/Controllers/Admin/ReceiptController.php tests/Unit/Services/ReceiptServiceGenerateNumberTest.php tests/Feature/Admin/ReceiptStoreGenerateNumberTest.php
git commit -m "fix: Receiptの採番をReferenceNumberServiceに統一し年月単位のリセットに変更（Controller側の重複実装も解消）"
```

---

## Task 6: Contract 番号の手動編集（下書き状態のみ）

**Files:**
- Modify: `app/Http/Controllers/Admin/Contract/ContractController.php:252-289`（`update()`）
- Modify: `app/Services/ContractService.php:223-245`（`updateContract()`）
- Modify: `resources/js/Pages/Admin/Contracts/Edit.jsx`
- Test: `tests/Feature/Admin/ContractNumberEditTest.php`

**Interfaces:**
- Consumes: なし（既存の`ContractController::update()`/`ContractService::updateContract()`を拡張する）
- Produces: `PUT admin.contract.update`が`contract_number`パラメータを受け付けるようになる。`status !== 'draft'`の場合は送信された`contract_number`を無視する

- [ ] **Step 1: 失敗するテストを書く**

`tests/Feature/Admin/ContractNumberEditTest.php` を新規作成する。

```php
<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use App\Models\Contract;
use App\Models\ContractVersion;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class ContractNumberEditTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    private function makeDraftContract(Admin $admin, User $user): Contract
    {
        $contract = Contract::create([
            'contract_number' => 'CTR-' . now()->format('Ym') . '-0001',
            'user_id' => $user->id,
            'title' => 'テスト契約',
            'status' => 'draft',
            'start_date' => now()->toDateString(),
            'created_by' => $admin->id,
        ]);

        $version = ContractVersion::create([
            'contract_id' => $contract->id,
            'version' => 1,
            'base_amount' => 0,
            'discount_amount' => 0,
            'tax_rate' => 10,
            'tax_amount' => 0,
            'total_amount' => 0,
            'status' => 'draft',
            'is_current' => true,
            'created_by' => $admin->id,
        ]);
        $contract->update(['current_version_id' => $version->id]);

        return $contract->fresh();
    }

    public function test_admin_can_edit_the_contract_number_while_draft(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);
        $user = User::factory()->create();
        $contract = $this->makeDraftContract($admin, $user);

        $response = $this->actingAs($admin, 'admins')->put(
            route('admin.contract.update', $contract->id),
            [
                'title' => $contract->title,
                'start_date' => $contract->start_date->toDateString(),
                'contract_number' => 'CTR-' . now()->format('Ym') . '-9999',
            ],
        );

        $response->assertSessionDoesntHaveErrors();
        $this->assertSame('CTR-' . now()->format('Ym') . '-9999', $contract->fresh()->contract_number);
    }

    public function test_contract_number_edit_is_ignored_when_not_draft(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);
        $user = User::factory()->create();
        $contract = $this->makeDraftContract($admin, $user);
        $contract->update(['status' => 'active']);
        $originalNumber = $contract->contract_number;

        $this->actingAs($admin, 'admins')->put(
            route('admin.contract.update', $contract->id),
            [
                'title' => $contract->title,
                'start_date' => $contract->start_date->toDateString(),
                'contract_number' => 'CTR-' . now()->format('Ym') . '-9999',
            ],
        );

        $this->assertSame($originalNumber, $contract->fresh()->contract_number);
    }

    public function test_contract_number_must_be_unique(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);
        $user = User::factory()->create();
        $existing = $this->makeDraftContract($admin, $user);
        $target = $this->makeDraftContract($admin, $user);

        $response = $this->actingAs($admin, 'admins')->put(
            route('admin.contract.update', $target->id),
            [
                'title' => $target->title,
                'start_date' => $target->start_date->toDateString(),
                'contract_number' => $existing->contract_number,
            ],
        );

        $response->assertSessionHasErrors('contract_number');
    }

    public function test_malformed_contract_number_does_not_block_the_rest_of_the_update_when_not_draft(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);
        $user = User::factory()->create();
        $contract = $this->makeDraftContract($admin, $user);
        $contract->update(['status' => 'active']);

        // 下書き以外の状態で、フォーマット不正・重複した番号を送っても、
        // 番号フィールドが無視されるだけで更新リクエスト全体は失敗してはならない
        $response = $this->actingAs($admin, 'admins')->put(
            route('admin.contract.update', $contract->id),
            [
                'title' => '更新後のタイトル',
                'start_date' => $contract->start_date->toDateString(),
                'contract_number' => 'invalid-format',
            ],
        );

        $response->assertSessionDoesntHaveErrors();
        $this->assertSame('更新後のタイトル', $contract->fresh()->title);
    }
}
```

- [ ] **Step 2: テストを実行して失敗を確認する**

Run: `docker exec spra-laravel.test-1 php artisan test --filter=ContractNumberEditTest`
Expected: FAIL（`contract_number`が`update()`のバリデーションルールに存在せず送信しても無視される、あるいは`updateContract()`が`contract_number`を反映しないため。4件目の`test_malformed_contract_number_does_not_block_the_rest_of_the_update_when_not_draft`は、修正前は`contract_number`のバリデーションがステータスに関わらず常に走るため`assertSessionDoesntHaveErrors()`で失敗する）

- [ ] **Step 3: バックエンドを実装する**

`app/Http/Controllers/Admin/Contract/ContractController.php` の`update()`メソッド（252〜289行目）内、`$request->validate([...])`の配列に以下を追加する（`title`の直後に挿入）。

```php
        $validated = $request->validate([
            'title'         => 'required|string|max:255',
            // 下書き以外の状態では、送信されたcontract_numberの値が不正・重複していても
            // 更新リクエスト全体を巻き込んで422にしてはならない（仕様上「無視する」の
            // 意図はバリデーション自体を通すこと）。status !== 'draft'のときはルールを
            // 空にしてバリデーションを完全にスキップする（永続化側のガードは
            // ContractService::updateContract()のisset($data['contract_number'])
            // && $contract->status === 'draft'が別途担っている）
            'contract_number' => $contract->status === 'draft'
                ? [
                    'nullable',
                    'string',
                    'max:50',
                    Rule::when(
                        $request->input('contract_number') !== $contract->contract_number,
                        ['regex:/^[A-Z]{3}-\d{6}-\d{4}$/'],
                    ),
                    Rule::unique('contracts', 'contract_number')->ignore($contract->id),
                ]
                : [],
            'description'   => 'nullable|string',
            // ... 既存のルールはそのまま
```

ファイル冒頭のuse文に `use Illuminate\Validation\Rule;` を追加する。

`app/Services/ContractService.php` の`updateContract()`（223〜245行目）内、`$contractUpdate`を組み立てている箇所に以下を追加する（`title`の直後）。

```php
            if (isset($data['title'])) {
                $contractUpdate['title'] = $data['title'];
            }
            if (isset($data['contract_number']) && $contract->status === 'draft') {
                $contractUpdate['contract_number'] = $data['contract_number'];
            }
```

- [ ] **Step 4: テストを実行して成功を確認する**

Run: `docker exec spra-laravel.test-1 php artisan test --filter=ContractNumberEditTest`
Expected: PASS（3件）

- [ ] **Step 5: フロントエンドに編集欄を追加する**

`resources/js/Pages/Admin/Contracts/Edit.jsx` の`useForm`初期値（22〜32行目、`title: contract.title || "",`の直後）に以下を追加する。

```jsx
        contract_number: contract.contract_number || "",
```

`resources/js/Pages/Admin/Contracts/_components/Form.jsx` は`data`/`setData`/`isEdit`を props で受け取る共有フォームで、`contract`オブジェクト自体は受け取らない（作成/編集共用のため）。94行目（「契約タイトル」の`FormGroup`を閉じる`</FormGroup>`）の直後、96行目の`{!isEdit && (`ブロックの直前に、以下を挿入する（`isEdit`のときだけ表示し、`data.status`が`draft`でなければ`disabled`にする）。

```jsx
                                {isEdit && (
                                    <FormGroup
                                        label="契約書番号"
                                        htmlFor="contract_number"
                                        error={errors.contract_number}
                                        help={
                                            data.status !== "draft"
                                                ? "下書き状態でのみ編集できます"
                                                : undefined
                                        }
                                    >
                                        <TextInput
                                            id="contract_number"
                                            name="contract_number"
                                            type="text"
                                            value={data.contract_number || ""}
                                            onChange={(e) =>
                                                setData(
                                                    "contract_number",
                                                    e.target.value,
                                                )
                                            }
                                            disabled={data.status !== "draft"}
                                        />
                                    </FormGroup>
                                )}
```

- [ ] **Step 6: フロントエンドのビルドを確認する**

Run: `npm run build`
Expected: エラー無く成功する

- [ ] **Step 7: コミット**

```bash
git add app/Http/Controllers/Admin/Contract/ContractController.php app/Services/ContractService.php resources/js/Pages/Admin/Contracts/Edit.jsx resources/js/Pages/Admin/Contracts/_components/Form.jsx tests/Feature/Admin/ContractNumberEditTest.php
git commit -m "feat: 契約書番号を下書き状態のみAdmin編集画面から手動修正できるようにする"
```

---

## Task 7: Quote 番号の手動編集（下書き状態のみ）

**Files:**
- Modify: `app/Http/Controllers/Admin/Quote/QuoteController.php:235-282`（`update()`）
- Modify: `app/Services/QuoteService.php`（`updateQuote()`。実装者はメソッド定義箇所を`grep -n "function updateQuote" app/Services/QuoteService.php`で確認すること）
- Modify: `resources/js/Pages/Admin/Quotes/Edit.jsx`
- Test: `tests/Feature/Admin/QuoteNumberEditTest.php`

**Interfaces:**
- Produces: `PUT admin.quote.update`が`quote_number`パラメータを受け付けるようになる。`status !== 'draft'`の場合は無視する

- [ ] **Step 1: 失敗するテストを書く**

`tests/Feature/Admin/QuoteNumberEditTest.php` を新規作成する（Task 6の`ContractNumberEditTest`と同じ構成で、Quote向けに書き換える）。

```php
<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use App\Models\Quote;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class QuoteNumberEditTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    private function makeDraftQuote(Admin $admin, string $quoteNumber): Quote
    {
        return Quote::create([
            'quote_number' => $quoteNumber,
            'title' => 'テスト見積',
            'status' => 'draft',
            'created_by' => $admin->id,
        ]);
    }

    public function test_admin_can_edit_the_quote_number_while_draft(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);
        $quote = $this->makeDraftQuote($admin, 'QTE-' . now()->format('Ym') . '-0001');

        $response = $this->actingAs($admin, 'admins')->put(
            route('admin.quote.update', $quote->id),
            [
                'title' => $quote->title,
                'status' => 'draft',
                'quote_number' => 'QTE-' . now()->format('Ym') . '-9999',
            ],
        );

        $response->assertSessionDoesntHaveErrors();
        $this->assertSame('QTE-' . now()->format('Ym') . '-9999', $quote->fresh()->quote_number);
    }

    public function test_quote_number_edit_is_ignored_when_not_draft(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);
        $quote = $this->makeDraftQuote($admin, 'QTE-' . now()->format('Ym') . '-0001');
        $quote->update(['status' => 'negotiating']);
        $originalNumber = $quote->quote_number;

        $this->actingAs($admin, 'admins')->put(
            route('admin.quote.update', $quote->id),
            [
                'title' => $quote->title,
                'status' => 'negotiating',
                'quote_number' => 'QTE-' . now()->format('Ym') . '-9999',
            ],
        );

        $this->assertSame($originalNumber, $quote->fresh()->quote_number);
    }

    public function test_quote_number_must_be_unique(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);
        $existing = $this->makeDraftQuote($admin, 'QTE-' . now()->format('Ym') . '-0001');
        $target = $this->makeDraftQuote($admin, 'QTE-' . now()->format('Ym') . '-0002');

        $response = $this->actingAs($admin, 'admins')->put(
            route('admin.quote.update', $target->id),
            [
                'title' => $target->title,
                'status' => 'draft',
                'quote_number' => $existing->quote_number,
            ],
        );

        $response->assertSessionHasErrors('quote_number');
    }

    public function test_malformed_quote_number_does_not_block_the_rest_of_the_update_when_not_draft(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);
        $quote = $this->makeDraftQuote($admin, 'QTE-' . now()->format('Ym') . '-0001');
        $quote->update(['status' => 'negotiating']);

        // 下書き以外の状態で、フォーマット不正・重複した番号を送っても、
        // 番号フィールドが無視されるだけで更新リクエスト全体は失敗してはならない
        $response = $this->actingAs($admin, 'admins')->put(
            route('admin.quote.update', $quote->id),
            [
                'title' => '更新後のタイトル',
                'status' => 'negotiating',
                'quote_number' => 'invalid-format',
            ],
        );

        $response->assertSessionDoesntHaveErrors();
        $this->assertSame('更新後のタイトル', $quote->fresh()->title);
    }
}
```

- [ ] **Step 2: テストを実行して失敗を確認する**

Run: `docker exec spra-laravel.test-1 php artisan test --filter=QuoteNumberEditTest`
Expected: FAIL

- [ ] **Step 3: バックエンドを実装する**

`app/Services/QuoteService.php` の`updateQuote()`（152行目〜）内、`$quoteUpdate`を組み立てている箇所（156〜166行目）に以下を追加する（`title`の直後）。

```php
            if (isset($data['title'])) {
                $quoteUpdate['title'] = $data['title'];
            }
            if (isset($data['quote_number']) && $quote->status === 'draft') {
                $quoteUpdate['quote_number'] = $data['quote_number'];
            }
```

`app/Http/Controllers/Admin/Quote/QuoteController.php` の`update()`メソッド（235〜282行目）内、`$request->validate([...])`の配列に以下を追加する（`title`の直後）。

```php
            // 下書き以外の状態では、送信されたquote_numberの値が不正・重複していても
            // 更新リクエスト全体を巻き込んで422にしてはならない（仕様上「無視する」の
            // 意図はバリデーション自体を通すこと）。status !== 'draft'のときはルールを
            // 空にしてバリデーションを完全にスキップする（永続化側のガードは
            // QuoteService::updateQuote()側で別途担っている）
            'quote_number' => $quote->status === 'draft'
                ? [
                    'nullable',
                    'string',
                    'max:50',
                    Rule::when(
                        $request->input('quote_number') !== $quote->quote_number,
                        ['regex:/^[A-Z]{3}-\d{6}-\d{4}$/'],
                    ),
                    Rule::unique('quotes', 'quote_number')->ignore($quote->id),
                ]
                : [],
```

ファイル冒頭のuse文に `use Illuminate\Validation\Rule;` が無ければ追加する。

- [ ] **Step 4: テストを実行して成功を確認する**

Run: `docker exec spra-laravel.test-1 php artisan test --filter=QuoteNumberEditTest`
Expected: PASS（3件）

- [ ] **Step 5: フロントエンドに編集欄を追加する**

`resources/js/Pages/Admin/Quotes/Edit.jsx` の`useForm`初期値（19行目〜、`title: quote.title || "",`の直後）に以下を追加する。

```jsx
        quote_number: quote.quote_number || "",
```

`resources/js/Pages/Admin/Quotes/_components/Form.jsx` の112行目（「件名」の`FormGroup`を閉じる`</FormGroup>`）の直後、114行目の「ステータス」`FormGroup`の直前に、以下を挿入する。

```jsx
                                {isEdit && (
                                    <FormGroup
                                        label="見積書番号"
                                        htmlFor="quote_number"
                                        error={errors.quote_number}
                                        help={
                                            data.status !== "draft"
                                                ? "下書き状態でのみ編集できます"
                                                : undefined
                                        }
                                    >
                                        <TextInput
                                            id="quote_number"
                                            name="quote_number"
                                            value={data.quote_number || ""}
                                            onChange={(e) =>
                                                setData(
                                                    "quote_number",
                                                    e.target.value,
                                                )
                                            }
                                            disabled={data.status !== "draft"}
                                        />
                                    </FormGroup>
                                )}
```

- [ ] **Step 6: フロントエンドのビルドを確認する**

Run: `npm run build`
Expected: エラー無く成功する

- [ ] **Step 7: コミット**

```bash
git add app/Http/Controllers/Admin/Quote/QuoteController.php app/Services/QuoteService.php resources/js/Pages/Admin/Quotes/Edit.jsx tests/Feature/Admin/QuoteNumberEditTest.php
git commit -m "feat: 見積書番号を下書き状態のみAdmin編集画面から手動修正できるようにする"
```

---

## Task 8: Invoice 番号の手動編集（下書き状態のみ）

**Files:**
- Modify: `app/Http/Requests/InvoiceRequest.php`
- Modify: `resources/js/Pages/Admin/Invoices/Edit.jsx`
- Test: `tests/Feature/Admin/InvoiceNumberEditTest.php`

**Interfaces:**
- Produces: `PUT admin.invoice.update`が`invoice_number`パラメータを受け付けるようになる

**背景**: `InvoiceController::update()`は既に`in_array($invoice->status, ['sent','viewed','paid','overdue'])`の場合に更新自体を丸ごと拒否している（141〜150行目）。つまりこのコントローラーに到達できる時点で必ず`draft`状態であり、Contract/Quoteのような「値が変わったら状態をチェックする」という追加のガードは不要。`InvoiceRequest`（store/update共用）に`invoice_number`のルールを追加するだけでよい。

- [ ] **Step 1: 失敗するテストを書く**

`tests/Feature/Admin/InvoiceNumberEditTest.php` を新規作成する。

```php
<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use App\Models\Invoice;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InvoiceNumberEditTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    private function makeDraftInvoice(User $user, string $invoiceNumber): Invoice
    {
        return Invoice::create([
            'invoice_number' => $invoiceNumber,
            'user_id' => $user->id,
            'issue_date' => now()->toDateString(),
            'due_date' => now()->addDays(30)->toDateString(),
            'status' => 'draft',
            'subtotal' => 100000,
            'tax_rate' => 10,
            'tax_amount' => 10000,
            'total_amount' => 110000,
        ]);
    }

    public function test_admin_can_edit_the_invoice_number_while_draft(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);
        $user = User::factory()->create();
        $invoice = $this->makeDraftInvoice($user, 'INV-' . now()->format('Ym') . '-0001');

        $response = $this->actingAs($admin, 'admins')->put(
            route('admin.invoice.update', $invoice->id),
            [
                'issue_date' => $invoice->issue_date->toDateString(),
                'due_date' => $invoice->due_date->toDateString(),
                'user_id' => $user->id,
                'status' => 'draft',
                'subtotal' => 100000,
                'tax_rate' => 10,
                'tax_amount' => 10000,
                'total_amount' => 110000,
                'invoice_number' => 'INV-' . now()->format('Ym') . '-9999',
            ],
        );

        $response->assertSessionDoesntHaveErrors();
        $this->assertSame('INV-' . now()->format('Ym') . '-9999', $invoice->fresh()->invoice_number);
    }

    public function test_invoice_number_must_be_unique(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);
        $user = User::factory()->create();
        $existing = $this->makeDraftInvoice($user, 'INV-' . now()->format('Ym') . '-0001');
        $target = $this->makeDraftInvoice($user, 'INV-' . now()->format('Ym') . '-0002');

        $response = $this->actingAs($admin, 'admins')->put(
            route('admin.invoice.update', $target->id),
            [
                'issue_date' => $target->issue_date->toDateString(),
                'due_date' => $target->due_date->toDateString(),
                'user_id' => $user->id,
                'status' => 'draft',
                'subtotal' => 100000,
                'tax_rate' => 10,
                'tax_amount' => 10000,
                'total_amount' => 110000,
                'invoice_number' => $existing->invoice_number,
            ],
        );

        $response->assertSessionHasErrors('invoice_number');
    }
}
```

- [ ] **Step 2: テストを実行して失敗を確認する**

Run: `docker exec spra-laravel.test-1 php artisan test --filter=InvoiceNumberEditTest`
Expected: FAIL（`invoice_number`が`InvoiceRequest`のルールに無いため、`$request->validated()`から除外され反映されない）

- [ ] **Step 3: バックエンドを実装する**

`app/Http/Requests/InvoiceRequest.php` の`rules()`に以下を追加する（`contract_id`の直後）。

```php
            'invoice_number'        => [
                'nullable',
                'string',
                'max:50',
                Rule::when(
                    $this->route('invoice') && $this->input('invoice_number') !== \App\Models\Invoice::find($this->route('invoice'))?->invoice_number,
                    ['regex:/^[A-Z]{3}-\d{6}-\d{4}$/'],
                ),
                Rule::unique('invoices', 'invoice_number')->ignore($this->route('invoice')),
            ],
```

ファイル冒頭に `use Illuminate\Validation\Rule;` を追加する（`InvoiceRequest`の現在の実装を確認し、既に`use`文があれば重複させない）。

- [ ] **Step 4: テストを実行して成功を確認する**

Run: `docker exec spra-laravel.test-1 php artisan test --filter=InvoiceNumberEditTest`
Expected: PASS（2件）

- [ ] **Step 5: フロントエンドに編集欄を追加する**

`resources/js/Pages/Admin/Invoices/Edit.jsx` の`useForm`初期値（17行目〜、`contract_id: invoice.contract_id || "",`の直後）に以下を追加する。

```jsx
        invoice_number: invoice.invoice_number || "",
```

`resources/js/Pages/Admin/Invoices/_components/Form.jsx` の104行目（`<div className="grid grid-cols-1 md:grid-cols-2 gap-6">`）の直後、`{contract ? (`ブロックの直前に、以下を挿入する。`InvoiceController::edit()`は`in_array($invoice->status, ['sent','viewed','paid','overdue'])`の場合にshow画面へリダイレクトする実装になっていないため（`update()`側でのみガードしている）、フロントエンド側でも`data.status !== "draft"`のとき`disabled`にしておく。

```jsx
                            {isEdit && (
                                <FormGroup
                                    label="請求書番号"
                                    htmlFor="invoice_number"
                                    error={errors.invoice_number}
                                    help={
                                        data.status !== "draft"
                                            ? "下書き状態でのみ編集できます"
                                            : undefined
                                    }
                                >
                                    <TextInput
                                        id="invoice_number"
                                        name="invoice_number"
                                        value={data.invoice_number || ""}
                                        onChange={(e) =>
                                            setData(
                                                "invoice_number",
                                                e.target.value,
                                            )
                                        }
                                        disabled={data.status !== "draft"}
                                    />
                                </FormGroup>
                            )}
```

- [ ] **Step 6: フロントエンドのビルドを確認する**

Run: `npm run build`
Expected: エラー無く成功する

- [ ] **Step 7: コミット**

```bash
git add app/Http/Requests/InvoiceRequest.php resources/js/Pages/Admin/Invoices/Edit.jsx tests/Feature/Admin/InvoiceNumberEditTest.php
git commit -m "feat: 請求書番号を下書き状態のみAdmin編集画面から手動修正できるようにする"
```

---

## Task 9: Receipt 用 FormRequest の新設と番号の手動編集（未送付のみ）

**Files:**
- Create: `app/Http/Requests/ReceiptRequest.php`
- Modify: `app/Http/Controllers/Admin/ReceiptController.php:130-230`（`store()`/`update()`）
- Modify: `resources/js/Pages/Admin/Receipts/Edit.jsx`
- Test: `tests/Feature/Admin/ReceiptNumberEditTest.php`

**Interfaces:**
- Produces: `PUT admin.receipt.update`が`receipt_number`パラメータを受け付けるようになる

**背景**: `ReceiptController`は現状`store()`/`update()`ともに`Request $request`を直に受け取り`$request->validate([...])`をインラインで書いている（`ReceiptRequest`というFormRequestクラスは存在しない）。今回、番号バリデーションのため新設する。`update()`は既に`$receipt->status === 'sent'`の場合に更新自体を拒否している（201〜203行目）ため、Invoiceと同様、到達できる時点で`sent`ではないことが保証されている。

- [ ] **Step 1: 失敗するテストを書く**

`tests/Feature/Admin/ReceiptNumberEditTest.php` を新規作成する。

```php
<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use App\Models\Invoice;
use App\Models\Receipt;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReceiptNumberEditTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    private function makeDraftReceipt(User $user, string $receiptNumber): array
    {
        $invoice = Invoice::create([
            'invoice_number' => 'INV-' . now()->format('Ym') . '-' . random_int(1000, 9999),
            'user_id' => $user->id,
            'issue_date' => now()->toDateString(),
            'due_date' => now()->addDays(30)->toDateString(),
            'status' => 'paid',
            'subtotal' => 100000,
            'tax_rate' => 10,
            'tax_amount' => 10000,
            'total_amount' => 110000,
        ]);

        $receipt = Receipt::create([
            'receipt_number' => $receiptNumber,
            'invoice_id' => $invoice->id,
            'user_id' => $user->id,
            'amount' => 100000,
            'tax_amount' => 10000,
            'total_amount' => 110000,
            'status' => 'draft',
        ]);

        return [$invoice, $receipt];
    }

    public function test_admin_can_edit_the_receipt_number_while_not_sent(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);
        $user = User::factory()->create();
        [$invoice, $receipt] = $this->makeDraftReceipt($user, 'RCP-' . now()->format('Ym') . '-0001');

        $response = $this->actingAs($admin, 'admins')->put(
            route('admin.receipt.update', $receipt->id),
            [
                'invoice_id' => $invoice->id,
                'user_id' => $user->id,
                'amount' => 100000,
                'tax_amount' => 10000,
                'total_amount' => 110000,
                'status' => 'draft',
                'receipt_number' => 'RCP-' . now()->format('Ym') . '-9999',
            ],
        );

        $response->assertSessionDoesntHaveErrors();
        $this->assertSame('RCP-' . now()->format('Ym') . '-9999', $receipt->fresh()->receipt_number);
    }

    public function test_receipt_number_must_be_unique(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);
        $user = User::factory()->create();
        [, $existing] = $this->makeDraftReceipt($user, 'RCP-' . now()->format('Ym') . '-0001');
        [$invoice, $target] = $this->makeDraftReceipt($user, 'RCP-' . now()->format('Ym') . '-0002');

        $response = $this->actingAs($admin, 'admins')->put(
            route('admin.receipt.update', $target->id),
            [
                'invoice_id' => $invoice->id,
                'user_id' => $user->id,
                'amount' => 100000,
                'tax_amount' => 10000,
                'total_amount' => 110000,
                'status' => 'draft',
                'receipt_number' => $existing->receipt_number,
            ],
        );

        $response->assertSessionHasErrors('receipt_number');
    }
}
```

- [ ] **Step 2: テストを実行して失敗を確認する**

Run: `docker exec spra-laravel.test-1 php artisan test --filter=ReceiptNumberEditTest`
Expected: FAIL（`receipt_number`が`update()`のインラインバリデーションに存在しない）

- [ ] **Step 3: ReceiptRequest を新設する**

`app/Http/Requests/ReceiptRequest.php` を新規作成する。既存の`ReceiptController::update()`（205〜216行目）のインラインルールをそのまま移し、`receipt_number`を追加する。

```php
<?php

namespace App\Http\Requests;

use App\Models\Receipt;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ReceiptRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $receiptId = $this->route('receipt');

        return [
            'invoice_id'    => 'required|ulid|exists:invoices,id',
            'payment_id'    => 'nullable|ulid|exists:payments,id',
            'user_id'       => 'required|uuid|exists:users,id',
            'company_id'    => 'nullable|ulid|exists:companies,id',
            'amount'        => 'required|numeric|min:0',
            'tax_amount'    => 'required|numeric|min:0',
            'total_amount'  => 'required|numeric|min:0',
            'status'        => 'required|string|in:draft,issued,sent',
            'issued_at'     => 'nullable|date',
            'notes'         => 'nullable|string',
            'receipt_number' => [
                'nullable',
                'string',
                'max:50',
                Rule::when(
                    $receiptId && $this->input('receipt_number') !== Receipt::find($receiptId)?->receipt_number,
                    ['regex:/^[A-Z]{3}-\d{6}-\d{4}$/'],
                ),
                Rule::unique('receipts', 'receipt_number')->ignore($receiptId),
            ],
        ];
    }
}
```

- [ ] **Step 4: ReceiptController を ReceiptRequest を使う形に置き換える**

`app/Http/Controllers/Admin/ReceiptController.php` の`update()`（196〜230行目付近）を、`Request $request`の代わりに`ReceiptRequest $request`を受け取り、インラインの`$request->validate([...])`（205〜216行目）を`$request->validated()`に置き換える。`store()`（130行目）についても同様に`ReceiptRequest`を使うよう統一する（`store()`は`receipt_number`を通常フロントから送らないため、`nullable`ルールにより影響しない）。ファイル冒頭のuse文に `use App\Http\Requests\ReceiptRequest;` を追加する。

- [ ] **Step 5: テストを実行して成功を確認する**

Run: `docker exec spra-laravel.test-1 php artisan test --filter=ReceiptNumberEditTest`
Expected: PASS（2件）

- [ ] **Step 6: 既存の領収書関連テストに影響が無いことを確認する**

Run: `docker exec spra-laravel.test-1 php artisan test --filter=Receipt`
Expected: 既存のReceipt関連テスト（存在すれば）が全てPASSする

- [ ] **Step 7: フロントエンドに編集欄を追加する**

`resources/js/Pages/Admin/Receipts/Edit.jsx` の`useForm`初期値（16行目〜、`invoice_id: receipt.invoice_id || "",`の直後）に以下を追加する。

```jsx
        receipt_number: receipt.receipt_number || "",
```

`resources/js/Pages/Admin/Receipts/_components/Form.jsx` の107行目（「請求書」の`FormGroup`を閉じる`</FormGroup>`）の直後、109行目の`<div className="grid grid-cols-2 gap-4">`の直前に、以下を挿入する（Receiptは`status === 'sent'`で編集不可になる設計のため、その条件で`disabled`にする）。

```jsx

                        {isEdit && (
                            <FormGroup
                                label="領収書番号"
                                htmlFor="receipt_number"
                                error={errors.receipt_number}
                            >
                                <TextInput
                                    id="receipt_number"
                                    name="receipt_number"
                                    value={data.receipt_number || ""}
                                    onChange={(e) =>
                                        setData(
                                            "receipt_number",
                                            e.target.value,
                                        )
                                    }
                                    disabled={data.status === "sent"}
                                />
                            </FormGroup>
                        )}
```

- [ ] **Step 8: フロントエンドのビルドを確認する**

Run: `npm run build`
Expected: エラー無く成功する

- [ ] **Step 9: コミット**

```bash
git add app/Http/Requests/ReceiptRequest.php app/Http/Controllers/Admin/ReceiptController.php resources/js/Pages/Admin/Receipts/Edit.jsx tests/Feature/Admin/ReceiptNumberEditTest.php
git commit -m "feat: 領収書に専用ReceiptRequestを新設し、未送付の間のみ番号を手動修正できるようにする"
```

---

## Task 10: 全体テストスイート実行とドキュメント更新

**Files:**
- Modify: `SPEC.md`（§7既知の課題一覧・§10変更履歴）
- Modify: `TASKS.md`（該当タスクがあればチェック）

- [ ] **Step 1: 全体テストスイートを単独実行する**

Run: `docker exec spra-laravel.test-1 php artisan test`
Expected: 既知の事前失敗15件のみで、Task 1〜9で追加した全テストを含めそれ以外はPASSする。もし他のテストで失敗が出た場合、Task 1〜5で採番フォーマットが変わったことに起因する既存テストの期待値のずれが無いか確認して修正する。

- [ ] **Step 2: SPEC.md を更新する**

`SPEC.md` §7の表に新しいK番号（既存の最大K番号の次の番号、実装時点で確認する）で以下を追加する。

```
| K{N} | 契約/見積/請求/領収書の採番フォーマットに統一感が無く、桁数から受注件数が推測できる。番号を手動修正する手段も無い | **修正済み**（2026-08-21、ユーザー指摘）。`{PREFIX}-{YYYYMM}-{4桁連番}`（CTR/QTE/INV/RCP）に統一する共通採番サービス`ReferenceNumberService`を新設し、既存4箇所の採番ロジックを置き換えた。あわせてContractの採番に排他ロック・論理削除考慮が欠けていた不備も修正。下書き/未送付状態に限り、Admin編集画面から番号を手動修正できるようにした。過去に発行済みの番号は遡って変換していない。設計は`docs/superpowers/specs/2026-08-21-reference-number-unification-design.md`参照 | フェーズ1（完了） |
```

§10の変更履歴に1行追加する。

- [ ] **Step 3: コミット**

```bash
git add SPEC.md TASKS.md
git commit -m "docs: 採番方式統一・番号手動編集機能の完了をSPEC.mdに記録"
```

- [ ] **Step 4: ブランチをpushしてPRを作成する**

```bash
git push -u origin <branch-name>
gh pr create --title "feat: 契約/見積/請求/領収書の採番方式を統一し番号を手動編集可能にする" --body "$(cat <<'EOF'
## Summary
（Task 1〜10の内容を要約して記載する。docs/superpowers/specs/2026-08-21-reference-number-unification-design.mdへのリンクを含める）

## Test plan
- [x] 各Taskで追加した回帰テストが全てPASS
- [x] docker exec spra-laravel.test-1 php artisan test を単独実行し、既知の事前失敗15件のみでリグレッションが無いことを確認
- [x] npm run build をホスト側で実行しフロント変更に構文エラーが無いことを確認

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

PR作成後、ユーザーにマージ確認を依頼する（マージそのものは実行しない）。
