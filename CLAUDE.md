# CLAUDE.md — Spra リポジトリ作業規約

このファイルはこのリポジトリ（Spra）でClaude Codeが作業する際の規約を記す。ユーザーのグローバル指示（すべてのドキュメント成果物は日本語で作成）は前提として常に適用する。ここではリポジトリ固有の注意点のみを扱い、汎用的なコーディング規約（PSR-12・Pint設定等）は既存の設定ファイル（`pint.json`等）を正とし重複記載しない。

## 1. このプロジェクトについて

Spra は Laravel 12 + Inertia.js + React による社内向け中央管理システム（契約管理・自社Webサイト管理・Atlas会員制サブプロダクト）。現在約8割完成、開発環境のみで稼働（本番未リリース）。

ドキュメントは4層構造になっている。作業前に必ず参照すること。

- **SPEC.md**: システム全体像・ドメイン仕様・既知の課題一覧
- **docs/ 配下12本**: 各機能の実装詳細ガイド
- **TASKS.md**: フェーズ1（1ヶ月必達MVP）／フェーズ2（継続タスク）のやることリスト
- **CLAUDE.md**（本書）: 作業規約

## 2. 3ガード構成を扱う際の注意

- `config/auth.php`に`admins`（自社スタッフ）・`users`（クライアント企業担当者）の2ガード（デフォルトガードは`users`）。
- 新規コントローラー・ミドルウェア・FormRequestでは、**どちらのガードかを必ず明示**する（`auth('admins')`/`auth('users')`、`Auth::guard('admins')`等）。ガード名の綴り間違い・取り違えは実際にバグの原因になっている（SPEC.md §7 K5: `admin`と`admins`の取り違え）。実装前に既存の同種クラス（同じ`Admin/`または`User/`名前空間内）を確認し、ガード名を揃える。
- `Admin/*`コントローラーは`admins`ガード、`User/*`・`Public/*`は`users`ガードまたは未認証、`Atlas/*`はさらに別セッション（`config('app.atlas_domain')`でサブドメイン分離、Cookieもメインサイトと共有しない）。
- Spatie権限（ロール・パーミッション）を追加/変更したら、開発環境・本番環境どちらでも`php artisan admin:sync-permissions`を実行して同期すること。

## 3. Repository/Serviceパターンの規約

- 新規実装は必ず`app/Repositories/BaseRepository`（または`SoftDeletableRepositoryInterface`等）と`app/Services/BaseService`を継承する。Repository=データアクセス、Service=ビジネスロジック、Controller=プレゼンテーションの役割分担を厳守する（詳細は`docs/RepositoryServiceMigrationGuide.md`のパターン例）。
- 2026-07-30時点で全エンティティの移行が完了している（Contract/Invoice/Payment/Projectを含む）。既存の`ContractRepository`/`InvoiceRepository`/`PaymentRepository`/`ProjectRepository`等を参考実装として読むこと。
- `BaseService`の`update(mixed $model, array $data)`/`delete(mixed $model)`をオーバーライドする際、PHPの引数共変性制約により第一引数を具体的なモデル型に狭めることはできない（`mixed`のまま受け取り、関数内で目的の型として扱う）。

## 4. Inertia + React + Blade の使い分け

- 画面（Admin/User/Public/Atlas）は全てInertia.js + React（`resources/js/Pages`配下）。
- メール本文・PDF（契約書・請求書・領収書・プロジェクト仕様書）はBlade（`resources/views/emails`・`pdfs`・`contracts`・`project_documents`）。PDF生成ライブラリはdompdf/snappy/mpdf/tcpdfが機能ごとに混在しているため、新規PDF機能を追加する際は既存の同種機能がどれを使っているか確認してから合わせる（統一の判断はTASKS.mdに含めていないため、独断で全面統一しない）。
- 新規コンポーネントは`resources/js/Components`配下、`docs/ComponentsStructureGuide.md`のディレクトリ構成に従う。
- ボタンは新規実装で必ず`@/Components/Buttons`の新`Button`/`CrudButton`/`IconButton`を使う（旧`PrimaryButton`/`SecondaryButton`/`DangerButton`は後方互換のみ、新規使用禁止）。
- リッチテキスト編集は`resources/js/Components/Forms/RichTextEditor.jsx`を使う（`resources/js/Components/`直下のスタブは未実装のため使用禁止、TASKS.mdフェーズ2で削除予定）。

## 5. 既知の技術的負債に触れる際の注意

