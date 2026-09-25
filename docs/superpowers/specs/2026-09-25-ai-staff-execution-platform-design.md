# AI社員 実行基盤（LLM呼び出し・スケジュール実行・コンテンツ下書き作成） 設計メモ

- 作成日: 2026-09-25
- 位置づけ: 新規サブシステムの設計合意メモ。この後`superpowers:writing-plans`で実装計画を作成する。ただし**Tiled（バーチャルオフィス）完成後に着手する前提**であり、この計画自体は今すぐ実装しない（ユーザー指示）。
- 背景: これまでの議論（2026-09-18/23の設計メモ）で「AI社員が実際にどう動くか（LLM呼び出し設計・実行トリガー）」は繰り返し「未設計」として保留されてきた。ブログ・SNS投稿の自動化を検討する中で、この保留していた実行基盤そのものを今のうちに設計しておくことになった。

## 0. 前提の確認

- AI社員（`admins.role = 'ai_staff'`）は`docs/superpowers/specs/2026-09-18-ai-staff-and-proposal-flow-design.md` §1で導入済み。部署（`department`カラム）ごとにアカウントがあり、`AiStaffSeeder`で初期10部署分を作成できる（`marketing`部署を含む）。
- AI社員の業務ログ・日報（`ai_staff_activity_logs`/`ai_staff_daily_reports`）は`docs/superpowers/specs/2026-09-24-ai-staff-daily-reports-design.md`で実装済み。本設計はこの上に乗る（新しいログ記録先を1つ追加する形）。
- LLM呼び出しはClaude API（Anthropic Messages API）を使う。**実装着手前に、ユーザー側でAnthropic APIキーの発行・課金登録が必要**（本設計の前提条件、今回のスコープ外）。
- 「PCを常時稼働させる必要がある」という当初の懸念は、AI呼び出しを**サーバー側のスケジュール実行**に置くことで解消する（ユーザーの端末が開いているかどうかに依存しない）。手動トリガー（Admin画面からの即時実行）は今回のスコープ外とする（ユーザー確認済み、必要になれば後で追加）。

## 1. 全体の流れ

```
① 人間がAdmin画面でトピックを事前登録
   （例:「AIをタスク管理に使うメリット」「Laravel×Inertiaを選んだ理由」等）
  ↓
② 毎朝9時頃、スケジュール実行のArtisanコマンドが起動
  ↓
③ pending状態のトピックを1件取得
  ↓
④ ClaudeApiClientサービスがAnthropic Messages APIを呼び出し
   （プロンプトに「3サイトの発信内容の使い分け」方針を固定で含める）
  ↓
⑤ 生成結果からPost（is_published=false、下書き）を作成
  ↓
⑥ トピックをused状態に更新
  ↓
⑦ Admin全員へベル通知＋AiStaffActivityLoggerへ記録（AI日報に反映）
  ↓
⑧ 人間がAdmin画面で内容を確認し、問題なければ公開（is_published=trueに変更）
```

pendingなトピックが無くなれば④以降は実行されず、コマンドは何もせず終了する。これが自然な生成量の歯止めになる（人間がトピックを補充しない限り、AIは新しい下書きを作らない）。

## 2. スキーマ変更案

### 2.1 `ai_content_topics`（新規）

| カラム | 型 | 備考 |
|---|---|---|
| `id` | ulid, PK | `HasUlid`トレイト使用 |
| `title` | string | トピック案（例:「AIをタスク管理に使うメリット」） |
| `destination` | string | `spra_blog`固定値（今回の唯一の対象）。将来`wordpress`/`sns`等に拡張する余地を持たせるためenumではなくstring |
| `status` | string | `pending`（未処理）/`used`（下書き作成済み）/`failed`（生成失敗） |
| `assigned_admin_id` | uuid, FK→admins, nullable | どのAI社員（部署）が担当するか。未指定なら`department = 'marketing'`のAI社員をコマンド側でフォールバック解決する |
| `post_id` | ulid, FK→posts, nullable | 生成後、作成された`Post`を紐付ける（`used`/`failed`の追跡用） |
| `failure_reason` | text, nullable | `failed`時のエラー内容 |
| `created_by` | uuid, FK→admins | トピックを登録した人間Admin |
| `created_at`/`updated_at` | timestamps | |

