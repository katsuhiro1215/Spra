# TASKS.md — Spra 実装タスク一覧

最終更新: 2026-07-29

## 1. 本書の使い方

- **フェーズ1（1ヶ月必達MVP）**: お金・法的リスクの高い既知バグ是正、個人情報保護・セキュリティの最低限の担保、AWS Lightsail本番デプロイ、Atlas「/apply」フォーム実装。期限内に必ず終わらせる。
- **フェーズ2（継続・期限なし）**: Repository/Service完全移行、Button統一、コード衛生・デッドコード整理、テストカバレッジ拡充、docsに記載されている未実装機能群。触ったファイルのついでに進める。
- 各タスクは「対象ファイル／内容／完了の定義」の3点セットで記載する。将来チームに人が増えても、このドキュメントだけで単独着手できることを目指す。
- **重要な注意**: `docs/` 配下のガイドや本リストの前提記述より、**常に実際のコードを先に確認すること**。SPEC.md §7に記載の通り、一部の「既知バグ」は既に解消済みであることが判明している（docsが古いだけ）。着手前に必ず現在のコードで再現するか確認する。
- 進捗管理: 完了したら該当タスクの `[ ]` を `[x]` にする。

---

## 2. フェーズ1: 1ヶ月必達MVP

### 2.1 金銭・法的リスクの検証と是正（最優先）

- [x] **T1: `UpdateMediaRequest`の認可ガード名の誤りを修正**（完了: 2026-07-29、`fix/media-request-guard-and-mime`）
  - 対象ファイル: `app/Http/Requests/Media/UpdateMediaRequest.php`（`authorize()`）
  - 内容: `Auth::guard('admin')`（存在しないガード名、単数形）となっており、`config/auth.php`で定義されているのは`admins`（複数形）のみ。このままだと`Auth guard [admin] is not defined.`で例外が発生し、メディア更新（画像差し替え・メタデータ編集）が機能しない可能性が高い。`StoreMediaRequest`に合わせて`admins`に修正する。
  - 完了の定義: 実際に管理画面からメディア更新を実行しエラーが出ないことを確認。→ Featureテスト（`tests/Feature/Admin/MediaUpdateRequestTest.php`）で確認済み。
  - **副次的発見（T1対応中に判明、あわせて修正済み）**: `Admin\MediaController::update()`/`destroy()`の引数名が`$media`だったが、リソースルートの実パラメータ名は`{medium}`（`show()`/`edit()`は`$medium`で正しい）。名前不一致で暗黙のルートモデルバインディングが効かず、常に空の未保存Mediaインスタンスが注入されていた＝**メディア更新・削除が実質常に失敗していた実バグ**。`$medium`に統一して修正（SPEC.md §7 K17参照）。

- [x] **T2: QuoteObserverの扱いを決定し実装する（登録 or 削除）**（完了: 2026-07-29、`fix/register-quote-observer`）
  - 対象ファイル: `app/Observers/QuoteObserver.php`、`app/Models/Quote.php`
  - 内容: `QuoteObserver`はContactのメールアドレスからUser/Companyを自動特定するロジックを持つが、現状どこにも`Quote::observe()`や`#[ObservedBy]`属性で登録されておらず、**唯一の真に未解決の既知バグ**。運用実態を確認したところ、`resources/js/Pages/Admin/Contact/Show.jsx`(L236)から`contact_id`のみを渡してQuote作成画面に遷移する実際のUI導線があり、Observerの自動紐付けロジックは実用上必要と判断。`Quote`モデルに`#[ObservedBy(QuoteObserver::class)]`属性を追加して登録した。
  - 完了の定義: 登録する場合は動作確認テストを追加。→ `tests/Unit/QuoteObserverTest.php`で確認済み（自動紐付け／明示的user_idの尊重／マッチなしの場合にnullのまま、の3パターン）。

