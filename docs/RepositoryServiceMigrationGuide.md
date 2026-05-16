# Interface・Repository・Service 移行ガイド

## ✅ 完了した実装

### Phase 1: 基底クラス作成 ✅

#### 作成したファイル

1. **app/Repositories/Contracts/BaseRepositoryInterface.php**
    - 全リポジトリの基底インターフェース
    - 共通CRUD操作を定義

2. **app/Repositories/Contracts/SoftDeletableRepositoryInterface.php**
    - SoftDeletes対応リポジトリ用
    - restore, forceDelete, getTrashedStatsを追加

3. **app/Repositories/Contracts/SlugableRepositoryInterface.php**
    - slug対応リポジトリ用
    - findBySlug, slugExists, generateUniqueSlugを定義

4. **app/Repositories/Contracts/StatusableRepositoryInterface.php**
    - ステータス管理対応リポジトリ用
    - getByStatus, getActiveRecords, updateStatusを定義

5. **app/Repositories/BaseRepository.php**
    - 基底リポジトリ抽象クラス
    - 共通ロジックを実装

6. **app/Repositories/SoftDeletableRepository.php**
    - SoftDelete対応基底リポジトリ
    - BaseRepositoryを継承

7. **app/Services/BaseService.php**
    - 基底サービス抽象クラス
    - トランザクション管理とログ機能を実装

### Phase 2: AdminRepository/Service移行 ✅

#### 更新したファイル

1. **app/Repositories/Contracts/AdminRepositoryInterface.php**
    - SoftDeletableRepositoryInterfaceを継承
    - Admin固有メソッド（findByEmail, buildRoleFilter）のみ定義

2. **app/Repositories/AdminRepository.php**
    - SoftDeletableRepositoryを継承
    - 約120行から約60行に削減（50%削減）
    - 重複コードを削除

3. **app/Services/AdminService.php**
    - BaseServiceを継承
    - メソッド名を統一（getPaginated, getStats）
    - トランザクション管理を基底クラスに委譲

4. **app/Http/Controllers/Admin/AdminController.php**
    - メソッド名を更新
    - `getPaginatedAdmins()` → `getPaginated()`
    - `getAdminStats()` → `getStats()`

---

## 📋 他のRepository/Service移行手順

### ステップ1: Interfaceの更新

既存のInterfaceを適切な基底インターフェースを継承するように変更します。

#### パターンA: SoftDeletes対応モデル（Service, Blog, Project等）

```php
<?php

namespace App\Repositories\Contracts;

use App\Models\Service;
use Illuminate\Database\Eloquent\Builder;

interface ServiceRepositoryInterface extends SoftDeletableRepositoryInterface
{
    // Service固有のメソッドのみ定義
    public function findBySlug(string $slug): ?Service;
    public function slugExists(string $slug, ?string $excludeId = null): bool;
    public function buildCategoryFilter(Builder $query, string $categoryId): Builder;
    public function buildFeaturedFilter(Builder $query, bool $featured): Builder;
}
```

#### パターンB: 通常のモデル（Contact等）

```php
<?php

namespace App\Repositories\Contracts;

use App\Models\Contact;

interface ContactRepositoryInterface extends BaseRepositoryInterface
{
    // Contact固有のメソッドのみ定義
    public function buildSourceFilter(Builder $query, string $source): Builder;
}
```

### ステップ2: Repositoryの更新

既存のRepositoryを基底クラスを継承するようにリファクタリングします。

#### 例: ServiceRepository