インデックス: `(destination, status)`（次に処理すべきトピックの取得に使う主要な絞り込み軸）

### 2.2 既存`posts`テーブル・`ai_staff_activity_logs`への変更

- `posts`テーブル自体への変更は無し。既存の`is_published`/`created_by`等をそのまま使う。
- `ai_staff_activity_logs.action`に新しい値`blog_draft_created`を追加（`AiStaffActivityLog`モデルの定数に`ACTION_BLOG_DRAFT_CREATED`を追加するのみ、マイグレーション不要— `action`は既にstringカラム）。

## 3. LLM呼び出し（`ClaudeApiClient`サービス、新規）

- `app/Services/ClaudeApiClient.php`（`BaseService`は継承しない。外部API連携の薄いラッパーであり、単一エンティティのCRUDではないため — `AiStaffActivityLogger`と同じ位置づけ）
- `config/services.php`に`'anthropic' => ['api_key' => env('ANTHROPIC_API_KEY'), 'model' => env('ANTHROPIC_MODEL', 'claude-sonnet-5')]`を追加
- Laravelの`Http`ファサードでAnthropic Messages API（`https://api.anthropic.com/v1/messages`）をPOST呼び出しする薄いラッパー。メソッド例: `generateBlogDraft(string $topicTitle): array`（戻り値: `['title' => string, 'blocks' => array]`）
- プロンプトには固定の指示文として以下を必ず含める（`project_site_content_positioning`メモの内容を反映）:
  - 「SmartSproutsは中央管理システムであり対外露出は控えめ・限定的な内容にする」
  - 「技術的に深い内容は書かない（それはkatsu-coach.com向け）」
  - 出力形式の指示（後述3.1）
- API呼び出し失敗（タイムアウト・レート制限・不正レスポンス等）は例外を投げ、呼び出し元（コマンド）でキャッチしてトピックを`failed`にする（3章のエラーハンドリング方針、握りつぶさない＝呼び出し元に伝播させる。`AiStaffActivityLogger`とは異なり、こちらは「本処理」そのものなので失敗を握りつぶしてはいけない）

### 3.1 出力形式とPost.contentへの変換

- `posts.content`は`BlockEditor`（`resources/js/Components/BlockUI`）が扱うブロック配列JSON（各要素`{id, type, data}`、`type`は`heading`/`text`等）。AIが生成する下書きは、このうち**`heading`と`text`の2種類のみ**を使う簡易構成にする（`CTA`/`Stats`/`Gallery`等のランディングページ向け複雑なブロックは使わない）。
- `ClaudeApiClient`はLLMに「見出しと本文（HTML可）のペアの配列」をJSON形式で出力させ（Claude APIのstructured output機能を使う）、`ClaudeApiClient`側でその配列を`heading`/`text`ブロックの配列（`{id: (ulid), type: 'heading', data: {text, level: 'h2', align: 'left'}}`/`{id: (ulid), type: 'text', data: {html}}`）に変換してから返す。この変換ロジックの実装時は`resources/js/Components/BlockUI/BlockEditor.jsx`の実際のブロック配列の型（トップレベルが配列かオブジェクトか等）を確認してから実装する（本メモ作成時点では未確定、実装時に確認）。

## 4. スケジュール実行（新規Artisanコマンド）

- `app/Console/Commands/AiStaff/GenerateBlogDraft.php`
- シグネチャ: `ai-staff:generate-blog-draft`（引数なし。特定トピックを狙い撃ちする運用は想定しない）
- 処理内容:
  1. `AiContentTopic::where('destination', 'spra_blog')->where('status', 'pending')->oldest()->first()`で最古のpendingトピックを1件取得。無ければ何もせず終了
  2. 担当AI社員を解決（トピックの`assigned_admin_id`があればそれ、無ければ`Admin::where('role', 'ai_staff')->where('department', 'marketing')->first()`）。どちらも解決できなければトピックを`failed`にして終了
  3. `ClaudeApiClient::generateBlogDraft($topic->title)`を呼び出す
  4. 成功時: `Post::create([...、'is_published' => false, 'created_by' => $aiStaffAdmin->id])`を作成し、トピックを`used`・`post_id`セットで更新
  5. 失敗時（3の例外）: トピックを`failed`・`failure_reason`セットで更新、`Log::error`
  6. 成功時のみ、Admin全員へベル通知（5章）＋`AiStaffActivityLogger::log()`で記録（6章）