- [x] **T3: Quote⇔QuoteResponseのuser_id/company_id同期を検証し回帰テストを追加**（完了: 2026-07-29、`fix/quote-response-sync-regression-test`）
  - 対象ファイル: `app/Http/Controllers/QuoteResponseController.php`(L158-198)、`docs/QuoteUserCompanyIdAnalysis.md`
  - 内容: 現行コードには既にQuote本体への同期処理（L192-197）が実装済み。実際にDBで動作確認し、`quote_id`が無いケース（シミュレーター経由等）の扱いを洗い出した上でFeatureテストを追加し、`docs/QuoteUserCompanyIdAnalysis.md`を実態に合わせて更新する。
  - 完了の定義: テストGreen、docs更新済み。→ `tests/Feature/QuoteResponseRegistrationSyncTest.php`で確認済み（同期動作／トークン再使用時の安全な失敗の2パターン）。なお`quote_responses.quote_id`はDB制約上NOT NULLのため「quote_idが無いケース」は実際には発生し得ないことを確認（コード中の`if ($quoteResponse->quote_id)`は常にtrueとなる冗長なガード節）。`docs/QuoteUserCompanyIdAnalysis.md`に解消済みの旨を追記。

- [x] **T4: Onboarding承認/却下フロー（Company.status='pending'）の実地検証**（完了: 2026-07-29、`fix/onboarding-approval-verification`）
  - 対象ファイル: `app/Http/Controllers/Admin/OnboardingController.php`、`docs/OnboardingSystemGuide.md`
  - 内容: migration・登録処理は既に整合しているため実質バグではない。実際に承認・却下双方を通し、`reject()`が物理削除である仕様を最終確認した上でSPEC.mdの記述と合わせる。
  - 完了の定義: 承認・却下双方をFeatureテストで確認、docs訂正。→ **検証の結果、想定より深刻な2件の実バグを発見・修正**:
    1. `reject()`は`delete()`でUser/Companyを削除していたが両モデルとも`SoftDeletes`のため論理削除にしかならず、`users.email`のunique制約が残ったままになり**却下後に同じメールアドレスで再登録が永久にできなくなる**バグがあった。`forceDelete()`に変更して物理削除に修正（コード内コメントが元々想定していた「FK cascadeで片付く」という意図とも一致）。
    2. `approve()`は`invoices`テーブルが必須とする`contract_id`/`user_id`を渡さずInvoiceを作成しようとしており、**承認ボタンを押すと必ずSQLエラーで失敗する**バグがあった（ユーザーに確認の上、`ContractService::createContract()`でQuoteの内容を引き継いだContractを自動作成してからInvoiceを発行するよう修正、SPEC.md §7 K19参照）。
    3. 副次的に`detail()`で存在しない`$company->type`を参照していた点（正しくは`company_type`）も修正。
    - `tests/Feature/Admin/OnboardingApprovalTest.php`で承認・却下の両方を確認済み。全テストスイート実行で新規失敗なし。

- [x] **T5: 月次自動請求書のsent化を保証する回帰テストを追加**（完了: 2026-07-29、`fix/monthly-invoice-sent-regression-test`）
  - 対象ファイル: `app/Services/InvoiceService.php`、`app/Console/Commands/GenerateMonthlyInvoices.php`、`app/Console/Commands/SendPendingInvoices.php`
  - 内容: 2026-07-21付けで既に修正済み（`docs/BatchAutomationOverview.md`記載）だが自動テストが無い。月次自動生成・契約承認時自動生成の両経路でstatus=sent・PDF生成・メール送信・契約履歴記録までを保証するFeatureテストを追加する。
  - 完了の定義: 両経路のテストがGreen。→ `tests/Feature/Invoice/MonthlyInvoiceGenerationTest.php`で`InvoiceService::generateMonthlyInvoice()`を確認（status=sent・pdf_path・契約履歴`invoice_sent`・次回請求日更新まで）。`GenerateInvoiceJob`（契約承認時自動生成）も同じ`InvoiceService::sendInvoice()`を呼ぶ共通経路のため、二重にテストを書かず1本に集約した。

- [x] **T6: `MAIL_ADMIN_ADDRESS`を実際に届くアドレスに設定**（完了: 2026-07-29、`.env`は追跡対象外のためコミットなし）
  - 対象ファイル: `.env`
  - 内容: 現状キー自体が未設定（`.env.example`のダミー値`admin@example.com`にフォールバックする状態）。バッチ失敗通知・督促メール等の管理者宛通知が実際には届かない。
  - 完了の定義: バッチを意図的に失敗させ、通知が実アドレスに届くことを確認。→ `MAIL_FROM_ADDRESS`と同じ`info@katsucode.jp`をユーザー指示で設定し、`config('mail.admin_address')`が正しく反映されることを確認済み。実際のバッチ失敗時の受信確認は本番環境（フェーズ1 T15-T27）で行う。

