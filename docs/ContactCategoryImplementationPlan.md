# ContactCategory機能実装計画

## 概要

お問い合わせ（Contact）にカテゴリー機能を追加し、クライアントからの要望をより分類しやすくする機能の実装計画です。

### 目的

- 見積もり依頼、技術的な質問、一般的な問い合わせなど、お問い合わせの種類を明確に分類
- 管理者側での問い合わせ管理を効率化
- クライアント側での問い合わせフォームをより直感的に

---

## 実装が必要な項目

### 1. データベース

#### 1.1 ContactCategoryテーブル作成

**マイグレーションファイル**: `database/migrations/YYYY_MM_DD_create_contact_categories_table.php`

```php
Schema::create('contact_categories', function (Blueprint $table) {
    $table->ulid('id')->primary();
    $table->string('name');                    // カテゴリー名（例: 見積もり依頼、技術サポート）
    $table->string('slug')->unique();          // URLスラッグ
    $table->text('description')->nullable();   // カテゴリーの説明
    $table->string('icon')->nullable();        // アイコン名（Heroicons）
    $table->string('color')->default('gray');  // カラーテーマ（gray, blue, green, など）
    $table->integer('display_order')->default(0); // 表示順序
    $table->boolean('is_active')->default(true);  // アクティブフラグ
    $table->ulid('created_by')->nullable();
    $table->ulid('updated_by')->nullable();
    $table->timestamps();
    $table->softDeletes();

    $table->foreign('created_by')->references('id')->on('admins')->nullOnDelete();
    $table->foreign('updated_by')->references('id')->on('admins')->nullOnDelete();
});
```

#### 1.2 contactsテーブル修正

**マイグレーションファイル**: `database/migrations/YYYY_MM_DD_add_contact_category_id_to_contacts_table.php`

```php
Schema::table('contacts', function (Blueprint $table) {
    // categoryカラムを削除（現在はenum型かstring型）
    $table->dropColumn('category');

    // contact_category_id外部キーを追加
    $table->ulid('contact_category_id')->nullable()->after('id');
    $table->foreign('contact_category_id')
          ->references('id')
          ->on('contact_categories')
          ->nullOnDelete();
});
```

**注意点**:

- 既存の`category`データを`ContactCategory`に移行するシーダーが必要
- 本番環境に既存データがある場合は、ダウンタイムなしでの移行戦略を検討

---

### 2. バックエンド

#### 2.1 モデル

**ファイル**: `app/Models/ContactCategory.php`

```php
class ContactCategory extends Model
{
    use HasFactory, SoftDeletes, HasMetadata;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'icon',
        'color',
        'display_order',
        'is_active',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'display_order' => 'integer',
    ];

    // Relationships
    public function contacts()
    {
        return $this->hasMany(Contact::class, 'contact_category_id');
    }

    public function createdBy()
    {
        return $this->belongsTo(Admin::class, 'created_by');
    }

    public function updatedBy()
    {
        return $this->belongsTo(Admin::class, 'updated_by');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('display_order');
    }
}
```

**ファイル**: `app/Models/Contact.php` (既存を更新)

```php
// Relationshipを追加
public function category()
{
    return $this->belongsTo(ContactCategory::class, 'contact_category_id');
}
```

#### 2.2 リポジトリ

**ファイル**: `app/Repositories/ContactCategoryRepository.php`

```php
class ContactCategoryRepository extends SoftDeletableRepository
{
    public function __construct(ContactCategory $model)
    {
        parent::__construct($model);
    }

    protected function getSearchableFields(): array
    {
        return ['name', 'slug', 'description'];
    }

    protected function getDefaultRelations(): array
    {
        return ['createdBy', 'updatedBy'];
    }

    public function getActiveCategories()
    {
        return $this->model
            ->active()
            ->ordered()
            ->get(['id', 'name', 'slug', 'icon', 'color']);
    }
}
```

#### 2.3 サービス

**ファイル**: `app/Services/ContactCategoryService.php`

```php
class ContactCategoryService extends BaseService
{
    protected $repository;

    public function __construct(ContactCategoryRepository $repository)
    {
        $this->repository = $repository;
        parent::__construct();
    }

    public function getActiveCategories()
    {
        return $this->repository->getActiveCategories();
    }

    // CRUD操作
    public function create(array $data)
    {
        return $this->repository->create($data);
    }

    public function update($id, array $data)
    {
        return $this->repository->update($id, $data);
    }

    public function delete($id)
    {
        return $this->repository->delete($id);
    }
}
```

#### 2.4 コントローラー

**Admin側**: `app/Http/Controllers/Admin/ContactCategoryController.php`

