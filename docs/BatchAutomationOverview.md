# バッチ・自動実行処理 全体まとめ

現在このプロジェクトで動いている「定期実行バッチ」と「イベント駆動の自動処理（キュージョブ）」を棚卸しした一覧。あわせて、調査中に見つかった不具合・改善候補も記載する。

調査日: 2026-07-21

## 1. 定期実行バッチ（スケジューラ）

登録場所: [routes/console.php](../routes/console.php)（Laravel 11以降の作法で、`app/Console/Kernel.php`は使っていない）

| 時刻 | コマンド | 実装 | 内容 |
|---|---|---|---|
| 毎日 02:00 | `analytics:aggregate-daily` | [AggregateDailyAnalytics.php](../app/Console/Commands/Analytics/AggregateDailyAnalytics.php) | 前日分のアクセス解析（ページ別/デバイス別/流入元別）と業務KPI（問い合わせ数・見積数・契約数・売上・案件数など）を`AnalyticsDaily`/`AnalyticsKpi`に集計 |
| 毎日 03:00 | `analytics:sync-search-console` | [SyncSearchConsole.php](../app/Console/Commands/Analytics/SyncSearchConsole.php) | Search Consoleの検索パフォーマンス（3日前分、反映ラグ考慮）を同期。**現状はダミーデータ実装**（`SearchConsoleServiceInterface`の本実装が未接続） |
| 毎日 09:00 | `appointments:send-reminders` | [SendAppointmentReminders.php](../app/Console/Commands/SendAppointmentReminders.php) | 24時間後に予約がある顧客へリマインダー送信 |
| 毎日 09:00 | `invoices:generate-monthly` | [GenerateMonthlyInvoices.php](../app/Console/Commands/GenerateMonthlyInvoices.php) | `type=monthly`かつ`auto_invoice_generation=true`かつ`next_billing_date`到来済みの契約から請求書を自動生成し、即メール送信まで実施 |
| 毎日 09:00 | `benefits:generate-monthly` | [GenerateMonthlyContractBenefits.php](../app/Console/Commands/GenerateMonthlyContractBenefits.php) | `end_date`未設定（継続契約）かつ有効な契約に対し、契約特典（チケット）を翌期分生成 |
| 毎日 09:30 | `membership:calculate-ranks` | [CalculateMembershipRanks.php](../app/Console/Commands/CalculateMembershipRanks.php) | 入金履歴のある全会社の年間利用額を再集計し、会員ランクを更新 |
| 毎日 10:00 | `invoices:send-pending` | [SendPendingInvoices.php](../app/Console/Commands/SendPendingInvoices.php) | `status=draft`かつ`pdf_path`生成済みの請求書を送信（取りこぼし救済用） |
| 毎日 11:00 | `invoices:send-overdue-reminders` | [SendOverdueInvoiceReminders.php](../app/Console/Commands/SendOverdueInvoiceReminders.php) | 支払期限を過ぎた請求書に督促メールを送信（前回督促/初回送付から`--interval-days`（デフォルト3日）以上経過したもののみ対象） |
| 毎日 08:00 | `contracts:send-renewal-notices` | [SendContractRenewalNotices.php](../app/Console/Commands/SendContractRenewalNotices.php) | `auto_renewal=true`かつ有効な契約で、終了日が`renewal_notice_days`以内に迫ったものについて管理者(owner/super_admin/admin)へ更新案内メールを送信。契約1件につき1回のみ（`renewal_notice_sent_at`で管理） |

いずれも`--dry-run`オプションを持つ（`sync-search-console`除く）ため、手動検証がしやすい設計になっている。全9コマンドとも失敗時は`emailOutputOnFailure(config('mail.admin_address'))`によりコンソール出力が管理者へメール送信される（[routes/console.php](../routes/console.php)）。

## 2. イベント駆動の自動処理（キュージョブ）

スケジュールではなく、特定の操作をトリガーに`dispatch()`される非同期ジョブ。

