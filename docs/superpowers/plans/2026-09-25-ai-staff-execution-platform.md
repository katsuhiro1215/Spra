# AI社員 実行基盤（LLM呼び出し・スケジュール実行・ブログ下書き作成） Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **着手タイミングの注意:** この計画は「Tiled（バーチャルオフィス）完成後に着手する」というユーザー指示に基づき、実装計画のみを事前に用意したものです。ユーザーから明示的に実装開始の指示があるまで、このプランを実行しないこと。

**Goal:** AI社員（`ai_staff`ロール）がAnthropic Claude APIを使ってSpraブログの下書きを自動生成できる実行基盤を構築する。人間が事前登録したトピックを、毎朝のスケジュール実行でAIが1件ずつ消化し、既存の`Post`（`is_published=false`）として下書き保存する。

**Architecture:** 新規`ai_content_topics`テーブル（トピックのキュー）、`ClaudeApiClient`サービス（Anthropic Messages APIへの薄いHTTPラッパー）、`ai-staff:generate-blog-draft`Artisanコマンド（毎朝9:15スケジュール実行）の3点が中核。既存の`Post`モデル・`AiStaffActivityLogger`（日報連携）・通知（ベルアイコン）・Repository/Serviceパターンにそのまま乗せる。人間の確認なしに公開されることはない（`Post.is_published`は常にfalseで作成）。

**Tech Stack:** Laravel 12 / MySQL / Inertia.js + React（既存スタック）。新規外部依存: Anthropic Messages API（HTTPのみ、SDK追加なし）。

**Spec:** `docs/superpowers/specs/2026-09-25-ai-staff-execution-platform-design.md`

## Global Constraints

- LLM呼び出しはAnthropic Messages API（`https://api.anthropic.com/v1/messages`）をLaravelの`Http`ファサードで直接呼び出す。サードパーティSDKは追加しない。
- `posts.content`は`{ blocks: [{ id, type, data }] }`形式（`resources/js/Components/BlockUI/BlockEditor.jsx`で確認済み）。AI生成コンテンツは`type: 'heading'`（`data: {text, level, align}`）と`type: 'text'`（`data: {html}`）の2種類のみを使う。
- 1回のコマンド実行で処理するトピックは最大1件。トピックが尽きれば何もせず終了する（暴走的なAPIコスト増加を防ぐ設計）。
- LLM呼び出し失敗時はコマンド自体を異常終了させず、トピックを`failed`にしてログを残す。一方、`AiStaffActivityLogger::log()`自体の失敗は呼び出し元（コマンド）の処理を止めない（`docs/superpowers/specs/2026-09-24-ai-staff-daily-reports-design.md`で確立済みの既存契約、変更しない）。
- 新規実装は`app/Repositories/BaseRepository`/`app/Services/BaseService`のRepository/Serviceパターンに従う（CLAUDE.md §3）。
- Git運用ルール（CLAUDE.md §9）に従い、新しいブランチ`feat/ai-staff-execution-platform`を`origin/main`起点で作成する。
- テスト実行はDocker Sail経由: `docker compose exec -T laravel.test <command>`（ホストで直接`php artisan`は使えない）。フロントエンドビルド（`npm run build`）はホストで直接実行する（コンテナのesbuildはプラットフォーム不一致のため）。

## Review Focus

- Anthropic APIキー未設定（`.env`に`ANTHROPIC_API_KEY`が無い）状態でコマンドを実行した場合、原因不明のエラーで落ちるのではなく、分かりやすいエラーメッセージでトピックが`failed`になること。
- pendingなトピックが0件の状態でコマンドを実行しても、例外やクラッシュにならず正常終了すること。
- Anthropic APIが不正な形式のレスポンス（想定した`tool_use`ブロックが無い等）を返した場合に、`ClaudeApiClient`がクラッシュせず例外を投げ、呼び出し元が正しく`failed`処理できること。
- 同じ`Post`が二重生成されないこと（1トピック=最大1つの`Post`、`used`になったトピックは再処理されない）。
- 人間Admin（`ai_staff`以外）が誤ってこの機能のAPIエンドポイント・コマンドを操作しても、既存のPost公開フロー・権限体系を壊さないこと（`is_published`は常にfalseで作成され、公開操作は既存のPostController経由のみ）。

---

### Task 1: `ai_content_topics`テーブル・モデル・Repository/Service

**Files:**
- Create: `database/migrations/2026_09_25_100001_create_ai_content_topics_table.php`
- Create: `app/Models/AiContentTopic.php`
- Create: `app/Repositories/Contracts/AiContentTopicRepositoryInterface.php`
- Create: `app/Repositories/AiContentTopicRepository.php`
- Create: `app/Services/AiContentTopicService.php`
- Modify: `app/Providers/AppServiceProvider.php`（インターフェースのバインド追加）
- Test: `tests/Unit/AiContentTopicModelTest.php`

**Interfaces:**
- Produces: `AiContentTopic`モデル（`STATUS_PENDING='pending'`/`STATUS_USED='used'`/`STATUS_FAILED='failed'`定数、`DESTINATION_SPRA_BLOG='spra_blog'`定数）
- Produces: `AiContentTopicService::getNextPending(string $destination): ?AiContentTopic`（後続タスク5が使用）
- Produces: `AiContentTopicService::markUsed(AiContentTopic $topic, string $postId): AiContentTopic`
- Produces: `AiContentTopicService::markFailed(AiContentTopic $topic, string $reason): AiContentTopic`
- Produces: `AiContentTopicService::retry(AiContentTopic $topic): AiContentTopic`（`failed`以外を渡すと`\RuntimeException`、Task 7が使用）

- [ ] **Step 1: マイグレーションを作成**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * AI社員がコンテンツ下書きを作成する際のトピックキュー
     */
    public function up(): void
    {
        Schema::create('ai_content_topics', function (Blueprint $table) {
            $table->ulid('id')->primary();

            $table->string('title');
            $table->string('destination')->default('spra_blog')->comment('spra_blog固定(将来wordpress/sns等に拡張予定)');
            $table->string('status')->default('pending')->comment('pending/used/failed');

            $table->uuid('assigned_admin_id')->nullable();
            $table->foreign('assigned_admin_id')->references('id')->on('admins')->nullOnDelete();

            $table->ulid('post_id')->nullable();
            $table->foreign('post_id')->references('id')->on('posts')->nullOnDelete();

            $table->text('failure_reason')->nullable();

            $table->uuid('created_by');
            $table->foreign('created_by')->references('id')->on('admins')->cascadeOnDelete();

            $table->timestamps();

            $table->index(['destination', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ai_content_topics');
    }
};
```

- [ ] **Step 2: マイグレーションを実行**

Run: `docker compose exec -T laravel.test php artisan migrate --path=database/migrations/2026_09_25_100001_create_ai_content_topics_table.php`
Expected: `DONE`と表示される

- [ ] **Step 3: モデルを作成**

```php
<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AiContentTopic extends Model
{
    use HasUlid;

    protected $fillable = [
        'title',
        'destination',
        'status',
        'assigned_admin_id',
        'post_id',
        'failure_reason',
        'created_by',
    ];

    public const STATUS_PENDING = 'pending';
    public const STATUS_USED = 'used';
    public const STATUS_FAILED = 'failed';

    public const DESTINATION_SPRA_BLOG = 'spra_blog';

    public function assignedAdmin(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'assigned_admin_id');
    }

    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'created_by');
    }
}
```

- [ ] **Step 4: Repositoryインターフェース・実装を作成**

```php
<?php

