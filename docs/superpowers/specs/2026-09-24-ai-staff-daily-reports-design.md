# AI社員 日報（業務ログ・日次レポート） 設計メモ

- 作成日: 2026-09-24
- 位置づけ: 新規サブシステムの設計合意メモ。この後`superpowers:writing-plans`で実装計画を作成する。
- 背景: AI社員（`admins.role = 'ai_staff'`、`docs/superpowers/specs/2026-09-18-ai-staff-and-proposal-flow-design.md` §1で導入済み）が実際に稼働し始めた際、その日々の活動を人間が確認できる仕組みが無い。現状は各チャットセッション（このSpraセッション等）に断片的に残るのみで、システム内に構造化された記録が無いため、今後AI社員が増えると把握できなくなる。

## 0. 前提の確認

- `UserActivityLog`（`app/Models/UserActivityLog.php`）は、テーブル・モデル上は`admin_id`/`actor_type=ACTOR_ADMIN`を扱えるようスキーマ・定数が用意されているが、**実際の書き込み箇所5件は全てPublic/Api配下のクライアント向けイベント**（お問い合わせ受付・見積回答・見積シミュレーター・予約通知）であり、Admin側の操作を記録する`logAdminActivity()`ヘルパーは呼び出し箇所ゼロ（デッドコード）。名称・実態ともにクライアント向けログであり、本機能では流用しない（ユーザーとの確認により新規テーブルを新設する方針）。
- 対象は**AI社員限定**（`admins.role = 'ai_staff'`）とし、人間Adminの業務ログ化は今回のスコープ外。
- 記録対象操作は**タスクの状態変更＋主要な業務アクション**（Response/Quote/Proposalの作成）とする（ユーザー確認済み）。
- 日報の生成方式は**案A: ①の随時ログを整形して並べるだけ**を採用する（AI呼び出し不要、今すぐ実装可能）。AIによる要約文生成（案B）は、AI社員の実行・呼び出し基盤自体が未設計のため、別タスクとして将来検討する。

## 1. 全体の流れ

```
AI社員が業務アクションを実行
  （タスク状態変更／返信作成／見積作成／提案書作成）
  ↓ ①随時記録（各書き込み経路にAiStaffActivityLoggerを1行挿入）
ai_staff_activity_logs に1行追加
  ↓ ②毎朝8:00のスケジュールタスク（前日分を集計）
ai_staff_daily_reports に1日1AI社員1行を生成（活動0件の日はスキップ）
  ↓ ③閲覧
Admin画面「AI社員 日報」で日付・担当者別に一覧・詳細確認
```

## 2. スキーマ変更案

### 2.1 `ai_staff_activity_logs`（新規、①の随時ログ）

| カラム | 型 | 備考 |
|---|---|---|
| `id` | ulid, PK | `HasUlid`トレイト使用 |
| `admin_id` | ulid, FK→admins | NOT NULL。`onDelete: cascade`（Admin削除時はログも削除） |
| `action` | string | `task_status_changed`/`response_created`/`quote_created`/`proposal_created`等。将来の種類追加を見越し、DB enumではなくstring＋アプリ側定数管理とする |
| `subject_type` / `subject_id` | string / ulid, nullable | 対象レコードへのポリモーフィック参照（Task/Response/Quote/Proposal） |
| `description` | text | 「タスク『○○』をレビュー待ちに変更」等、一覧・日報にそのまま使える一言 |
| `occurred_at` | datetime | 実際に操作が行われた日時（バッチ集計の対象範囲判定に使用） |
| `created_at` | datetime | レコード作成日時（`updated_at`は無し、追記のみのログのため） |

インデックス: `(admin_id, occurred_at)`（バッチ集計・一覧表示の主要な絞り込み軸）

### 2.2 `ai_staff_daily_reports`（新規、②の日次集計結果）

| カラム | 型 | 備考 |
|---|---|---|
| `id` | ulid, PK | |
| `admin_id` | ulid, FK→admins | NOT NULL |
| `report_date` | date | 対象日（＝集計対象にした活動ログの`occurred_at`の日付、生成日の前日） |
| `body` | text | ①のログを整形して並べたテキスト（案A） |
| `activity_count` | integer | その日の活動ログ件数（一覧画面での件数表示用） |
| `generated_at` | datetime | バッチ実行日時 |

制約: `unique(admin_id, report_date)`（再実行時は同日分をupsertし重複させない）

