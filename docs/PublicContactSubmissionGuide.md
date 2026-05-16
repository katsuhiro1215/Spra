# Public側お問い合わせ送信機能の実装ガイド

## 概要

Publicサイトのお問い合わせフォームから送信されたデータを処理し、データベースに保存、メール通知を行う機能を実装しました。

## 実装内容

### 1. FormRequest（バリデーション）

#### StoreContactRequest

**ファイル**: `app/Http/Requests/StoreContactRequest.php`

お問い合わせフォームのバリデーションルールを定義：

```php
[
    'name' => ['required', 'string', 'max:255'],
    'email' => ['required', 'email', 'max:255'],
    'phone' => ['nullable', 'string', 'max:20'],
    'company' => ['nullable', 'string', 'max:255'],
    'subject' => ['required', 'string', 'max:255'],
    'message' => ['required', 'string', 'max:5000'],
]
```

**特徴**:

- 公開フォームなので `authorize()` は常に `true`
- 日本語のカスタムメッセージ
- 必須項目: 名前、メールアドレス、件名、お問い合わせ内容
- 任意項目: 電話番号、会社名

### 2. Public用Controller

#### ContactController

**ファイル**: `app/Http/Controllers/ContactController.php`

Public側のお問い合わせ処理を担当：

**主な機能**:

1. **データ保存**
    - バリデーション済みデータを取得
    - トラッキング情報を追加（source, ip, user_agent, referrer）
    - ContactServiceを使用してデータベースに保存

2. **メール送信**
    - お客様への自動返信メール
    - 管理者への通知メール
    - エラー時もログに記録し、処理を継続

3. **エラーハンドリング**
    - try-catchでエラーをキャッチ
    - ログに詳細を記録
    - ユーザーにわかりやすいメッセージを表示

**送信データ**:

```php
[
    'name' => 'お名前',
    'email' => 'メールアドレス',
    'phone' => '電話番号（任意）',
    'company' => '会社名（任意）',
    'subject' => '件名',
    'message' => 'お問い合わせ内容',
    'status' => 'new',  // 固定値
    'source' => 'web',  // 固定値
    'ip' => 'IPアドレス',
    'user_agent' => 'ユーザーエージェント',
    'referrer' => 'リファラーURL',
]
```

### 3. メール機能

#### ContactReceivedMail（お客様宛て自動返信）

**ファイル**: `app/Mail/ContactReceivedMail.php`

お問い合わせを受け付けたことを確認するメール。

**内容**:

- 件名: 「お問い合わせを受け付けました - {アプリ名}」
- お問い合わせ内容の確認
- 2営業日以内に返信する旨の案内

#### ContactNotificationMail（管理者宛て通知）

**ファイル**: `app/Mail/ContactNotificationMail.php`

管理者に新しいお問い合わせを通知するメール。

**内容**:

- 件名: 「【新規お問い合わせ】{お問い合わせ件名} - {アプリ名}」
- お問い合わせの詳細情報
- トラッキング情報（source, ip, referrer）
- 管理画面へのリンクボタン

### 4. メールテンプレート（Markdown）

#### お客様宛て自動返信

**ファイル**: `resources/views/emails/contact/received.blade.php`

```blade
@component('mail::message')
# お問い合わせを受け付けました

{{ $contact->name }} 様

お問い合わせいただき、誠にありがとうございます。
担当者より2営業日以内にご返信させていただきます。

【お問い合わせ内容】
- お名前: {{ $contact->name }}
- メールアドレス: {{ $contact->email }}
- 件名: {{ $contact->subject }}
- お問い合わせ内容: {{ $contact->message }}

@endcomponent
```

#### 管理者宛て通知

**ファイル**: `resources/views/emails/contact/notification.blade.php`

```blade
@component('mail::message')
# 新規お問い合わせが届きました

【基本情報】
- お問い合わせID: {{ $contact->id }}
- 受信日時: {{ $contact->created_at->format('Y年m月d日 H:i') }}
- お名前: {{ $contact->name }}
- 件名: {{ $contact->subject }}

【トラッキング情報】
- ソース: {{ $contact->source }}
- IPアドレス: {{ $contact->ip }}

@component('mail::button', ['url' => route('admin.homepage.contacts.show', $contact->id)])
お問い合わせを確認する
@endcomponent

@endcomponent
```

