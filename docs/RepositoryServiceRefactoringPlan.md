# Interface・Repository・Service 整理計画

## 📋 現状分析

### 共通パターン

#### Interface/Repository共通メソッド

- `query(): Builder`
- `findById(string $id): ?Model`
- `findWithFilters(array $filters): Builder`
- `paginate(int $perPage, array $filters, array $sort): LengthAwarePaginator`
- `buildSearchQuery(Builder $query, string $search): Builder`
- `buildStatusFilter(Builder $query, string $status): Builder`
- `applySorting(Builder $query, string $field, string $direction): Builder`
- `create(array $data): Model`
- `update(Model $model, array $data): Model|bool`
- `delete(Model $model): bool`
- `getStats(): array`

#### SoftDelete対応モデルの追加メソッド

- `restore(Model $model): bool`
- `forceDelete(Model $model): bool`
- `applyTrashedFilter(Builder $query, string $trashed): Builder`

#### 特定モデルのみのメソッド

- `findByEmail(string $email)` - Admin, User
- `findBySlug(string $slug)` - Service, Blog等
- `slugExists(string $slug, ?string $excludeId)` - Service, Blog等
- `buildRoleFilter(Builder $query, string $role)` - Admin, User

### 統一すべき項目

#### 1. ステータスカラム名

❌ 現状: `is_active` (boolean), `status` (enum)
✅ 統一: `status` (enum) - 値: active, inactive, suspended

#### 2. ステータス値

標準値: `active`, `inactive`, `suspended`
特殊ケース:

- Contact: `new`, `in_progress`, `replied`, `closed`
- Lead: `new`, `contacted`, `qualified`, `proposal`, `negotiation`, `won`, `lost`
- Project: `draft`, `active`, `on_hold`, `completed`, `cancelled`
- Invoice/Payment: `draft`, `sent`, `paid`, `overdue`, `cancelled`

#### 3. メソッド命名規則

- `getPaginated{Model}s()` - ページネーション取得
- `get{Model}Stats()` - 統計情報取得
- `create{Model}()` - 作成
- `update{Model}()` - 更新
- `delete{Model}()` - 削除
- `restore{Model}()` - 復元

---

## 🏗️ 提案する構造

### 1. 基底インターフェース階層

```
BaseRepositoryInterface (基底)
├── SoftDeletableRepositoryInterface (SoftDeletes対応)
├── SlugableRepositoryInterface (Slug対応)
├── StatusableRepositoryInterface (Status対応)
└── SearchableRepositoryInterface (検索対応)
```

### 2. 基底リポジトリクラス

```
BaseRepository (abstract)
├── SoftDeletableRepository (abstract)
└── 具体的なRepository (AdminRepository, ServiceRepository等)
```

### 3. 基底サービスクラス

```
BaseService (abstract)
├── 具体的なService (AdminService, ServiceService等)
```

---

## 📐 設計詳細

### BaseRepositoryInterface

```php
interface BaseRepositoryInterface
{
    // Query
    public function query(): Builder;
    public function findById(string $id): mixed;
    public function findWithFilters(array $filters): Builder;

    // Pagination
    public function paginate(
        int $perPage = 20,
        array $filters = [],
        array $sort = []
    ): LengthAwarePaginator;

    // Filters
    public function buildSearchQuery(Builder $query, string $search): Builder;
    public function buildStatusFilter(Builder $query, string $status): Builder;

    // Sorting
    public function applySorting(
        Builder $query,
        string $field,
        string $direction = 'desc'
    ): Builder;

    // CRUD
    public function create(array $data): mixed;
    public function update(mixed $model, array $data): mixed;
    public function delete(mixed $model): bool;

    // Stats
    public function getStats(): array;
}
```

### SoftDeletableRepositoryInterface

```php
interface SoftDeletableRepositoryInterface extends BaseRepositoryInterface
{
    public function restore(mixed $model): bool;
    public function forceDelete(mixed $model): bool;
    public function applyTrashedFilter(Builder $query, ?string $trashed): Builder;
    public function getTrashedStats(): array;
}
```

### SlugableRepositoryInterface

```php
interface SlugableRepositoryInterface
{
    public function findBySlug(string $slug): mixed;
    public function slugExists(string $slug, ?string $excludeId = null): bool;
    public function generateUniqueSlug(string $text, ?string $excludeId = null): string;
}
```

### StatusableRepositoryInterface

```php
interface StatusableRepositoryInterface
{
    public function getByStatus(string $status): Collection;
    public function getActiveRecords(): Collection;
    public function getInactiveRecords(): Collection;
    public function updateStatus(mixed $model, string $status): bool;
}
```