- [x] **T7: `Contract::shouldGenerateInvoice()`と`GenerateMonthlyInvoices`の重複ロジックを整理**（完了: 2026-07-29、`chore/contract-invoice-eligibility-consolidation`）
  - 対象ファイル: `app/Models/Contract.php`(L339-358)、`app/Console/Commands/GenerateMonthlyInvoices.php`
  - 内容: モデル側に条件メソッドが定義されているが、コマンド側で同等条件を直接クエリしていないか確認し、重複があれば一本化する。
  - 完了の定義: 重複解消後も既存バッチの挙動が変わらないことをテストで確認。→ `shouldGenerateInvoice()`はどこからも呼ばれておらずクエリと重複したデッドコードだったと判明。クエリ自体はDB絞り込みに必要なため残し、生成直前に`shouldGenerateInvoice()`で再検証する安全網として組み込み、将来クエリ条件とモデル条件がずれた場合の事故を防ぐ形にした。`tests/Feature/Invoice/GenerateMonthlyInvoicesCommandTest.php`で対象/対象外の契約が正しく仕分けられることを確認。

- [x] **T8: Contract/Invoice/Quoteの金額計算ロジックにUnitテストを追加**（完了: 2026-07-29、`fix/pricing-calculation-unit-tests`）
  - 対象ファイル: `app/Services/ContractService.php`、`app/Services/InvoiceService.php`、`app/Services/QuoteService.php`
  - 内容: 税額計算・合計金額算出・採番ロジック（`quote_number`/`invoice_number`/`project_code`）に自動テストが無い。主要な計算メソッドにUnitテストを追加する。
  - 完了の定義: 主要計算メソッドにテストが存在しGreen。→ `ContractService::recalculateVersionAmounts()`（明細合計・割引・税額計算）、`QuoteService::recalculateVersionAmounts()`（同上＋キャンペーン割引の自動適用・期限切れ時のフォールバック）、`Campaign::calculateDiscount()`/`isCurrentlyActive()`にUnitテストを追加（`tests/Unit/Services/ContractServiceAmountCalculationTest.php`、`tests/Unit/Services/QuoteServiceAmountCalculationTest.php`、`tests/Unit/CampaignDiscountCalculationTest.php`）。採番ロジック（`quote_number`/`invoice_number`/`project_code`/`contract_number`）は既存のFeatureテスト群で間接的に検証済み（採番結果を含むレコード作成が繰り返しテストされている）のため、重複したUnitテストは追加していない。InvoiceServiceには`recalculateVersionAmounts`に相当する再計算メソッドは無く（請求書は生成時に確定した金額をそのまま保持する設計）、対象外。

- [x] **T8b: `User::primaryCompany()`のリレーション定義修正**（完了: 2026-07-29、`fix/user-primary-company-relation`。SPEC.md §7 K18として発見、ユーザー指示によりフェーズ2から繰り上げ対応）
  - 対象ファイル: `app/Models/User.php`
  - 内容: `hasOne(Company::class, 'company_user', 'user_id')`はピボットテーブル名を外部キー名として誤用しており、生成されるSQLが自己矛盾する条件になり常に空を返していた（例外は出ないため気づきにくい）。`app/Http/Controllers/User/ContactController.php`(L40)と`app/Http/Controllers/User/AppointmentController.php`(L99)で使用されており、ログイン済みユーザーのお問い合わせ・予約フォームで会社情報が常に空になっていた。
  - 完了の定義: 既存の`company()`（`is_primary`ピボットで絞ったBelongsToMany）を使うアクセサ`getPrimaryCompanyAttribute()`に置き換え。`tests/Unit/UserPrimaryCompanyTest.php`で確認済み。

### 2.2 個人情報保護・セキュリティの最低限の担保

