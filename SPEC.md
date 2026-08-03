# SPEC.md — Spra 中央管理システム 仕様書

最終更新: 2026-08-03

## 1. はじめに

本書は Spra（中央管理システム）の全体像を新規参加者・将来のPM/開発者向けにまとめた仕様書である。このリポジトリのドキュメントは以下の4層構造になっている。

| ドキュメント | 役割 |
|---|---|
| **SPEC.md**（本書） | システム全体像・ドメイン仕様サマリ・非機能要件・既知の課題一覧 |
| **docs/ 配下（12本）** | 各機能の実装詳細ガイド（本書からリンクする。§9参照） |
| **TASKS.md** | 今やるべきこと（フェーズ1: 1ヶ月必達MVP／フェーズ2: 継続タスク） |
| **CLAUDE.md** | AIエージェント（Claude Code）がこのリポジトリで作業する際の規約 |

**更新ルール**: 仕様に影響する変更を行った場合は、同じPRでSPEC.mdの該当セクションも更新すること。`docs/` 配下の既存ガイドは実装当時の記述のまま更新されていないことがあるため、**本書および docs/ の記述より、常に実際のコードを優先して確認する**（詳細は §7）。

## 2. システム概要・事業背景

Spra は、以下2つの事業ドメインを1つのシステムで管理する。

1. **クライアント企業向け受託契約・プロジェクト管理**: 問い合わせ・見積もり・契約・プロジェクト（納品）・請求までを一気通貫で管理する。事業内容としてはWeb制作・システム開発の受託（SES的な性質を含む）を行う会社が、顧客企業との契約とプロジェクト進行を管理するための業務システムである。
2. **自社Webサイトの管理（CMS）**: 自社の企業サイト（会社概要・ブログ・FAQ・お問い合わせ等）を管理する。**クライアント企業のWebサイト自体をホスティング・保守する機能ではない**（誤解しやすいポイント）。

これに加えて、**Atlas** という会員制サブプロダクト（富裕層向けコンシェルジュ的サービス、専用サブドメインで配信）が同一システム内に存在する。

### 利用者ロール

| ガード | 利用者 | 説明 |
|---|---|---|
| `admins` | 自社スタッフ | `owner` / `super_admin` / `admin` / `editor` / `viewer` の5ロール（Spatie Permissionで実権限管理、`Admin::ROLES`定数参照） |
| `users` | クライアント企業側の担当者 | 見積回答・契約閲覧・署名・プロジェクト確認・請求書確認等を行う |
| （未認証） | 見込み客・一般訪問者 | 公開サイト閲覧、問い合わせ・見積依頼・予約・Atlas申込み等 |

### 現在の完成度

- 約8割完成。**開発環境のみで稼働中、本番未リリース（実データなし）**。
- そのため、破壊的なスキーマ変更・データ初期化は現時点では自由に行える（TASKS.mdフェーズ1で本番リリースを予定しているため、リリース後は方針が変わる）。
- リポジトリ名は `Spra`。正式なプロダクト名・`APP_NAME`は `composer.json`/`.env` 上まだ `Laravel` のままで未確定（TASKS.mdフェーズ2で統一予定、§7参照）。

## 3. アーキテクチャ全体像

### 技術スタック

**バックエンド**
- Laravel 12（PHP ^8.2）
- Inertia.js v2（`inertiajs/inertia-laravel`）— Blade主体ではなく、Reactにリクエスト/レスポンスを橋渡し
- 認証・認可: Laravel Sanctum、Spatie Laravel Permission（ロール/権限）、pragmarx/google2fa（TOTP 2FA）
- キュー/スケジューラ: Laravel Horizon（Redisバックエンド、`/admin/horizon`、owner/super_admin限定）、`routes/console.php` によるスケジュール定義
- 文書生成: dompdf / snappy / mpdf / tcpdf が機能ごとに混在（契約書・請求書・領収書・プロジェクト仕様書）
- Excel出力: maatwebsite/excel。QRコード: bacon/bacon-qr-code。画像処理: intervention/image
- 開発環境: Laravel Sail（`compose.yaml`: app + MySQL + phpMyAdmin + Redis）

**フロントエンド**
- React 18 + Inertia Reactアダプタ、Vite、Tailwind CSS 3
- 主要ライブラリ: `@dnd-kit`（ガントチャート等のドラッグ&ドロップ）、`@tinymce/tinymce-react`（リッチテキスト）、`gsap`、`mermaid`、`japanmap`/`yubinbango-core2`（住所・郵便番号）、`react-signature-canvas`（契約電子署名）
- Blade は `resources/views/emails/`・`pdfs/`・`contracts/`・`project_documents/` の生成専用（画面UIには使わない）

**インフラ**
- 開発: Docker（Laravel Sail）
- 本番: AWS Lightsail（VM）+ Docker Compose、コスト最小構成（MySQLもコンテナ内運用）。詳細は `docs/ProductionDeploymentGuide.md`、TASKS.mdフェーズ1で構築予定

### ディレクトリ構成の要点

```
app/Http/Controllers/{Admin,User,Public,Atlas,Api}/  — ガード・公開範囲別に分離
app/Repositories/ + app/Repositories/Contracts/       — データアクセス層（BaseRepository移行中、§7参照）
app/Services/                                          — ビジネスロジック層（BaseService移行中）
app/Models/                                            — 約100モデル
resources/js/Pages/{Admin,User,Public,Atlas}/          — Inertiaページ（ルート構成とほぼ1:1対応）
resources/js/Components/                               — 共有UIキット（docs/ComponentsStructureGuide.md参照）
docs/                                                  — 実装詳細ガイド12本（§9参照）
```

