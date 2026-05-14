# 参照番号システムとContact改修 - 実装完了

## 📋 実装内容

### 1. Contactテーブル改修

#### マイグレーション更新

- **ファイル**: `database/migrations/2025_10_31_000014_create_contacts_table.php`
- **追加カラム**:
    - `source` (string, nullable): 流入元 (web, phone, email, sns, referral, other)
    - `ip` (string, nullable): 送信元IPアドレス
    - `user_agent` (text, nullable): ユーザーエージェント
    - `referrer` (string, nullable): リファラーURL
- **追加インデックス**: `source`カラムにインデックス追加

#### Contactモデル更新

- **ファイル**: `app/Models/Contact.php`
- **fillable追加**: source, ip, user_agent, referrer

#### ContactController更新

- **ファイル**: `app/Http/Controllers/Admin/Homepage/ContactController.php`
- **変更点**:
    - 検索クエリに`source`を追加
    - `source`フィルタを追加
    - filtersに`source`を追加

#### フロントエンド更新

**SelectOptions.js** - 定数追加:

```javascript
// お問い合わせ流入元
export const CONTACT_SOURCE_OPTIONS = [
    { value: "web", label: "Webフォーム" },
    { value: "phone", label: "電話" },
    { value: "email", label: "メール" },
    { value: "sns", label: "SNS" },
    { value: "referral", label: "紹介" },
    { value: "other", label: "その他" },
];

// お問い合わせステータス
export const CONTACT_STATUS_OPTIONS = [
    { value: "new", label: "新規" },
    { value: "in_progress", label: "対応中" },
    { value: "replied", label: "返信済み" },
    { value: "closed", label: "クローズ" },
];

// お問い合わせカテゴリ
export const CONTACT_CATEGORY_OPTIONS = [
    { value: "estimate", label: "見積もり" },
    { value: "partnership", label: "業務提携" },
    { value: "support", label: "サポート" },
    { value: "other", label: "その他" },
];
```

**Contact/Index.jsx** - 更新内容:

- 流入元フィルタを追加（5列グリッド）
- テーブルに流入元列を追加
- アイコン追加: `GlobeAltIcon`
- 定数インポート: `CONTACT_SOURCE_OPTIONS`

**Contact/Show.jsx** - 更新内容:

- 「流入元・トラッキング情報」セクションを追加
- 表示項目: 流入元、IPアドレス、リファラー、ユーザーエージェント
- アイコン追加: `GlobeAltIcon`, `ComputerDesktopIcon`

---

### 2. 参照番号システム実装

#### reference_numbersテーブル作成

- **ファイル**: `database/migrations/2026_05_09_000001_create_reference_numbers_table.php`

**テーブル構造**:

```php
Schema::create('reference_numbers', function (Blueprint $table) {
    $table->ulid('id')->primary();

    // 参照番号の構成要素
    $table->string('prefix', 10);           // LED, CTR, PRJ, etc.
    $table->char('year_month', 6);          // YYYYMM
    $table->unsignedInteger('sequence');    // 0001, 0002, ...
    $table->string('reference_number', 50)->unique(); // PRJ-202605-0001

    // エンティティ情報
    $table->string('entity_type', 50);      // Lead, Contract, Project, etc.
    $table->ulid('entity_id');              // 関連エンティティのULID

    // 状態管理
    $table->boolean('is_active')->default(true);

    // タイムスタンプ
    $table->timestamps();
    $table->softDeletes();
});
```

#### ReferenceNumberモデル作成

- **ファイル**: `app/Models/ReferenceNumber.php`

**プレフィックス定数**:

```php
const PREFIX_LEAD = 'LED';           // 見込み顧客
const PREFIX_CONTRACT = 'CTR';       // 契約
const PREFIX_PROJECT = 'PRJ';        // プロジェクト
const PREFIX_INVOICE = 'INV';        // 請求書
const PREFIX_RECEIPT = 'RCT';        // 領収書
const PREFIX_MAINTENANCE = 'MNT';    // メンテナンス
const PREFIX_SUBSCRIPTION = 'SUB';   // サブスクリプション
const PREFIX_PROPOSAL = 'PRP';       // 提案書
const PREFIX_QUOTE = 'QTE';          // 見積書
```

**主要メソッド**:

- `entity()`: ポリモーフィックリレーション
- `scopeActive()`: アクティブな参照番号
- `scopeByPrefix()`: プレフィックスでフィルタ
- `deactivate()`: 参照番号を無効化
- `activate()`: 参照番号を再アクティブ化