namespace App\Repositories\Contracts;

interface AiContentTopicRepositoryInterface extends BaseRepositoryInterface
{
}
```

```php
<?php

namespace App\Repositories;

use App\Models\AiContentTopic;
use App\Repositories\Contracts\AiContentTopicRepositoryInterface;

class AiContentTopicRepository extends BaseRepository implements AiContentTopicRepositoryInterface
{
    protected function getModelClass(): string
    {
        return AiContentTopic::class;
    }

    protected function getSearchableFields(): array
    {
        return ['title'];
    }

    protected function getSortableFields(): array
    {
        return ['title', 'status', 'created_at'];
    }
}
```

- [ ] **Step 5: `AppServiceProvider`にバインドを追加**

`app/Providers/AppServiceProvider.php`の`register()`メソッド内、既存の`TaskCategoryRepositoryInterface`バインドの近くに1行追加:

```php
$this->app->bind(\App\Repositories\Contracts\AiContentTopicRepositoryInterface::class, \App\Repositories\AiContentTopicRepository::class);
```

- [ ] **Step 6: Serviceを作成**

```php
<?php

namespace App\Services;

use App\Models\AiContentTopic;
use App\Repositories\Contracts\AiContentTopicRepositoryInterface;

class AiContentTopicService extends BaseService
{
    public function __construct(AiContentTopicRepositoryInterface $repository)
    {
        parent::__construct($repository);
    }

    protected function getEntityName(): string
    {
        return 'AiContentTopic';
    }

    /**
     * 指定した投稿先で、最も古いpendingトピックを1件取得する
     */
    public function getNextPending(string $destination): ?AiContentTopic
    {
        return AiContentTopic::where('destination', $destination)
            ->where('status', AiContentTopic::STATUS_PENDING)
            ->oldest()
            ->first();
    }

    public function markUsed(AiContentTopic $topic, string $postId): AiContentTopic
    {
        $topic->update([
            'status' => AiContentTopic::STATUS_USED,
            'post_id' => $postId,
        ]);

        return $topic->fresh();
    }

    public function markFailed(AiContentTopic $topic, string $reason): AiContentTopic
    {
        $topic->update([
            'status' => AiContentTopic::STATUS_FAILED,
            'failure_reason' => $reason,
        ]);

        return $topic->fresh();
    }

    /**
     * failed状態のトピックを人間が手動でpendingに戻す（再試行）
     *
     * @throws \RuntimeException failed状態でないトピックを渡した場合
     */
    public function retry(AiContentTopic $topic): AiContentTopic
    {
        if ($topic->status !== AiContentTopic::STATUS_FAILED) {
            throw new \RuntimeException('失敗状態のトピックのみ再試行できます。');
        }

        $topic->update([
            'status' => AiContentTopic::STATUS_PENDING,
            'failure_reason' => null,
        ]);

        return $topic->fresh();
    }
}
```

- [ ] **Step 7: 単体テストを作成**

```php
<?php

namespace Tests\Unit;

use App\Models\Admin;
use App\Models\AiContentTopic;
use App\Services\AiContentTopicService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AiContentTopicModelTest extends TestCase
{
    use RefreshDatabase;

    private function createAdmin(): Admin
    {
        return Admin::factory()->create(['role' => 'admin']);
    }

    public function test_get_next_pending_returns_the_oldest_pending_topic_for_the_destination(): void
    {
        $admin = $this->createAdmin();

        $older = AiContentTopic::create([
            'title' => '古いトピック',
            'destination' => AiContentTopic::DESTINATION_SPRA_BLOG,
            'status' => AiContentTopic::STATUS_PENDING,
            'created_by' => $admin->id,
            'created_at' => now()->subDay(),
        ]);
        AiContentTopic::create([
            'title' => '新しいトピック',
            'destination' => AiContentTopic::DESTINATION_SPRA_BLOG,
            'status' => AiContentTopic::STATUS_PENDING,
            'created_by' => $admin->id,
        ]);
        AiContentTopic::create([
            'title' => '既に使用済みのトピック',
            'destination' => AiContentTopic::DESTINATION_SPRA_BLOG,
            'status' => AiContentTopic::STATUS_USED,
            'created_by' => $admin->id,
            'created_at' => now()->subDays(2),
        ]);

        $next = app(AiContentTopicService::class)->getNextPending(AiContentTopic::DESTINATION_SPRA_BLOG);

        $this->assertTrue($next->is($older));
    }

    public function test_get_next_pending_returns_null_when_none_pending(): void
    {
        $next = app(AiContentTopicService::class)->getNextPending(AiContentTopic::DESTINATION_SPRA_BLOG);

        $this->assertNull($next);
    }

    public function test_mark_used_updates_status_and_post_id(): void
    {
        $admin = $this->createAdmin();
        $topic = AiContentTopic::create([
            'title' => 'テストトピック',
            'destination' => AiContentTopic::DESTINATION_SPRA_BLOG,
            'status' => AiContentTopic::STATUS_PENDING,
            'created_by' => $admin->id,
        ]);

        $updated = app(AiContentTopicService::class)->markUsed($topic, 'fake-post-id');

        $this->assertSame(AiContentTopic::STATUS_USED, $updated->status);
        $this->assertSame('fake-post-id', $updated->post_id);
    }

    public function test_mark_failed_updates_status_and_reason(): void
    {
        $admin = $this->createAdmin();
        $topic = AiContentTopic::create([
            'title' => 'テストトピック',
            'destination' => AiContentTopic::DESTINATION_SPRA_BLOG,
            'status' => AiContentTopic::STATUS_PENDING,
            'created_by' => $admin->id,
        ]);

        $updated = app(AiContentTopicService::class)->markFailed($topic, 'API timeout');

        $this->assertSame(AiContentTopic::STATUS_FAILED, $updated->status);
        $this->assertSame('API timeout', $updated->failure_reason);
    }

    public function test_retry_resets_a_failed_topic_to_pending(): void
    {
        $admin = $this->createAdmin();
        $topic = AiContentTopic::create([
            'title' => 'テストトピック',
            'destination' => AiContentTopic::DESTINATION_SPRA_BLOG,
            'status' => AiContentTopic::STATUS_FAILED,
            'failure_reason' => 'API timeout',
            'created_by' => $admin->id,
        ]);

        $updated = app(AiContentTopicService::class)->retry($topic);

        $this->assertSame(AiContentTopic::STATUS_PENDING, $updated->status);
        $this->assertNull($updated->failure_reason);
    }

    public function test_retry_rejects_a_topic_that_is_not_failed(): void
    {
        $admin = $this->createAdmin();
        $topic = AiContentTopic::create([
            'title' => 'テストトピック',
            'destination' => AiContentTopic::DESTINATION_SPRA_BLOG,
            'status' => AiContentTopic::STATUS_PENDING,
            'created_by' => $admin->id,
        ]);

        $this->expectException(\RuntimeException::class);

        app(AiContentTopicService::class)->retry($topic);
    }
}
```

- [ ] **Step 8: テストを実行して確認**

Run: `docker compose exec -T laravel.test php artisan test tests/Unit/AiContentTopicModelTest.php`
Expected: `6 passed`

- [ ] **Step 9: Pintを実行してコミット**

```bash
./vendor/bin/pint --dirty
git add database/migrations/2026_09_25_100001_create_ai_content_topics_table.php \
        app/Models/AiContentTopic.php \
        app/Repositories/Contracts/AiContentTopicRepositoryInterface.php \
        app/Repositories/AiContentTopicRepository.php \
        app/Services/AiContentTopicService.php \
        app/Providers/AppServiceProvider.php \
        tests/Unit/AiContentTopicModelTest.php