### ドメイン間データフロー

```
Contact（問い合わせ） / EstimateSimulator（概算見積もり）
   ↓
Quote（見積もり、status: draft→negotiating→approved/rejected→contracted、cancelled）
   ↓
QuoteResponse（クライアントがトークン付き公開ページで回答）
   ↓ response_type='request' の場合、招待メール自動送信
本登録（User作成 status=pending、Company作成 status=pending）
   ↓
Admin Onboarding承認（Admin\OnboardingController::approve/reject）
   ↓
Contract（バージョン/明細/電子署名/特典チケット、status: draft→pending_signature→active→suspended/completed/cancelled）
   ↓
Project（バージョン/マイルストーン/アイテム/ガントチャート）
   ↓
Invoice（status: draft→sent→viewed→paid、または overdue/cancelled）→ Payment → Receipt

横断的なドメイン: Points/CompanyMembership/MembershipRank、自社サイトCMS（Page/Section/Post/Menu/Faq）、
Media（画像アップロード＋バリアント自動生成）、Analytics（Search Console連携含む）
```

### Atlas サブドメイン構成

- `config('app.atlas_domain')` によるサブドメイン配信（ローカルは `atlas.localhost:8000`）。メインサイトとは**セッションを共有しない**独立したログイン導線（`Atlas\Auth\*`）。
- `AtlasMembership`（brand: `concierge`/`life`/`japan`、status: `pending`/`active`/`paused`/`revoked`）と `AtlasInviteCode`（使い切り・失効可能な10桁招待コード）で会員登録を制御。
- 公開の「/apply」申込みフォームは未実装（現状 `Public/AtlasComingSoon` を表示するのみ）。TASKS.mdフェーズ1で実装予定（審査・承認・課金プランは対象外、申込み受付のみ）。

## 4. 認証・権限モデル

- `config/auth.php` に `users`（デフォルトガード）・`admins` の2ガード。未ログインは実質ゲスト扱い。
- 新規実装では **必ずどちらのガードかを明示**すること（`auth('admins')`/`auth('users')`）。ガード名の取り違えは実際にバグの原因になっている（§7・TASKS.md参照）。
- Spatie Permission: `Admin::ROLES` = `owner`（オーナー）/ `super_admin`（スーパー管理者）/ `admin`（管理者）/ `editor`（編集者）/ `viewer`（閲覧者）。`owner`/`super_admin` は個別制限の対象外、それ以外（`Admin::RESTRICTABLE_ROLES`）は管理者ごとの個別権限上書きが可能。権限定義を変更したら `php artisan admin:sync-permissions` を実行すること。
- Google2FA（TOTP、またはメールOTP）を admins/users 双方に適用可能。ログインフロー（`AdminLoginRequest::authenticate()`）は資格情報検証と実ログイン(`Auth::guard('admins')->login()`)を分離しており、`two_factor_enabled`な管理者は`2fa_pending`セッションに保持されるだけで、2段階目のコード確認が完了するまでガードの認証状態にはならない（2FAバイパスの経路なし、2026-07-29検証済み）。
  - ただし**2FAは各管理者の任意設定（opt-in）であり、`owner`/`super_admin`を含めどのロールにも強制する仕組みは無い**。組織として2FAを必須にしたい場合は別途ポリシー・実装が必要（本書のスコープ外、要判断）。
- 管理画面の権限制御は`EnsureAdminPermission`ミドルウェア＋`config/admin_permissions.php`の`whitelist`（ダッシュボード・自分のプロフィール/セキュリティ設定・自分の勤怠打刻・通知既読等、ロールに関係なく安全な自己サービス系アクションのみ）で構成。権限管理画面自体（`permissions.index`/`permissions.update`等）はwhitelistで権限カタログ対象外にしつつ、`PermissionController`側で`abort_unless($admin->isSuperAdmin(), 403, ...)`により別途保護されていることを確認済み。
- Laravel Horizonダッシュボード（`/admin/horizon`）は `owner`/`super_admin` のみアクセス可能。

## 5. 主要ドメイン仕様サマリ

各ドメインの詳細な実装ガイドは `docs/` 配下を参照。ここでは目的・主要モデル・状態遷移の要点のみ記す。

### 5.1 Contact / Quote
- `Contact`（問い合わせ、`source`/IP/UTM等のトラッキング情報を保持）→ `Quote`（見積もり、`quote_number`自動採番）。
- `QuoteObserver`（`Quote`モデルに`#[ObservedBy]`属性で登録済み）は、`contact_id`のみを指定してQuoteを作成した場合（`Admin/Contact/Show.jsx`からの「見積もり作成」導線）に、Contactのメールアドレスと一致する既存Userを自動的に`user_id`/`company_id`へ紐付ける。

### 5.2 Onboarding（顧客登録承認）
- 詳細: `docs/OnboardingSystemGuide.md`
- `QuoteResponse::registerStore()` でUser（status=`pending`）とCompany（status=`pending`）を作成し、元のQuoteにもuser_id/company_idを同期する（`QuoteResponseController.php` L192-197 で実装済み）。
- 管理者が `Admin\OnboardingController::approve/reject` で承認・却下。**reject() は物理削除である**点に注意。