#### ReferenceNumberService作成

- **ファイル**: `app/Services/ReferenceNumberService.php`

**主要機能**:

1. `generate()`: 参照番号の生成（トランザクション内）
2. `getByEntity()`: エンティティの参照番号を取得
3. `findByNumber()`: 参照番号文字列から検索
4. `deactivate()`: 参照番号を無効化
5. `activate()`: 参照番号を再アクティブ化
6. `getStatistics()`: 統計情報取得
7. `exists()`: 参照番号の存在チェック
8. `hasReferenceNumber()`: エンティティに番号が既に発行されているかチェック

---

## 🚀 使用方法

### 参照番号の生成

```php
use App\Services\ReferenceNumberService;
use App\Models\ReferenceNumber;

// サービスをインジェクト
$referenceNumberService = app(ReferenceNumberService::class);

// プロジェクトの参照番号を生成
$refNumber = $referenceNumberService->generate(
    prefix: ReferenceNumber::PREFIX_PROJECT,  // 'PRJ'
    entityType: 'Project',
    entityId: $project->id
);

// 生成された参照番号: PRJ-202605-0001
echo $refNumber->reference_number;
```

### 特定の年月で参照番号を生成

```php
// 2026年6月の参照番号を生成
$refNumber = $referenceNumberService->generate(
    prefix: ReferenceNumber::PREFIX_LEAD,     // 'LED'
    entityType: 'Lead',
    entityId: $lead->id,
    yearMonth: '202606'
);

// 生成された参照番号: LED-202606-0001
echo $refNumber->reference_number;
```

### 参照番号の取得

```php
// エンティティから参照番号を取得
$refNumber = $referenceNumberService->getByEntity('Project', $project->id);

if ($refNumber) {
    echo $refNumber->reference_number; // PRJ-202605-0001
    echo $refNumber->prefix_label;     // プロジェクト
}

// 参照番号文字列から検索
$refNumber = $referenceNumberService->findByNumber('PRJ-202605-0001');
```

### 参照番号の無効化

```php
// 参照番号を無効化（論理削除ではない）
$result = $referenceNumberService->deactivate('Project', $project->id);

// 参照番号を再アクティブ化
$result = $referenceNumberService->activate('Project', $project->id);
```

### 統計情報の取得

```php
// 2026年5月のプロジェクト参照番号の統計
$stats = $referenceNumberService->getStatistics('PRJ', '202605');

/*
[
    'total' => 15,          // 総数（削除済み含む）
    'active' => 12,         // アクティブ
    'inactive' => 2,        // 非アクティブ
    'deleted' => 1,         // 削除済み
    'max_sequence' => 15,   // 最大連番
]
*/
```

### 存在チェック

```php
// 参照番号の存在確認
if ($referenceNumberService->exists('PRJ-202605-0001')) {
    echo '参照番号は既に存在します';
}

// エンティティに参照番号が発行済みか確認
if ($referenceNumberService->hasReferenceNumber('Project', $project->id)) {
    echo '既に参照番号が発行されています';
}
```

---

## 🔐 重要な制約事項

### 1. 番号は変更不可（Immutable）

- 一度発行した参照番号は**絶対に変更できません**
- 契約後に番号が変わると危険なため、immutableとして扱う

### 2. SoftDelete時の注意

- 番号は**再利用しない**
- `withTrashed()`を使って削除済みレコードも含めて連番を管理
- `getNextSequence()`メソッドで削除済みも考慮

```php
protected function getNextSequence(string $prefix, string $yearMonth): int
{
    // 削除済みも含めて最大値を取得
    $maxSequence = ReferenceNumber::withTrashed()
        ->where('prefix', strtoupper($prefix))
        ->where('year_month', $yearMonth)
        ->lockForUpdate() // 悲観的ロック
        ->max('sequence');

    return ($maxSequence ?? 0) + 1;
}
```

### 3. トランザクション内で生成

- 同時リクエストでの重複を防ぐため、**必ずトランザクション内**で生成
- `lockForUpdate()`で悲観的ロックを使用

---

## 📊 Contactフォームでのトラッキング情報の保存

外部からのお問い合わせフォーム投稿時に、トラッキング情報を自動保存する例:

