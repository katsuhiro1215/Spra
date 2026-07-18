<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\Company;
use App\Models\Profile;
use App\Models\Project;
use App\Models\ProjectDocumentVersion;
use App\Models\User;
use App\Services\ProjectDocumentSectionService;
use App\Services\ProjectDocumentService;
use App\Services\ProjectDocumentVersionService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * ProjectDocument機能（設計文書の中央管理）のデモ用シードデータ。
 *
 * 「体操教室向け会員・予約管理システム」という過去の実案件を想定し、
 * User（山田太郎）・Company（ABC体操教室）・Projectと、
 * 各種ProjectDocument（概要/要件定義/基本設計/DB設計/API設計/画面設計/テスト/リリース）に
 * 現実的な内容を投入する。
 *
 * DatabaseSeeder::run() には含めない（デモ専用のため個別実行する）。
 * 実行方法: php artisan db:seed --class=ProjectDocumentDemoSeeder
 */
class ProjectDocumentDemoSeeder extends Seeder
{
    public function run(): void
    {
        $admin = Admin::first();
        if (!$admin) {
            $this->command?->warn('ProjectDocumentDemoSeeder: Adminが存在しないためスキップします。');
            return;
        }

        DB::transaction(function () use ($admin) {
            [$user, $company] = $this->createUserAndCompany();
            $project = $this->createProject($user, $company, $admin);
            $this->createDocuments($project);
        });

        $this->command?->info('ProjectDocumentDemoSeeder: ABC体操教室のデモプロジェクトを作成しました。');
    }