### 5.3 Contract（契約）
- `Contract`: `TYPES`（`one_time`一括払い / `monthly`月額 / `annual`年額）、`STATUSES`（`draft`下書き→`pending_signature`署名待ち→`active`契約中→`suspended`一時停止/`completed`完了/`cancelled`キャンセル）、`signature_status`（`pending`→`user_signed`/`admin_signed`→`fully_signed`）。
- バージョン管理（`ContractVersion`）・明細（`ContractItem`）・電子署名（`ContractSignature`、`react-signature-canvas`）・特典チケット（`ContractBenefit`/`ContractBenefitUsage`、予約で消費）・監査履歴（`ContractHistory`、`action`カラムは実運用で不足が発覚しVARCHAR化済み）。
- 月額契約は `Contract::shouldGenerateInvoice()` の条件（自動生成ON・type=monthly・status=active・次回請求日到来）を満たすと `GenerateMonthlyInvoices` コマンドで自動請求される。

### 5.4 Project（プロジェクト管理）
- 詳細: `docs/ProjectWorkflowGuide.md`
- Project作成時にVersion1が自動作成（`project_code`は`PRJ-YYYY-XXXXXXXX`形式で自動採番）。ContractItemからの取り込み・マイルストーン自動生成に対応。
- ガントチャートのドラッグ&ドロップ編集（日付・進捗）・並び替え・ファイルアップロード（`ProjectFile`、`private`ディスク保存）・ProjectUpdate作成フォームは**実装済み**（2026-07-30、フェーズ2 3.5完了）。

### 5.5 Invoice / Payment / Receipt（請求）
- `Invoice::STATUSES`: `draft`下書き→`sent`送付済み→`viewed`確認済み→`paid`支払済み、または`overdue`期限超過/`cancelled`キャンセル。`invoice_number`は`INV-00000001`形式で自動採番。
- 月次自動請求（`GenerateMonthlyInvoices`）・督促（`SendOverdueInvoiceReminders`）・下書き未送信分の送付（`SendPendingInvoices`）をバッチで実行。
- クライアントは `/invoice-payment/{token}` の公開ページから入金報告が可能。

### 5.6 Points / Membership
- `PointTransaction`/`PointRedemption`/`PointReward`/`PointCatalogItem`、`CompanyMembership`+`MembershipRank`（年間利用額に応じたランク自動再計算バッチあり）。

### 5.7 Website CMS（自社サイト管理）
- `Page`/`Section`（ブロックエディタ）/`Menu`/`MenuItem`/`Post`/`PostCategory`/`Faq`/`FaqCategory`/`SiteSetting`/`Portfolio`/`Voice`（お客様の声）/`Document`（利用規約・プライバシーポリシー等、バージョン管理・同意取得あり）。

### 5.8 Appointment（予約）
- 詳細: `docs/AppointmentSystemGuide.md`
- `ScheduleDefault`（曜日ごとの営業時間テンプレート）/`ScheduleException`/`Holiday`/`AppointmentSlot`/`Appointment`（status: `pending`/`confirmed`/`completed`/`cancelled`/`no_show`）。
- 繰り返し枠設定（`AppointmentSlotRecurrence`、曜日パターン→`AppointmentSlot`自動生成）・クライアント向け予約UI（`User/AppointmentController`）・カレンダー連携（`ScheduleController::calendar()`）は**実装済み**（2026-07-30、フェーズ2 3.5完了。クライアント向けUI・カレンダー連携は調査の結果既に実装済みだったと判明）。SMS通知・一括インポート/エクスポートは引き続き**未実装**（フェーズ2）。

### 5.9 Atlas
- §3参照。「/apply」フォーム実装がフェーズ1スコープ、審査・承認・課金プラン管理はスコープ外。
- **実装済み（2026-07-29）**: 既存の`Contact`テーブルを流用する方針を採用（新規モデルは作らない）。専用の`ContactCategory`（slug: `ContactCategory::SLUG_ATLAS_APPLY` = `atlas-apply`）を新設し、`source='atlas_apply'`で識別する。`Atlas\ApplicationController`（`atlas.apply`/`atlas.apply.store`）が`Public/AtlasApply.jsx`のフォームを処理し、既存の`ContactService::createContact()`/`sendNotificationEmails()`をそのまま呼び出すことで、通知メール（`ContactReceivedMail`/`ContactNotificationMail`）と管理画面（`Admin/Contact`）を追加実装なしで流用している。審査・承認・課金プランの管理機能は引き続き未実装（意図的にスコープ外）。

### 5.10 Media（メディア管理）
- `Media`（原本、S3/publicディスクURL）+ `MediaVariant`（Large/Medium/Small、WebP自動生成、`GenerateMediaVariantsJob`）+ `MediaSetting`（圧縮/サイズ上限の単一設定）。
- アップロードのMIME制限・認可ガード名に不整合があり是正予定（§7・TASKS.md参照）。

### 5.11 Analytics
- `AnalyticsDaily`/`AnalyticsDimension`/`AnalyticsEvent`/`AnalyticsKpi`/`AnalyticsReport`。Search Console連携は`SearchConsoleServiceInterface`経由（`config('services.search_console.driver')`で`dummy`/`google`を切替）。`google`は`GoogleSearchConsoleService`（サービスアカウントJWT認証）で実装済み、本番`.env`設定後の実データ取得確認はK15参照。