- [x] **T9: `UpdateMediaRequest`にMIMEタイプ制限を追加**（完了: 2026-07-29、`fix/media-request-guard-and-mime`）
  - 対象ファイル: `app/Http/Requests/Media/UpdateMediaRequest.php`(L27,29)
  - 内容: `StoreMediaRequest`（`mimes:jpeg,jpg,png,gif,webp`）と異なり制限が無く、任意拡張子がアップロード可能。同水準の制限を追加する。
  - 完了の定義: 許可外拡張子でバリデーションエラーになることをテストで確認。→ Featureテストで確認済み。

- [x] **T10: 公開フォームへのthrottleミドルウェア追加**（完了: 2026-07-29、`fix/public-form-throttle`）
  - 対象ファイル: `routes/web.php`（`contact.store` L105、`quote.response.register.store` L119、`invoice.payment.store` L123）
  - 内容: 個人情報を伴うエンドポイントに`throttle`が無い（`consultation.store`のみ L110 で`throttle:5,1`設定済み）。同水準のthrottleを追加する。
  - 完了の定義: 各エンドポイントで超過時429が返ることをテストで確認。→ `contact.store`/`quote.response.store`/`quote.response.register.store`/`invoice.payment.store`に`throttle:5,1`を追加（`quote.response.store`は元のタスク一覧に無かったが、同じ公開トークン系エンドポイント群のため合わせて対応）。`tests/Feature/Public/PublicFormThrottleTest.php`で確認済み。

- [x] **T11: ログ出力への個人情報混入監査**（完了: 2026-07-29、`docs/log-pii-audit`。問題なし、修正不要）
  - 対象: app全体の`Log::info/error/debug`呼び出し（165箇所）
  - 内容: `$request->all()`やパスワード・トークンをそのまま出力していないか監査し、該当箇所があれば修正する。
  - 完了の定義: 監査結果をSPEC.md §6.1に反映。→ `$request->all()`/`$request`/モデルの`->toArray()`を直接渡している箇所は無く、いずれもID・ステータス・エラーメッセージ等の構造化されたコンテキストのみを渡す一貫したパターンだった。DBに保存する操作ログ（`ActivityLogMiddleware::sanitizeRequestData()`）は既に`password`/`token`/`api_key`等を`[FILTERED]`に置換する仕組みが実装済みで問題なし。

- [x] **T12: 本番用セッションCookie設定の確定**（完了: 2026-07-29、`docs/production-session-cookie-checklist`）
  - 対象ファイル: 本番用`.env`（TASKS 2.3で作成）、`config/session.php`
  - 内容: `SESSION_SECURE_COOKIE=true`等、本番用.envチェックリストに明記する。
  - 完了の定義: 本番`.env`テンプレートに反映済み。→ `docs/ProductionDeploymentGuide.md`の`.env`本番設定チェックリストに`SESSION_SECURE_COOKIE=true`を追記済み。実際の本番`.env`作成はT20で行う。

- [x] **T13: Spatie権限・2FA適用範囲の棚卸し**（完了: 2026-07-29、`docs/2fa-permission-audit`）
  - 内容: 全adminロールに2FAが強制されているか、バイパス経路が無いか確認する。
  - 完了の定義: 確認結果をSPEC.md §4に反映。→ ログインフローにバイパス経路は無いことを確認（資格情報検証と実ログインの分離が正しく実装済み）。一方で2FAは任意設定（opt-in）であり`owner`/`super_admin`にも強制されていないことが判明（フェーズ2以降の検討事項としてSPEC.md §4に記載）。権限whitelistの内容も確認、`permissions.index`等は別途`isSuperAdmin()`チェックで保護されていることを確認済み。

- [x] **T14: CORS設定の本番ドメイン限定化確認**（完了: 2026-07-29、`docs/cors-audit`。問題なし、修正不要）
  - 対象ファイル: `config/cors.php`
  - 内容: 許可オリジンが本番ドメイン・Atlasサブドメインのみに絞られているか検証する。
  - 完了の定義: 設定内容を確認、必要なら修正。→ `allowed_origins`は既に`CORS_ALLOWED_ORIGINS`環境変数（未設定時は`config('app.url')`にフォールバック）で自ドメインのみに限定されており、ワイルドカードではない。`paths`も`api/*`・`sanctum/csrf-cookie`のみが対象でInertiaの通常ページ遷移は対象外。Atlas関連のJSがメインドメインのAPIをクロスオリジンでfetchしている箇所は無く、Atlas用のCORS追加設定は不要と判断。本番では`APP_URL`を本番ドメインに設定すれば自動的にCORSも本番ドメインに限定される。

