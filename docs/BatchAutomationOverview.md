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

いずれも`--dry-run`オプションを持つ（`sync-search-console`除く）ため、手動検証がしやすい設計になっている。

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

- **キュージョブ**は`QUEUE_CONNECTION=database`（[.env](../.env)）のため、`php artisan queue:work`が常駐していないと`jobs`テーブルに溜まったまま処理されない。
- **スケジューラ**も`schedule:run`を毎分呼ぶcronが動いていて初めて発火する。
- ローカル/Sail環境では現状どちらも常駐していない（`supervisor`はPHPプロセスのみ管理）。[ProductionDeploymentGuide.md](ProductionDeploymentGuide.md)に本番では常駐コンテナ＋cronで対応する方針が明記されている。**本番環境で実際にこの2つが起動しているかは、デプロイ時に必ず確認する必要がある**（起動していないと、この一覧の処理は全く動かない）。

## 4. 見つかった問題点（優先度順）

### 🔴 重要: 自動生成された請求書がメール送信後も「下書き」のまま＆PDF未添付

`InvoiceService::generateMonthlyInvoice()`（[InvoiceService.php:107-119](../app/Services/InvoiceService.php#L107-L119)）と`GenerateInvoiceJob`（契約承認時）は、どちらも請求書を`status=draft`のまま作成し、`SendInvoiceJob`を直接ディスパッチしている。しかし`SendInvoiceJob`自体は「ステータス（sent）は既にController側で更新済み」という前提で書かれており（[SendInvoiceJob.php:43](../app/Jobs/SendInvoiceJob.php#L43)）、この2つの自動生成経路ではステータス更新もPDF生成も行われない。結果として：

1. 送信メールにPDFが添付されない（`InvoiceMail`は`pdf_path`がある場合のみ添付するため）。
2. 請求書は自動送信された後も管理画面上は「下書き」のまま表示され、実態と表示が食い違う。
3. 下書き状態のままなので、気づかず管理者が手動で「送信」を押すと**顧客に同じ請求書が二重に送られる**リスクがある。

対応案: 両経路とも`SendInvoiceJob::dispatch()`の前に`InvoiceService::sendInvoice()`（PDF生成＋メール送信＋`status=sent`更新を一体で行うメソッド）を使うよう統一する。

### 🟡 QuoteObserverが登録されておらず機能していない

[QuoteObserver.php](../app/Observers/QuoteObserver.php)は「問い合わせ(Contact)のメールアドレスから既存Userを自動特定してQuoteに紐付ける」ロジックを持つが、`Quote`モデルに`#[ObservedBy]`属性も無く、どのServiceProviderでも`Quote::observe()`が呼ばれていない。**このファイルは現状デッドコードで、意図した自動紐付けは一切動いていない**。

### 🟡 `SendPendingInvoices`が存在しない`$invoice->user->name`を参照

[SendPendingInvoices.php:64,67,74](../app/Console/Commands/SendPendingInvoices.php#L64)。`User`モデルに`name`属性は無く（氏名は`profile->full_name`）、実行時にコンソール出力のクライアント名が常に空になる（例外にはならないが表示が壊れている）。

### 🟡 `ContractSignedNotificationJob`の履歴記録先メールアドレスがハードコード

[ContractSignedNotificationJob.php:124](../app/Jobs/ContractSignedNotificationJob.php#L124)で`'admin@example.com'`が固定値。実際の送信は`owner/super_admin/admin`ロール全員に飛ぶが、履歴(`ContractHistory`)には実態と異なるダミーアドレスが記録される。

### 🟡 Search Consoleデータは本番未接続のダミー実装

[SyncSearchConsole.php](../app/Console/Commands/Analytics/SyncSearchConsole.php)は`isLive()`で未接続を検知して警告は出すが、`analytics:sync-search-console`は本番投入前提でスケジュール登録済み。本番稼働前に`SearchConsoleServiceInterface`の実装を差し替える必要がある。

## 5. 自動化した方が良い候補

- **請求書の督促（延滞リマインド）バッチ**: `overdue`ステータスの請求書に対して`InvoiceReminderMail`（[InvoiceService::resendInvoice](../app/Services/InvoiceService.php#L210)）が既にあるが、現状は管理者が手動で「再送信」を押した時のみ。`appointments:send-reminders`と同様に`invoices:send-overdue-reminders`のような定期バッチにすると、督促漏れが防げる。
- **契約自動更新の事前通知**: `Contract`には`auto_renewal`・`renewal_notice_days`（更新通知日数）フィールドがあるが、実際に「更新◯日前にお知らせする」処理は存在しない。フィールドが使われないまま放置されている状態なので、更新のお知らせバッチを新設するか、使わないなら項目自体の整理を検討。
- **失敗時のアラート通知が無い**: 現在、7本のスケジュールコマンドはどれも失敗時にSlack/メール等で管理者に通知する仕組みが無く（`->emailOutputOnFailure()`等が未設定）、気づく手段はサーバーログのみ。特に「請求書自動生成・送信」は金銭が絡むため、失敗時に管理者へ通知が飛ぶようにしておくと安心（Laravelの`Schedule::command(...)->emailOutputOnFailure()`や、Slack通知チャンネルへのフックなど）。
- **キュー/スケジューラの稼働監視が無い**: 3節の通り「動くはずのコードが実際に動いているか」を確認する手段が現状は無い（Horizon等の可視化ツールも未導入）。将来的にLaravel HorizonやPulseの導入、あるいは簡易な「最終実行日時」を記録してダッシュボードに出す仕組みがあると安心。

## 6. 整理候補（未使用コード）

- `Contract::shouldGenerateInvoice()`（[Contract.php:328-347](../app/Models/Contract.php#L328-L347)）— 定義されているが呼び出し箇所が無い。`GenerateMonthlyInvoices`コマンドが同等条件をクエリに直接書いており重複している。どちらかに統一するのが望ましい。
- `QuoteObserver` — 4節の通り未登録。意図的に無効化しているのでなければ登録するか、使わないなら削除も検討。