- TASKS.mdフェーズ2に列挙された項目（Button統一、RichTextEditor重複、ScheduleDefaultController等の空stub、アプリ名不一致）は、**関連するファイルを触った場合についでに直す**範囲に留める。無関係な大規模一括置換はスコープ外。
- **`docs/`配下のガイドやSPEC.md/TASKS.mdの記述を無条件に信用せず、必ず現在のコードを読んで実態を確認してから作業する。** 2026-07-29の検証で、docsに「未修正の既知バグ」と記載されていたものの一部（Quote⇔QuoteResponse同期、Company.statusのenum、下書き請求書のsent化）が実際には既に解消済みだったことが判明している（SPEC.md §7参照）。ドキュメントは実装当時のスナップショットであり、後から直っていても更新されていないことがある。
- Onboarding/Quote/Invoice/Contract等、金銭・法的リスクが絡む変更を行う場合は、関連するFeatureテスト（TASKS.mdフェーズ1のT3・T5・T8等で追加予定）を実行してから完了とする。

## 6. テスト方針

- 「触った箇所から順次テストを追加する」方針。全域を一括でテスト整備する計画ではない。
- 現状`tests/Feature/`はLaravel Breezeの認証スキャフォールディング・`PermissionEnforcementTest`（権限）・ロケール関連のみで、Contract/Invoice/Quote/Project/Appointment等の中核ビジネスロジックには自動テストが無い。
- 金額計算・ステータス遷移・メール送信を伴う変更を行った場合は、最低限その変更範囲のFeature/Unitテストを追加する。
- テスト実行コマンドは`phpunit.xml`・`composer.json`の設定に従う（`php artisan test`または`vendor/bin/phpunit`）。

## 7. 破壊的変更の許容範囲とチーム開発を見据えた注意

- 本番未リリース・実データ無しのため（TASKS.mdフェーズ1で本番デプロイ予定、以降は方針が変わる）、現時点ではマイグレーションの作り直しやスキーマ変更を自由に行ってよい。
- ただし将来的にチーム開発へ移行する前提があるため、破壊的変更であっても可読性・命名の一貫性（ULID主体は`HasUlid`トレイト、ステータス値はモデル定数`STATUSES`/`ROLES`等を使う、ガード名は`admins`/`users`で統一）は維持すること。
- コミット前にSPEC.md/TASKS.mdの該当箇所が古くなっていないか確認し、必要なら同じ変更の中で更新する。

## 8. ドキュメント更新ルール

- 新機能・仕様変更を行ったらSPEC.mdの該当ドメイン節（§5）を更新する。
- 完了したタスクはTASKS.mdの`[ ]`を`[x]`にする。
- 新しい実装ガイドが必要な場合は`docs/`配下に追加し、SPEC.md §9の索引にリンクを追記する。
- 既知の課題（SPEC.md §7）の状態が変わったら（解消・新規発見問わず）、表を更新する。

## 9. Git運用ルール（2026-07-29策定）

### 権限の分担
- **コミット・プッシュ・PR作成**: Claude Codeが判断して自律的に行ってよい。
- **mainへのマージ**: 必ずユーザーの確認を取ってから行う。Claude Code自身が `gh pr merge` 等でマージを実行しない。

### ブランチ運用
- 作業は必ず新しいブランチを切って行う。`main`へ直接コミットしない。
- ブランチは**種別プレフィックス＋短い説明**で命名する: `fix/`（バグ修正）、`feat/`（新機能）、`chore/`（雑務・整理・依存更新等）、`docs/`（ドキュメントのみの変更）。
  - 例: `fix/media-request-guard`、`feat/atlas-apply-form`、`docs/spec-tasks-claude-md`
- 新しいブランチは必ず最新の`origin/main`を基点にする（`git fetch origin` してから `git checkout -b <branch> origin/main`）。
- TASKS.mdのタスク単位で1ブランチを目安にする（複数の小タスクをまとめても良いが、無関係な変更を混在させない）。
- 既存の放置ブランチ（`FinalCheck`〜`5`、`Test`〜`4`、`Project`〜`6`等、命名一貫性なし）は当面そのまま残す。整理は別途指示があった場合のみ行う。

### コミット
- 論理的にまとまった単位でコミットを分ける（例: 「不要ファイルの削除」と「ドキュメント追加」は別コミット）。
- コミットメッセージは日本語で、「何を」より「なぜ」を意識する。

### PR作成
- ブランチをpushしたら`gh pr create`でPRを作成するところまで自動で行う。
- PR本文にはSummaryとTest planを日本語で記載する。
- PR作成後、マージについてはユーザーに確認を依頼する（マージそのものは実行しない）。