### 5.12 Task（Admin向けタスク管理）
- 詳細な実装ガイドは無く、本節がサマリを兼ねる。
- `TaskCategory`（`name`一意・`color`カラーコード・`sort_order`、ULID主体）と`Task`（ULID主体、`SoftDeletes`）の2テーブル構成。
- `Task::STATUSES` = `todo`（未着手）/`in_progress`（進行中）/`done`（完了）の3値、`Task::PRIORITIES` = `high`/`medium`/`low`の3値（いずれもenumカラム）。
- 担当者は`admin_id`（`admins`テーブル参照、単一担当のみ・共同担当は非対応）、作成者は`created_by`で別カラムに分離。カテゴリ（`task_category_id`、削除時`set null`）に加え、`tags`（JSON配列）で自由なタグ付けも可能。期限は`due_date`（必須）＋`due_time`（任意）。
- 繰り返しタスクは自己参照（`parent_task_id`）で表現する。`parent_task_id`が`null`かつ`recurrence_rule`（JSON、`freq`/`byweekday`等）が設定された行が「テンプレート行」、そこから生成される実体タスクは`parent_task_id`でテンプレートを参照し`recurrence_rule`は持たない（`Task::isRecurringTemplate()`で判定）。
- 管理画面UIは`/admin/task`（ルート名`admin.task.*`、`Route::resource('task', TaskController::class)`）。未着手/進行中/完了の3カラム固定のカンバンボード（`resources/js/Pages/Admin/Tasks/_components/TaskBoard.jsx`）で、`@dnd-kit`によるドラッグ&ドロップでステータス変更（`PATCH admin.task.status`）ができる。担当者・カテゴリ・優先度での絞り込みに対応（`TaskFilterBar.jsx`）。カテゴリマスタ管理は`/admin/task-category`（`admin.task-category.*`）。
- ダッシュボードの「今日やること」ウィジェット（`resources/js/Components/Tasks/TodayTaskList.jsx`）はログイン中Adminの本日期限タスクを表示、Admin詳細画面には「担当タスク」タブ（`resources/js/Pages/Admin/Admin/_components/AdminAssignedTasks.jsx`）でそのAdminが担当する全タスクを一覧表示する。
- バッチは2種類、いずれも`routes/console.php`でスケジュール登録済み。
  - `tasks:generate-recurring`（毎日06:10）: `TaskService::generateUpcomingOccurrences()`がテンプレート行を走査し、既定14日先までの実体タスクを未生成分のみ穴埋め生成する。
  - `tasks:send-reminders`（15分おき、デフォルト30分前）: `TaskService::getTasksNeedingReminder()`で本日期限・未完了・繰り返しテンプレート以外・`due_time`設定済みのタスクのうち期限が指定分数以内に迫っているものを抽出し、`TaskDueReminder`通知（`database`チャンネルのみ、キューワーカー不要の同期実行）を担当Adminへ送信する。
- スコープ外（意図的に見送り）: タスクへのコメント・添付ファイル、複数Admin共同担当、既存シフト/予約カレンダーとの統合表示、カスタムステータス列。TASKS.mdフェーズ2に候補として記載。

## 6. 非機能要件

### 6.1 セキュリティ・個人情報保護方針
- 扱う個人情報: 氏名・メールアドレス・電話番号・住所・契約金額・支払情報等。
- アクセス制御はガード（`admins`/`users`）+ Spatie権限で行う。ログ出力（`Log::info/error`等）に個人情報・パスワード・トークンをそのまま出力しないこと。2026-07-29時点で全165箇所を監査済み、問題は見つかっていない（構造化されたコンテキストのみを渡す一貫したパターン、DB保存の操作ログも`ActivityLogMiddleware::sanitizeRequestData()`で機密キーを`[FILTERED]`化済み）。今後新規に追加するログ出力でもこの方針を維持すること。
- 公開フォーム（問い合わせ・見積回答登録・入金報告等）にはレート制限（`throttle:5,1`）を設定する（設定済み、SPEC.md §7 K7参照）。
- ファイルアップロードはMIMEタイプ制限を必ず設ける（設定済み、SPEC.md §7 K6参照）。
- CORS（`config/cors.php`）は`allowed_origins`を自ドメインのみに限定済み（ワイルドカードなし）。対象は`api/*`・`sanctum/csrf-cookie`のみで、Inertiaの通常ページ遷移は対象外。本番では`APP_URL`を本番ドメインに設定すれば自動的に限定される。
- パスワードポリシー（2026-07-30強化、SPEC.md §7 K25参照）: `AppServiceProvider::boot()`で`Password::defaults()`を一元設定（12文字以上・英大小文字混在・数字必須、本番環境では漏洩済みパスワードチェック`uncompromised()`も実施）。`admins`/`users`/`atlas`いずれのガードの登録・パスワード変更もこの1箇所に集約されている。管理者・クライアント企業担当者アカウントを社内から作成する際の自動生成パスワード（`AdminService`/`UserService`）も`Str::password()`でこのポリシーを満たすよう生成する。
- 電子帳簿保存法・インボイス制度・電子署名法等の法令適合性は**本書のスコープ外**（ユーザー判断により明記しない方針）。