git commit -m "feat: AIコンテンツトピックのキューテーブルとRepository/Serviceを追加"
```

---

### Task 2: `AiStaffActivityLog`にブログ下書き作成アクションを追加

**Files:**
- Modify: `app/Models/AiStaffActivityLog.php`

**Interfaces:**
- Produces: `AiStaffActivityLog::ACTION_BLOG_DRAFT_CREATED`定数（Task 5が使用）

- [ ] **Step 1: 定数を追加**

`app/Models/AiStaffActivityLog.php`の既存の`ACTION_*`定数群（`ACTION_TASK_STATUS_CHANGED`等）の末尾に追加:

```php
    public const ACTION_BLOG_DRAFT_CREATED = 'blog_draft_created';
```

- [ ] **Step 2: 既存テストが壊れていないことを確認**

Run: `docker compose exec -T laravel.test php artisan test tests/Unit/AiStaffActivityLogModelTest.php`
Expected: 既存のテストが全て`passed`のまま（新しい定数追加は既存動作に影響しない）

- [ ] **Step 3: コミット**

```bash
git add app/Models/AiStaffActivityLog.php
git commit -m "feat: AI社員の活動ログにブログ下書き作成アクションを追加"
```

---

### Task 3: `ClaudeApiClient`サービス

**Files:**
- Modify: `config/services.php`
- Modify: `.env.example`（`ANTHROPIC_API_KEY`/`ANTHROPIC_MODEL`のプレースホルダー行を追加。実際の`.env`へのキー設定はユーザーが別途行う）
- Create: `app/Services/ClaudeApiClient.php`
- Test: `tests/Unit/ClaudeApiClientTest.php`

**Interfaces:**
- Consumes: なし（外部API呼び出しのみ）
- Produces: `ClaudeApiClient::generateBlogDraft(string $topicTitle): array`（戻り値: `['title' => string, 'blocks' => array]`、`blocks`は`[{id, type, data}]`形式）。Task 5が使用。失敗時は`\RuntimeException`を投げる。

- [ ] **Step 1: `config/services.php`にAnthropic設定を追加**

`config/services.php`の既存エントリ（`postmark`/`resend`/`ses`等）の末尾に追加:

```php
    'anthropic' => [
        'api_key' => env('ANTHROPIC_API_KEY'),
        'model' => env('ANTHROPIC_MODEL', 'claude-sonnet-5'),
    ],
```

- [ ] **Step 2: `.env.example`にプレースホルダーを追加**

`.env.example`の末尾に追加:

```
ANTHROPIC_API_KEY=
ANTHROPIC_MODEL=claude-sonnet-5
```

- [ ] **Step 3: 失敗するテストを書く**

```php
<?php

namespace Tests\Unit;

use App\Services\ClaudeApiClient;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class ClaudeApiClientTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        config(['services.anthropic.api_key' => 'test-api-key']);
        config(['services.anthropic.model' => 'claude-sonnet-5']);
    }

    public function test_it_converts_a_successful_response_into_title_and_blocks(): void
    {
        Http::fake([
            'api.anthropic.com/*' => Http::response([
                'content' => [
                    [
                        'type' => 'tool_use',
                        'name' => 'structure_blog_draft',
                        'input' => [
                            'title' => 'AIをタスク管理に使うメリット',
                            'sections' => [
                                ['heading' => 'はじめに', 'html' => '<p>本文1</p>'],
                                ['heading' => 'まとめ', 'html' => '<p>本文2</p>'],
                            ],
                        ],
                    ],
                ],
            ], 200),
        ]);

        $result = app(ClaudeApiClient::class)->generateBlogDraft('AIをタスク管理に使うメリット');

        $this->assertSame('AIをタスク管理に使うメリット', $result['title']);
        $this->assertCount(4, $result['blocks']); // heading+text × 2セクション

        $this->assertSame('heading', $result['blocks'][0]['type']);
        $this->assertSame('はじめに', $result['blocks'][0]['data']['text']);
        $this->assertSame('h2', $result['blocks'][0]['data']['level']);

        $this->assertSame('text', $result['blocks'][1]['type']);
        $this->assertSame('<p>本文1</p>', $result['blocks'][1]['data']['html']);

        Http::assertSent(function ($request) {
            return $request->url() === 'https://api.anthropic.com/v1/messages'
                && $request->hasHeader('x-api-key', 'test-api-key')
                && $request->hasHeader('anthropic-version', '2023-06-01')
                && $request['model'] === 'claude-sonnet-5';
        });
    }

    public function test_it_throws_when_the_api_key_is_not_configured(): void
    {
        config(['services.anthropic.api_key' => null]);

        $this->expectException(\RuntimeException::class);

        app(ClaudeApiClient::class)->generateBlogDraft('テストトピック');
    }

    public function test_it_throws_when_the_response_has_no_tool_use_block(): void
    {
        Http::fake([
            'api.anthropic.com/*' => Http::response([
                'content' => [
                    ['type' => 'text', 'text' => 'すみません、うまく生成できませんでした。'],
                ],
            ], 200),
        ]);

        $this->expectException(\RuntimeException::class);

        app(ClaudeApiClient::class)->generateBlogDraft('テストトピック');
    }

    public function test_it_throws_when_the_http_call_fails(): void
    {
        Http::fake([
            'api.anthropic.com/*' => Http::response(['error' => 'rate limited'], 429),
        ]);

        $this->expectException(\RuntimeException::class);

        app(ClaudeApiClient::class)->generateBlogDraft('テストトピック');
    }
}
```

- [ ] **Step 4: テストを実行して失敗を確認**

Run: `docker compose exec -T laravel.test php artisan test tests/Unit/ClaudeApiClientTest.php`
Expected: FAIL（`ClaudeApiClient`クラスが存在しない）

- [ ] **Step 5: `ClaudeApiClient`を実装**

```php
<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

/**
 * Anthropic Messages APIへの薄いHTTPラッパー。
 * BaseService（単一エンティティのCRUD想定）は継承しない。
 */
class ClaudeApiClient
{
    private const API_URL = 'https://api.anthropic.com/v1/messages';

    private const ANTHROPIC_VERSION = '2023-06-01';