### 5. ルート定義

#### web.php

**ファイル**: `routes/web.php`

Public routesグループに追加：

```php
use App\Http\Controllers\ContactController;

Route::name('public.')->prefix('/')->group(function () {
    // 既存のルート...
    Route::get('/contact', fn() => inertiaPublic('Contact'))->name('contact');
    Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');
});
```

### 6. フロントエンド（Contact.jsx）

#### フォーム送信処理

**ファイル**: `resources/js/Pages/Public/Contact.jsx`

**変更点**:

1. **usePage()の追加**:

```jsx
const { flash } = usePage().props;
```

2. **route()ヘルパーの使用**:

```jsx
post(route("public.contact.store"), {
    onSuccess: () => {
        reset();
    },
});
```

3. **フラッシュメッセージの表示**:

```jsx
{
    flash?.success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4">
            <CheckCircleIcon className="h-6 w-6 text-green-600" />
            <h4 className="text-green-800 font-semibold">送信完了</h4>
            <p className="text-green-700 text-sm">{flash.success}</p>
        </div>
    );
}

{
    flash?.error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
            <ExclamationCircleIcon className="h-6 w-6 text-red-600" />
            <h4 className="text-red-800 font-semibold">エラー</h4>
            <p className="text-red-700 text-sm">{flash.error}</p>
        </div>
    );
}
```

### 7. ContactService の修正

#### ContactService

**ファイル**: `app/Services/ContactService.php`

`createContact()`メソッドを修正し、全てのフィールドを保存できるように：

```php
public function createContact(array $data): Contact
{
    return DB::transaction(function () use ($data) {
        // $dataをそのまま渡す（トラッキング情報を含む）
        $contact = $this->repository->create($data);

        Log::info('New contact created: ' . $contact->id);

        return $contact;
    });
}
```

### 8. 設定ファイル

#### config/mail.php

管理者メールアドレスの設定を追加：

```php
'admin_address' => env('MAIL_ADMIN_ADDRESS', 'admin@example.com'),
```

### 9. 環境変数（.env）

以下の環境変数を設定してください：

```env
# メール設定
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_username
MAIL_PASSWORD=your_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@example.com
MAIL_FROM_NAME="${APP_NAME}"

# 管理者メールアドレス（お問い合わせ通知先）
MAIL_ADMIN_ADDRESS=admin@example.com
```

## データフロー

```
1. ユーザーがフォームに入力
    ↓
2. Contact.jsx → post(route("public.contact.store"))
    ↓
3. web.php → ContactController@store
    ↓
4. StoreContactRequest でバリデーション
    ↓
5. トラッキング情報を追加
    ↓
6. ContactService → ContactRepository → データベースに保存
    ↓
7. メール送信（2通）
   - お客様への自動返信
   - 管理者への通知
    ↓
8. フラッシュメッセージで結果を表示
    ↓
9. Admin管理画面のベル通知に未読件数+1
```

## テスト方法

### 1. ローカル環境でのテスト

#### Mailtrapを使用する場合

```bash
# .envを設定
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_mailtrap_username
MAIL_PASSWORD=your_mailtrap_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@example.com
MAIL_FROM_NAME="SmartSprouts"
MAIL_ADMIN_ADDRESS=admin@example.com
```

#### Logドライバーを使用する場合

```bash
# .envを設定
MAIL_MAILER=log
MAIL_LOG_CHANNEL=stack
```

メールは `storage/logs/laravel.log` に出力されます。

### 2. 動作確認手順

1. **フォームアクセス**

    ```
    http://localhost/contact
    ```

2. **フォーム入力**
    - お名前: テスト太郎
    - メールアドレス: test@example.com
    - 電話番号: 03-1234-5678（任意）
    - 会社名: テスト株式会社（任意）
    - 件名: テスト送信
    - お問い合わせ内容: これはテストです。

3. **送信ボタンをクリック**