### 6.2 本番環境構成
- AWS Lightsail（VM）+ Docker Compose、コスト最小構成（MySQLもコンテナ内運用、RDS等マネージドサービスは使わない）。
- 詳細手順・費用注意点・チェックリストは `docs/ProductionDeploymentGuide.md` を参照（TASKS.mdフェーズ1でこの手順に沿って実施）。
- ドメインはXserverで管理継続、AレコードのみAWS側を指す（ネームサーバー移管なし）。

### 6.3 テスト方針
- 「リファクタリング・機能追加で触った箇所から順次テストを追加する」方針（一括での網羅的テスト整備は行わない）。
- 現状 `tests/` はLaravel Breezeの認証スキャフォールディング＋権限テスト（`PermissionEnforcementTest`）＋ロケールテストのみで、Contract/Invoice/Quote/Project/Appointment等の中核ビジネスロジックへの自動テストは無い。

### 6.4 バックアップ・運用
- 本番はDBダンプ（`mysqldump`）の定期取得、保持世代数を絞ってコストを抑える方針。
- Laravel HorizonダッシュボードでSequential/失敗ジョブを目視監視。
- AWS Budgetsで想定月額の1.5倍を超えたら通知するアラートを設定。

## 7. 既知の課題・技術的負債

**重要**: 以下の表は2026-07-29時点でコードを直接確認して検証済みの状態を記載している。`docs/` 配下の一部ガイドはこれより古い状態を記述しているため、今後この表と食い違うdocsの記述を見つけた場合は、コードを正としてdocsを修正すること。

