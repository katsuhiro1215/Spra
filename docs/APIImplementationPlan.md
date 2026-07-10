# API 実装計画

## 概要

公開 API システムを構築し、複数のリソース（Contact, Quote, Schedule, News, Calendar, Project, Invoice）に対して一元的な流入源追跡と権限管理を実施する。

## アーキテクチャ

### 1. テーブル構成

#### Sources テーブル（マスタ）

```sql
sources:
  - id (ULID)
  - name (ex: "WordPress API", "モバイルアプリ")
  - type (enum: 'public', 'api', 'user', 'internal')
  - api_client_id (nullable FK to api_clients)
  - metadata (JSON: { platform, version, etc })
  - is_active (boolean)
  - created_at, updated_at
```

#### APIClients テーブル

```sql
api_clients:
  - id (ULID)
  - name (ex: "WordPress Site A", "Mobile App v1")
  - slug (unique, machine name)
  - api_key (hashed/encrypted)
  - secret_key (hashed/encrypted) [optional]
  - permissions (JSON array) [deprecated - use Laravel Permission]
  - webhook_url (nullable)
  - rate_limit (int: requests per minute)
  - ip_whitelist (JSON array: ['192.168.1.1', ...])
  - guard_name = 'api_client'
  - is_active (boolean)
  - last_used_at (datetime, nullable)
  - created_by (FK to admins)
  - created_at, updated_at
```

#### APILogs テーブル

```sql
api_logs:
  - id (ULID)
  - api_client_id (FK)
  - endpoint (ex: '/api/v1/contacts')
  - method (GET, POST, PUT, DELETE)
  - status_code (200, 400, 401, 403, 404, 429, 500)
  - request_body (JSON)
  - response_body (JSON)
  - ip_address
  - user_agent
  - created_at
```

#### リソーステーブル修正

```php
// contacts, quotes, schedules, news, calendars, projects, invoices テーブル
source_id (nullable FK to sources)      // 流入源追跡
api_client_id (nullable FK to api_clients)  // API経由の場合
```

### 2. 権限管理（Laravel Permission）

#### Guard 設定

```php
// config/auth.php
'guards' => [
    'web' => ['driver' => 'session', 'provider' => 'users'],
    'admin' => ['driver' => 'session', 'provider' => 'admins'],
    'api_client' => ['driver' => 'token', 'provider' => 'api_clients'],
]

'providers' => [
    'api_clients' => [
        'driver' => 'eloquent',
        'model' => \App\Models\APIClient::class,
    ],
]
```

#### ロール & パーミッション設計

**ロール：**

- `api_public_contact` → Contactのみ作成可
- `api_quote_integration` → Quote関連リソース
- `api_schedule_integration` → Schedule関連リソース
- `api_full_access` → すべてのエンドポイント

**パーミッション：**

- `contacts.create`, `contacts.read`, `contacts.update`
- `quotes.create`, `quotes.read`, `quotes.update`
- `schedules.create`, `schedules.read`
- ... 各リソースごと

#### APIClient モデル

```php
class APIClient extends Model {
    use HasRoles, HasPermissions;
    protected $guard_name = 'api_client';

    // 権限チェック例
    $apiClient->hasPermissionTo('contacts.create');
    $apiClient->hasRole('api_public_contact');
}
```

### 3. API エンドポイント

```
Base URL: /api/v1

Public Endpoints:
  POST   /api/v1/contacts       // source_id, api_client_id 自動設定
  POST   /api/v1/quotes
  POST   /api/v1/schedules
  POST   /api/v1/news
  GET    /api/v1/calendars
  POST   /api/v1/projects
  POST   /api/v1/invoices

認証:
  Header: Authorization: Bearer {api_key}
  または Query: ?api_key={api_key}
```

### 4. 認証ミドルウェア

```php
// middleware/AuthorizeAPIClient.php
Route::middleware('auth.api_client')
     ->middleware('permission:contacts.create')
     ->post('/api/v1/contacts', [ContactApiController::class, 'store']);
```

