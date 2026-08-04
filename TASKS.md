# TASKS.md — Spra 実装タスク一覧

最終更新: 2026-08-03

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

- [x] **T14b: Admin/Userのログインパスワードポリシーを強化**（完了: 2026-07-30、`fix/password-policy-strengthening`。ユーザー指示、SPEC.md §7 K25参照）
  - 対象ファイル: `app/Providers/AppServiceProvider.php`、`app/Http/Controllers/QuoteResponseController.php`、`app/Services/AdminService.php`、`app/Services/UserService.php`
  - 内容: `Rules\Password::defaults()`にカスタム設定が無く、Laravelの素の既定値（8文字以上のみ、複雑性要件なし）のままだった。`AppServiceProvider::boot()`で`Password::min(12)->mixedCase()->numbers()`（本番のみ`uncompromised()`追加）を一元設定。`QuoteResponseController`のオンボーディング登録（`min:8`のみのインラインルールで中央ポリシーを迂回していた）もこれに統一。管理者・クライアント企業担当者の自動生成パスワード（`Str::random(12)`）も、たまたま数字や大文字を含まない可能性があったため`Str::password(12, letters: true, numbers: true, symbols: false)`に変更しポリシーを確実に満たすようにした。
  - 完了の定義: 弱いパスワードが拒否され、強いパスワードが通ることをテストで確認。→ `tests/Feature/PasswordPolicyTest.php`で確認済み（ポリシー未達の拒否・充足時の許可・Admin/UserServiceの自動生成パスワードがポリシーを満たすことの3点）。既存の`tests/Feature/Auth/PasswordUpdateTest.php`・`tests/Feature/QuoteResponseRegistrationSyncTest.php`のテストデータもポリシー準拠のパスワードに更新。

### 2.3 AWS Lightsail 本番デプロイ

`docs/ProductionDeploymentGuide.md`の未着手チェックリストをそのままタスク化する。

- [x] **T15**: `Dockerfile.prod`作成（マルチステージ: `composer install --no-dev --optimize-autoloader` → `npm run build` → 実行用イメージにCOPY）（完了: 2026-07-30、`feat/dockerfile-prod`）
  - 対象ファイル: `Dockerfile.prod`（新規）、`.dockerignore`（新規）
  - 内容: `composer`イメージでの依存解決（`--ignore-platform-reqs`で拡張チェックを一旦無視、実行時拡張は最終イメージ側で用意）、`node:22-alpine`でのViteビルド、`php:8.4-fpm-alpine`ベースの実行イメージ（`pdo_mysql`/`gd`/`intl`/`bcmath`/`exif`/`zip`/`opcache`/`pcntl`/`redis`を導入）の3段階マルチステージ構成。php-fpmで9000番待受、リバースプロキシ（T16）から接続する想定。
  - **重要な発見**: ローカル検証中、`npm run build`単体でJavaScriptヒープ不足によるOOMが発生した（Docker Desktopのデフォルト割当2GBのため）。`mermaid`/`cytoscape`等の重量級ライブラリを含むバンドルのため、**本番のLightsailインスタンスも最低2GBでは同様にビルド時OOMのリスクが高い**と判明。ローカル検証はDocker Desktopのメモリ割当を8GBに増やして解消した。本番側の対応は`docs/ProductionDeploymentGuide.md`に追記済み（後述）。
  - 完了の定義: `docker build -f Dockerfile.prod .`がローカルで完走し、生成イメージで`php artisan --version`が正常に動作すること。→ 確認済み（`vendor/`が`--no-dev`で構築されていること、`public/build/manifest.json`が存在すること、`bootstrap/cache/*.php`のようなローカル生成物混入がないよう`.dockerignore`で除外済みであることも確認）。
- [x] **T16**: `compose.prod.yaml`作成（バインドマウント無し、phpMyAdmin除外、Caddyによる自動HTTPS、Horizon常駐サービス、スケジューラ用ループコンテナ）（完了: 2026-07-30、`feat/compose-prod`）
  - 対象ファイル: `compose.prod.yaml`（新規）、`Caddyfile`（新規）、`Dockerfile.prod`（`caddy`ステージ追加）、`.env.example`（`APP_DOMAIN`/`CADDY_ACME_EMAIL`追加）
  - 内容: HTTPS終端はnginx+Certbotではなく**Caddy**を採用（ユーザー判断。個人運用規模のため自動証明書取得・更新の運用負荷が低い方を優先）。`app`（php-fpm）・`caddy`（リバースプロキシ）・`horizon`（キューワーカー常駐）・`scheduler`（`schedule:run`を60秒間隔で呼ぶループ、Alpineベースのため通常cronは使わず）・`mysql`・`redis`の6サービス構成。詳細は`docs/ProductionDeploymentGuide.md`に追記済み。
  - 完了の定義: `docker compose -f compose.prod.yaml up -d --build`がローカルで完走し、Caddy経由でリクエストがphp-fpmまで到達すること。→ 確認済み（`localhost`ドメインでCaddyの自動HTTPS・HTTP→HTTPSリダイレクト・fastcgi疎通を確認。本番ドメインでの実証明書取得確認はT17以降で行う）。

