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

- [ ] **T5: 月次自動請求書のsent化を保証する回帰テストを追加**
  - 対象ファイル: `app/Services/InvoiceService.php`、`app/Console/Commands/GenerateMonthlyInvoices.php`、`app/Console/Commands/SendPendingInvoices.php`
  - 内容: 2026-07-21付けで既に修正済み（`docs/BatchAutomationOverview.md`記載）だが自動テストが無い。月次自動生成・契約承認時自動生成の両経路でstatus=sent・PDF生成・メール送信・契約履歴記録までを保証するFeatureテストを追加する。
  - 完了の定義: 両経路のテストがGreen。

- [ ] **T6: `MAIL_ADMIN_ADDRESS`を実際に届くアドレスに設定**
  - 対象ファイル: `.env`
  - 内容: 現状キー自体が未設定（`.env.example`のダミー値`admin@example.com`にフォールバックする状態）。バッチ失敗通知・督促メール等の管理者宛通知が実際には届かない。
  - 完了の定義: バッチを意図的に失敗させ、通知が実アドレスに届くことを確認。

- [ ] **T7: `Contract::shouldGenerateInvoice()`と`GenerateMonthlyInvoices`の重複ロジックを整理**
  - 対象ファイル: `app/Models/Contract.php`(L339-358)、`app/Console/Commands/GenerateMonthlyInvoices.php`
  - 内容: モデル側に条件メソッドが定義されているが、コマンド側で同等条件を直接クエリしていないか確認し、重複があれば一本化する。
  - 完了の定義: 重複解消後も既存バッチの挙動が変わらないことをテストで確認。

- [ ] **T8: Contract/Invoice/Quoteの金額計算ロジックにUnitテストを追加**
  - 対象ファイル: `app/Services/ContractService.php`、`app/Services/InvoiceService.php`、`app/Services/QuoteService.php`
  - 内容: 税額計算・合計金額算出・採番ロジック（`quote_number`/`invoice_number`/`project_code`）に自動テストが無い。主要な計算メソッドにUnitテストを追加する。
  - 完了の定義: 主要計算メソッドにテストが存在しGreen。

### 2.2 個人情報保護・セキュリティの最低限の担保

- [x] **T9: `UpdateMediaRequest`にMIMEタイプ制限を追加**（完了: 2026-07-29、`fix/media-request-guard-and-mime`）
  - 対象ファイル: `app/Http/Requests/Media/UpdateMediaRequest.php`(L27,29)
  - 内容: `StoreMediaRequest`（`mimes:jpeg,jpg,png,gif,webp`）と異なり制限が無く、任意拡張子がアップロード可能。同水準の制限を追加する。
  - 完了の定義: 許可外拡張子でバリデーションエラーになることをテストで確認。→ Featureテストで確認済み。

- [ ] **T10: 公開フォームへのthrottleミドルウェア追加**
  - 対象ファイル: `routes/web.php`（`contact.store` L105、`quote.response.register.store` L119、`invoice.payment.store` L123）
  - 内容: 個人情報を伴うエンドポイントに`throttle`が無い（`consultation.store`のみ L110 で`throttle:5,1`設定済み）。同水準のthrottleを追加する。
  - 完了の定義: 各エンドポイントで超過時429が返ることをテストで確認。

- [ ] **T11: ログ出力への個人情報混入監査**
  - 対象: app全体の`Log::info/error/debug`呼び出し
  - 内容: `$request->all()`やパスワード・トークンをそのまま出力していないか監査し、該当箇所があれば修正する。
  - 完了の定義: 監査結果をSPEC.md §6.1に反映。

- [ ] **T12: 本番用セッションCookie設定の確定**
  - 対象ファイル: 本番用`.env`（TASKS 2.3で作成）、`config/session.php`
  - 内容: `SESSION_SECURE_COOKIE=true`等、本番用.envチェックリストに明記する。
  - 完了の定義: 本番`.env`テンプレートに反映済み。

- [ ] **T13: Spatie権限・2FA適用範囲の棚卸し**
  - 内容: 全adminロールに2FAが強制されているか、バイパス経路が無いか確認する。
  - 完了の定義: 確認結果をSPEC.md §4に反映。