```php
<?php

namespace App\Repositories;

use App\Models\Service;
use App\Repositories\Contracts\ServiceRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;

class ServiceRepository extends SoftDeletableRepository implements ServiceRepositoryInterface
{
    /**
     * モデルクラス名を返す
     */
    protected function getModelClass(): string
    {
        return Service::class;
    }

    /**
     * 検索対象フィールドを返す
     */
    protected function getSearchableFields(): array
    {
        return [
            'name',
            'slug',
            'description',
            'serviceCategory.name',  // リレーション検索
        ];
    }

    /**
     * ソート可能フィールドを返す
     */
    protected function getSortableFields(): array
    {
        return [
            'created_at',
            'name',
            'slug',
            'sort_order',
            'status',
        ];
    }

    /**
     * デフォルトのリレーションを返す
     */
    protected function getDefaultRelations(): array
    {
        return ['serviceCategory', 'creator', 'updater'];
    }

    /**
     * デフォルトのソートフィールドを返す
     */
    protected function getDefaultSortField(): string
    {
        return 'sort_order';  // Serviceはsort_orderがデフォルト
    }

    /**
     * slugで検索（Service固有）
     */
    public function findBySlug(string $slug): ?Service
    {
        return $this->query()->where('slug', $slug)->first();
    }

    /**
     * slugの存在確認（Service固有）
     */
    public function slugExists(string $slug, ?string $excludeId = null): bool
    {
        $query = Service::where('slug', $slug);

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        return $query->exists();
    }

    /**
     * フィルタ条件でクエリビルダーを取得（オーバーライド）
     */
    public function findWithFilters(array $filters): Builder
    {
        $query = parent::findWithFilters($filters);

        // カテゴリフィルタ（Service固有）
        if (!empty($filters['category'])) {
            $query = $this->buildCategoryFilter($query, $filters['category']);
        }

        // 注目フィルタ（Service固有）
        if (isset($filters['is_featured'])) {
            $query = $this->buildFeaturedFilter($query, (bool)$filters['is_featured']);
        }

        return $query;
    }

    /**
     * カテゴリフィルタを適用
     */
    public function buildCategoryFilter(Builder $query, string $categoryId): Builder
    {
        return $query->where('service_category_id', $categoryId);
    }

    /**
     * 注目フィルタを適用
     */
    public function buildFeaturedFilter(Builder $query, bool $featured): Builder
    {
        return $query->where('is_featured', $featured);
    }
}
```

### ステップ3: Serviceの更新

既存のServiceをBaseServiceを継承するようにリファクタリングします。

#### 例: ServiceService

```php
<?php

namespace App\Services;

use App\Models\Service;
use App\Repositories\Contracts\ServiceRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class ServiceService extends BaseService
{
    /**
     * コンストラクタ
     */
    public function __construct(ServiceRepositoryInterface $repository)
    {
        parent::__construct($repository);
    }

    /**
     * エンティティ名を返す
     */
    protected function getEntityName(): string
    {
        return 'Service';
    }

    /**
     * サービスを作成（slug自動生成）
     */
    public function createService(array $data): Service
    {
        return DB::transaction(function () use ($data) {
            // slug自動生成
            if (empty($data['slug'])) {
                $data['slug'] = $this->generateUniqueSlug($data['name']);
            }

            // created_by設定
            if (Auth::guard('admins')->check()) {
                $data['created_by'] = Auth::guard('admins')->id();
            }

            $service = $this->repository->create($data);

            $this->logInfo('created', $service->id);

            return $service;
        });
    }

    /**
     * サービスを更新
     */
    public function updateService(Service $service, array $data): Service
    {
        return DB::transaction(function () use ($service, $data) {
            // slug更新時は重複チェック
            if (isset($data['slug']) && $data['slug'] !== $service->slug) {
                if ($this->repository->slugExists($data['slug'], $service->id)) {
                    throw new \Exception('このスラグは既に使用されています。');
                }
            }

            // updated_by設定
            if (Auth::guard('admins')->check()) {
                $data['updated_by'] = Auth::guard('admins')->id();
            }

            $updated = $this->repository->update($service, $data);

            $this->logInfo('updated', $updated->id);

            return $updated;
        });
    }

    /**
     * ユニークなslugを生成
     */
    protected function generateUniqueSlug(string $name): string
    {
        $slug = Str::slug($name);
        $originalSlug = $slug;
        $counter = 1;

        while ($this->repository->slugExists($slug)) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }

        return $slug;
    }

    /**
     * アクティブなサービス一覧を取得
     */
    public function getActiveServices()
    {
        return $this->repository->findWithFilters(['status' => 'active'])->get();
    }

    /**
     * 注目サービス一覧を取得
     */
    public function getFeaturedServices()
    {
        return $this->repository->findWithFilters([
            'status' => 'active',
            'is_featured' => true,
        ])->get();
    }
}
```

### ステップ4: Controllerの更新

Controllerでのメソッド呼び出しを統一されたメソッド名に変更します。

```php
// Before
$services = $this->serviceService->getPaginatedServices($filters, $sort, 20);
$stats = $this->serviceService->getServiceStats();

// After
$services = $this->serviceService->getPaginated($filters, $sort, 20);
$stats = $this->serviceService->getStats();
```

---

## 🎯 移行優先順位

### 高優先度（SoftDeletes + よく使う）

1. ✅ AdminRepository/Service - 完了
2. UserRepository/Service
3. ServiceRepository/Service
4. ServiceCategoryRepository/Service
5. ProjectRepository/Service

### 中優先度（SoftDeletes）