- スケジュール登録: `routes/console.php`に`$alertOnFailure(Schedule::command('ai-staff:generate-blog-draft')->dailyAt('09:15'))`を追加（既存の8:00の日報生成コマンドと重ならない時間帯）

## 5. 通知

- 新規`app/Notifications/AiBlogDraftCreated.php`（`ContactReceived`と同じ構造、`database`チャンネルのみ）
- `toArray()`: `title`「AIがブログ下書きを作成しました」、`message`に投稿タイトル、`url`は該当`Post`の編集画面（`admin.website.post.edit`等、実装時に正確なルート名を確認）
- `Notification::send(Admin::all(), new AiBlogDraftCreated($post))`（`ContactReceived`と同じ全員通知パターン）

## 6. ログ記録

- `AiStaffActivityLogger::log($aiStaffAdmin, AiStaffActivityLog::ACTION_BLOG_DRAFT_CREATED, "ブログ記事「{$post->title}」の下書きを作成", $post)`をコマンドの成功パスから呼び出す
- 翌朝の日次集計（`ai-staff:generate-daily-reports`、8:00実行）に自然に含まれる。本コマンドの9:15実行は当日分として翌日の日報に反映される

## 7. エラーハンドリング・運用上の注意

- LLM呼び出し失敗はトピックを`failed`にするだけで、コマンド自体は正常終了する（次のスケジュール実行や他のトピック処理をブロックしない）。`failed`トピックの再試行は人間が手動でステータスを`pending`に戻すことで対応する（自動リトライは今回のスコープ外）
- API課金・レート制限: 1日1トピック（=1回のAPI呼び出し）が上限。トピックが尽きれば呼び出しも止まるため、暴走的なコスト増加は起きない設計
- 出力内容の事実誤認・不適切表現のリスクは常にある。**`is_published=false`での下書き止まりを徹底し、人間の確認なしに公開されることは無い**（既存のPost公開フローをそのまま使うため、これは自動的に担保される）

## 8. 管理画面

- `ai_content_topics`の一覧・登録・編集はAdmin画面に新規CRUD画面を追加する（`Admin\AiContentTopicController`、Repository/Serviceパターンに従う）。詳細は実装計画で詰める
- 既存の「AI社員 日報」ナビゲーション（`docs/superpowers/specs/2026-09-24-ai-staff-daily-reports-design.md`で追加済み）と同じ「管理者管理」セクション、またはWebサイト管理セクション配下に配置するかは実装時に判断する

## 9. テスト方針

- `ClaudeApiClient`: HTTP呼び出しは`Http::fake()`でモックし、成功時のブロック変換ロジック・失敗時の例外送出を単体テストする
- `GenerateBlogDraft`コマンド: pendingトピックが有る/無い場合、LLM呼び出し成功/失敗、ベル通知・活動ログが正しく記録されることをFeatureテストで検証
- 実際のAnthropic APIへの本物の呼び出しはテストで行わない（コスト・非決定性のため、`Http::fake()`で完結させる）

## 10. 未決定事項（実装計画作成時に詰める）

- `posts.content`のブロック配列の正確な型（トップレベル配列かオブジェクトか）— `BlockEditor.jsx`を実装時に精読して確定する
- Admin画面での`ai_content_topics`管理画面の配置場所・UI詳細
- 将来`destination = wordpress`/`sns`を追加する際の「投稿先ごとの発行処理（Publisher）」の抽象化設計（今回は`spra_blog`の1系統のみ実装、抽象化は先送り＝YAGNI）
- 失敗トピックの自動リトライの要否（今回は手動リトライのみ）