- [ ] **T14: CORS設定の本番ドメイン限定化確認**
  - 対象ファイル: `config/cors.php`
  - 内容: 許可オリジンが本番ドメイン・Atlasサブドメインのみに絞られているか検証する。
  - 完了の定義: 設定内容を確認、必要なら修正。

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

- [ ] **T28: データ設計を決定する**
  - 対象ファイル: `app/Models/Contact.php`、`app/Models/AtlasMembership.php`、`app/Models/AtlasInviteCode.php`
  - 内容: 審査・承認・課金は対象外のため「応募データを保存し管理者に通知する」最小構成でよい。`Contact.source`はenum制約の無いstring型のため、`source='atlas_apply'`として既存`Contact`テーブルを流用するか、新規モデルを作るかを決定する。決定内容をSPEC.md §5.9に追記する。
  - 完了の定義: 方針をSPEC.mdに明記。

- [ ] **T29: リクエストバリデーション実装**
  - 対象ファイル: `app/Http/Requests/StoreContactRequest.php`（流用の場合は拡張）または新規`StoreAtlasApplicationRequest`
  - 完了の定義: バリデーションルール実装、公開フォームなので`authorize()`は`true`。

- [ ] **T30: Publicコントローラー実装・ルート差し替え**
  - 対象ファイル: `routes/web.php`（L49-52の`atlas.apply`を実フォーム表示・POST処理に変更）
  - 完了の定義: `/apply`が実際にフォームを表示し送信を受け付ける。

- [ ] **T31: `Public/AtlasApply.jsx`フォーム画面実装**
  - 対象ファイル: `resources/js/Pages/Public/AtlasApply.jsx`（新規）
  - 内容: 既存`Public/AtlasComingSoon.jsx`の配色・トーン（富裕層向けサービスのダークテーマ系）を踏襲する。`docs/PublicContactSubmissionGuide.md`のフォーム実装パターン（`Contact.jsx`）を参考にする。
  - 完了の定義: フォームがAtlasのトーンに合った見た目で表示される。

- [ ] **T32: 申込み受付メール実装**
  - 内容: `docs/PublicContactSubmissionGuide.md`の`ContactReceivedMail`/`ContactNotificationMail`パターンを踏襲し、自動返信＋管理者通知の2通を実装。
  - 完了の定義: 送信キュー投入を確認。

- [ ] **T33: 管理者が申込みを確認できる導線を用意**
  - 内容: 既存Contact管理画面の拡張、または新設モデルの場合は簡易一覧画面を用意する。
  - 完了の定義: 管理画面から申込み内容が閲覧できる。

- [ ] **T34: Featureテスト追加・動作確認**
  - 内容: フォーム送信→レコード作成→メールキュー投入までのFeatureテストを追加し、`atlas.localhost`サブドメインでの実アクセスを確認する。
  - 完了の定義: テストGreen、実アクセス確認済み。

### 補足: ゼロ工数の即時クリーンアップ

- [ ] **T35**: git作業ツリー上で削除済み・unstagedのままの`app/Http/Controllers/{LoginLog,MediaSetting,MediaVariant}Controller.php`（未使用の空stub、ルーティング依存ゼロ確認済み）をフェーズ1着手前にコミットする。

---

## 3. フェーズ2: 継続タスク（期限なし）

### 3.1 Repository/Service完全移行

SPEC.md §7 K9の通り、実際に未移行なのは以下**4エンティティのみ**（`docs/RepositoryServiceMigrationGuide.md`の記述は古い。User/Service/Company/Faq/Contact/Quote/Post/PostCategory/Adminは移行済み）。1エンティティ1タスクとして扱う。

- [ ] `ContractRepository`/`ContractService` → `SoftDeletableRepository`/`BaseService`へ移行（Contractは`SoftDeletes`使用）
- [ ] `InvoiceRepository`/`InvoiceService` → `SoftDeletableRepository`/`BaseService`へ移行
- [ ] `PaymentRepository`/`PaymentService` → `BaseRepository`/`BaseService`へ移行（`SoftDeletes`未使用）
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