| ID | 概要 | 現状ステータス | 対象フェーズ |
|---|---|---|---|
| K1 | Quote⇔QuoteResponseのuser_id/company_id同期 | **解消済み**（`QuoteResponseController.php` L192-197で実装済み、回帰テスト追加済み、`docs/QuoteUserCompanyIdAnalysis.md`に解消済みの旨を追記済み） | フェーズ1（完了） |
| K2 | Company.status enumに`pending`が無くonboarding承認をブロックする懸念 | **懸念は解消済み**（`pending`はenumに定義済み、`docs/OnboardingSystemGuide.md`の記述が誤り）。実地検証済み、docs訂正済み | フェーズ1（完了） |
| K3 | QuoteObserverが未登録のデッドコード | **修正済み**（2026-07-29）。`Admin/Contact/Show.jsx`から`contact_id`のみを渡してQuoteを作成する実際のUI導線があり、Observerのメール一致による自動User/Company紐付けは実用上必要と判断。`Quote`モデルに`#[ObservedBy(QuoteObserver::class)]`属性を追加して登録し、動作確認テストを追加 | フェーズ1（完了） |
| K4 | 下書き請求書が送信済みにならない | **2026-07-21付けで修正済み**（`docs/BatchAutomationOverview.md`に記載）。回帰防止テスト追加済み（`tests/Feature/Invoice/MonthlyInvoiceGenerationTest.php`） | フェーズ1（完了） |
| K5 | `UpdateMediaRequest::authorize()`が存在しないガード名`admin`（単数形）を参照 | **修正済み**（2026-07-29、`admins`に修正、回帰テスト追加） | フェーズ1（完了） |
| K6 | `UpdateMediaRequest`にMIMEタイプ制限が無い | **修正済み**（2026-07-29、`mimes:jpeg,jpg,png,gif,webp`を追加、回帰テスト追加） | フェーズ1（完了） |
| K7 | 公開フォーム（`contact.store`/`quote.response.store`/`quote.response.register.store`/`invoice.payment.store`）にthrottleが無い | **修正済み**（2026-07-29、全て`throttle:5,1`を追加、回帰テスト追加） | フェーズ1（完了） |
| K8 | `.env`に`MAIL_ADMIN_ADDRESS`が未設定 | **設定済み**（2026-07-29、`MAIL_FROM_ADDRESS`と同じ`info@katsucode.jp`。`.env`は追跡対象外のためコミットなし） | フェーズ1（完了） |
| K9 | Repository/Serviceの基盤クラス移行が未完了 | **解消済み**（2026-07-30）。Contract・Invoice・Payment・Projectを含む全エンティティの移行が完了。`docs/RepositoryServiceMigrationGuide.md`も更新済み | フェーズ2（完了） |
| K10 | 旧Button/CrudButtons→新Buttonコンポーネントへの統一が未完了 | 旧コンポーネント使用ファイルが多数残存（`docs/ButtonRefactoringGuide.md`参照） | フェーズ2 |
| K11 | `RichTextEditor.jsx`の重複 | **解消済み**（2026-07-30）。スタブへの参照がゼロだったことを確認し削除。実体の`Components/Forms/RichTextEditor.jsx`のみが残存 | フェーズ2（完了） |
| K12 | `ScheduleDefaultController`の未使用stub | **解消済み**（2026-07-30）。`routes/admin/schedule.php`で実際にルーティングされているのは`index`/`bulkUpdate`のみと確認し、未使用stub（create/store/show/edit/update/destroy）と、参照がなくなった`ScheduleDefaultRequest`を削除 | フェーズ2（完了） |
| K13 | アプリ名の不一致 | `composer.json`/`.env`は`Laravel`のまま、docsには`SmartSprouts`表記、フロントエンド（Sidebar/Footer）には`Spra`がハードコード。2026-07-30、正式名称の決定をユーザー判断により保留 | フェーズ2（要判断） |
| K14 | `routes/web.php`/`api.php`のコメントアウト済みルート | **一部解消**（2026-07-30）。トークン式オンボーディング（`/onboarding/{token}`）は`quote.response.register.*`に実質置き換わっており未使用と確認し削除、`auth:api`ガードのプレースホルダーも本プロジェクトでは未使用（2ガード構成）のため削除。`/plans`・`/careers`は画面実装済みだが公開判断待ちのためコメントアウトのまま保留 | フェーズ2（要判断） |
| K15 | Search Console連携が本番未検証 | **解消済み**（2026-07-31）。`SEARCH_CONSOLE_DRIVER=google`は従来コード上未実装で`RuntimeException`を投げるダミーだったことが判明（docsの「未検証」という記述は誤りで、実際には実装自体が存在しなかった）。`GoogleSearchConsoleService`（サービスアカウントJWT認証＋Search Analytics API直叩き、`google/apiclient`等の追加依存なし）を新規実装し、単体テスト追加済み。本番でドメイン所有権のDNS TXT確認・サービスアカウント作成・Search Console側への権限付与・`.env`設定・鍵ファイルのコンテナ内配置（`storage/app/private/`はnamed volumeのためホスト側配置だけでは反映されず`docker cp`が必要）まで完了し、`analytics:sync-search-console`が正常終了することを確認（新規ドメインのため現時点はクエリ0件、データ反映まで数日のラグは想定通り） | フェーズ1（完了） |
| K16 | 未参照の`User\OnboardingController` | **解消済み**（2026-07-30）。参照元ゼロを確認し削除。調査の結果、トップレベルの`app/Http/Controllers/OnboardingController.php`も参照元がなくなっていたため合わせて削除 | フェーズ2（完了） |
| K17 | `Admin\MediaController::update()`/`destroy()`の引数名`$media`がリソースルートの実パラメータ名`{medium}`と不一致 | **修正済み**（2026-07-29）。**新規発見の実バグ**: 暗黙のルートモデルバインディングが効かず、常に空の未保存Mediaインスタンスが注入されていた。`show()`/`edit()`は`$medium`で正しく動作していたが、`update()`/`destroy()`はメディア情報の更新・削除が実質常に失敗していた可能性が高い（K5のガード修正でテストを書いたところ発覚） | フェーズ1（完了） |
| K18 | `User::primaryCompany()`のリレーション定義が壊れており常に空を返す | **修正済み**（2026-07-29）。`hasOne(Company::class, 'company_user', 'user_id')`はピボットテーブル名を外部キー名として誤用しており、生成されるSQLが自己矛盾する条件になり常に空を返していた（例外は出ないため気づきにくい）。`app/Http/Controllers/User/ContactController.php`(L40)と`app/Http/Controllers/User/AppointmentController.php`(L99)で使用されており、ログイン済みユーザーのお問い合わせ・予約フォームで会社情報が常に空になっていた。既存の`company()`（`is_primary`ピボットで絞ったBelongsToMany）を使うアクセサ`getPrimaryCompanyAttribute()`に置き換えて修正 | フェーズ1（完了、優先度を上げて対応） |
| K19 | `Admin\OnboardingController::approve()`がContractを作成せずInvoiceを発行しようとし必ず失敗 | **修正済み**（2026-07-29）。`invoices.contract_id`/`user_id`はDB上必須だが、approve()はQuoteから直接Invoiceを作っておりContract作成が完全に欠落していた。**承認ボタンが一度も正常動作していなかった可能性が高い実質的な機能停止バグ**。ユーザー判断により、`ContractService::createContract()`でQuoteの内容（明細・金額）を引き継いだContractを自動作成してからInvoiceを発行するよう修正 | フェーズ1（完了） |
| K20 | 2FAが`owner`/`super_admin`を含め全adminロールで任意設定（opt-in）、組織として強制する仕組みが無い | バグではなくポリシー上の懸念（2026-07-29棚卸しで判明）。ログイン自体にバイパス経路は無い。2FA必須化を行うかはビジネス判断が必要 | フェーズ2（要判断） |
| K21 | `emails/contact/notification.blade.php`が存在しないルート名`admin.homepage.contacts.show`を参照 | **修正済み**（2026-07-29）。正しい`admin.contact.show`に修正。`route()`が`RouteNotFoundException`を投げ、`ContactService::sendNotificationEmails()`のtry/catchで警告ログのみ記録され握りつぶされていたため、**Contact（Atlas申込みも含む）作成時の管理者通知メールが常に送信失敗していた**。DBの通知（ベルアイコン）は別経路のため気づきにくかった | フェーズ1（完了） |
| K22 | 本番ビルド時、`npm run build`がメモリ不足でOOMするリスク | **解消済み**（2026-07-31）。`Dockerfile.prod`検証（2026-07-30）で判明。`mermaid`/`cytoscape`等を含む大きなバンドルのため、2GB程度のメモリではビルド中にOOMする（ローカルのDocker Desktop 2GB割当で実際に再現、8GBで解消）。実際のLightsailインスタンスは4GB以上のプランを選定してビルド・運用し、OOMは再発していない | フェーズ1（完了） |
| K23 | 本番環境（`APP_ENV=production`）で例外発生時、エラーページが表示できず真っ白な500レスポンスになる | **修正済み**（2026-07-30）。`compose.prod.yaml`（T16）検証中に発見。`bootstrap/app.php`の汎用例外ハンドラが`APP_DEBUG`に関わらず必ず`response()->view('errors.500', [], 500)`を呼ぶが、`resources/views/errors/`ディレクトリ自体が存在せず、**原因を問わずあらゆる例外（404/419/403含む）が本番では空の500レスポンスになっていた**。`resources/views/errors/{404,403,419,429,500,503}.blade.php`（共通レイアウト`errors/minimal.blade.php`を共有）を追加し、ハンドラも実際のHTTPステータスコードに応じた専用ビュー（無ければ500にフォールバック）を描画するよう修正 | フェーズ1（完了、優先度を上げて対応） |
| K24 | 公開サイト共通Footerに実装されていないルート（`/plans`・`/careers`・`/sitemap`）へのリンクが残存 | **修正済み**（2026-07-30）。本番リリース前の最終確認（Public/User配下のリンク切れ調査）で発見。3つとも`routes/web.php`に未登録またはルート自体が存在せず、クリックすると404になっていた。全公開ページ共通のFooterコンポーネントに現れるため影響範囲が広く、ユーザー判断により3本ともリンクを削除して対応 | フェーズ1（完了） |
| K25 | Admin/Userともにログインパスワードの複雑性要件が緩い（8文字以上のみ） | **修正済み**（2026-07-30）。ユーザー指示により強化。`AppServiceProvider::boot()`で`Password::defaults()`を一元設定（12文字以上・英大小文字混在・数字必須、本番のみ`uncompromised()`で漏洩チェック）。従来`Rules\Password::defaults()`を使っていなかった`QuoteResponseController`のオンボーディング登録（`min:8`のみ）もこのポリシーに統一。管理者・クライアント企業担当者アカウントの自動生成パスワード（`AdminService`/`UserService`）も`Str::random()`から`Str::password()`に変更しポリシーを確実に満たすようにした | フェーズ1（完了） |
| K26 | DNS本番切替時、MXレコードがドメイン本体を指していたためWeb用Aレコード変更でメール受信が停止 | **修正済み**（2026-07-31、実デプロイ中に発生・即時対応）。`smartsprouts.jp`のMXレコードが独立したホスト名ではなくドメイン本体自体を指す設定だったため、AWS Lightsailへの移行でAレコードを書き換えた際に**メール受信も同時に停止**（AWSのMFA確認メールが届かず一時ログイン不能になった）。`mail.smartsprouts.jp`を新設しXserverの元IPを割り当て、MXの参照先をそちらに変更して復旧。今後同様のドメイン移行を行う際は、事前にMXレコードの参照先ホスト名を必ず確認する（`docs/ProductionDeploymentGuide.md`に手順を明記済み） | フェーズ1（完了、実運用で顕在化） |
| K27 | 本番`.env`の`env_file`経由の値を変更しても`docker compose restart`では反映されない | **修正済み**（2026-08-01、実運用で発覚）。本番の`MAIL_*`（Xserver SMTP）設定時に発覚。`compose.prod.yaml`の`app`/`horizon`/`scheduler`は`env_file: .env`で環境変数を読み込むが、これは**コンテナ作成時点の値で固定**され、`.env`ファイルを更新して`restart`しても反映されない（Laravelは`.env`ファイルより既存のOS環境変数を優先するため、`config:cache`をやり直しても解決しない）。あわせて、このLaravelバージョン（12）では`MAIL_ENCRYPTION`は`config/mail.php`から参照されず無効で、暗号化方式の指定には`MAIL_SCHEME`（ポート465なら`smtps`）を使う必要があることも判明。`docker compose up -d --force-recreate <service>`でコンテナを作り直すことで解消。今後`.env`の値（特に`env_file`経由の変数）を本番で変更する際は、`restart`ではなく`up -d --force-recreate`が必要（`docs/ProductionDeploymentGuide.md`に追記済み） | フェーズ1（完了、実運用で顕在化） |
| K28 | 本番環境でメディアアップロードが失敗・表示されない（原因が3つ重なっていた） | **修正済み**（2026-08-01、実運用で発覚）。実際には3つの問題が重なっていた。**(1)** 本番`app`イメージのGD拡張がWebP非対応でビルドされており（`--with-webp`未指定・`libwebp-dev`未インストール）、Intervention ImageがWebPバリアントを生成しようとする際に`imagewebp()`未定義エラーでアップロード自体が失敗していた（開発環境のSailイメージはWebP対応済みのため気づかなかった）。`libwebp`/`libwebp-dev`追加・`--with-webp`付与で解消。**(2)** `caddy`コンテナが`app`/`horizon`/`scheduler`間で共有される`app-storage`ボリュームも`public/storage`シンボリックリンクも持っておらず、`/storage/xxx`へのアクセスが404になる状態だった。`compose.prod.yaml`のcaddyサービスへの`app-storage`ボリュームマウント追加、`Dockerfile.prod`のcaddyステージへの相対シンボリックリンク作成で解消。**(3)** `Media`/`MediaVariant`モデルの`getOriginalUrlAttribute()`/`getUrlAttribute()`/`getVariantUrl()`に`config('app.env') === 'production' ? 's3' : 'public'`というハードコードされた分岐があり、S3連携が実装・設定されていないにもかかわらず本番では常に`s3`ディスクを参照しようとして`Class "League\Flysystem\AwsS3V3\PortableVisibilityConverter" not found`で例外になっていた（アップロード自体が成功しても詳細画面表示時にここで落ちる）。3箇所とも無条件に`public`ディスクを使うよう修正、回帰テスト（`tests/Unit/MediaUrlAccessorTest.php`）追加。いずれも例外・404はログに出るがブラウザ上は無言で失敗するため気づきにくかった | フェーズ1（完了、実運用で顕在化） |
| K29 | `Admin\Admin\AdminController::destroy()`が存在しないガード名`admin`（単数形）を参照 | **未修正**（2026-08-03、タスク管理機能のドキュメント整備中に発見。本タスクのスコープ外のため修正は別タスクとする）。K5（`UpdateMediaRequest`）と同一パターンの取り違えが`auth('admin')->id()`という形で残存しており、管理者削除を実行すると`Auth guard [admin] is not defined.`例外が`catch (\Exception $e)`で握りつぶされ、エラーメッセージがフラッシュされるだけで**管理者の削除が常に失敗する**可能性が高い。`admins`への修正が必要 | フェーズ2（要対応） |