```php
// 公開側のContactコントローラー（例: app/Http/Controllers/ContactController.php）
use Illuminate\Http\Request;
use App\Models\Contact;

public function store(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email',
        'phone' => 'nullable|string',
        'company' => 'nullable|string',
        'subject' => 'nullable|string',
        'message' => 'required|string',
        'category' => 'required|in:estimate,partnership,support,other',
    ]);

    // トラッキング情報を追加
    $contactData = array_merge($validated, [
        'source' => 'web',  // Webフォームからの投稿
        'ip' => $request->ip(),
        'user_agent' => $request->userAgent(),
        'referrer' => $request->header('referer'),
        'status' => 'new',
    ]);

    $contact = Contact::create($contactData);

    return redirect()->back()->with('success', 'お問い合わせを受け付けました。');
}
```

---

## 🎯 次のステップ

### Phase 2: Leadモジュール実装

1. **Leadsテーブル作成**

```php
Schema::create('leads', function (Blueprint $table) {
    $table->ulid('id')->primary();
    $table->string('reference_number')->unique(); // LED-202605-0001
    $table->ulid('contact_id')->nullable();       // Contactからの変換
    $table->string('company_name');
    $table->string('contact_person');
    $table->string('email');
    $table->string('phone')->nullable();
    $table->string('source')->nullable();
    $table->enum('status', ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost']);
    $table->enum('priority', ['low', 'medium', 'high'])->default('medium');
    $table->decimal('estimated_value', 12, 2)->nullable();
    $table->date('expected_close_date')->nullable();
    $table->text('notes')->nullable();
    $table->ulid('assigned_to')->nullable();
    $table->ulid('created_by')->nullable();
    $table->ulid('updated_by')->nullable();
    $table->ulid('deleted_by')->nullable();
    $table->timestamps();
    $table->softDeletes();
});
```

2. **Lead作成時に参照番号を自動生成**

```php
use App\Services\ReferenceNumberService;
use App\Models\ReferenceNumber;

// Leadサービスクラス内
public function createLead(array $data): Lead
{
    return DB::transaction(function () use ($data) {
        // Leadを作成
        $lead = Lead::create($data);

        // 参照番号を生成
        $referenceNumberService = app(ReferenceNumberService::class);
        $refNumber = $referenceNumberService->generate(
            ReferenceNumber::PREFIX_LEAD,
            'Lead',
            $lead->id
        );

        // Leadに参照番号を設定
        $lead->update([
            'reference_number' => $refNumber->reference_number
        ]);

        return $lead;
    });
}
```

3. **ContactからLeadへの変換機能**

```php
public function convertToLead(Contact $contact): Lead
{
    return DB::transaction(function () use ($contact) {
        // ContactからLeadを作成
        $lead = Lead::create([
            'contact_id' => $contact->id,
            'company_name' => $contact->company,
            'contact_person' => $contact->name,
            'email' => $contact->email,
            'phone' => $contact->phone,
            'source' => $contact->source,
            'notes' => $contact->message,
            'status' => 'new',
        ]);

        // 参照番号を生成
        $referenceNumberService = app(ReferenceNumberService::class);
        $refNumber = $referenceNumberService->generate(
            ReferenceNumber::PREFIX_LEAD,
            'Lead',
            $lead->id
        );

        $lead->update([
            'reference_number' => $refNumber->reference_number
        ]);

        // Contactのステータスを更新
        $contact->update(['status' => 'in_progress']);

        return $lead;
    });
}
```

---

## ✅ 完了チェックリスト

- [x] Contactテーブルマイグレーション修正
- [x] Contact Model更新（fillable追加）
- [x] ContactController改修（source フィルタ追加）
- [x] Contact Index.jsx改修（流入元フィルタ・表示追加）
- [x] Contact Show.jsx改修（トラッキング情報表示追加）
- [x] SelectOptions.js更新（CONTACT\_\*\_OPTIONS追加）
- [x] reference_numbersテーブルマイグレーション作成
- [x] ReferenceNumber Model作成
- [x] ReferenceNumberService作成
- [x] 全ファイルエラーチェック完了

---

## 📝 マイグレーション実行

データベースの変更を反映するには、以下のコマンドを実行してください:

```bash
# マイグレーション実行
php artisan migrate

# または（Sailを使用している場合）
./vendor/bin/sail artisan migrate
```

---

## 🎉 実装完了！

Contact改修と参照番号システムの基盤が完成しました。次はLeadモジュールの実装に進むことができます。