    /**
     * ブログ下書き(タイトル+ブロック配列)を生成する
     *
     * @return array{title: string, blocks: array}
     *
     * @throws \RuntimeException APIキー未設定・HTTP呼び出し失敗・レスポンス形式不正の場合
     */
    public function generateBlogDraft(string $topicTitle): array
    {
        $apiKey = config('services.anthropic.api_key');

        if (! $apiKey) {
            throw new \RuntimeException('ANTHROPIC_API_KEYが設定されていません。');
        }

        $response = Http::withHeaders([
            'x-api-key' => $apiKey,
            'anthropic-version' => self::ANTHROPIC_VERSION,
            'content-type' => 'application/json',
        ])->post(self::API_URL, [
            'model' => config('services.anthropic.model'),
            'max_tokens' => 4096,
            'messages' => [
                ['role' => 'user', 'content' => $this->buildPrompt($topicTitle)],
            ],
            'tools' => [$this->toolDefinition()],
            'tool_choice' => ['type' => 'tool', 'name' => 'structure_blog_draft'],
        ]);

        if ($response->failed()) {
            throw new \RuntimeException("Claude API呼び出しに失敗しました（HTTP {$response->status()}）: {$response->body()}");
        }

        $toolUse = collect($response->json('content', []))
            ->firstWhere('type', 'tool_use');

        if (! $toolUse || ! isset($toolUse['input']['title'], $toolUse['input']['sections'])) {
            throw new \RuntimeException('Claude APIのレスポンスに構造化された下書きデータが含まれていません。');
        }

        return [
            'title' => $toolUse['input']['title'],
            'blocks' => $this->sectionsToBlocks($toolUse['input']['sections']),
        ];
    }

    private function buildPrompt(string $topicTitle): string
    {
        return <<<PROMPT
あなたはSmartSprouts（Spra）社内ブログの記事下書きを作成するAI社員です。
以下の方針を必ず守ってください:
- SmartSproutsは社内の中央管理システムであり、対外露出は控えめ・限定的な内容にする
- 技術的に深い内容は書かない（専門的な技術解説は別サイト向けのため対象外）
- 誇大な表現・断定的すぎる表現は避ける

以下のトピックについて、見出しと本文のペアを2〜4個作成してください。

トピック: {$topicTitle}
PROMPT;
    }

    private function toolDefinition(): array
    {
        return [
            'name' => 'structure_blog_draft',
            'description' => 'ブログ下書きのタイトルと、見出し+本文HTMLのセクション配列を返す',
            'input_schema' => [
                'type' => 'object',
                'properties' => [
                    'title' => ['type' => 'string'],
                    'sections' => [
                        'type' => 'array',
                        'items' => [
                            'type' => 'object',
                            'properties' => [
                                'heading' => ['type' => 'string'],
                                'html' => ['type' => 'string'],
                            ],
                            'required' => ['heading', 'html'],
                        ],
                    ],
                ],
                'required' => ['title', 'sections'],
            ],
        ];
    }

    private function sectionsToBlocks(array $sections): array
    {
        $blocks = [];

        foreach ($sections as $section) {
            $blocks[] = [
                'id' => (string) Str::ulid(),
                'type' => 'heading',
                'data' => ['text' => $section['heading'], 'level' => 'h2', 'align' => 'left'],
            ];
            $blocks[] = [
                'id' => (string) Str::ulid(),
                'type' => 'text',
                'data' => ['html' => $section['html']],
            ];
        }

        return $blocks;
    }
}
```

- [ ] **Step 6: テストを実行して成功を確認**

Run: `docker compose exec -T laravel.test php artisan test tests/Unit/ClaudeApiClientTest.php`
Expected: `4 passed`

- [ ] **Step 7: Pintを実行してコミット**

```bash
./vendor/bin/pint --dirty
git add config/services.php .env.example app/Services/ClaudeApiClient.php tests/Unit/ClaudeApiClientTest.php
git commit -m "feat: Anthropic Claude APIを呼び出すClaudeApiClientサービスを追加"
```

---

### Task 4: `AiBlogDraftCreated`通知

**Files:**
- Create: `app/Notifications/AiBlogDraftCreated.php`
- Test: `tests/Unit/AiBlogDraftCreatedTest.php`

**Interfaces:**
- Consumes: `Post`モデル（既存）
- Produces: `new AiBlogDraftCreated(Post $post)`（Task 5が`Notification::send()`で使用）

- [ ] **Step 1: 失敗するテストを書く**

```php
<?php

namespace Tests\Unit;

use App\Models\Admin;
use App\Models\Post;
use App\Models\PostCategory;
use App\Notifications\AiBlogDraftCreated;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AiBlogDraftCreatedTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_builds_the_expected_database_notification_payload(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin']);
        $category = PostCategory::create(['name' => 'テストカテゴリ', 'slug' => 'test-category-'.uniqid()]);
        $post = Post::create([
            'post_category_id' => $category->id,
            'title' => 'AIをタスク管理に使うメリット',
            'slug' => 'ai-task-management-'.uniqid(),
            'content' => ['blocks' => []],
            'is_published' => false,
            'created_by' => $admin->id,
        ]);

        $notification = new AiBlogDraftCreated($post);
        $payload = $notification->toArray($admin);

        $this->assertSame('AIがブログ下書きを作成しました', $payload['title']);
        $this->assertStringContainsString('AIをタスク管理に使うメリット', $payload['message']);
        $this->assertSame($post->id, $payload['post_id']);
        $this->assertSame(route('admin.website.post.edit', $post), $payload['url']);
        $this->assertSame(['database'], $notification->via($admin));
    }
}
```

- [ ] **Step 2: テストを実行して失敗を確認**

Run: `docker compose exec -T laravel.test php artisan test tests/Unit/AiBlogDraftCreatedTest.php`
Expected: FAIL（`AiBlogDraftCreated`クラスが存在しない）

- [ ] **Step 3: 通知クラスを実装**

```php
<?php

namespace App\Notifications;

use App\Models\Post;
use Illuminate\Notifications\Notification;

class AiBlogDraftCreated extends Notification
{
    public function __construct(private Post $post) {}