## 8. 用語集

- **ULID主体キー**: `HasUlid`トレイト使用モデルは`incrementing=false`・`keyType=string`で、作成時に`Str::ulid()`を自動採番。
- **quote_number**: `QuoteService`で自動採番（見積番号）。
- **invoice_number**: `INV-00000001`形式で自動採番（`InvoiceService::generateInvoiceNumber()`）。
- **project_code**: `PRJ-YYYY-XXXXXXXX`形式（年+タイムスタンプ+ランダム文字）で自動採番。
- **Quoteステータス**: `draft`（下書き）/`negotiating`（交渉中）/`approved`（承認済み）/`rejected`（却下）/`contracted`（契約済み）/`cancelled`（キャンセル）。
- **Contractステータス**: `draft`/`pending_signature`/`active`/`suspended`/`completed`/`cancelled`。署名状況は別カラム`signature_status`（`pending`/`user_signed`/`admin_signed`/`fully_signed`）。
- **Invoiceステータス**: `draft`/`sent`/`viewed`/`paid`/`overdue`/`cancelled`。
- **Companyステータス**: `active`/`inactive`/`suspended`/`pending`。`company_type`: `individual`/`corporate`。
- **Adminロール**: `owner`/`super_admin`/`admin`/`editor`/`viewer`（`Admin::ROLES`）。
- **Atlas brand**: `concierge`/`life`/`japan`。**Atlas membership status**: `pending`/`active`/`paused`/`revoked`。
- **Appointmentステータス**: `pending`/`confirmed`/`completed`/`cancelled`/`no_show`。