- [x] **T16b: 本番環境で例外発生時にエラーページが表示されない（真っ白な500レスポンス）バグを修正**（完了: 2026-07-30、`fix/production-error-page-missing`。SPEC.md §7 K23として発見、T16検証中にユーザー指示により優先度を上げて対応）
  - 対象ファイル: `bootstrap/app.php`（汎用例外ハンドラ）、`resources/views/errors/`（新規）
  - 内容: `bootstrap/app.php`の汎用`Throwable`ハンドラが、本番環境で常に`response()->view('errors.500', [], 500)`を呼んでいたが、`resources/views/errors/`ディレクトリ自体が存在せず、**原因を問わずあらゆる例外（404/419/403含む）が空の500レスポンスになっていた**。ハンドラを実際のHTTPステータスコード（`HttpExceptionInterface::getStatusCode()`）に応じて`errors.{code}`ビューを描画し、専用ビューが無ければ`errors.500`にフォールバックするよう修正。共通レイアウト`errors/minimal.blade.php`を作り、`404`/`403`/`419`/`429`/`500`/`503`の各ビューはそこに委譲する形にした。
  - 完了の定義: 本番相当の環境（`APP_ENV=production`かつ`APP_DEBUG=false`相当）で404・未処理例外の両方が正しいステータスコード・空でないレスポンスになることをテストで確認。→ `tests/Feature/ProductionErrorPageTest.php`で確認済み（`$this->app->detectEnvironment()`でproduction環境を模擬）。

- [x] **T17**: Lightsailインスタンス作成（Ubuntu 24.04 LTS、4GB以上、東京リージョン）・静的IP取得・ファイアウォール設定（80/443/22のみ、3306は非公開）（完了: 2026-07-31）
  - 内容: インスタンス名`smartsprouts-production`。K22の発見（ビルド時OOMリスク）を踏まえ、2GBではなく**4GB以上**のプランを選択。静的IPを取得・アタッチ、ファイアウォールで80/443を「Any IPv4」で許可（22はデフォルトのSSH許可のまま）。
- [x] **T18**: Xserver側DNS設定（本番ドメインと`ATLAS_DOMAIN`サブドメインの両方でAレコードを静的IPに向ける、ネームサーバー移管なし、MX/TXT等メール関連レコードは変更しない）（完了: 2026-07-31）
  - 内容: `smartsprouts.jp`・`www.smartsprouts.jp`・`*.smartsprouts.jp`（ワイルドカードが`atlas`を含め全サブドメインをカバー）の3つのAレコードを静的IPに変更。切替前にTTLを3600→300に短縮し、半日待ってから実施、安定確認後に3600へ復元。
  - **重要な教訓（本番切替で発生した実障害）**: MXレコードが`smartsprouts.jp`自体（ドメイン本体）を指す設定だったため、Web用Aレコードの変更が**メール受信を停止させてしまった**（AWSのMFA確認メールが届かず一時ログイン不能に）。原因はMXの参照先が独立したホスト名ではなくドメイン本体だったこと。`mail.smartsprouts.jp`という専用サブドメインを新設しXserverの元IP（`202.254.239.146`）を割り当て、MXの参照先をそちらに変更して復旧した。**教訓**: DNS移行時は「AレコードとMXレコードが同じホスト名を共有していないか」を事前に必ず確認すること。SPEC.md §7 K26として記録。
- [x] **T19**: サーバーへのDocker/Docker Composeインストール・リポジトリclone（完了: 2026-07-31）
  - 内容: Ubuntu公式手順でDocker CE・Composeプラグインを導入。GitHub CLI（`gh`）をインストールしdevice flow認証、`gh repo clone`でプライベートリポジトリを取得。
