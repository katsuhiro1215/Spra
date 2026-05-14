# お問い合わせ機能の実装ガイド

## 概要

お客様からのお問い合わせを受付・管理する機能を実装しました。お問い合わせがあると、Admin管理画面のベル通知に未読件数が表示されます。

## 実装内容

### 1. テストデータ（Seeder）

#### ContactSeeder

**ファイル**: `database/seeders/ContactSeeder.php`

様々なパターンのお問い合わせデータを作成します：

1. **新規Webサイト制作の相談**（新規・Web流入）
2. **既存サイトのリニューアル**（進行中・電話問い合わせ）
3. **ECサイト構築**（返信済み・SNS流入）
4. **保守・運用の相談**（クローズ済み・紹介）
5. **システム開発**（新規・メール問い合わせ）
6. **技術相談**（進行中・Web流入）
7. **採用に関する問い合わせ**（新規・Web流入）
8. **一般的な問い合わせ**（新規・Web流入）
9. **緊急の問い合わせ**（新規・電話）
10. **見積もり依頼**（新規・その他）

#### データ構造

```php
[
    'name' => 'お名前',
    'email' => 'メールアドレス',
    'phone' => '電話番号',
    'company' => '会社名',
    'subject' => '件名',
    'message' => 'お問い合わせ内容',
    'status' => 'new|in_progress|replied|closed',
    'source' => 'web|phone|email|sns|referral|other',
    'ip' => 'IPアドレス',
    'user_agent' => 'ユーザーエージェント',
    'referrer' => 'リファラーURL',
    'replied_at' => '返信日時（任意）',
    'admin_notes' => '管理者メモ（任意）',
]
```

### 2. Repository層の拡張

#### ContactRepositoryInterface

**ファイル**: `app/Repositories/Contracts/ContactRepositoryInterface.php`

未読件数取得メソッドを追加：

```php
public function getUnreadCount(): int;
```

#### ContactRepository

**ファイル**: `app/Repositories/ContactRepository.php`

実装を追加：

```php
/**
 * 未読お問い合わせ件数を取得
 *
 * @return int
 */
public function getUnreadCount(): int
{
    return Contact::where('status', 'new')->count();
}
```

### 3. Service層の拡張

#### ContactService

**ファイル**: `app/Services/ContactService.php`

未読件数取得メソッドを追加：

```php
/**
 * 未読お問い合わせ件数を取得
 *
 * @return int
 */
public function getUnreadCount(): int
{
    return $this->repository->getUnreadCount();
}
```

### 4. グローバルデータ共有

#### HandleInertiaRequests

**ファイル**: `app/Http/Middleware/HandleInertiaRequests.php`

全ページで未読件数を利用可能にします：

```php
use App\Services\ContactService;

public function share(Request $request): array
{
    $admin = $request->user('admins');

    return [
        ...parent::share($request),
        'auth' => [
            'user' => $request->user(),
            'admin' => $admin,
        ],
        'notifications' => [
            'unreadContacts' => $admin ? app(ContactService::class)->getUnreadCount() : 0,
        ],
        // ... その他
    ];
}
```

**ポイント**:

- Admin認証時のみ未読件数を取得
- パフォーマンスを考慮し、必要な時のみクエリ実行

### 5. UI実装（通知機能）

#### AdminHeader

**ファイル**: `resources/js/Layouts/Admin/AdminHeader.jsx`

ベル通知アイコンに未読件数を表示：

```jsx
export default function AdminHeader({ sidebarOpen, setSidebarOpen }) {
    const { props } = usePage();
    const admin = props.auth?.admin;
    const unreadContacts = props.notifications?.unreadContacts || 0;

    return (
        // ...
        <Dropdown>
            <Dropdown.Trigger>
                <button className="relative p-2 ...">
                    <BellIcon className="h-6 w-6" />
                    {/* 未読件数バッジ */}
                    {unreadContacts > 0 && (
                        <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold">
                            {unreadContacts > 9 ? "9+" : unreadContacts}
                        </span>
                    )}
                </button>
            </Dropdown.Trigger>
            <Dropdown.Content>
                {unreadContacts > 0 ? (
                    <a href={route("admin.homepage.contacts.index")}>
                        <p>未読お問い合わせ</p>
                        <p>{unreadContacts}件の新しいお問い合わせ</p>
                    </a>
                ) : (
                    <p>未読通知はありません</p>
                )}
            </Dropdown.Content>
        </Dropdown>
    );
}
```

**UI機能**:

- 未読件数が0の場合は赤いバッジを非表示
- 件数が10件以上の場合は「9+」と表示
- クリックでお問い合わせ一覧ページへ遷移
- ダークモード対応

## ビジネスフロー

お問い合わせから契約・開発・保守までの流れ：