---

## 🎯 実装ステップ

### Phase 1: 基底クラス作成

1. ✅ BaseRepositoryInterface 作成
2. ✅ SoftDeletableRepositoryInterface 作成
3. ✅ SlugableRepositoryInterface 作成
4. ✅ StatusableRepositoryInterface 作成
5. ✅ BaseRepository (abstract class) 作成
6. ✅ SoftDeletableRepository (abstract class) 作成
7. ✅ BaseService (abstract class) 作成

### Phase 2: 既存Repository移行

1. AdminRepository → BaseRepository継承に変更
2. UserRepository → BaseRepository継承に変更
3. ServiceRepository → SoftDeletableRepository継承に変更
4. ServiceCategoryRepository → SoftDeletableRepository継承に変更
5. その他のRepository順次移行

### Phase 3: 既存Service移行

1. AdminService → BaseService継承に変更
2. UserService → BaseService継承に変更
3. ServiceService → BaseService継承に変更
4. その他のService順次移行

### Phase 4: データベース統一

1. is_active → status カラム変更マイグレーション
2. status値の統一（active, inactive, suspended）

---

## 📊 役割の明確化

### Interface (契約)

- **責務**: メソッドシグネチャの定義
- **含むもの**: public メソッドの宣言のみ
- **含まないもの**: 実装ロジック

### Repository (データアクセス層)

- **責務**: データベースとの直接的なやりとり
- **含むもの**:
    - Eloquent クエリビルダー操作
    - フィルタリング・ソート・ページネーション
    - CRUD操作
    - シンプルな集計（count, max, min等）
- **含まないもの**:
    - ビジネスロジック
    - 複雑な計算
    - 外部APIとの通信
    - メール送信

### Service (ビジネスロジック層)

- **責務**: ビジネスロジックの実装
- **含むもの**:
    - 複雑な処理フロー
    - トランザクション管理
    - バリデーション
    - イベント発火
    - メール送信
    - 外部API連携
    - 複数Repositoryの調整
- **含まないもの**:
    - 直接的なSQL操作
    - Eloquentクエリビルダー操作

### Controller (プレゼンテーション層)

- **責務**: HTTPリクエスト/レスポンスの処理
- **含むもの**:
    - リクエストバリデーション
    - Serviceメソッド呼び出し
    - レスポンス整形
    - ビュー返却
- **含まないもの**:
    - ビジネスロジック
    - データベース操作

---

## 💡 統一ガイドライン

### 1. メソッド命名規則

#### Repository

```php
// 取得系
public function findById(string $id): ?Model
public function findBySlug(string $slug): ?Model
public function getAll(): Collection
public function getActive(): Collection

// フィルタ系
public function buildSearchQuery(Builder $query, string $search): Builder
public function buildStatusFilter(Builder $query, string $status): Builder

// CRUD
public function create(array $data): Model
public function update(Model $model, array $data): Model|bool
public function delete(Model $model): bool
```

#### Service

```php
// 取得系
public function getPaginated{Models}(array $filters = [], array $sort = [], int $perPage = 20)
public function find{Model}ById(string $id): ?Model
public function get{Model}Stats(): array

// CRUD
public function create{Model}(array $data): Model
public function update{Model}(Model $model, array $data): Model
public function delete{Model}(Model $model): bool
public function restore{Model}(Model $model): bool
```

### 2. ステータス値の標準化

```php
// 標準ステータス
const STATUS_ACTIVE = 'active';
const STATUS_INACTIVE = 'inactive';
const STATUS_SUSPENDED = 'suspended';

// エンティティ固有ステータスは別途定義
```

### 3. フィルタパラメータの標準化

```php
$filters = [
    'search' => string,      // 検索キーワード
    'status' => string,      // ステータス
    'trashed' => string,     // with_trashed | only_trashed | without_trashed
    'role' => string,        // 役割（Admin/User）
    'category' => string,    // カテゴリID
    // ... エンティティ固有のフィルタ
];

$sort = [
    'field' => string,       // ソート対象フィールド
    'direction' => string,   // asc | desc
];
```

---

## ✅ 期待される効果

1. **コードの一貫性**: 全てのRepository/Serviceが同じパターンに従う
2. **保守性向上**: 共通ロジックの変更が一箇所で済む
3. **テスト容易性**: モックやスタブの作成が容易
4. **新規追加が簡単**: 基底クラスを継承するだけで基本機能が使える
5. **役割の明確化**: 各層の責務が明確になる
6. **バグ削減**: 共通ロジックのバグが減る