## 9. docs/ 配下ガイド索引

凡例: ✅=実装済み範囲を扱う ／ 🟡=既知の懸念・要注意点を含む ／ ❌=未実装機能の記述を含む

| ファイル | 扱う範囲 |
|---|---|
| `docs/AlertSystemGuide.md` | フロントエンドのアラート/ダイアログコンポーネント（BaseAlert, DeleteAlert等） ✅ |
| `docs/AppointmentSystemGuide.md` | 予約システム全体（枠・ステータス・通知・DBスキーマ）、未実装機能チェックリスト ✅🟡❌ |
| `docs/BatchAutomationOverview.md` | 全スケジュールコマンド・キュージョブの一覧、過去に発見・修正した実バグの記録 ✅🟡 |
| `docs/ButtonRefactoringGuide.md` | 旧→新Buttonコンポーネント移行ガイド、移行未完了 🟡 |
| `docs/ComponentsStructureGuide.md` | Reactコンポーネントのディレクトリ構成規約 ✅ |
| `docs/OnboardingSystemGuide.md` | QuoteResponse→登録→承認の全体フロー、既知の懸念点（一部は本書§7で解消と確認済み） 🟡 |
| `docs/ProductionDeploymentGuide.md` | AWS Lightsail本番デプロイ手順・チェックリスト・費用注意点 ❌（未実施） |
| `docs/ProjectWorkflowGuide.md` | Project→Version→Milestone/Item→ガントチャートのフロー、未実装機能チェックリスト ✅❌ |
| `docs/PublicContactSubmissionGuide.md` | 公開お問い合わせフォームの実装詳細（バリデーション・メール・トラッキング） ✅ |
| `docs/QuoteUserCompanyIdAnalysis.md` | Quote⇔QuoteResponseのuser_id/company_id同期に関する調査（**記述が古い、本書§7 K1参照**） 🟡 |
| `docs/RepositoryServiceMigrationGuide.md` | Repository/Service基盤クラス移行ガイド（**進捗記述が古い、本書§7 K9参照**） 🟡 |
| `docs/RouteNamingAndStructure.md` | ルート命名規則（`public.`/`user.`/`admin.`）、既知のルーティングバグ 🟡 |

## 10. 変更履歴

| 日付 | 変更内容 |
|---|---|
| 2026-07-29 | SPEC.md初版作成。コードベース調査＋ユーザーヒアリング＋独立検証に基づく |
| 2026-08-03 | §5.12にAdmin向けタスク管理機能（カンバンボード・繰り返しタスク・リマインダー）のドメイン仕様を追記。§7にK29（`AdminController::destroy()`のガード名取り違え、未修正）を追加 |