- [x] **T20**: 本番用`.env`作成（`APP_ENV=production`, `APP_DEBUG=false`, `APP_URL`, `DB_*`, `SESSION_DOMAIN`, `INSTAGRAM_*`, `SEARCH_CONSOLE_DRIVER=google`, `MAIL_*`, `MAIL_ADMIN_ADDRESS`, `QUEUE_CONNECTION=database`をチェックリストに沿って設定。T12のセッション設定も含む）（完了: 2026-07-31）
  - 内容: `APP_NAME`を懸案だったK13（アプリ名不一致）を機に`SmartSprouts`に確定（フロントエンドのハードコード「Spra」表記統一は引き続きフェーズ2で対応）。`DB_PASSWORD`はサーバー上で`openssl rand`により生成しチャットには残さない運用とした。`QUEUE_CONNECTION`は本ガイドのチェックリスト記載`database`ではなく、実際の`.env.example`・Horizon運用に合わせ`redis`のまま維持（チェックリストの記載が実態と異なっていたため、`docs/ProductionDeploymentGuide.md`を訂正）。`MAIL_*`（Xserver SMTP）は本番投入後に別途設定する方針でユーザー承認済み。
  - **`MAIL_*`設定を実施（2026-08-01）**: Xserverのメールアカウント（`info@smartsprouts.jp`）のSMTP情報を設定。当初メールが実際に届かず、原因切り分けに手間取った。判明した落とし穴は次の3点。
    1. このLaravelバージョン（12）では`MAIL_ENCRYPTION`は`config/mail.php`のどこからも参照されておらず無効。ポート465（暗黙的TLS）を使う場合は`MAIL_SCHEME=smtps`が必要（`config/mail.php`のsmtpドライバ定義参照）。
    2. `.env`更新後は`config:clear`＋`config:cache`の実行が必須（`config:cache`済みの状態だと`.env`変更が反映されない）。
    3. **最大の原因**: `docker compose restart app horizon`は既存コンテナをそのまま再起動するだけで、`compose.prod.yaml`の`env_file: .env`で読み込まれる環境変数は**コンテナ作成時点のまま凍結**されており、`.env`ファイル自体を更新しても反映されない。Laravelは`.env`ファイルより既存のOS環境変数を優先するため、`config:cache`をやり直しても解決しなかった。`docker compose up -d --force-recreate app horizon`でコンテナを作り直して解消。**教訓**: 本番で`.env`の値（特にコンテナ作成時にenv_file経由で読み込まれる変数）を変更した際は、`restart`ではなく`up -d --force-recreate`（またはコンテナの再作成を伴う操作）が必要。
    - 実際にWordPressのお問い合わせフォームから送信し、自動返信・管理者通知の両方が届くことを確認済み。
- [x] **T21**: `docker compose -f compose.prod.yaml up -d --build`で起動、HTTPS化（Caddyが`APP_DOMAIN`宛の証明書を自動取得・更新するため追加作業は基本不要）（完了: 2026-07-31）
  - **副次的発見・修正**: `compose.prod.yaml`の`app`/`horizon`/`scheduler`が`env_file: .env`のみで`.env`ファイル自体をコンテナにマウントしておらず、`php artisan key:generate`（ファイルへの直接書き込みが必要）が失敗することが判明。3サービスの`volumes`に`./.env:/var/www/html/.env:ro`を追加して解消（本番サーバー側で緊急対応、リポジトリへの反映は別途）。APP_KEYはコンテナ経由ではなく`openssl rand -base64 32`で生成しサーバー上の`.env`に直接設定。DNS伝播直後はCaddyの証明書取得が長いバックオフに入り自動リトライが遅延したため、`docker compose restart caddy`で強制的に再試行させ取得に成功。
- [x] **T22**: マイグレーション適用（`migrate --force`）・`admin:sync-permissions`実行・新規権限の管理者への付与（完了: 2026-07-31）
- [x] **T23**: キャッシュ最適化（`config:cache`, `route:cache`, `view:cache`）（完了: 2026-07-31）
- [x] **T24**: Horizon常駐・スケジューラ（`schedule:run`毎分cron）稼働確認（完了: 2026-07-31）
  - 内容: 起動直後、マイグレーション未実行の状態でHorizonが`cache`テーブル不在エラーを出していたが、マイグレーション完了後は安定稼働を確認（`restart: always`のため起動直後の一時的なエラーは想定内）。スケジューラは`schedule:run`ループが正常に動作（実行対象コマンド無しの状態を確認）。