**処理フロー：**

1. API Key をヘッダー/クエリから取得
2. APIClient テーブルから検索
3. レート制限チェック
4. IP ホワイトリストチェック
5. パーミッション確認
6. リクエスト処理 → source_id, api_client_id を自動設定
7. APILog 記録

### 5. WordPress 統合コード生成

Admin 画面で以下を自動生成：

```html
<!-- WordPress プラグイン用コード -->
<script>
    const SPRA_API_KEY = "sk_xxxx...";
    const SPRA_API_ENDPOINT = "https://spra.example.com/api/v1";

    // Contact送信フォーム
    async function submitContact(data) {
        const response = await fetch(`${SPRA_API_ENDPOINT}/contacts`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${SPRA_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        return await response.json();
    }
</script>
```

### 6. 分析・ダッシュボード

#### 統一された source_id による分析

```sql
-- 流入源ごとのお問い合わせ
SELECT sources.name, COUNT(contacts.id) as count
FROM contacts
JOIN sources ON contacts.source_id = sources.id
GROUP BY sources.id

-- 流入源ごとの見積から契約率
SELECT sources.name,
       COUNT(quotes.id) as quote_count,
       COUNT(CASE WHEN contracts.status = 'signed' THEN 1 END) as signed_count,
       (COUNT(CASE WHEN contracts.status = 'signed' THEN 1 END) / COUNT(quotes.id) * 100) as conversion_rate
FROM sources
LEFT JOIN quotes ON quotes.source_id = sources.id
LEFT JOIN contracts ON quotes.id = contracts.quote_id
GROUP BY sources.id

-- 売上分析
SELECT sources.name, SUM(invoices.total) as revenue
FROM sources
LEFT JOIN invoices ON invoices.source_id = sources.id
WHERE invoices.status = 'paid'
GROUP BY sources.id
```

## 実装順序（優先度）

### ✅ Phase 1: 基盤構築（現在）

1. **ContactCategory 作成** ← NOW
2. Contact 修正（category → category_id）
3. Sources テーブル・モデル作成
4. APIClient テーブル・モデル作成
5. Laravel Permission 統合設定

### 🔄 Phase 2: API 実装（後日）

6. API 認証ミドルウェア
7. Contact API エンドポイント（/api/v1/contacts）
8. APILog 記録機能
9. レート制限・IP ホワイトリスト機能

### 📊 Phase 3: 管理画面・分析（最後）

10. APIClient CRUD 管理画面
11. API Logs 監視画面
12. WordPress 統合コード生成画面
13. 流入源分析ダッシュボード
14. 他リソース（Quote, Schedule 等）への source_id 追加

## データフロー例

```
WordPress フォーム送信
    ↓
POST /api/v1/contacts
  Header: Authorization: Bearer sk_xxxxx
  Body: { name, email, category_id, subject, message }
    ↓
AuthorizeAPIClient Middleware
  1. API Key 検証
  2. API Client 取得
  3. パーミッション確認（contacts.create）
    ↓
ContactApiController@store
  1. バリデーション
  2. Source 取得 (api_client_id → sources.id)
  3. Contact 作成 (source_id, api_client_id 自動設定)
  4. APILog 記録
  5. レスポンス返却
    ↓
WordPress: JSON レスポンス受信
  { id, created_at, status: 'new', ... }
```

## 注意事項

- API Key は暗号化して保存（Illuminate\Encryption\Encrypter 使用）
- Secret Key は ハッシュ化（bcrypt）して保存
- レート制限は Redis キャッシュで管理
- APILog は監査目的のため完全に記録
- 本番環境では必ず HTTPS 使用
- CORS 設定で WordPress ドメインをホワイトリスト化

## 関連ファイル

- [ContactManagementImplementation.md](./ContactManagementImplementation.md)
- [PublicContactSubmissionGuide.md](./PublicContactSubmissionGuide.md)