| ジョブ | トリガー元 | 内容 |
|---|---|---|
| `SendInvoiceJob` | 請求書送信操作全般（[InvoiceController::send](../app/Http/Controllers/Admin/Invoice/InvoiceController.php)、`GenerateInvoiceJob`、`generateMonthlyInvoice`） | 請求書メール送信＋契約履歴記録 |
| `GenerateInvoiceJob` | 契約承認時（[ContractController::approve](../app/Http/Controllers/Admin/Contract/ContractController.php#L322)、署名完了→有効化のタイミング） | 一括払い契約の請求書を自動生成し`SendInvoiceJob`を連鎖ディスパッチ |
| `ContractMailJob` | 契約書メール送信操作 | 契約書（PDF/利用規約付き）をクライアントへ送信、履歴記録、失敗時60秒後に自動リトライ |
| `ContractGroupMailJob` | 契約グループ一括送信操作 | グループ内全契約をまとめて送信、失敗時60秒後リトライ |
| `ContractSignedNotificationJob` | 署名イベント（ユーザー署名完了／全署名完了／却下） | 管理者・クライアントへの署名関連通知メール |
| `NotifyUserToSignContractJob` | 署名リマインダー送信操作 | 未署名クライアントへ署名依頼メール |
| `SendInstagramBookingLinkJob` | Instagram Webhook受信（[InstagramWebhookController](../app/Http/Controllers/Api/InstagramWebhookController.php)） | DM送信者へ無料相談予約リンクを自動返信 |
| `GenerateMediaVariantsJob` | メディアアップロード（[MediaService](../app/Services/MediaService.php)） | 画像のLarge/Medium/Small WebPバリアントを生成 |

## 3. 実行基盤の前提（重要）

これらは「コードが存在する」ことと「実際に動く」ことが分離している点に注意。

- **キュージョブ**は`QUEUE_CONNECTION=redis`（[.env](../.env)、2026-07-21にHorizon導入に伴い`database`から変更）。`compose.yaml`に`redis`サービスを追加済みで、Sail起動時に自動的に立ち上がる。ただし**ワーカー(`php artisan horizon`)自体は自動起動しない**ため、キュージョブを実際に処理させるにはローカルでは手動で`sail artisan horizon`を実行しておく必要がある（5節・7節参照）。
- **スケジューラ**も`schedule:run`を毎分呼ぶcronが動いていて初めて発火する。ローカル/Sail環境では現状常駐していない（`supervisor`はPHPプロセスのみ管理）。
- [ProductionDeploymentGuide.md](ProductionDeploymentGuide.md)に本番では常駐コンテナ＋cronで対応する方針が明記されている。**本番環境で実際にHorizon・スケジューラが起動しているかは、デプロイ時に必ず確認する必要がある**（起動していないと、この一覧の処理は全く動かない）。
- 失敗時アラート（`emailOutputOnFailure`）は`config('mail.admin_address')`（`.env`の`MAIL_ADMIN_ADDRESS`）宛に送信される。**現在`.env`に`MAIL_ADMIN_ADDRESS`が未設定で、コード側のデフォルト値`admin@example.com`（実在しないダミー）にフォールバックしている。実際に届く宛先を設定する必要がある。**

## 4. 見つかった問題点（優先度順）

### ✅ 対応済み: 自動生成された請求書がメール送信後も「下書き」のまま＆PDF未添付（2026-07-21修正）

`InvoiceService::generateMonthlyInvoice()`（[InvoiceService.php:107-119](../app/Services/InvoiceService.php#L107-L119)）と`GenerateInvoiceJob`（契約承認時、[GenerateInvoiceJob.php:105-107](../app/Jobs/GenerateInvoiceJob.php#L105-L107)）は、どちらも請求書を`status=draft`のまま作成し、`SendInvoiceJob`を直接ディスパッチしていた。しかし`SendInvoiceJob`自体は「ステータス（sent）は既にController側で更新済み」という前提で書かれており（[SendInvoiceJob.php:43](../app/Jobs/SendInvoiceJob.php#L43)）、この2つの自動生成経路ではステータス更新もPDF生成も行われていなかった。結果として、送信メールにPDFが添付されない・管理画面上「下書き」のまま表示される・気づかず手動再送信すると二重送信になる、という問題があった。

**対応**: 両経路とも`SendInvoiceJob::dispatch()`をやめ、既に`invoices:send-pending`で実績のある`InvoiceService::sendInvoice()`（PDF生成＋`InvoiceMail`送信＋`status=sent`更新を一体で行う）を呼ぶよう統一した。あわせて、`InvoiceMail`が使う`emails/invoices/invoice.blade.php`に存在した`$invoice->user->name`（Userに`name`属性は無く常に空になる）を`$invoice->user->profile?->full_name ?? $invoice->user->email`に修正し、実際に自動送信されるメールの宛名が正しく表示されるようにした。

動作確認: テスト用の月額契約を作成し`generateMonthlyInvoice()`を実行、`status=sent`・`sent_at`設定・PDFファイル実体生成・`InvoiceMail`のキュー投入までを確認済み（検証用データは削除済み）。

**追記（2026-07-21）**: この修正により`SendInvoiceJob`経由で記録されていた契約履歴(`invoice_sent`/`invoice_send_failed`)が自動生成経路では記録されなくなっていたため、`InvoiceService::sendInvoice()`自体に履歴記録を組み込み直した（成功時は`invoice_sent`、失敗時はトランザクション外で`invoice_send_failed`を記録）。これにより月次自動生成・契約承認時自動生成・`invoices:send-pending`・のいずれの経路でも一貫して契約履歴が記録されるようになった。あわせて、これまで書き込むだけで表示する画面が無かった契約履歴を確認できるよう、契約詳細画面に「契約履歴」タブ（[ContractHistories.jsx](../resources/js/Pages/Admin/Contracts/_components/ContractHistories.jsx)）を新設。動作確認: テスト契約で自動生成→送信→契約履歴タブに`請求書送付`が正しいラベル・送付先・日時で表示されることを確認済み（検証用データは削除済み）。

### 🟡 QuoteObserverが登録されておらず機能していない

[QuoteObserver.php](../app/Observers/QuoteObserver.php)は「問い合わせ(Contact)のメールアドレスから既存Userを自動特定してQuoteに紐付ける」ロジックを持つが、`Quote`モデルに`#[ObservedBy]`属性も無く、どのServiceProviderでも`Quote::observe()`が呼ばれていない。**このファイルは現状デッドコードで、意図した自動紐付けは一切動いていない**。

### ✅ 対応済み: `SendPendingInvoices`が存在しない`$invoice->user->name`を参照（2026-07-21修正）

[SendPendingInvoices.php](../app/Console/Commands/SendPendingInvoices.php)。`User`モデルに`name`属性は無く（氏名は`profile->full_name`）、実行時にコンソール出力のクライアント名が常に空になっていた。他のバッチコマンド（`GenerateMonthlyInvoices`等）と同じ`clientName()`ヘルパー（`$invoice->user?->profile?->full_name ?? $invoice->user?->email ?? '(不明)'`）を追加し、`user.profile`をeager loadするよう修正。`--dry-run`で氏名が正しく表示されることを確認済み。

### ✅ 対応済み: `ContractSignedNotificationJob`の履歴記録先メールアドレスがハードコード（2026-07-21修正）

[ContractSignedNotificationJob.php](../app/Jobs/ContractSignedNotificationJob.php)で`'admin@example.com'`が固定値になっており、実際の送信先（`owner/super_admin/admin`ロール全員）と履歴(`ContractHistory.recipient_email`)の記録内容が食い違っていた。`notifyAdminOfUserSignature()`実行時に実際に送信した管理者のメールアドレス一覧を保持し、履歴にはその実際のアドレス（カンマ区切り、該当者がいない場合は「(該当する管理者なし)」）を記録するよう修正。

**検証中に見つかった別の問題 → こちらも対応済み（2026-07-21修正）**:
- ✅ `contract_histories.action`カラムが`ENUM('created','sent','signed','archived','cancelled','note_added')`に固定されていた（[migration](../database/migrations/2026_07_02_120807_create_contract_histories_table.php#L26)）のに対し、`ContractSignedNotificationJob`や`ContractMailJob`、`NotifyUserToSignContractJob`、`SendInvoiceJob`、`GenerateInvoiceJob`はいずれもこのENUMに無い値（`signature_notification`・`invoice_sent`・`reminder_sent`等）を`action`に入れようとしており、**MySQL側でこれらの履歴保存は実際にはエラーになっていた**（動作確認中に実際に`SQLSTATE[01000]: Data truncated for column 'action'`を確認）。実際に使われている9種類の値はENUMで管理しきれず今後も増える前提のため、[マイグレーション](../database/migrations/2026_07_21_133853_change_action_column_to_string_on_contract_histories_table.php)で`action`を`VARCHAR(50)`に変更。あわせて`ContractHistory::getActionLabel()`（[ContractHistory.php](../app/Models/ContractHistory.php)）に不足していた8種類のラベルを追加。
- ✅ `ContractSignedNotificationJob::notifyAdminOfUserSignature()`が管理者向けメールビューに`'admin' => $admin`を渡していたが、[emails/admin-user-signed.blade.php](../resources/views/emails/admin-user-signed.blade.php)側は「クライアントが署名した」ことを伝える本文のため`$user`（署名した契約者本人）・`$signatureMethod`・`$signedAt`を参照する設計だった。ジョブ側を修正し、契約のクライアント本人・署名方法・署名日時を正しく渡すよう対応。あわせてテンプレート内の`$user->name`（Userに`name`属性なし）も`profile->full_name`ベースに修正。

動作確認: 実際の契約に対して`ContractSignedNotificationJob`（`user_signed`）を実行し、例外・未定義変数警告なしで完了、履歴が`action=signature_notification`・正しいラベル・実際の管理者アドレスで保存されることを確認済み（検証用の履歴レコードは削除済み）。

### 🟡 Search Consoleデータは本番未接続のダミー実装

[SyncSearchConsole.php](../app/Console/Commands/Analytics/SyncSearchConsole.php)は`isLive()`で未接続を検知して警告は出すが、`analytics:sync-search-console`は本番投入前提でスケジュール登録済み。本番稼働前に`SearchConsoleServiceInterface`の実装を差し替える必要がある。

## 5. 自動化した方が良い候補 → 全て対応済み（2026-07-21）

- ✅ **請求書の督促（延滞リマインド）バッチ**: 新規コマンド`invoices:send-overdue-reminders`を追加（1節参照）。`InvoiceService::resendInvoice()`を再利用し、督促の成功/失敗も契約履歴(`invoice_reminder_sent`/`invoice_reminder_failed`)に記録するようにした。
- ✅ **契約自動更新の事前通知**: 新規コマンド`contracts:send-renewal-notices`を追加（1節参照）。`renewal_notice_sent_at`カラムを追加し契約1件につき1回のみ通知。管理者(owner/super_admin/admin)へ[ContractRenewalNoticeMail](../app/Mail/ContractRenewalNoticeMail.php)を送信し、契約履歴にも記録する。
- ✅ **失敗時のアラート通知**: [routes/console.php](../routes/console.php)で全9コマンドに`emailOutputOnFailure(config('mail.admin_address'))`を設定。失敗時はコンソール出力がそのまま管理者へメールされる。**`MAIL_ADMIN_ADDRESS`の設定が必要（3節参照）**。
- ✅ **キュー/スケジューラの稼働監視**: Laravel Horizonを導入（7節参照）。管理画面から`/admin/horizon`でキューの稼働状況・処理件数・失敗ジョブ・スループットをリアルタイムに確認できる。

## 6. 整理候補（未使用コード）

- `Contract::shouldGenerateInvoice()`（[Contract.php:328-347](../app/Models/Contract.php#L328-L347)）— 定義されているが呼び出し箇所が無い。`GenerateMonthlyInvoices`コマンドが同等条件をクエリに直接書いており重複している。どちらかに統一するのが望ましい。
- `QuoteObserver` — 4節の通り未登録。意図的に無効化しているのでなければ登録するか、使わないなら削除も検討。

## 7. Laravel Horizon導入（2026-07-21）

キュー・スケジュールの稼働監視のためLaravel Horizonを導入した。

**変更点**
- `compose.yaml`に`redis`サービスを追加（`redis:alpine`、ボリューム`sail-redis`）
- `.env`（実運用ファイル）を`QUEUE_CONNECTION=database`→`redis`、`REDIS_HOST=127.0.0.1`→`redis`に変更（`.env.example`も追随して更新済み）
- `composer require laravel/horizon`、`php artisan horizon:install`で導入
- ダッシュボードURL: **`/admin/horizon`**（`config/horizon.php`の`path`を`admin/horizon`に変更）
  - `/admin/`配下にすることで、`AppServiceProvider`が持つ「`admin/*`のときだけ管理者用セッションCookieに切り替える」既存ロジック（[AppServiceProvider.php:90-96](../app/Providers/AppServiceProvider.php#L90-L96)）にそのまま乗る設計にした。これを外れたパス（素の`/horizon`）だと管理者ログインセッションが認識されない。
- アクセス権限: [HorizonServiceProvider.php](../app/Providers/HorizonServiceProvider.php)で`viewHorizon`ゲートを`admins`ガードの`isSuperAdmin()`（owner/super_adminのみ）に限定。**Horizon標準の「local環境は無条件許可」機能は明示的に上書きして無効化した**（このアプリは管理者ロールが複数あり、ローカルでも役割ベースのアクセス制御を維持したいため）。admin/editor/viewerロールでアクセスすると403。

**ローカルでの使い方**
- キューを処理するには`sail artisan horizon`を実行しておく必要がある（自動起動はしない。以前の`sail artisan queue:work`に代わるもの）
- ブラウザで owner または super_admin でログイン後、`/admin/horizon`にアクセス

**本番投入時に必要な作業（未着手）**
- `compose.prod.yaml`に`redis`サービスと、`php artisan horizon`を`restart: always`で常駐させる専用サービスを追加（[ProductionDeploymentGuide.md](ProductionDeploymentGuide.md)参照）
- `.env`の`MAIL_ADMIN_ADDRESS`に実際に届くアドレスを設定（Horizonの障害通知はメールでは飛ばないため、キュー監視自体はダッシュボード目視が前提。深刻な滞留・失敗急増を自動検知したい場合は`Horizon::routeMailNotificationsTo()`等の追加設定を検討）

**動作確認**: `sail artisan horizon`起動後、実際のジョブ(`SendInvoiceJob`)をRedis経由でディスパッチし、Horizonが処理して契約履歴に記録されることを確認。ダッシュボードがowner権限で表示されること、editorロールでは403になることをブラウザで確認済み。