### 2.3 AWS Lightsail 本番デプロイ

`docs/ProductionDeploymentGuide.md`の未着手チェックリストをそのままタスク化する。

- [ ] **T15**: `Dockerfile.prod`作成（マルチステージ: `composer install --no-dev --optimize-autoloader` → `npm run build` → 実行用イメージにCOPY）
- [ ] **T16**: `compose.prod.yaml`作成（バインドマウント無し、phpMyAdmin除外、nginx+Let's Encrypt、Horizon常駐サービス、スケジューラ用cronコンテナ）
- [ ] **T17**: Lightsailインスタンス作成（Ubuntu 22.04/24.04、2GB以上、東京リージョン）・静的IP取得・ファイアウォール設定（80/443/22のみ、3306は非公開）
- [ ] **T18**: Xserver側DNS設定（Aレコードで静的IPを指す、ネームサーバー移管なし）
- [ ] **T19**: サーバーへのDocker/Docker Composeインストール・リポジトリclone
- [ ] **T20**: 本番用`.env`作成（`APP_ENV=production`, `APP_DEBUG=false`, `APP_URL`, `DB_*`, `SESSION_DOMAIN`, `INSTAGRAM_*`, `SEARCH_CONSOLE_DRIVER=google`, `MAIL_*`, `MAIL_ADMIN_ADDRESS`, `QUEUE_CONNECTION=database`をチェックリストに沿って設定。T12のセッション設定も含む）
- [ ] **T21**: `docker compose -f compose.prod.yaml up -d --build`で起動、HTTPS化（nginx+Certbot、証明書自動更新）
- [ ] **T22**: マイグレーション適用（`migrate --force`）・`admin:sync-permissions`実行・新規権限の管理者への付与
- [ ] **T23**: キャッシュ最適化（`config:cache`, `route:cache`, `view:cache`）
- [ ] **T24**: Horizon常駐・スケジューラ（`schedule:run`毎分cron）稼働確認
- [ ] **T25**: DBバックアップ運用実装（`mysqldump`定期実行、保持世代数を絞る＝例: 直近7日分のみ）
- [ ] **T26**: AWS Budgetsで金額アラート設定（想定月額の1.5倍等）
- [ ] **T27**: 1週間の自己検証チェックリスト実施（予約通知到達、リマインダーバッチ定刻動作、Instagram Webhookの`source=instagram`記録、Search Console実データ取得、スケジュール変更履歴・営業中判定APIの本番動作、AWS請求ダッシュボード確認）

### 2.4 Atlas「/apply」フォーム実装

- [x] **T28: データ設計を決定する**（完了: 2026-07-29、`feat/atlas-apply-form`）
  - 対象ファイル: `app/Models/Contact.php`、`app/Models/AtlasMembership.php`、`app/Models/AtlasInviteCode.php`
  - 内容: 審査・承認・課金は対象外のため「応募データを保存し管理者に通知する」最小構成でよい。`Contact.source`はenum制約の無いstring型のため、`source='atlas_apply'`として既存`Contact`テーブルを流用するか、新規モデルを作るかを決定する。決定内容をSPEC.md §5.9に追記する。
  - 完了の定義: 方針をSPEC.mdに明記。→ 既存`Contact`テーブルを流用する方針を採用。専用の`ContactCategory`（slug: `atlas-apply`、`ContactCategory::SLUG_ATLAS_APPLY`定数）を新設し、`source='atlas_apply'`で識別する。既存のContact通知メール・管理画面をそのまま流用できるメリットを優先。

- [x] **T29: リクエストバリデーション実装**（完了: 2026-07-29）
  - 対象ファイル: `app/Http/Requests/StoreContactRequest.php`（流用の場合は拡張）または新規`StoreAtlasApplicationRequest`
  - 完了の定義: バリデーションルール実装、公開フォームなので`authorize()`は`true`。→ 新規`StoreAtlasApplicationRequest`を作成（name/email必須、phone/message任意）。