    /**
     * database チャンネルのみ（同期実行・キューワーカー不要）
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'title' => 'AIがブログ下書きを作成しました',
            'message' => "「{$this->post->title}」の下書きを作成しました。内容をご確認のうえ公開してください。",
            'color' => 'purple',
            'post_id' => $this->post->id,
            'url' => route('admin.website.post.edit', $this->post),
        ];
    }
}
```

- [ ] **Step 4: テストを実行して成功を確認**

Run: `docker compose exec -T laravel.test php artisan test tests/Unit/AiBlogDraftCreatedTest.php`
Expected: `1 passed`

- [ ] **Step 5: Pintを実行してコミット**

```bash
./vendor/bin/pint --dirty
git add app/Notifications/AiBlogDraftCreated.php tests/Unit/AiBlogDraftCreatedTest.php
git commit -m "feat: AIブログ下書き作成時のベル通知を追加"
```

---

### Task 5: `ai-staff:generate-blog-draft`コマンド

**Files:**
- Create: `app/Console/Commands/AiStaff/GenerateBlogDraft.php`
- Test: `tests/Feature/Console/GenerateBlogDraftTest.php`

**Interfaces:**
- Consumes: `AiContentTopicService::getNextPending()`/`markUsed()`/`markFailed()`（Task 1）、`ClaudeApiClient::generateBlogDraft()`（Task 3）、`AiBlogDraftCreated`（Task 4）、`AiStaffActivityLogger::log()`・`AiStaffActivityLog::ACTION_BLOG_DRAFT_CREATED`（Task 2、既存の`AiStaffActivityLogger`は`docs/superpowers/specs/2026-09-24-ai-staff-daily-reports-design.md`で実装済み）
- Produces: `php artisan ai-staff:generate-blog-draft`コマンド（Task 6のスケジュール登録から呼ばれる）

- [ ] **Step 1: 失敗するテストを書く**

```php
<?php

namespace Tests\Feature\Console;

use App\Models\Admin;
use App\Models\AiContentTopic;
use App\Models\AiStaffActivityLog;
use App\Models\Post;
use App\Models\PostCategory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class GenerateBlogDraftTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        config(['services.anthropic.api_key' => 'test-api-key']);
        config(['services.anthropic.model' => 'claude-sonnet-5']);

        // 生成された下書きの保存先(投稿カテゴリ)を1件用意しておく
        PostCategory::firstOrCreate(
            ['slug' => 'default'],
            ['name' => 'デフォルト']
        );
    }

    private function fakeSuccessfulClaudeResponse(string $title = 'AIをタスク管理に使うメリット'): void
    {
        Http::fake([
            'api.anthropic.com/*' => Http::response([
                'content' => [
                    [
                        'type' => 'tool_use',
                        'name' => 'structure_blog_draft',
                        'input' => [
                            'title' => $title,
                            'sections' => [
                                ['heading' => 'はじめに', 'html' => '<p>本文</p>'],
                            ],
                        ],
                    ],
                ],
            ], 200),
        ]);
    }

    public function test_it_creates_a_draft_post_and_marks_the_topic_used(): void
    {
        Notification::fake();
        $this->fakeSuccessfulClaudeResponse();

        $creator = Admin::factory()->create(['role' => 'admin']);
        $aiStaff = Admin::factory()->aiStaff('marketing')->create();
        $topic = AiContentTopic::create([
            'title' => 'AIをタスク管理に使うメリット',
            'destination' => AiContentTopic::DESTINATION_SPRA_BLOG,
            'status' => AiContentTopic::STATUS_PENDING,
            'created_by' => $creator->id,
        ]);

        $this->artisan('ai-staff:generate-blog-draft')->assertExitCode(0);

        $topic->refresh();
        $this->assertSame(AiContentTopic::STATUS_USED, $topic->status);
        $this->assertNotNull($topic->post_id);

        $post = Post::findOrFail($topic->post_id);
        $this->assertSame('AIをタスク管理に使うメリット', $post->title);
        $this->assertFalse($post->is_published);
        $this->assertSame($aiStaff->id, $post->created_by);

        $this->assertDatabaseHas('ai_staff_activity_logs', [
            'admin_id' => $aiStaff->id,
            'action' => AiStaffActivityLog::ACTION_BLOG_DRAFT_CREATED,
        ]);

        Notification::assertSentTo($creator, \App\Notifications\AiBlogDraftCreated::class);
    }

    public function test_it_uses_the_topics_assigned_admin_when_present(): void
    {
        Notification::fake();
        $this->fakeSuccessfulClaudeResponse();

        $creator = Admin::factory()->create(['role' => 'admin']);
        Admin::factory()->aiStaff('marketing')->create();
        $salesAiStaff = Admin::factory()->aiStaff('sales')->create();

        AiContentTopic::create([
            'title' => 'テストトピック',
            'destination' => AiContentTopic::DESTINATION_SPRA_BLOG,
            'status' => AiContentTopic::STATUS_PENDING,
            'assigned_admin_id' => $salesAiStaff->id,
            'created_by' => $creator->id,
        ]);

        $this->artisan('ai-staff:generate-blog-draft')->assertExitCode(0);

        $post = Post::firstOrFail();
        $this->assertSame($salesAiStaff->id, $post->created_by);
    }

    public function test_it_does_nothing_when_there_is_no_pending_topic(): void
    {
        Notification::fake();

        $this->artisan('ai-staff:generate-blog-draft')->assertExitCode(0);

        $this->assertDatabaseCount('posts', 0);
        Notification::assertNothingSent();
    }

    public function test_it_marks_the_topic_failed_when_the_api_call_fails(): void
    {
        Notification::fake();
        Http::fake([
            'api.anthropic.com/*' => Http::response(['error' => 'rate limited'], 429),
        ]);

        $creator = Admin::factory()->create(['role' => 'admin']);
        Admin::factory()->aiStaff('marketing')->create();
        $topic = AiContentTopic::create([
            'title' => 'テストトピック',
            'destination' => AiContentTopic::DESTINATION_SPRA_BLOG,
            'status' => AiContentTopic::STATUS_PENDING,
            'created_by' => $creator->id,
        ]);

        $this->artisan('ai-staff:generate-blog-draft')->assertExitCode(0);

        $topic->refresh();
        $this->assertSame(AiContentTopic::STATUS_FAILED, $topic->status);
        $this->assertNotNull($topic->failure_reason);
        $this->assertDatabaseCount('posts', 0);
        Notification::assertNothingSent();
    }

    public function test_it_marks_the_topic_failed_when_no_ai_staff_can_be_resolved(): void
    {
        Notification::fake();
        $this->fakeSuccessfulClaudeResponse();

        $creator = Admin::factory()->create(['role' => 'admin']);
        // marketing部署のAI社員を作らない = 担当者解決不能
        $topic = AiContentTopic::create([
            'title' => 'テストトピック',
            'destination' => AiContentTopic::DESTINATION_SPRA_BLOG,
            'status' => AiContentTopic::STATUS_PENDING,
            'created_by' => $creator->id,
        ]);

        $this->artisan('ai-staff:generate-blog-draft')->assertExitCode(0);

        $topic->refresh();
        $this->assertSame(AiContentTopic::STATUS_FAILED, $topic->status);
        $this->assertDatabaseCount('posts', 0);
    }
}
```

- [ ] **Step 2: テストを実行して失敗を確認**

Run: `docker compose exec -T laravel.test php artisan test tests/Feature/Console/GenerateBlogDraftTest.php`
Expected: FAIL（コマンドが存在しない）

- [ ] **Step 3: コマンドを実装**

```php
<?php

namespace App\Console\Commands\AiStaff;

use App\Models\Admin;
use App\Models\AiContentTopic;
use App\Models\AiStaffActivityLog;
use App\Models\Post;
use App\Models\PostCategory;
use App\Notifications\AiBlogDraftCreated;
use App\Services\AiContentTopicService;
use App\Services\AiStaffActivityLogger;
use App\Services\ClaudeApiClient;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Str;

class GenerateBlogDraft extends Command
{
    protected $signature = 'ai-staff:generate-blog-draft';

    protected $description = 'AI社員が、登録済みのトピックからSpraブログの下書き(Post)を1件生成する';

    public function __construct(
        private AiContentTopicService $topicService,
        private ClaudeApiClient $claudeApiClient,
        private AiStaffActivityLogger $activityLogger,
    ) {
        parent::__construct();
    }

    public function handle(): int
    {
        $topic = $this->topicService->getNextPending(AiContentTopic::DESTINATION_SPRA_BLOG);

        if (! $topic) {
            $this->line('pending状態のトピックがありません。');

            return self::SUCCESS;
        }

        $aiStaff = $topic->assigned_admin_id
            ? Admin::find($topic->assigned_admin_id)
            : Admin::where('role', 'ai_staff')->where('department', 'marketing')->first();

        if (! $aiStaff) {
            $this->topicService->markFailed($topic, '担当AI社員(marketing部署)が見つかりませんでした。');
            $this->error('担当AI社員が見つかりませんでした。');

            return self::SUCCESS;
        }

        try {
            $draft = $this->claudeApiClient->generateBlogDraft($topic->title);
        } catch (\RuntimeException $e) {
            $this->topicService->markFailed($topic, $e->getMessage());
            $this->error("Claude API呼び出しに失敗しました: {$e->getMessage()}");

            return self::SUCCESS;
        }

        $post = DB::transaction(function () use ($draft, $aiStaff) {
            $category = PostCategory::first();

            return Post::create([
                'post_category_id' => $category?->id,
                'title' => $draft['title'],
                'slug' => Str::slug($draft['title']).'-'.Str::lower(Str::random(6)),
                'content' => ['blocks' => $draft['blocks']],
                'is_published' => false,
                'created_by' => $aiStaff->id,
            ]);
        });

        $this->topicService->markUsed($topic, $post->id);

        $this->activityLogger->log(
            $aiStaff,
            AiStaffActivityLog::ACTION_BLOG_DRAFT_CREATED,
            "ブログ記事「{$post->title}」の下書きを作成",
            $post
        );

        Notification::send(Admin::all(), new AiBlogDraftCreated($post));

        $this->info("下書きを作成しました: {$post->title}");

        return self::SUCCESS;
    }
}
```

- [ ] **Step 4: テストを実行して成功を確認**

Run: `docker compose exec -T laravel.test php artisan test tests/Feature/Console/GenerateBlogDraftTest.php`
Expected: `5 passed`

- [ ] **Step 5: Pintを実行してコミット**

```bash
./vendor/bin/pint --dirty
git add app/Console/Commands/AiStaff/GenerateBlogDraft.php tests/Feature/Console/GenerateBlogDraftTest.php
git commit -m "feat: AIブログ下書き生成コマンドを追加"
```

---

### Task 6: スケジュール登録

**Files:**
- Modify: `routes/console.php`

**Interfaces:**
- Consumes: `ai-staff:generate-blog-draft`コマンド（Task 5）

- [ ] **Step 1: `routes/console.php`に毎朝9:15のスケジュールを追加**

既存の`ai-staff:generate-daily-reports`（8:00実行、`docs/superpowers/specs/2026-09-24-ai-staff-daily-reports-design.md`で追加済み）の行の直後に追加する:

```php
// AI社員によるSpraブログ下書き生成を毎朝9:15に実行（日報生成の後、他のジョブと時間帯が重ならないよう調整）
$alertOnFailure(Schedule::command('ai-staff:generate-blog-draft')->dailyAt('09:15'));
```

- [ ] **Step 2: スケジュール一覧に登録されたことを確認**

Run: `docker compose exec -T laravel.test php artisan schedule:list`
Expected: 出力に`ai-staff:generate-blog-draft`と`09:15`が含まれる

- [ ] **Step 3: コミット**

```bash
git add routes/console.php
git commit -m "feat: AIブログ下書き生成コマンドを毎朝9:15にスケジュール登録"
```

---

### Task 7: Admin用トピック管理コントローラー・ルート

**Files:**
- Create: `app/Http/Requests/AiContentTopicRequest.php`
- Create: `app/Http/Controllers/Admin/Website/AiContentTopicController.php`
- Modify: `routes/admin/website.php`
- Test: `tests/Feature/Admin/AiContentTopicControllerTest.php`

**Interfaces:**
- Consumes: `AiContentTopicService`（Task 1、`retry()`含む）
- Produces: `admin.website.ai-content-topic.index`/`.create`/`.store`/`.edit`/`.update`/`.destroy`/`.retry`ルート（Task 8のReactページが利用する）

- [ ] **Step 1: FormRequestを作成**

```php
<?php

namespace App\Http\Requests;

use App\Models\AiContentTopic;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AiContentTopicRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'destination' => ['required', Rule::in([AiContentTopic::DESTINATION_SPRA_BLOG])],
            'assigned_admin_id' => ['nullable', 'uuid', 'exists:admins,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'トピック名を入力してください。',
            'destination.in' => '投稿先の値が不正です。',
            'assigned_admin_id.exists' => '指定された担当者が存在しません。',
        ];
    }
}
```

- [ ] **Step 2: コントローラーを作成**

```php
<?php

namespace App\Http\Controllers\Admin\Website;

use App\Http\Controllers\Controller;
use App\Http\Requests\AiContentTopicRequest;
use App\Models\Admin;
use App\Models\AiContentTopic;
use App\Services\AiContentTopicService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AiContentTopicController extends Controller
{
    public function __construct(private AiContentTopicService $service) {}

    public function index(): Response
    {
        return Inertia::render('Admin/AiContentTopics/Index', [
            'topics' => AiContentTopic::with(['assignedAdmin', 'post'])
                ->orderByDesc('created_at')
                ->paginate(20),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/AiContentTopics/Create', [
            'aiStaffAdmins' => Admin::where('role', 'ai_staff')->orderBy('department')->get(['id', 'email', 'department']),
        ]);
    }

    public function store(AiContentTopicRequest $request): RedirectResponse
    {
        $this->service->create([
            ...$request->validated(),
            'status' => AiContentTopic::STATUS_PENDING,
            'created_by' => Auth::guard('admins')->id(),
        ]);

        return redirect()->route('admin.website.ai-content-topic.index')
            ->with('success', __('messages.created', ['attribute' => 'トピック']));
    }

    public function edit(AiContentTopic $aiContentTopic): Response
    {
        return Inertia::render('Admin/AiContentTopics/Edit', [
            'topic' => $aiContentTopic,
            'aiStaffAdmins' => Admin::where('role', 'ai_staff')->orderBy('department')->get(['id', 'email', 'department']),
        ]);
    }

    public function update(AiContentTopicRequest $request, AiContentTopic $aiContentTopic): RedirectResponse
    {
        $this->service->update($aiContentTopic, $request->validated());

        return redirect()->route('admin.website.ai-content-topic.index')
            ->with('success', __('messages.updated', ['attribute' => 'トピック']));
    }

    public function destroy(AiContentTopic $aiContentTopic): RedirectResponse
    {
        $this->service->delete($aiContentTopic);

        return redirect()->route('admin.website.ai-content-topic.index')
            ->with('success', __('messages.deleted', ['attribute' => 'トピック']));
    }

    /**
     * failed状態のトピックをpendingに戻す（再試行）
     */
    public function retry(AiContentTopic $aiContentTopic): RedirectResponse
    {
        try {
            $this->service->retry($aiContentTopic);
        } catch (\RuntimeException $e) {
            return back()->with('error', $e->getMessage());
        }

        return redirect()->route('admin.website.ai-content-topic.index')
            ->with('success', '再試行のためpending状態に戻しました。');
    }
}
```

- [ ] **Step 3: ルートを登録**

`routes/admin/website.php`の`post`グループの直後（`});`の後、次のセクションが始まる前）に追加:

```php
    // AIコンテンツトピック管理
    Route::prefix('ai-content-topic')->name('ai-content-topic.')->group(function () {
        Route::resource('', \App\Http\Controllers\Admin\Website\AiContentTopicController::class)
            ->parameters(['' => 'aiContentTopic'])
            ->except(['show']);
        Route::post('/{aiContentTopic}/retry', [\App\Http\Controllers\Admin\Website\AiContentTopicController::class, 'retry'])->name('retry');
    });