- [x] **T25**: DBバックアップ運用実装（`mysqldump`定期実行、保持世代数を絞る＝例: 直近7日分のみ）（完了: 2026-07-31、`chore/db-backup-script`）
  - 対象ファイル: `scripts/backup-db.sh`（新規）
  - 内容: ユーザー判断により、保存先はS3等の外部ストレージではなく**Lightsailインスタンス内のみ**（`~/db-backups`）とした（追加コスト・IAM設定不要、シンプルさを優先）。`compose.prod.yaml`のmysqlサービスに対して`mysqldump`を実行しgzip圧縮、直近7日分より古いものは自動削除。
  - 完了の定義: 手動実行でバックアップファイルが作成されることを確認し、cron登録まで行う。→ 本番サーバーで手動実行（43KBのバックアップファイル生成を確認）、`crontab -e`で毎日AM4:00実行を登録済み（`crontab -l`で反映確認済み）。
- [x] **T26**: AWS Budgetsで金額アラート設定（想定月額の1.5倍等）（完了: 2026-07-31）
  - 内容: Cost budget（Monthly）を作成。アラートは「実績コストが80%超過」「予測コストが100%超過」の2つを設定、通知先メールアドレスを登録。「アラートにアクションを追加」（しきい値超過時のリソース自動停止等）は、本番稼働中にコスト超過を理由に自動でインスタンスが止まるリスクを避けるためあえて設定しなかった。
- [ ] **T27**: 1週間の自己検証チェックリスト実施（予約通知到達、リマインダーバッチ定刻動作、Instagram Webhookの`source=instagram`記録、~~Search Console実データ取得~~、スケジュール変更履歴・営業中判定APIの本番動作、AWS請求ダッシュボード確認）
  - Search Console実データ取得は完了（2026-07-31）。ドメイン所有権のDNS TXT確認、サービスアカウント作成・権限付与、本番`.env`設定、鍵ファイルのコンテナ内配置まで完了し`analytics:sync-search-console`が正常終了（新規ドメインのため現時点はクエリ0件、データ反映まで数日想定）。詳細は`docs/ProductionDeploymentGuide.md`参照
  - Instagram連携はMeta for Developers側の一時的な不具合（アクセストークン生成時に「開発者の役割が不十分です」からの`We're working on getting this fixed as soon as we can.`表示）により保留中
  - お問い合わせについては、既存WordPressサイト（Contact Form 7）からSpra API（`POST /api/contacts`）への切替を実施（2026-07-31、`docs/katsucode`のWordPressテーマ側で対応、Spra側のコード変更なし）。動作確認済み

- [x] **T27b: 公開サイトFooterの壊れたリンクを修正**（完了: 2026-07-30、`fix/public-footer-broken-links`。本番リリース前の最終確認としてユーザー指示によりPublic/User配下のリンク切れを調査、SPEC.md §7 K24として発見・優先度を上げて対応）
  - 対象ファイル: `resources/js/Components/Public/Footer.jsx`
  - 内容: 全公開ページ共通のFooterに、`routes/web.php`で未実装（コメントアウトのまま）の`/plans`・`/careers`、およびルート自体が存在しない`/sitemap`へのリンクが残っており、クリックすると404になっていた。ユーザー判断により3本ともリンクを削除して対応（`/careers`は`Careers.jsx`ページ自体は実装済みだが、ルート有効化は別途の機能判断が必要なため今回は見送り）。
  - 完了の定義: `route()`呼び出し・ハードコードされたhrefが実在するルートと一致していることを確認。→ Public/User配下71種類の`route()`呼び出しを全数照合（Explore調査）、Userは問題なし、Publicはこの3件のみが該当。`npm run build`でビルドエラーが無いことも確認。

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
- [x] `ProjectRepository`/`ProjectService` → `SoftDeletableRepository`/`BaseService`へ移行（完了: 2026-07-30、`chore/migrate-project-repository-service`）。旧`ProjectRepositoryInterface`も`paginate`/`findById`/`create`/`update`/`delete`が未宣言だったため、`SoftDeletableRepositoryInterface`継承により正式に宣言。`Admin\Project\ProjectController::index()`は元々Service/Repositoryを経由せず`Project::with(...)->paginate(20)`を直接呼んでいたため、`getPaginated()`のシグネチャ変更による呼び出し元修正は不要だった（`getPaginated()`自体が実質使われていなかった）。`update()`/`delete()`はPayment同様、引数共変性制約により`mixed`型に変更。
- [x] 全エンティティ移行完了後、`docs/RepositoryServiceMigrationGuide.md`の進捗記述を更新（完了: 2026-07-30）