6. CompanyRepository/Service
7. ContractRepository/Service
8. InvoiceRepository/Service
9. BlogRepository/Service
10. FaqRepository/Service

### 低優先度（通常モデル）

11. ContactRepository/Service
12. PaymentRepository/Service
13. QuoteRepository/Service

---

## 🔧 移行チェックリスト

各Repository/Serviceの移行時に確認する項目：

### Repository

- [ ] 適切な基底クラスを継承（BaseRepository or SoftDeletableRepository）
- [ ] 適切なインターフェースを実装
- [ ] `getModelClass()` を実装
- [ ] `getSearchableFields()` を実装
- [ ] `getSortableFields()` を実装
- [ ] `getDefaultRelations()` を実装（必要に応じて）
- [ ] `getDefaultSortField()` を実装（デフォルトと異なる場合）
- [ ] モデル固有のメソッドのみを残す
- [ ] 重複コードを削除
- [ ] エラーチェック完了

### Service

- [ ] BaseServiceを継承
- [ ] `getEntityName()` を実装
- [ ] コンストラクタでRepositoryを注入
- [ ] メソッド名を統一（`getPaginated`, `getStats`等）
- [ ] トランザクション管理を基底クラスに委譲
- [ ] モデル固有のビジネスロジックのみを残す
- [ ] エラーチェック完了

### Controller

- [ ] メソッド呼び出しを更新
- [ ] エラーチェック完了
- [ ] 動作確認完了

---

## 💡 ベストプラクティス

### 1. リレーション検索の定義方法

```php
protected function getSearchableFields(): array
{
    return [
        'name',                    // 直接フィールド
        'email',                   // 直接フィールド
        'profile.last_name',       // リレーション.フィールド
        'profile.first_name',      // リレーション.フィールド
        'company.name',            // リレーション.フィールド
    ];
}
```

### 2. findWithFiltersのオーバーライド

親クラスのフィルタを活用し、モデル固有のフィルタを追加：

```php
public function findWithFilters(array $filters): Builder
{
    // 親クラスの基本フィルタ（search, status, trashed）を適用
    $query = parent::findWithFilters($filters);

    // モデル固有のフィルタを追加
    if (!empty($filters['role'])) {
        $query = $this->buildRoleFilter($query, $filters['role']);
    }

    if (!empty($filters['category'])) {
        $query = $this->buildCategoryFilter($query, $filters['category']);
    }

    return $query;
}
```

### 3. getStatsのオーバーライド

親クラスの統計情報に追加情報をマージ：

```php
public function getStats(): array
{
    $baseStats = parent::getStats();  // total, active, trashed

    return array_merge($baseStats, [
        'pending' => $this->getModelClass()::where('status', 'pending')->count(),
        'completed' => $this->getModelClass()::where('status', 'completed')->count(),
    ]);
}
```

### 4. 独自メソッドの追加

基底クラスにない機能は通常通り実装：

```php
/**
 * メールアドレスで検索（Admin/User固有）
 */
public function findByEmail(string $email): ?Model
{
    return $this->getModelClass()::where('email', $email)->first();
}

/**
 * slugで検索（Service/Blog固有）
 */
public function findBySlug(string $slug): ?Model
{
    return $this->query()->where('slug', $slug)->first();
}
```

---

## 📊 期待される効果

### コード削減率

- Repository: 約40-60%削減
- Service: 約20-40%削減
- 全体: 約30-50%削減

### 保守性向上

- 共通ロジックの変更が一箇所で済む
- 新規エンティティの追加が簡単
- バグ修正の影響範囲が明確

### 一貫性向上

- 全てのRepository/Serviceが同じパターン
- メソッド名が統一される
- フィルタ・ソートの仕組みが統一される

---

## 🚀 次のステップ

1. UserRepository/Service の移行
2. ServiceRepository/Service の移行
3. ServiceCategoryRepository/Service の移行
4. その他のRepository/Service を順次移行
5. データベースの統一（is_active → status）
6. ステータス値の統一

---

## 📝 移行時の注意事項

### PHPStan/Larastanエラー

型の不一致エラーが出る場合：

```php
// Interface側
public function findById(string $id): mixed;  // 基底はmixed

// Repository側
public function findById(string $id): ?Model  // 具体型を返してOK
{
    return $this->query()->find($id);
}
```

### メソッド名の後方互換性

Controller等で既存のメソッド名が使われている場合、一時的にエイリアスメソッドを作成：

```php
/**
 * @deprecated Use getPaginated() instead
 */
public function getPaginatedServices(...$args)
{
    return $this->getPaginated(...$args);
}
```

移行完了後に削除します。