## 3. ①随時ログの記録方法

`app/Services/AiStaffActivityLogger.php`（新規、`BaseService`は継承しない単純なヘルパークラス。CRUD主体のエンティティサービスではなく横断的な記録係のため）を新設し、以下のインターフェースを提供する:

```php
public function log(Admin $admin, string $action, string $description, ?Model $subject = null): void
```

内部で既存の`$admin->isAiStaff()`（`app/Models/Admin.php`に実装済み、`role === 'ai_staff'`判定）を確認し、人間Adminの場合は何もせず即return（スコープ限定）。

呼び出し箇所（4箇所、いずれも既存の書き込み処理の最後に1行追加するのみ）:
- `TaskController`（または`TaskService`）のステータス更新処理
- `ResponseController`（または`ResponseService`）の返信作成処理
- `QuoteService`または関連コントローラーの見積作成処理（`EstimateSimulatorService::createEstimateRequest()`のAI社員起点呼び出しを含む）
- `ProposalService::createProposal()`

ログ記録自体の失敗が本処理を止めないよう、呼び出し側でtry-catchするか`AiStaffActivityLogger::log()`内部でtry-catchしログのみ残す（`EstimateSimulatorController`の招待メール送信失敗時と同じ「握りつぶしてログのみ」パターンを踏襲）。

## 4. ②日次集計バッチ

- 新規Artisanコマンド `php artisan ai-staff:generate-daily-reports {--date=}`（既存の`GenerateMonthlyInvoices`等と同じ運用パターン）
- `--date`未指定時は「前日」（`Carbon::yesterday()`）を対象にする。指定時はその日付を対象にし、手動での過去分再生成・欠損日の埋め直しに使う
- 処理内容: 対象日の`ai_staff_activity_logs`を`admin_id`ごとに`groupBy`し、各グループについて`occurred_at`昇順に整形した文字列を`body`として`ai_staff_daily_reports`へupsert。ログが0件のAI社員はレコードを作らない（＝日報は「活動があった日のみ」存在する）
- スケジュール登録: `routes/console.php`（Laravel 12の標準）に`Schedule::command('ai-staff:generate-daily-reports')->dailyAt('08:00')`を追加

## 5. ③閲覧UI

- 新規Admin画面「AI社員 日報」（`Admin/AiStaffDailyReports/Index.jsx`・`Show.jsx`、既存の一覧/詳細ページ構成に合わせる）
- 一覧: 日付・担当AI社員での絞り込み、`activity_count`表示
- 詳細: `body`（整形済み本文）に加え、元の`ai_staff_activity_logs`を時系列表示（本文で物足りない場合に生ログへ降りられるようにする）
- サイドバーナビゲーションへの追加は既存の`AdminNavItems.jsx`パターンに従う

## 6. エラーハンドリング・運用上の注意

- ①のログ記録失敗は本処理（タスク更新等）を止めない（3章参照）
- ②のバッチ失敗時は次回実行を待たず`--date=`オプションで対象日を指定して手動再実行できる
- 既存のCLAUDE.md §7方針（本番稼働中、ロールバック安全なマイグレーション）に従い、両テーブルとも新規追加のみで既存テーブルへの破壊的変更は無い

## 7. テスト方針

- `AiStaffActivityLogger::log()`: AI社員の場合にログが1件作成されること／人間Adminの場合は何も作成されないこと
- 各呼び出し箇所（Task/Response/Quote/Proposal）: AI社員が操作した場合にログが増えることの回帰テスト（既存のテストへの追記または新規ケース追加）
- 日次集計コマンド: 複数AI社員分のログが正しく別々の日報に分かれること、活動0件のAI社員には日報が作られないこと、`--date`指定での過去日再生成、再実行時の重複防止（upsert）
- 閲覧UI: 一覧・詳細のInertiaレンダリングテスト（既存の`assertInertia`パターン踏襲）

## 8. 未決定事項（実装計画作成時に詰める）

- `description`の具体的な文言テンプレート（各アクション種別ごとにどこまで詳細に書くか）
- 案B（AI要約生成）へ移行する場合の起動条件・呼び出し基盤設計（本メモのスコープ外、AI社員の実行基盤自体の設計が前提条件）
- 日報一覧のページネーション・保持期間（当面は無期限保持、件数が問題になれば別途アーカイブ方針を検討）