- Index: カテゴリー一覧
- Create: 新規作成フォーム
- Store: 作成処理
- Edit: 編集フォーム
- Update: 更新処理
- Destroy: 削除処理

**Public側**: `app/Http/Controllers/ContactController.php` (既存を更新)

- `index()`や`create()`でアクティブなカテゴリー一覧を取得
- `store()`で選択されたカテゴリーを保存

#### 2.5 バリデーション

**ファイル**: `app/Http/Requests/ContactCategoryStoreRequest.php`

```php
public function rules()
{
    return [
        'name' => 'required|string|max:255',
        'slug' => 'required|string|max:255|unique:contact_categories,slug',
        'description' => 'nullable|string',
        'icon' => 'nullable|string|max:255',
        'color' => 'nullable|string|max:50',
        'display_order' => 'nullable|integer|min:0',
        'is_active' => 'boolean',
    ];
}
```

**ファイル**: `app/Http/Requests/ContactCategoryUpdateRequest.php` (slug uniqueを除外)

#### 2.6 シーダー

**ファイル**: `database/seeders/ContactCategorySeeder.php`

```php
class ContactCategorySeeder extends Seeder
{
    public function run()
    {
        $categories = [
            [
                'name' => '見積もり依頼',
                'slug' => 'estimate-request',
                'description' => 'サービスやプロジェクトの見積もりに関するお問い合わせ',
                'icon' => 'DocumentTextIcon',
                'color' => 'blue',
                'display_order' => 1,
                'is_active' => true,
            ],
            [
                'name' => '技術サポート',
                'slug' => 'technical-support',
                'description' => '技術的な質問やサポート依頼',
                'icon' => 'WrenchScrewdriverIcon',
                'color' => 'green',
                'display_order' => 2,
                'is_active' => true,
            ],
            [
                'name' => '一般的なお問い合わせ',
                'slug' => 'general-inquiry',
                'description' => 'サービスに関する一般的な質問',
                'icon' => 'ChatBubbleLeftRightIcon',
                'color' => 'gray',
                'display_order' => 3,
                'is_active' => true,
            ],
            [
                'name' => 'パートナーシップ',
                'slug' => 'partnership',
                'description' => 'ビジネスパートナーシップや提携に関するお問い合わせ',
                'icon' => 'HandshakeIcon',
                'color' => 'purple',
                'display_order' => 4,
                'is_active' => true,
            ],
            [
                'name' => 'その他',
                'slug' => 'other',
                'description' => '上記に該当しないお問い合わせ',
                'icon' => 'EllipsisHorizontalIcon',
                'color' => 'gray',
                'display_order' => 99,
                'is_active' => true,
            ],
        ];

        $admin = Admin::first(); // 作成者として最初の管理者を使用

        foreach ($categories as $category) {
            ContactCategory::create([
                ...$category,
                'created_by' => $admin->id,
                'updated_by' => $admin->id,
            ]);
        }
    }
}
```

**既存データ移行シーダー**: `database/seeders/MigrateContactCategoryDataSeeder.php`

```php
class MigrateContactCategoryDataSeeder extends Seeder
{
    public function run()
    {
        // 既存のcontacts.categoryデータを新しいContactCategoryに移行
        $contacts = Contact::whereNotNull('category')->get();

        foreach ($contacts as $contact) {
            $category = ContactCategory::where('slug', $contact->category)
                ->orWhere('name', $contact->category)
                ->first();

            if ($category) {
                $contact->update(['contact_category_id' => $category->id]);
            }
        }
    }
}
```

---

### 3. フロントエンド

#### 3.1 Admin側 - ContactCategory管理画面

**ファイル**: `resources/js/Pages/Admin/ContactCategories/Index.jsx`

- カテゴリー一覧表示
- 検索・フィルター機能
- 並び替え（display_order）
- アクティブ/非アクティブ切り替え

**ファイル**: `resources/js/Pages/Admin/ContactCategories/Create.jsx`

- カテゴリー作成フォーム

**ファイル**: `resources/js/Pages/Admin/ContactCategories/Edit.jsx`

- カテゴリー編集フォーム

**ファイル**: `resources/js/Pages/Admin/ContactCategories/_components/Form.jsx`

- 共通フォームコンポーネント
- フィールド: name, slug, description, icon, color, display_order, is_active

#### 3.2 Admin側 - Contact管理画面更新

**ファイル**: `resources/js/Pages/Admin/Contacts/Index.jsx`

- フィルターに`contact_category_id`を追加
- カテゴリー別絞り込み機能

**ファイル**: `resources/js/Pages/Admin/Contacts/Show.jsx`