    private function createUserAndCompany(): array
    {
        $company = Company::updateOrCreate(
            ['name' => 'ABC体操教室'],
            [
                'company_type' => 'corporate',
                'legal_name' => '株式会社ABC体操教室',
                'industry' => 'スポーツ・フィットネス',
                'employee_count' => 12,
                'business_description' => '幼児から中学生を対象とした体操教室を3教室運営。会員管理・レッスン予約・月謝決済のシステム化を依頼。',
                'status' => 'active',
            ]
        );

        $user = User::updateOrCreate(
            ['email' => 'yamada.taro@abc-gym.example.com'],
            [
                'password' => Hash::make('password'),
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );

        Profile::updateOrCreate(
            ['profilable_type' => User::class, 'profilable_id' => $user->id],
            [
                'last_name' => '山田',
                'first_name' => '太郎',
                'last_name_kana' => 'ヤマダ',
                'first_name_kana' => 'タロウ',
                'phone' => '090-1234-5678',
            ]
        );

        if (!DB::table('company_user')->where('user_id', $user->id)->where('company_id', $company->id)->exists()) {
            DB::table('company_user')->insert([
                'id' => (string) Str::ulid(),
                'user_id' => $user->id,
                'company_id' => $company->id,
                'role' => 'owner',
                'is_primary' => true,
                'joined_at' => now()->subYears(2),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        return [$user, $company];
    }

    private function createProject(User $user, Company $company, Admin $admin): Project
    {
        $startDate = now()->subMonths(10);
        $endDate = now()->subMonths(2);

        $project = Project::updateOrCreate(
            ['project_code' => 'PRJ-DEMO-GYM01'],
            [
                'user_id' => $user->id,
                'company_id' => $company->id,
                'title' => 'ABC体操教室 会員・予約管理システム構築',
                'description' => "ABC体操教室（3教室運営）向けの業務管理システム。\n"
                    . "会員管理（CRM）とレッスン予約システムを中心に、月謝・都度払いの決済管理、"
                    . "インストラクター別のレッスンスケジュール管理までを一元化する。\n"
                    . "保護者がスマートフォンからレッスンの予約・キャンセルを行えることを重視。",
                'status' => 'completed',
                'priority' => 'medium',
                'start_date' => $startDate->toDateString(),
                'estimated_end_date' => $endDate->toDateString(),
                'actual_end_date' => $endDate->toDateString(),
                'is_client_visible' => true,
                'created_by' => $admin->id,
            ]
        );

        if (!$project->admins()->where('admin_id', $admin->id)->exists()) {
            $project->admins()->attach($admin->id, ['id' => (string) Str::ulid(), 'role' => 'leader']);
        }

        return $project;
    }

    private function createDocuments(Project $project): void
    {
        $documentService = app(ProjectDocumentService::class);
        $sectionService = app(ProjectDocumentSectionService::class);
        $versionService = app(ProjectDocumentVersionService::class);

        $makeDocument = function (string $type) use ($project, $documentService): \App\Models\ProjectDocument {
            $existing = $project->documents()->where('document_type', $type)->first();
            if ($existing) {
                return $existing->load('currentVersion');
            }

            return $documentService->createForProject($project, $type);
        };

        // ---------------------------------------------------------
        // 概要
        // ---------------------------------------------------------
        $overview = $makeDocument('overview');
        $this->upsertTextSection($sectionService, $overview->currentVersion, 'システム概要', <<<'TEXT'
ABC体操教室（3教室運営）向けの会員・予約管理システム。

これまでExcelと電話・LINEで行っていた会員管理、レッスンの予約受付、
月謝の集金管理を一つのシステムに集約する。

主な利用者は3種類:
- 教室スタッフ（管理者）: 会員管理、レッスン枠管理、決済状況の確認
- インストラクター: 担当レッスンの受講者確認、出欠記録
- 保護者（会員）: レッスンの予約・キャンセル、月謝の支払い状況確認
TEXT);

        // ---------------------------------------------------------
        // 要件定義
        // ---------------------------------------------------------
        $requirements = $makeDocument('requirements');
        $this->upsertTextSection($sectionService, $requirements->currentVersion, '業務要件', <<<'TEXT'
・保護者はレッスンの空き状況をスマートフォンから確認し、その場で予約・キャンセルできること
・キャンセルは開始24時間前まで無料、以降はキャンセル料が発生する運用に対応すること
・月謝は口座振替、都度払いはクレジットカード/現金に対応すること
・インストラクターごとに担当レッスンと受講者一覧を確認できること
・教室スタッフは全教室・全会員の状況を横断的に確認できること
TEXT);
        $this->upsertFeatureListSection($sectionService, $requirements->currentVersion, '主要機能一覧', [
            ['name' => '会員管理（CRM）', 'description' => '入会・退会手続き、会員情報・受講履歴の管理', 'related_screen' => '会員一覧画面', 'priority' => 'high', 'status' => 'done'],
            ['name' => 'レッスン予約管理', 'description' => 'オンラインでのレッスン予約・キャンセル', 'related_screen' => 'レッスン予約画面', 'priority' => 'high', 'status' => 'done'],
            ['name' => 'クラス・スケジュール管理', 'description' => 'インストラクター別のレッスン枠・定員管理', 'related_screen' => 'レッスンカレンダー画面', 'priority' => 'high', 'status' => 'done'],
            ['name' => '月謝・決済管理', 'description' => '口座振替/カード/現金による決済管理', 'related_screen' => '決済履歴画面', 'priority' => 'high', 'status' => 'done'],
            ['name' => '出欠管理', 'description' => 'レッスンごとの出席記録', 'related_screen' => 'レッスン詳細画面', 'priority' => 'medium', 'status' => 'done'],
            ['name' => '保護者への一斉連絡', 'description' => '休講・お知らせのプッシュ通知配信', 'related_screen' => 'お知らせ管理画面', 'priority' => 'low', 'status' => 'done'],
        ]);

        // ---------------------------------------------------------
        // 基本設計
        // ---------------------------------------------------------
        $basicDesign = $makeDocument('basic_design');
        $this->upsertTextSection($sectionService, $basicDesign->currentVersion, 'システム概要', <<<'TEXT'
本システムは「管理者向け管理画面」「インストラクター向け画面」「保護者向けスマートフォンWeb」の
3つのフロントエンドと、共通のAPIバックエンドで構成する。
TEXT);
        $this->upsertFeatureListSection($sectionService, $basicDesign->currentVersion, '機能一覧', [
            ['name' => '会員管理', 'description' => '会員のCRUD、検索、退会処理', 'related_screen' => '会員一覧/詳細画面', 'priority' => 'high', 'status' => 'done'],
            ['name' => 'レッスン予約', 'description' => '空き枠確認、予約、キャンセル', 'related_screen' => 'レッスン予約画面', 'priority' => 'high', 'status' => 'done'],
            ['name' => '決済管理', 'description' => '月謝・都度払いの記録と一覧', 'related_screen' => '決済履歴画面', 'priority' => 'high', 'status' => 'done'],
        ]);
        $this->upsertScreenListSection($sectionService, $basicDesign->currentVersion, '画面一覧', [
            ['screen_name' => 'ログイン画面', 'path' => '/login', 'description' => '会員・スタッフ共通のログイン画面', 'related_features' => '認証'],
            ['screen_name' => '会員一覧画面', 'path' => '/admin/members', 'description' => '全会員の検索・一覧表示', 'related_features' => '会員管理'],
            ['screen_name' => '会員詳細画面', 'path' => '/admin/members/{id}', 'description' => '会員情報・受講履歴・決済履歴の確認', 'related_features' => '会員管理, 決済管理'],
            ['screen_name' => 'レッスンカレンダー画面', 'path' => '/admin/classes/calendar', 'description' => 'インストラクター別のレッスン枠管理', 'related_features' => 'クラス・スケジュール管理'],
            ['screen_name' => 'レッスン予約画面', 'path' => '/reservations/new', 'description' => '保護者が空き状況を見て予約する画面', 'related_features' => 'レッスン予約'],
            ['screen_name' => '決済履歴画面', 'path' => '/admin/payments', 'description' => '月謝・都度払いの入金状況一覧', 'related_features' => '決済管理'],
        ]);
        $this->upsertPermissionListSection($sectionService, $basicDesign->currentVersion, '権限一覧', [
            ['role_name' => '管理者', 'permission' => '全機能へのアクセス', 'description' => '教室スタッフ。全教室・全会員のデータを閲覧・編集可能'],
            ['role_name' => 'インストラクター', 'permission' => '自分の担当レッスンの閲覧・出欠登録', 'description' => '他インストラクターのレッスンは閲覧不可'],
            ['role_name' => '会員（保護者）', 'permission' => '自分の予約・決済履歴の閲覧、予約操作', 'description' => '他会員の情報は閲覧不可'],
        ]);

        // ---------------------------------------------------------
        // DB設計
        // ---------------------------------------------------------
        $databaseDesign = $makeDocument('database_design');
        $v = $databaseDesign->currentVersion;

        $this->upsertColumnsSection($sectionService, $v, 'MembershipPlans', [
            ['name' => 'id', 'data_type' => 'ulid', 'is_primary_key' => true],
            ['name' => 'name', 'data_type' => 'varchar', 'length' => '100', 'comment' => 'プラン名（週1コース等）'],
            ['name' => 'monthly_fee', 'data_type' => 'decimal', 'length' => '8,2', 'comment' => '月謝'],
            ['name' => 'description', 'data_type' => 'text', 'nullable' => true],
        ]);
        $this->upsertColumnsSection($sectionService, $v, 'Members', [
            ['name' => 'id', 'data_type' => 'ulid', 'is_primary_key' => true],
            ['name' => 'membership_plan_id', 'data_type' => 'ulid', 'references_table' => 'MembershipPlans', 'references_column' => 'id'],
            ['name' => 'name', 'data_type' => 'varchar', 'length' => '100', 'comment' => '会員名（お子様の氏名）'],
            ['name' => 'guardian_name', 'data_type' => 'varchar', 'length' => '100', 'comment' => '保護者氏名'],
            ['name' => 'email', 'data_type' => 'varchar', 'length' => '255', 'is_unique' => true],
            ['name' => 'phone', 'data_type' => 'varchar', 'length' => '20'],
            ['name' => 'joined_at', 'data_type' => 'date'],
            ['name' => 'status', 'data_type' => 'varchar', 'length' => '20', 'default_value' => 'active', 'comment' => 'active/withdrawn'],
        ]);
        $this->upsertColumnsSection($sectionService, $v, 'Instructors', [
            ['name' => 'id', 'data_type' => 'ulid', 'is_primary_key' => true],
            ['name' => 'name', 'data_type' => 'varchar', 'length' => '100'],
            ['name' => 'email', 'data_type' => 'varchar', 'length' => '255', 'is_unique' => true],
            ['name' => 'bio', 'data_type' => 'text', 'nullable' => true],
        ]);
        $this->upsertColumnsSection($sectionService, $v, 'LessonClasses', [
            ['name' => 'id', 'data_type' => 'ulid', 'is_primary_key' => true],
            ['name' => 'instructor_id', 'data_type' => 'ulid', 'references_table' => 'Instructors', 'references_column' => 'id'],
            ['name' => 'name', 'data_type' => 'varchar', 'length' => '100', 'comment' => '例: 幼児クラス、初級クラス'],
            ['name' => 'capacity', 'data_type' => 'integer', 'comment' => '定員'],
            ['name' => 'duration_minutes', 'data_type' => 'integer', 'default_value' => '60'],
        ]);
        $this->upsertColumnsSection($sectionService, $v, 'Reservations', [
            ['name' => 'id', 'data_type' => 'ulid', 'is_primary_key' => true],
            ['name' => 'member_id', 'data_type' => 'ulid', 'references_table' => 'Members', 'references_column' => 'id'],
            ['name' => 'lesson_class_id', 'data_type' => 'ulid', 'references_table' => 'LessonClasses', 'references_column' => 'id'],
            ['name' => 'reserved_at', 'data_type' => 'datetime', 'comment' => 'レッスン開催日時'],
            ['name' => 'status', 'data_type' => 'varchar', 'length' => '20', 'default_value' => 'confirmed', 'comment' => 'confirmed/cancelled'],
        ]);
        $this->upsertColumnsSection($sectionService, $v, 'Payments', [
            ['name' => 'id', 'data_type' => 'ulid', 'is_primary_key' => true],
            ['name' => 'member_id', 'data_type' => 'ulid', 'references_table' => 'Members', 'references_column' => 'id'],
            ['name' => 'amount', 'data_type' => 'decimal', 'length' => '8,2'],
            ['name' => 'paid_at', 'data_type' => 'datetime', 'nullable' => true],
            ['name' => 'method', 'data_type' => 'varchar', 'length' => '20', 'comment' => 'transfer/card/cash'],
        ]);

        // ---------------------------------------------------------
        // API設計
        // ---------------------------------------------------------
        $apiDesign = $makeDocument('api_design');
        $this->upsertEndpointsSection(app(ProjectDocumentSectionService::class), $apiDesign->currentVersion, '会員API', [
            ['http_method' => 'GET', 'path' => '/api/members', 'summary' => '会員一覧取得', 'status_codes' => '200'],
            ['http_method' => 'POST', 'path' => '/api/members', 'summary' => '会員登録', 'status_codes' => '201,422'],
            ['http_method' => 'GET', 'path' => '/api/members/{id}', 'summary' => '会員詳細取得', 'status_codes' => '200,404'],
            ['http_method' => 'PUT', 'path' => '/api/members/{id}', 'summary' => '会員情報更新', 'status_codes' => '200,422,404'],
        ]);
        $this->upsertEndpointsSection(app(ProjectDocumentSectionService::class), $apiDesign->currentVersion, '予約API', [
            ['http_method' => 'GET', 'path' => '/api/reservations', 'summary' => '予約一覧取得（会員本人分）', 'status_codes' => '200'],
            ['http_method' => 'POST', 'path' => '/api/reservations', 'summary' => 'レッスン予約作成', 'request_body' => 'lesson_class_id, reserved_at', 'status_codes' => '201,409'],
            ['http_method' => 'DELETE', 'path' => '/api/reservations/{id}', 'summary' => '予約キャンセル', 'status_codes' => '204,403'],
        ]);

        // ---------------------------------------------------------
        // 画面設計
        // ---------------------------------------------------------
        $screenDesign = $makeDocument('screen_design');
        $this->upsertScreenListSection($sectionService, $screenDesign->currentVersion, '保護者向け画面一覧', [
            ['screen_name' => 'レッスン予約画面', 'path' => '/reservations/new', 'description' => 'カレンダーから空き枠を選んで予約', 'related_features' => 'レッスン予約'],
            ['screen_name' => '予約履歴画面', 'path' => '/reservations', 'description' => '予約中・過去のレッスン一覧', 'related_features' => 'レッスン予約'],
            ['screen_name' => '決済状況確認画面', 'path' => '/payments', 'description' => '月謝の支払い状況を確認', 'related_features' => '決済管理'],
        ]);

        // ---------------------------------------------------------
        // テスト
        // ---------------------------------------------------------
        $test = $makeDocument('test');
        $this->upsertTextSection($sectionService, $test->currentVersion, 'テスト方針', <<<'TEXT'
単体テストはAPI主要エンドポイントを対象に実施。
結合テストでは「予約→キャンセル→キャンセル料計算」「月謝の自動引き落とし」の
2つの業務フローを重点的に確認した。
本番投入前に、実際のインストラクター2名・保護者5名によるUAT（受入テスト）を1週間実施。
TEXT);

        // ---------------------------------------------------------
        // リリース
        // ---------------------------------------------------------
        $release = $makeDocument('release');
        $this->upsertTextSection($sectionService, $release->currentVersion, 'リリース計画', <<<'TEXT'
2教室を先行導入し、2週間の並行運用（紙台帳と併用）を経て問題がないことを確認後、
残り1教室を含めた全教室展開に切り替えた。
リリース後1ヶ月は、既存会員データの移行不備がないか集中的にモニタリングした。
TEXT);

        // ---------------------------------------------------------
        // 主要文書（基本設計・DB設計・API設計）を v1として確定
        // ---------------------------------------------------------
        foreach ([$requirements, $basicDesign, $databaseDesign, $apiDesign] as $doc) {
            $doc->refresh();
            $alreadyReleased = $doc->versions()->where('status', 'released')->exists();
            if (!$alreadyReleased && $doc->currentVersion) {
                $versionService->release($doc->currentVersion, '初版リリース後の運用改善用ドラフト');
            }
            $doc->update(['status' => 'confirmed']);
        }
    }

    private function upsertTextSection(ProjectDocumentSectionService $service, ProjectDocumentVersion $version, string $title, string $body): void
    {
        $section = $version->sections()->where('title', $title)->first()
            ?? $service->create($version, 'text', $title);
        $service->updateMeta($section, ['title' => $title, 'body' => $body]);
    }

    private function upsertColumnsSection(ProjectDocumentSectionService $service, ProjectDocumentVersion $version, string $tableName, array $rows): void
    {
        $section = $version->sections()->where('title', $tableName)->first()
            ?? $service->create($version, 'db_table', $tableName);
        $service->replaceDetails($section, $rows);
    }

    private function upsertEndpointsSection(ProjectDocumentSectionService $service, ProjectDocumentVersion $version, string $title, array $rows): void
    {
        $section = $version->sections()->where('title', $title)->first()
            ?? $service->create($version, 'api_group', $title);
        $service->replaceDetails($section, $rows);
    }

    private function upsertFeatureListSection(ProjectDocumentSectionService $service, ProjectDocumentVersion $version, string $title, array $rows): void
    {
        $section = $version->sections()->where('title', $title)->first()
            ?? $service->create($version, 'feature_list', $title);
        $service->replaceDetails($section, $rows);
    }

    private function upsertScreenListSection(ProjectDocumentSectionService $service, ProjectDocumentVersion $version, string $title, array $rows): void
    {
        $section = $version->sections()->where('title', $title)->first()
            ?? $service->create($version, 'screen_list', $title);
        $service->replaceDetails($section, $rows);
    }

    private function upsertPermissionListSection(ProjectDocumentSectionService $service, ProjectDocumentVersion $version, string $title, array $rows): void
    {
        $section = $version->sections()->where('title', $title)->first()
            ?? $service->create($version, 'permission_list', $title);
        $service->replaceDetails($section, $rows);
    }
}