```

ファイル冒頭のuse文一覧に追加:

```php
use App\Http\Controllers\Admin\Website\AiContentTopicController;
```

（すでにファイル内に同名でuseしていないことを確認してから追加すること）

- [ ] **Step 4: 失敗するテストを書く**

```php
<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use App\Models\AiContentTopic;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AiContentTopicControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
    }

    public function test_admin_can_create_a_topic(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);

        $this->actingAs($admin, 'admins')
            ->post(route('admin.website.ai-content-topic.store'), [
                'title' => 'AIをタスク管理に使うメリット',
                'destination' => AiContentTopic::DESTINATION_SPRA_BLOG,
            ])
            ->assertRedirect(route('admin.website.ai-content-topic.index'));

        $this->assertDatabaseHas('ai_content_topics', [
            'title' => 'AIをタスク管理に使うメリット',
            'status' => AiContentTopic::STATUS_PENDING,
            'created_by' => $admin->id,
        ]);
    }

    public function test_admin_can_view_the_topic_list(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);
        AiContentTopic::create([
            'title' => 'テストトピック',
            'destination' => AiContentTopic::DESTINATION_SPRA_BLOG,
            'status' => AiContentTopic::STATUS_PENDING,
            'created_by' => $admin->id,
        ]);

        $response = $this->actingAs($admin, 'admins')->get(route('admin.website.ai-content-topic.index'));

        $response->assertInertia(fn ($page) => $page
            ->component('Admin/AiContentTopics/Index')
            ->has('topics.data', 1)
        );
    }

    public function test_guest_cannot_view_the_topic_list(): void
    {
        $response = $this->get(route('admin.website.ai-content-topic.index'));

        $response->assertRedirect(route('admin.login'));
    }

    public function test_admin_can_retry_a_failed_topic(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);
        $topic = AiContentTopic::create([
            'title' => 'テストトピック',
            'destination' => AiContentTopic::DESTINATION_SPRA_BLOG,
            'status' => AiContentTopic::STATUS_FAILED,
            'failure_reason' => 'API timeout',
            'created_by' => $admin->id,
        ]);

        $this->actingAs($admin, 'admins')
            ->post(route('admin.website.ai-content-topic.retry', $topic))
            ->assertRedirect(route('admin.website.ai-content-topic.index'));

        $topic->refresh();
        $this->assertSame(AiContentTopic::STATUS_PENDING, $topic->status);
        $this->assertNull($topic->failure_reason);
    }

    public function test_retrying_a_pending_topic_fails_gracefully(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);
        $topic = AiContentTopic::create([
            'title' => 'テストトピック',
            'destination' => AiContentTopic::DESTINATION_SPRA_BLOG,
            'status' => AiContentTopic::STATUS_PENDING,
            'created_by' => $admin->id,
        ]);

        $this->actingAs($admin, 'admins')
            ->post(route('admin.website.ai-content-topic.retry', $topic))
            ->assertSessionHas('error');

        $topic->refresh();
        $this->assertSame(AiContentTopic::STATUS_PENDING, $topic->status);
    }
}
```

- [ ] **Step 5: テストを実行して失敗を確認**

Run: `docker compose exec -T laravel.test php artisan test tests/Feature/Admin/AiContentTopicControllerTest.php`
Expected: FAIL（コントローラー・ルートが存在しない）

- [ ] **Step 6: 権限カタログを同期**

Run: `docker compose exec -T laravel.test php artisan admin:sync-permissions`

- [ ] **Step 7: テストを実行して成功を確認**

Run: `docker compose exec -T laravel.test php artisan test tests/Feature/Admin/AiContentTopicControllerTest.php`
Expected: `5 passed`

- [ ] **Step 8: Pintを実行してコミット**

```bash
./vendor/bin/pint --dirty
git add app/Http/Requests/AiContentTopicRequest.php \
        app/Http/Controllers/Admin/Website/AiContentTopicController.php \
        routes/admin/website.php \
        tests/Feature/Admin/AiContentTopicControllerTest.php