- カテゴリー表示をContactCategoryモデルから取得
- カテゴリーアイコンとカラーの表示

#### 3.3 Public側 - お問い合わせフォーム更新

**ファイル**: `resources/js/Pages/Public/Contact.jsx`

- カテゴリー選択UI追加
- ラジオボタンまたはカード形式での選択
- 各カテゴリーにアイコンと説明を表示

**UIイメージ**:

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {categories.map((category) => (
        <label
            key={category.id}
            className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
                selectedCategory === category.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
            }`}
        >
            <input
                type="radio"
                name="contact_category_id"
                value={category.id}
                className="sr-only"
            />
            <div className="flex items-start">
                <Icon className={`h-6 w-6 text-${category.color}-600`} />
                <div className="ml-3">
                    <h4 className="font-semibold">{category.name}</h4>
                    <p className="text-sm text-gray-600">
                        {category.description}
                    </p>
                </div>
            </div>
        </label>
    ))}
</div>
```

#### 3.4 定数ファイル更新

**ファイル**: `resources/js/Constants/SelectOptions.js`

- `CONTACT_CATEGORY_OPTIONS`を削除（動的にContactCategoryから取得）

---

### 4. ルーティング

**ファイル**: `routes/admin.php`

```php
// ContactCategory管理
Route::prefix('contact-categories')->name('contact-category.')->group(function () {
    Route::get('/', [ContactCategoryController::class, 'index'])->name('index');
    Route::get('/create', [ContactCategoryController::class, 'create'])->name('create');
    Route::post('/', [ContactCategoryController::class, 'store'])->name('store');
    Route::get('/{contactCategory}/edit', [ContactCategoryController::class, 'edit'])->name('edit');
    Route::patch('/{contactCategory}', [ContactCategoryController::class, 'update'])->name('update');
    Route::delete('/{contactCategory}', [ContactCategoryController::class, 'destroy'])->name('destroy');
});
```

**ファイル**: `routes/web.php` (Public側)

- 既存のContactController→ContactCategoryを渡すように更新

---

### 5. テスト

#### 5.1 ユニットテスト

- ContactCategoryモデルのテスト
- ContactCategoryRepositoryのテスト
- ContactCategoryServiceのテスト

#### 5.2 機能テスト

- Admin側: ContactCategoryCRUD操作のテスト
- Public側: カテゴリー選択付きお問い合わせ送信のテスト

---

## 実装順序

1. **Phase 1: データベースとモデル**
    - マイグレーション作成
    - ContactCategoryモデル作成
    - Contactモデル更新
    - シーダー作成

2. **Phase 2: バックエンドロジック**
    - Repository作成
    - Service作成
    - Admin側ContactCategoryControllerCRUD実装
    - Public側ContactController更新

3. **Phase 3: Admin側UI**
    - ContactCategory管理画面実装
    - Contact一覧・詳細画面更新

4. **Phase 4: Public側UI**
    - お問い合わせフォームにカテゴリー選択追加
    - デザイン調整

5. **Phase 5: テスト・検証**
    - ユニットテスト作成
    - 機能テスト作成
    - 手動テスト実施

6. **Phase 6: データ移行（本番環境のみ）**
    - 既存categoryデータの移行スクリプト実行
    - 検証

---

## 注意事項

1. **既存データの互換性**
    - 現在の`contacts.category`カラムのデータ形式を確認
    - マイグレーション前に既存データのバックアップを取得

2. **ダウンタイム対策**
    - 本番環境では、段階的なマイグレーションを検討
    - `contact_category_id`追加→データ移行→`category`カラム削除の順で実施

3. **パフォーマンス**
    - ContactCategoryはキャッシュ対象として検討
    - Public側では頻繁にアクセスされるため

4. **権限管理**
    - ContactCategory管理は管理者のみ
    - 必要に応じてPolicy実装

---

## 期待される効果

1. **管理者側**
    - お問い合わせの種類が一目で分かる
    - カテゴリー別のフィルタリングが可能
    - 対応優先度の判断が容易

2. **クライアント側**
    - 適切なカテゴリーを選択することで、より具体的な問い合わせが可能
    - 管理者の対応スピード向上が期待できる

3. **分析**
    - カテゴリー別の問い合わせ数を分析
    - どの種類の問い合わせが多いかを把握し、サービス改善に活用

---

## 参考資料

- 既存のServiceCategory実装
- 既存のContactモデル・コントローラー
- CONTACT_CATEGORY_OPTIONSの定義（SelectOptions.js）

---

**作成日**: 2026年5月17日  
**最終更新**: 2026年5月17日  
**ステータス**: 計画中（未着手）