4. **確認事項**
    - ✅ 緑色の成功メッセージが表示される
    - ✅ フォームがリセットされる
    - ✅ データベースに保存される（contactsテーブル）
    - ✅ メールが送信される（2通）
    - ✅ Admin管理画面のベル通知が+1される

### 3. データベース確認

```bash
# Tinkerで確認
php artisan tinker

# 最新のお問い合わせを取得
$contact = \App\Models\Contact::latest()->first();

# 内容を確認
$contact->toArray();

# 未読件数を確認
\App\Models\Contact::where('status', 'new')->count();
```

### 4. ログ確認

```bash
# Laravel Log
tail -f storage/logs/laravel.log

# お問い合わせ作成のログ
# "New contact created: {id}"

# メール送信失敗時のログ
# "自動返信メール送信失敗: ..."
# "管理者通知メール送信失敗: ..."
```

## エラーハンドリング

### メール送信失敗時

メール送信が失敗しても、お問い合わせデータの保存は成功します：

- お客様への自動返信失敗 → 警告ログ出力、処理継続
- 管理者への通知失敗 → 警告ログ出力、処理継続
- データ保存失敗 → エラーメッセージ表示、ログ出力

### バリデーションエラー時

フォーム下にエラーメッセージが表示されます：

```
お名前を入力してください。
メールアドレスを入力してください。
有効なメールアドレスを入力してください。
```

## セキュリティ対策

### CSRFトークン

Inertia.jsが自動的にCSRFトークンを送信します。

### バリデーション

- 最大文字数制限
- メールアドレス形式チェック
- XSS対策（自動エスケープ）

### レート制限

必要に応じて追加：

```php
// routes/web.php
Route::post('/contact', [ContactController::class, 'store'])
    ->middleware('throttle:5,1')  // 1分間に5回まで
    ->name('contact.store');
```

## 今後の拡張案

### 1. reCAPTCHA導入

スパム対策として：

```bash
composer require google/recaptcha
```

### 2. ファイル添付機能

お問い合わせにファイルを添付：

```php
'attachments' => ['nullable', 'array', 'max:3'],
'attachments.*' => ['file', 'max:10240'], // 10MB
```

### 3. カテゴリ選択

お問い合わせの種類を選択：

```jsx
<select name="category">
    <option value="general">一般的なお問い合わせ</option>
    <option value="sales">営業・見積もり</option>
    <option value="support">サポート</option>
    <option value="recruitment">採用</option>
</select>
```

### 4. 自動応答機能

特定のキーワードに対して自動返信：

```php
if (str_contains($contact->message, '料金')) {
    // 料金表を添付して返信
}
```

### 5. Slack通知

管理者へリアルタイム通知：

```php
use Illuminate\Support\Facades\Notification;
use App\Notifications\NewContactNotification;

Notification::route('slack', env('SLACK_WEBHOOK_URL'))
    ->notify(new NewContactNotification($contact));
```

## トラブルシューティング

### メールが送信されない

1. **.envの確認**

    ```bash
    php artisan config:clear
    php artisan cache:clear
    ```

2. **Mailtrapの確認**
    - ユーザー名とパスワードが正しいか
    - ポート番号が2525か

3. **ログの確認**
    ```bash
    tail -f storage/logs/laravel.log
    ```

### データが保存されない

1. **マイグレーション確認**

    ```bash
    php artisan migrate:status
    ```

2. **fillableの確認**
    - Contactモデルに全フィールドが含まれているか

3. **バリデーションエラー**
    - ブラウザの開発者ツールでネットワークタブを確認

### 通知件数が更新されない

1. **キャッシュクリア**

    ```bash
    php artisan cache:clear
    php artisan config:clear
    ```

2. **ブラウザリロード**
    - ハードリロード（Cmd+Shift+R / Ctrl+Shift+R）

## まとめ

✅ 実装完了：

- FormRequest（バリデーション）
- Public用ContactController
- メール機能（2種類）
- メールテンプレート（Markdown）
- ルート定義
- Contact.jsx修正（フラッシュメッセージ表示）
- ContactService修正
- 設定ファイル（admin_address）

この実装により、Publicサイトから安全にお問い合わせを受け付け、データベースに保存し、関係者へメール通知する機能が完成しました。