### 3.2 Button/CrudButtonsコンポーネント統一

- [ ] 旧`PrimaryButton`/`SecondaryButton`/`DangerButton`使用箇所を画面グループ単位（Admin/Contract配下、Admin/Invoice配下等）でタスク化し、新`@/Components/Buttons`の`Button`/`CrudButton`/`IconButton`に置き換える（一括置換はしない）
- [ ] 置き換え完了後、後方互換用に残置されている旧コンポーネントを削除するか判断

### 3.3 コード衛生・デッドコード整理

- [x] `resources/js/Components/RichTextEditor.jsx`（`<textarea>`のTODOスタブ）を削除。既存のimportは全て`Components/Forms/RichTextEditor.jsx`を参照済みで、スタブへの参照はゼロだったことを確認済み（2026-07-30, `chore/code-hygiene-cleanup`）
- [x] `app/Http/Controllers/Admin/Schedule/ScheduleDefaultController.php`の未使用stub（create/store/show/edit/update/destroy）を削除。`routes/admin/schedule.php`で実際にルーティングされているのは`index`/`bulkUpdate`のみと確認済み。使用箇所がなくなった`app/Http/Requests/ScheduleDefaultRequest.php`も合わせて削除（2026-07-30）
- [ ] アプリ名統一: 正式名称を決定し、`composer.json`(`name`)・`.env`/`.env.example`(`APP_NAME`)・`docs/`内の"SmartSprouts"表記を統一する（2026-07-30: ユーザー判断により対応保留。決定後に再着手）
- [x] `routes/web.php`・`routes/api.php`のコメントアウト済みルートを整理（2026-07-30）。トークン式オンボーディング（`/onboarding/{token}`）は`QuoteResponseController::registerShow`/`registerStore`（`quote.response.register.*`）に実質置き換わっており未使用と確認、コメントごと削除。`api.php`の`auth:api`ガードのプレースホルダーも本プロジェクトでは未使用（`admins`/`users`の2ガード構成）のため削除。`/plans`・`/careers`は画面実装済みだが公開判断が未了のため、コメントアウトのまま保留
- [x] 未参照の`app/Http/Controllers/User/OnboardingController.php`を削除（2026-07-30）。調査の結果、トップレベルの`app/Http/Controllers/OnboardingController.php`も参照元がなくなっていたため合わせて削除

### 3.4 テストカバレッジ拡充

- [ ] フェーズ1で追加したテスト（T3, T5, T8等）を土台に、Contract/Invoice/Quote/Project/Appointmentの主要フローへFeatureテストを拡充

### 3.5 docs記載の未実装機能群

- [x] ガントチャートのドラッグ&ドロップ編集・並び替え（`docs/ProjectWorkflowGuide.md`）（2026-07-30）。日付・進捗のドラッグ編集は既に実装済みと判明。並び替え（sort_order保存）のみ未実装だったため、`ProjectItemController::reorder`を追加し`GanttChart/Show.jsx`のhandleTaskReorderをサーバー保存に接続
- [x] Projectのファイルアップロード機能、ProjectUpdate作成フォーム（2026-07-30）。ファイルアップロードは`ProjectFile`モデル・Repository/Service・Controllerを新規実装（`private`ディスク保存）。ProjectUpdate作成フォームはバックエンドAPIが既に実装済みと判明したため、モーダルフォーム（フロントのみ）を追加
- [x] 予約の繰り返し枠設定・クライアント向け予約UI・カレンダー連携（`docs/AppointmentSystemGuide.md`）（2026-07-30）。クライアント向け予約UI（`User/AppointmentController`等）とカレンダーへの予約統合（`ScheduleController::calendar()`）は既に実装済みと判明（docsの「保留中」記載が古いだけ）。繰り返し予約枠設定は`AppointmentSlotRecurrence`（曜日・時間帯パターン）を新規実装。作成時に90日先まで先行生成し、以降は`appointments:generate-recurring-slots`コマンド（毎日6:00実行）が継ぎ足す方式とした
- [x] Search Console実連携の実装（2026-07-31）。`SEARCH_CONSOLE_DRIVER=google`は従来コード未実装（`RuntimeException`を投げるダミー）だったと判明。`GoogleSearchConsoleService`（サービスアカウントJWT認証、追加依存なし）を新規実装し単体テスト追加。本番`.env`設定・実データ取得確認はT27で実施

### 3.6 Admin向けタスク管理機能（新規実装）