- [x] **T30: Publicコントローラー実装・ルート差し替え**（完了: 2026-07-29）
  - 対象ファイル: `routes/web.php`（L49-52の`atlas.apply`を実フォーム表示・POST処理に変更）
  - 完了の定義: `/apply`が実際にフォームを表示し送信を受け付ける。→ 新規`Atlas\ApplicationController`を作成。`atlas.apply`(GET)/`atlas.apply.store`(POST、`throttle:5,1`)を追加。

- [x] **T31: `Public/AtlasApply.jsx`フォーム画面実装**（完了: 2026-07-29）
  - 対象ファイル: `resources/js/Pages/Public/AtlasApply.jsx`（新規）
  - 内容: 既存`Public/AtlasComingSoon.jsx`の配色・トーン（富裕層向けサービスのダークテーマ系）を踏襲する。`docs/PublicContactSubmissionGuide.md`のフォーム実装パターン（`Contact.jsx`）を参考にする。
  - 完了の定義: フォームがAtlasのトーンに合った見た目で表示される。→ Playwrightで実ブラウザ表示・送信を確認済み。

- [x] **T32: 申込み受付メール実装**（完了: 2026-07-29）
  - 内容: `docs/PublicContactSubmissionGuide.md`の`ContactReceivedMail`/`ContactNotificationMail`パターンを踏襲し、自動返信＋管理者通知の2通を実装。
  - 完了の定義: 送信キュー投入を確認。→ 新規メールクラスは作らず、既存の`ContactService::sendNotificationEmails()`（`ContactReceivedMail`/`ContactNotificationMail`）をそのまま呼び出す形で実装（T28の方針通り）。

- [x] **T33: 管理者が申込みを確認できる導線を用意**（完了: 2026-07-29、追加実装なし）
  - 内容: 既存Contact管理画面の拡張、または新設モデルの場合は簡易一覧画面を用意する。
  - 完了の定義: 管理画面から申込み内容が閲覧できる。→ `Admin\Contact\ContactController::index()`はカテゴリを動的に取得しており、新設した「Atlas利用申込み」カテゴリも既存のContact一覧・詳細画面にそのまま表示される。追加のUI実装は不要と判断。

- [x] **T34: Featureテスト追加・動作確認**（完了: 2026-07-29）
  - 内容: フォーム送信→レコード作成→メールキュー投入までのFeatureテストを追加し、`atlas.localhost`サブドメインでの実アクセスを確認する。
  - 完了の定義: テストGreen、実アクセス確認済み。→ `tests/Feature/Atlas/AtlasApplicationTest.php`（4パターン）。Playwrightで`atlas.localhost/apply`への実アクセス・フォーム送信・成功表示を確認。この過程で`contacts.message`がNOT NULL制約のため未入力時にDBエラーになる不具合を発見し、既定文言で補完するよう修正済み（テストにも反映）。

### 補足: ゼロ工数の即時クリーンアップ

- [x] **T35**（完了: 2026-07-29、PR #27）: git作業ツリー上で削除済み・unstagedのままの`app/Http/Controllers/{LoginLog,MediaSetting,MediaVariant}Controller.php`（未使用の空stub、ルーティング依存ゼロ確認済み）をフェーズ1着手前にコミットする。

---

## 3. フェーズ2: 継続タスク（期限なし）

### 3.1 Repository/Service完全移行

SPEC.md §7 K9の通り、実際に未移行なのは以下**4エンティティのみ**（`docs/RepositoryServiceMigrationGuide.md`の記述は古い。User/Service/Company/Faq/Contact/Quote/Post/PostCategory/Adminは移行済み）。1エンティティ1タスクとして扱う。