```
1. Contact（お問い合わせ）
    ↓
2. Response（返答）
    ↓
3. Quote（見積もり）
    ↓
4. Contract（契約）
    ↓
5. Deposit Payment（着手金支払い）
    ↓
6. Development Start（開発開始）
    ↓
7. Progress Reporting（進捗報告）
    ↓
8. Review / Testing（レビュー・テスト）
    ↓
9. Final Payment（最終支払い）
    ↓
10. Release（リリース）
    ↓
11. Maintenance / Operation（保守・運用）
```

## 使用方法

### Seederの実行

テストデータを作成：

```bash
# データベースリフレッシュ＋Seeder実行
php artisan migrate:fresh --seed

# ContactSeederのみ実行
php artisan db:seed --class=ContactSeeder
```

### 未読件数の確認

AdminHeaderのベル通知アイコンを確認してください：

- **赤いバッジ**: 未読件数あり
- **バッジなし**: 未読なし
- **クリック**: お問い合わせ一覧へ遷移

### お問い合わせの管理

Admin管理画面から：

1. **一覧表示**: `/admin/homepage/contacts`
2. **フィルタ機能**:
    - ステータス（new, in_progress, replied, closed）
    - 流入元（web, phone, email, sns, referral, other）
    - カテゴリ
    - 検索（名前、メール、会社名、件名）
3. **一括操作**:
    - ステータス変更
    - 担当者割り当て
4. **統計情報**:
    - 総件数
    - 新規
    - 対応中
    - 解決済み
    - 7日以内の問い合わせ

## お問い合わせステータス

| ステータス    | 説明           | 色  |
| ------------- | -------------- | --- |
| `new`         | 新規（未対応） | 青  |
| `in_progress` | 対応中         | 黄  |
| `replied`     | 返信済み       | 緑  |
| `closed`      | クローズ       | 灰  |

## お問い合わせ流入元

| 流入元     | 説明                         |
| ---------- | ---------------------------- |
| `web`      | Webサイトのフォーム          |
| `phone`    | 電話での問い合わせ           |
| `email`    | メールでの問い合わせ         |
| `sns`      | SNS（Instagram、Facebook等） |
| `referral` | 紹介                         |
| `other`    | その他                       |

## トラッキング情報

お問い合わせ時に以下の情報を自動記録：

- **source**: 流入元
- **ip**: 送信元IPアドレス
- **user_agent**: ブラウザ情報
- **referrer**: 流入元URL（GoogleやSNS等）

これによりマーケティング分析が可能になります。

## 次のステップ

### Response（返答）機能の実装

お問い合わせへの返答機能：

1. 返答テンプレート管理
2. メール送信機能
3. 返答履歴管理
4. 自動返信機能

### Quote（見積もり）機能の実装

見積書作成・管理機能：

1. 見積書テンプレート
2. 見積項目管理
3. PDF出力
4. 承認ワークフロー

### 通知機能の拡張

1. リアルタイム通知（Laravel Echo + Pusher）
2. メール通知（Admin宛て）
3. Slack連携
4. 通知設定（個別ON/OFF）

## パフォーマンス考慮事項

### 未読件数の取得

現在の実装では、各ページロード時に未読件数をクエリしています。

**最適化案**:

1. **キャッシュの利用**:

```php
public function getUnreadCount(): int
{
    return Cache::remember('contacts.unread.count', 60, function () {
        return Contact::where('status', 'new')->count();
    });
}
```

2. **キャッシュクリア**:
   お問い合わせのステータス更新時にキャッシュをクリア：

```php
Cache::forget('contacts.unread.count');
```

3. **イベント駆動**:
   ContactStatusUpdatedイベントを発火し、キャッシュを更新

## トラブルシューティング

### 未読件数が表示されない

1. **Admin認証を確認**:

```php
// HandleInertiaRequests.php
$admin = $request->user('admins');  // nullでないか確認
```

2. **Seederが実行されているか確認**:

```bash
php artisan db:seed --class=ContactSeeder
```

3. **ブラウザコンソールでpropsを確認**:

```javascript
console.log(usePage().props.notifications.unreadContacts);
```

### Seeder実行時のエラー

**ULID関連のエラー**:

```bash
# Contactモデルで HasUlid trait が使われているか確認
use App\Models\Concerns\HasUlid;
```

## まとめ

✅ 実装完了：

- ContactSeeder（10パターン）
- 未読件数取得機能（Repository/Service層）
- グローバルデータ共有（Inertia Middleware）
- ベル通知UI（AdminHeader）

🔄 次の実装：

- Response（返答）機能
- Quote（見積もり）機能
- Contract（契約）機能
- その他ビジネスフローに沿った機能

この実装により、お客様からのお問い合わせを効率的に管理し、迅速に対応できる仕組みが整いました。