- [x] Admin向けタスク管理機能一式を実装（完了: 2026-08-03、`feat/task-management`）。`tasks`/`task_categories`テーブル、Repository/Service層、3カラム固定のカンバンボードUI（`/admin/task`、`@dnd-kit`でドラッグ&ドロップ）、繰り返しタスク生成バッチ（`tasks:generate-recurring`、毎日06:10）、期限リマインダー通知バッチ（`tasks:send-reminders`、15分おき）、ダッシュボード「今日やること」ウィジェット、Admin詳細画面「担当タスク」タブまで実装済み。詳細はSPEC.md §5.12参照
- [x] 繰り返しタスク作成UI・タグ入力/絞り込みUIを追加（完了: 2026-08-04、`feat/task-recurrence-ui`）。最終コードレビューで、毎週指定かつ曜日未選択（`byweekday: []`）だとテンプレートが永久に実体タスクを生成しない不具合を発見し、フロントエンド送信ガード・バックエンドバリデーション（`min:1`）・サービス層フォールバックの三重対策で修正。あわせてタグ絞り込み入力のデバウンス化・前後空白トリム、繰り返しタスク当日分の即時生成が未来日付テンプレートの生成開始日を狂わせないよう修正。詳細はSPEC.md §5.12・§10参照

以下はスコープ外として意図的に見送った項目。フェーズ2の新規候補として記録する。

- [ ] タスクへのコメント・添付ファイル機能
- [ ] 複数Admin共同担当（現状は単一担当者のみ）
- [ ] 既存のシフト/予約カレンダーとの統合表示
- [ ] カスタムステータス列（現状は未着手/進行中/完了の3列固定）

### 3.7 クライアントヒアリング機能（小規模版実装済み）

初回商談・電話でのヒアリング内容を体系的に記録し、見積作成につなげる機能。ユーザー要望（2026-08-04ヒアリング）を受けて設計案を提示・承認済み。実装は別途着手する。

**データフロー**: `Contact`（問い合わせ） → `Hearing`（ヒアリングシート） → `Quote`（見積作成、`requirements`/`custom_specifications`へ転記）

**データモデル案**:
- `hearing_templates`: 質問テンプレートのマスタ（業態ごとに複数テンプレートを持てる）
- `hearing_template_items`: 個々の質問項目（`type`: single_choice/multi_choice/text/number、`category`: サイト目的／デザイン／ページ構成／機能要件／参考サイト／予算感／納期／その他、`options`: 選択肢のJSON）
- `hearings`: 実際のヒアリング記録（`contact_id`または`quote_id`に紐づく）
- `hearing_answers`: 各質問への回答（`hearing_template_item_id` + 選択値/自由記述）

**画面イメージ**: Admin側「ヒアリング作成」画面でカテゴリごとにアコーディオン表示、チェックボックス/ラジオボタンで対面・電話しながらその場で記録。各カテゴリ末尾に「その他・自由記述」欄。

**想定質問例（Web制作の場合）**: サイト種別（コーポレート/LP/EC/予約システム/その他）、参考サイトURL（複数）、ページ数の目安、必須機能（お問い合わせフォーム/ブログ/会員機能/決済/多言語対応等、複数選択）、既存資産（ロゴ・写真・原稿）の有無、予算感（レンジ選択）、希望納期

**実装スコープの判断**: フルスコープ（テンプレート管理画面込み、テーブル4本）はやや大きいため、まずは「質問項目はSeederで固定投入、テンプレート管理画面は無し、ヒアリング作成・回答・一覧のみ」の小規模版から着手するのが現実的（ユーザー承認済み、2026-08-04）。

- [x] 小規模版（Seeder固定の質問項目＋ヒアリング作成・回答・一覧画面）を実装
- [ ] 見積作成時に「このヒアリングから見積を作成」導線でrequirements/custom_specificationsへ転記する機能
- [ ] （将来）テンプレート管理画面への拡張

---

## 4. タスク粒度に関する指針

- 1人体制（+Claude Code）・1ヶ月という制約から、フェーズ1の各タスクは**1〜3日で完了できる粒度**に分解している。
- 大きすぎるタスク（例: 「Repository/Service移行」を1つにまとめる）は避け、エンティティ単位・画面グループ単位で分割する。
- 小さすぎるタスク（例: 1ファイルのimport文修正のみ）は関連ファイル群でまとめてバッチ化する。
- T1〜T5・T9は「バグ修正」ではなく「検証＋テスト追加＋doc更新」が主作業であるものが混在している点に注意（SPEC.md §7参照）。