git commit -m "feat: AIコンテンツトピックのAdmin管理画面エンドポイントを追加"
```

---

### Task 8: Admin用React画面・ナビゲーション

**Files:**
- Create: `resources/js/Pages/Admin/AiContentTopics/Index.jsx`
- Create: `resources/js/Pages/Admin/AiContentTopics/Create.jsx`
- Create: `resources/js/Pages/Admin/AiContentTopics/Edit.jsx`
- Create: `resources/js/Pages/Admin/AiContentTopics/_components/Form.jsx`
- Modify: `resources/js/Components/NavItems/AdminNavItems.jsx`

**Interfaces:**
- Consumes: Task 7の`admin.website.ai-content-topic.*`ルートとInertia props（`topics`、`aiStaffAdmins`、`topic`）

- [ ] **Step 1: 共通フォームコンポーネントを作成**

```jsx
import React from "react";
import { FormGroup, TextInput, SelectInput } from "@/Components/Forms";
import { PrimaryButton, SecondaryButton } from "@/Components/Buttons";
import InputError from "@/Components/InputError";

export default function Form({ data, setData, errors, processing, onSubmit, aiStaffAdmins, onCancel }) {
    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <FormGroup label="トピック名" required>
                <TextInput
                    value={data.title}
                    onChange={(e) => setData("title", e.target.value)}
                    placeholder="例: AIをタスク管理に使うメリット"
                />
                <InputError message={errors.title} />
            </FormGroup>

            <FormGroup label="担当AI社員（任意、未指定ならマーケティング部門のAI社員が担当）">
                <SelectInput
                    value={data.assigned_admin_id || ""}
                    onChange={(e) => setData("assigned_admin_id", e.target.value || null)}
                >
                    <option value="">自動選択（マーケティング部門）</option>
                    {aiStaffAdmins.map((admin) => (
                        <option key={admin.id} value={admin.id}>
                            {admin.department ?? admin.email}
                        </option>
                    ))}
                </SelectInput>
                <InputError message={errors.assigned_admin_id} />
            </FormGroup>

            <div className="flex justify-end gap-3">
                <SecondaryButton type="button" onClick={onCancel}>
                    キャンセル
                </SecondaryButton>
                <PrimaryButton type="submit" disabled={processing}>
                    保存
                </PrimaryButton>
            </div>
        </form>
    );
}
```

- [ ] **Step 2: 一覧ページを作成**

```jsx
import React from "react";
import { Head, Link, router } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { Card } from "@/Components/Card";
import { Badge } from "@/Components/Badges";
import Pagination from "@/Components/Layout/Pagination";
import { PlusIcon } from "@heroicons/react/24/outline";