- [x] `ContractRepository`/`ContractService` → `SoftDeletableRepository`/`BaseService`へ移行（Contractは`SoftDeletes`使用）（完了: 2026-07-29、`chore/migrate-contract-repository-service`）。既存の`getPaginated($filters, 20)`呼び出し（`Admin\Contract\ContractController`）はBaseServiceの`getPaginated(filters, sort, perPage)`とシグネチャ非互換だったため、呼び出し側を名前付き引数`getPaginated($filters, perPage: 20)`に修正して対応。
- [x] `InvoiceRepository`/`InvoiceService` → `SoftDeletableRepository`/`BaseService`へ移行（完了: 2026-07-30、`chore/migrate-invoice-repository-service`）。Contract移行時と同様、`Admin\Invoice\InvoiceController`の`getPaginated($filters, 20)`呼び出しを`getPaginated($filters, perPage: 20)`に修正。旧`paginate()`が使っていた`sort['column']`キーは実際にはどこからも使われていなかったため、他の移行済みリポジトリと同じ`sort['field']`規約に統一した。
- [x] `PaymentRepository`/`PaymentService` → `BaseRepository`/`BaseService`へ移行（`SoftDeletes`未使用）（完了: 2026-07-30、`chore/migrate-payment-repository-service`）。旧`PaymentRepositoryInterface`は`query()`/`confirm()`しか宣言していなかった（実装クラスにはpaginate/findById等もあったが未宣言）ため、`BaseRepositoryInterface`継承により正式に宣言される形に整理。`create()`/`update()`/`delete()`/`confirm()`は請求書ステータス更新・領収書自動発行の副作用があるため個別実装を維持（`update()`/`delete()`はPHPの引数共変性制約によりBaseServiceと同じ`mixed`型に変更）。`Admin\PaymentController`の`getPaginated($filters, 20)`呼び出しも名前付き引数に修正。
- [ ] `ProjectRepository`/`ProjectService` → `SoftDeletableRepository`/`BaseService`へ移行
- [ ] 全エンティティ移行完了後、`docs/RepositoryServiceMigrationGuide.md`の進捗記述を更新

### 3.2 Button/CrudButtonsコンポーネント統一

- [ ] 旧`PrimaryButton`/`SecondaryButton`/`DangerButton`使用箇所を画面グループ単位（Admin/Contract配下、Admin/Invoice配下等）でタスク化し、新`@/Components/Buttons`の`Button`/`CrudButton`/`IconButton`に置き換える（一括置換はしない）
- [ ] 置き換え完了後、後方互換用に残置されている旧コンポーネントを削除するか判断

### 3.3 コード衛生・デッドコード整理

- [ ] `resources/js/Components/RichTextEditor.jsx`（`<textarea>`のTODOスタブ）のimport先を全て`Components/Forms/RichTextEditor.jsx`へ向け直し、スタブを削除
- [ ] `app/Http/Controllers/Admin/Schedule/ScheduleDefaultController.php`の未使用stub（create/store/show/edit/update/destroy）を削除、または実装するか判断
- [ ] アプリ名統一: 正式名称を決定し、`composer.json`(`name`)・`.env`/`.env.example`(`APP_NAME`)・`docs/`内の"SmartSprouts"表記を統一する
- [ ] `routes/web.php`・`routes/api.php`のコメントアウト済みルート（`/plans`、`/careers`、トークン式オンボーディング、`auth:api`ガード）を実装するか削除するか判断
- [ ] 未参照の`app/Http/Controllers/User/OnboardingController.php`を削除（`docs/OnboardingSystemGuide.md`に削除候補として記載済み）

### 3.4 テストカバレッジ拡充

- [ ] フェーズ1で追加したテスト（T3, T5, T8等）を土台に、Contract/Invoice/Quote/Project/Appointmentの主要フローへFeatureテストを拡充

### 3.5 docs記載の未実装機能群

- [ ] ガントチャートのドラッグ&ドロップ編集・並び替え（`docs/ProjectWorkflowGuide.md`）
- [ ] Projectのファイルアップロード機能、ProjectUpdate作成フォーム
- [ ] 予約の繰り返し枠設定・クライアント向け予約UI・カレンダー連携（`docs/AppointmentSystemGuide.md`）
- [ ] Search Console実連携への切替検証（`SEARCH_CONSOLE_DRIVER=google`、本番接続後）

---

## 4. タスク粒度に関する指針

- 1人体制（+Claude Code）・1ヶ月という制約から、フェーズ1の各タスクは**1〜3日で完了できる粒度**に分解している。
- 大きすぎるタスク（例: 「Repository/Service移行」を1つにまとめる）は避け、エンティティ単位・画面グループ単位で分割する。
- 小さすぎるタスク（例: 1ファイルのimport文修正のみ）は関連ファイル群でまとめてバッチ化する。
- T1〜T5・T9は「バグ修正」ではなく「検証＋テスト追加＋doc更新」が主作業であるものが混在している点に注意（SPEC.md §7参照）。
