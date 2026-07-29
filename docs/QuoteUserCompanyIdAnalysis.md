# Quote の user_id と company_id 設定方法 - 調査報告書

> **✅ 2026-07-29追記: 本書§3.2/§4.2/§5/§6で指摘していた同期漏れは解消済みです。**
> `QuoteResponseController::registerStore()`（`app/Http/Controllers/QuoteResponseController.php` L192-197）に、
> QuoteResponse登録完了時に元のQuoteへ`user_id`/`company_id`を同期する処理が既に実装されています
> （本書§5で提案していたEvent/Listenerパターンではなく、コントローラー内で直接同期する形）。
> 回帰テストは `tests/Feature/QuoteResponseRegistrationSyncTest.php` を参照。
> 以下は解消前の調査記録として残していますが、**現状のコードの動作とは異なる**点に注意してください（SPEC.md §7 K1参照）。

## 概要

見積もり（Quote）作成時の user_id と company_id がどのように設定されているかの調査結果を以下にまとめます。

---

## 1. QuoteController での Quote 作成時の user_id と company_id 設定

### 1.1 QuoteController::store メソッド

**ファイル**: [app/Http/Controllers/Admin/Quote/QuoteController.php](app/Http/Controllers/Admin/Quote/QuoteController.php#L147)

```php
// バリデーション（行135-157）
$validated = $request->validate([
    'user_id' => 'nullable|exists:users,id',
    'contact_id' => 'nullable|exists:contacts,id',
    'company_id' => 'nullable|exists:companies,id',
    // ... その他のフィールド
]);

// user_id と contact_id のどちらか一方は必須（行159-164）
if (empty($validated['user_id']) && empty($validated['contact_id'])) {
    return back()->withErrors([
        'user_id' => 'ユーザーまたはお問い合わせのいずれかを選択してください。',
        'contact_id' => 'ユーザーまたはお問い合わせのいずれかを選択してください。',
    ])->withInput();
}

// Quote 作成
$quote = $this->quoteService->createQuote($validated);
```

**重要ポイント**:

- ✅ `user_id` と `company_id` は両方ともオプショナル（nullable）
- ✅ `user_id` または `contact_id` のどちらか一方は必須
- ✅ フロントエンドからのデータは `validated` 配列に含まれる
- ✅ これらの値は QuoteService::createQuote に渡される

### 1.2 QuoteService::createQuote メソッド

**ファイル**: [app/Services/QuoteService.php](app/Services/QuoteService.php#L68)

```php
public function createQuote(array $data): Quote
{
    return DB::transaction(function () use ($data) {
        // 見積番号を自動生成
        if (empty($data['quote_number'])) {
            $data['quote_number'] = $this->repository->generateQuoteNumber();
        }

        // デフォルトステータス
        $data['status'] = $data['status'] ?? 'draft';

        // 作成者を設定
        $data['created_by'] = $data['created_by'] ?? auth('admins')->id();
        $data['updated_by'] = $data['updated_by'] ?? auth('admins')->id();

        // 金額フィールドのデフォルト値を設定
        if (!isset($data['base_amount'])) {
            $data['base_amount'] = 0;
        }
        if (!isset($data['tax_amount'])) {
            $data['tax_amount'] = 0;
        }
        if (!isset($data['total_amount'])) {
            $data['total_amount'] = 0;
        }

        // Quote を作成（$data に user_id, contact_id, company_id が含まれている）
        $quote = $this->repository->create($data);

        // QuoteItems を作成...
    });
}
```

**重要ポイント**:

- ✅ Quote に渡す `$data` には **そのまま** `user_id`、`company_id` が含まれる
- ✅ **特に追加の変換は行わない**
- ✅ Quote モデルの `$fillable` に `user_id`、`company_id` が含まれているため直接作成可能

---

## 2. QuoteObserver による自動設定

### 2.1 QuoteObserver::creating - Quote 作成時の自動処理

**ファイル**: [app/Observers/QuoteObserver.php](app/Observers/QuoteObserver.php#L13)

```php
/**
 * Quote が作成されるとき、メールアドレスからユーザーと会社を自動特定する
 */
public function creating(Quote $quote): void
{
    // 既に user_id と company_id が設定されている場合はスキップ
    if ($quote->user_id && $quote->company_id) {
        return;
    }

    // Contact 情報からメールアドレスを取得
    if ($quote->contact_id && !$quote->user_id) {
        $contact = $quote->contact;

        if ($contact && $contact->email) {
            // メールアドレスからユーザーを検索
            $user = User::where('email', $contact->email)->first();

            if ($user) {
                $quote->user_id = $user->id;

                // ユーザーが会社を持っている場合、最初の会社を紐付ける
                if ($user->companies()->count() > 0 && !$quote->company_id) {
                    $quote->company_id = $user->companies()->first()->id;
                }
            }
        }
    }
}
```

**動作フロー**:

1. **既に user_id と company_id が両方設定されている場合**: スキップ（早期リターン）
2. **contact_id が設定されており user_id が未設定の場合**:
    - Contact のメールアドレスから User を検索
    - User が見つかったら `user_id` を設定
    - User が複数の会社を持っている場合は最初の会社を `company_id` に設定

**重要ポイント**:

- ✅ User と Contact が同じメールアドレスを持つ場合、自動的に紐付け
- ✅ User が複数の会社に所属している場合は **最初の会社**を使用
- ✅ **既に設定されている値は上書きしない**

### 2.2 QuoteObserver::updating - Quote 更新時の自動処理

```php
/**
 * Quote が更新されるとき、同じロジックを適用
 */
public function updating(Quote $quote): void
{
    // contact_id が変更された場合、ユーザー情報も更新する
    if ($quote->isDirty('contact_id') && !$quote->user_id) {
        // ... creating と同じロジック
    }
}
```

**重要ポイント**:

- ✅ `contact_id` が変更された場合のみ処理
- ✅ 既に `user_id` が設定されている場合は更新しない

---

## 3. QuoteResponse から Quote が作成される場合

### 3.1 フロー全体

**ステップ 1: Quote 送信時に QuoteResponse を作成**

[app/Services/QuoteService.php](app/Services/QuoteService.php#L225)

```php
public function sendQuote(Quote $quote, ?string $token = null, string $responseFormUrl = ''): Quote
{
    // ...

    // Create QuoteResponse with token
    $quoteResponse = \App\Models\QuoteResponse::create([
        'quote_id' => $quote->id,
        'token' => $token,
        'email' => $recipientEmail,
        'response_type' => null,
    ]);

    // Quote のステータスを 'sent' に更新
    $quote->update([
        'status' => 'sent',
        'sent_at' => now(),
    ]);
}
```

**ステップ 2: ユーザー登録時に QuoteResponse に user_id と company_id を設定**

[app/Http/Controllers/QuoteResponseController.php](app/Http/Controllers/QuoteResponseController.php#L202)

```php
public function registerStore(Request $request, string $token): Response|RedirectResponse
{
    $quoteResponse = QuoteResponse::where('token', $token)->firstOrFail();

    // User を作成
    $user = \App\Models\User::create([
        'email' => $quoteResponse->email,
        'password' => bcrypt($validated['password']),
        'status' => 'pending',
    ]);

    // Company を作成
    $company = \App\Models\Company::create([
        'name' => $validated['company_name'],
        'company_type' => $validated['company_type'],
        'status' => 'active',
    ]);

    // User を Company に関連付け
    $user->companies()->attach($company->id, [
        'role' => 'owner',
        'is_primary' => true,
        'joined_at' => now(),
    ]);

    // QuoteResponse に関連付け
    $quoteResponse->update([
        'user_id' => $user->id,
        'company_id' => $company->id,
        'admin_notified_at' => now(),
    ]);
}
```

### 3.2 問題点と注意事項

**⚠️ 重要**: Quote と QuoteResponse の user_id/company_id は **完全には同期されていない**

| 項目               | Quote                                          | QuoteResponse                             |
| ------------------ | ---------------------------------------------- | ----------------------------------------- |
| **作成時**         | `user_id` と `contact_id` のどちらか一方を持つ | 最初は空（`NULL`）                        |
| **送信時**         | `status` が `'sent'` に更新                    | `quote_id`, `token`, `email` が設定される |
| **ユーザー登録時** | ⚠️ **更新されない**                            | `user_id` と `company_id` が設定される    |
| **最終状態**       | 元の `user_id`/`company_id` のままの可能性     | 新しい `user_id`/`company_id` を持つ      |

---

## 4. 見積もり返信後の Quote 更新ロジック

### 4.1 Quote ステータス更新

見積もり返信時に Quote のステータス更新は行われている:

```php
// QuoteService::approveQuote
public function approveQuote(Quote $quote, ?string $clientFeedback = null): Quote
{
    return DB::transaction(function () use ($quote, $clientFeedback) {
        $quote->update([
            'status' => 'approved',
            'responded_at' => now(),
            'client_feedback' => $clientFeedback,
        ]);
        return $quote->fresh();
    });
}

// QuoteService::rejectQuote
public function rejectQuote(Quote $quote, ?string $clientFeedback = null): Quote
{
    return DB::transaction(function () use ($quote, $clientFeedback) {
        $quote->update([
            'status' => 'rejected',
            'responded_at' => now(),
            'client_feedback' => $clientFeedback,
        ]);
        return $quote->fresh();
    });
}
```

### 4.2 ⚠️ Quote の user_id と company_id は更新されない

Quote が QuoteResponse で登録されたユーザーに属する場合でも、Quote 自体の `user_id` と `company_id` は自動的には更新されない。

---

## 5. 推奨される改善事項

### 5.1 Quote と QuoteResponse の同期を確保

**問題**: QuoteResponse にユーザー登録が完了しても、Quote の `user_id` と `company_id` は更新されない

**解決方法 1: Event + Listener パターン**

```php
// QuoteResponseUserCreated Event を作成
class QuoteResponseUserCreated
{
    public function __construct(public QuoteResponse $quoteResponse) {}
}

// Listener で Quote を更新
class UpdateQuoteUserInfo
{
    public function handle(QuoteResponseUserCreated $event)
    {
        $quoteResponse = $event->quoteResponse;

        // Quote の user_id と company_id を同期
        $quoteResponse->quote->update([
            'user_id' => $quoteResponse->user_id,
            'company_id' => $quoteResponse->company_id,
        ]);
    }
}
```

**解決方法 2: QuoteResponseObserver パターン**

```php
class QuoteResponseObserver
{
    public function updated(QuoteResponse $quoteResponse)
    {
        // user_id または company_id が変更された場合
        if ($quoteResponse->isDirty(['user_id', 'company_id'])) {
            $quoteResponse->quote->update([
                'user_id' => $quoteResponse->user_id,
                'company_id' => $quoteResponse->company_id,
            ]);
        }
    }
}
```

### 5.2 user_id 検証の強化

QuoteObserver で複数の会社を持つユーザーから最初の会社を選ぶ際、より明示的な処理を推奨:

```php
// 現在のコード
if ($user->companies()->count() > 0 && !$quote->company_id) {
    $quote->company_id = $user->companies()->first()->id;
}

// 推奨: is_primary = true の会社を優先
if (!$quote->company_id) {
    $primaryCompany = $user->companies()
        ->wherePivot('is_primary', true)
        ->first();

    $quote->company_id = $primaryCompany?->id ?? $user->companies()->first()?->id;
}
```

---

## 6. まとめ

### ✅ 現在の動作

1. **Quote 作成時**:
    - 管理者が明示的に `user_id` と `company_id` を指定する
    - 指定されない場合、Observer が `contact_id` のメールアドレスから自動的に user を検索して設定

2. **QuoteResponse 経由の場合**:
    - QuoteResponse に新しいユーザーが登録される
    - QuoteResponse には `user_id` と `company_id` が設定される
    - ⚠️ **但し、元の Quote には反映されない**

3. **見積もり返信後**:
    - Quote のステータスが更新される
    - ⚠️ **Quote の所有者（user_id/company_id）は更新されない**

### ⚠️ 潜在的な問題

- Quote と QuoteResponse の `user_id`/`company_id` が異なる可能性
- Quote の実際の所有者が誰であるかが不明確になる可能性
- 契約作成時にどの user_id/company_id を使用するかの判断が曖昧

### 🔧 推奨アクション

1. QuoteResponse にユーザー登録が完了した際、Quote を同期する Listener/Observer を実装
2. 設計仕様を文書化（Quote の所有者はいつ、どのように確定するのか）
3. 必要に応じてマイグレーションで歴史的データを修正