const handleRetry = (topicId) => {
    router.post(route("admin.website.ai-content-topic.retry", topicId));
};

const STATUS_BADGE = {
    pending: { label: "未処理", variant: "secondary" },
    used: { label: "下書き作成済み", variant: "success" },
    failed: { label: "失敗", variant: "danger" },
};

export default function Index({ topics }) {
    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="AIコンテンツトピック"
                    description="AIがブログ下書きを作成する際のトピックキューを管理します"
                    breadcrumbs={["AIコンテンツトピック"]}
                    actions={[
                        {
                            label: "新規登録",
                            icon: PlusIcon,
                            variant: "primary",
                            route: route("admin.website.ai-content-topic.create"),
                        },
                    ]}
                />
            }
        >
            <Head title="AIコンテンツトピック" />

            <div className="space-y-4">
                <Card>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                            <thead>
                                <tr>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                                        トピック名
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                                        状態
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                                        担当
                                    </th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                                        操作
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {topics.data.map((topic) => {
                                    const badge = STATUS_BADGE[topic.status] ?? {
                                        label: topic.status,
                                        variant: "secondary",
                                    };

                                    return (
                                        <tr
                                            key={topic.id}
                                            className="hover:bg-gray-50 dark:hover:bg-gray-800"
                                        >
                                            <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                                                {topic.title}
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge variant={badge.variant}>
                                                    {badge.label}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                                                {topic.assigned_admin?.department ??
                                                    "自動選択"}
                                            </td>
                                            <td className="px-4 py-3">
                                                {topic.status === "pending" && (
                                                    <Link
                                                        href={route(
                                                            "admin.website.ai-content-topic.edit",
                                                            topic.id,
                                                        )}
                                                        className="text-indigo-600 dark:text-indigo-400 hover:underline"
                                                    >
                                                        編集
                                                    </Link>
                                                )}
                                                {topic.post && (
                                                    <Link
                                                        href={route(
                                                            "admin.website.post.edit",
                                                            topic.post.id,
                                                        )}
                                                        className="ml-3 text-indigo-600 dark:text-indigo-400 hover:underline"
                                                    >
                                                        下書きを見る
                                                    </Link>
                                                )}
                                                {topic.status === "failed" && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleRetry(topic.id)
                                                        }
                                                        className="ml-3 text-indigo-600 dark:text-indigo-400 hover:underline"
                                                    >
                                                        再試行
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                                {topics.data.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
                                        >
                                            トピックが登録されていません
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {topics.data.length > 0 && <Pagination paginationData={topics} />}
            </div>
        </AdminAuthenticatedLayout>
    );
}
```

- [ ] **Step 3: 新規作成ページを作成**

```jsx
import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { Card } from "@/Components/Card";
import Form from "./_components/Form";

export default function Create({ aiStaffAdmins }) {
    const { data, setData, post, processing, errors } = useForm({
        title: "",
        destination: "spra_blog",
        assigned_admin_id: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.website.ai-content-topic.store"));
    };

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="トピックの新規登録"
                    breadcrumbs={["AIコンテンツトピック", "新規登録"]}
                />
            }
        >
            <Head title="トピックの新規登録" />

            <Card>
                <div className="p-4">
                    <Form
                        data={data}
                        setData={setData}
                        errors={errors}
                        processing={processing}
                        onSubmit={handleSubmit}
                        aiStaffAdmins={aiStaffAdmins}
                        onCancel={() =>
                            (window.location.href = route(
                                "admin.website.ai-content-topic.index",
                            ))
                        }
                    />
                </div>
            </Card>
        </AdminAuthenticatedLayout>
    );
}
```

- [ ] **Step 4: 編集ページを作成**

```jsx
import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import PageHeader from "@/Components/Layout/PageHeader";
import { Card } from "@/Components/Card";
import Form from "./_components/Form";

export default function Edit({ topic, aiStaffAdmins }) {
    const { data, setData, put, processing, errors } = useForm({
        title: topic.title,
        destination: topic.destination,
        assigned_admin_id: topic.assigned_admin_id,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("admin.website.ai-content-topic.update", topic.id));
    };

    return (
        <AdminAuthenticatedLayout
            header={
                <PageHeader
                    title="トピックの編集"
                    breadcrumbs={["AIコンテンツトピック", "編集"]}
                />
            }
        >
            <Head title="トピックの編集" />

            <Card>
                <div className="p-4">
                    <Form
                        data={data}
                        setData={setData}
                        errors={errors}
                        processing={processing}
                        onSubmit={handleSubmit}
                        aiStaffAdmins={aiStaffAdmins}
                        onCancel={() =>
                            (window.location.href = route(
                                "admin.website.ai-content-topic.index",
                            ))
                        }
                    />
                </div>
            </Card>
        </AdminAuthenticatedLayout>
    );
}
```

- [ ] **Step 5: ナビゲーションに追加**

`resources/js/Components/NavItems/AdminNavItems.jsx`の「Webサイト」セクション、`{ name: "投稿カテゴリ", href: "admin.website.post.category.index" }`の直後に追加:

```js
                {
                    name: "AIコンテンツトピック",
                    href: "admin.website.ai-content-topic.index",
                },
```

（この項目の`currentPath`は既存の`"admin.website.*"`が`admin.website.ai-content-topic.*`もカバーするため、追加の変更は不要）

- [ ] **Step 6: フロントエンドをビルド**

Run（ホスト側で実行）: `npm run build`
Expected: `✓ built`とエラー無しで終了

- [ ] **Step 7: バックエンドのテストを再実行して回帰が無いことを確認**

Run: `docker compose exec -T laravel.test php artisan test tests/Feature/Admin/AiContentTopicControllerTest.php`
Expected: `3 passed`

- [ ] **Step 8: コミット**

```bash
git add resources/js/Pages/Admin/AiContentTopics/ \
        resources/js/Components/NavItems/AdminNavItems.jsx
git commit -m "feat: AIコンテンツトピックの管理画面とナビゲーションを追加"
```

---

## 最終確認

全タスク完了後、以下を実行してから`superpowers:finishing-a-development-branch`スキルでブランチを統合する:

```bash
docker compose exec -T laravel.test php artisan test \
  tests/Unit/AiContentTopicModelTest.php \
  tests/Unit/ClaudeApiClientTest.php \
  tests/Unit/AiBlogDraftCreatedTest.php \
  tests/Feature/Console/GenerateBlogDraftTest.php \
  tests/Feature/Admin/AiContentTopicControllerTest.php
./vendor/bin/pint --dirty
npm run build
```

あわせて、CLAUDE.md §8のドキュメント更新ルールに従い、`docs/superpowers/specs/2026-09-25-ai-staff-execution-platform-design.md`に「実装済み」の追記と、`SPEC.md`の該当ドメイン節（§5.13のAI社員節、または新規節）への参照を追加すること。

**実装着手前の前提条件（このプランの範囲外）:** `.env`（開発環境・本番環境どちらも）に実際の`ANTHROPIC_API_KEY`を設定すること。未設定のままでもテストは`Http::fake()`で完結するため失敗しないが、実際にコマンドを手動実行して動作確認する際は必須。
