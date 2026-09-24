<?php

namespace Tests\Unit;

use App\Models\Admin;
use App\Models\AiStaffActivityLog;
use App\Services\AiStaffActivityLogger;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AiStaffActivityLoggerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    public function test_it_logs_an_action_for_an_ai_staff_admin(): void
    {
        $admin = Admin::factory()->aiStaff('marketing')->create();

        app(AiStaffActivityLogger::class)->log(
            $admin,
            AiStaffActivityLog::ACTION_TASK_STATUS_CHANGED,
            'タスク「テスト」をレビュー待ちに変更'
        );

        $this->assertDatabaseHas('ai_staff_activity_logs', [
            'admin_id' => $admin->id,
            'action' => AiStaffActivityLog::ACTION_TASK_STATUS_CHANGED,
            'description' => 'タスク「テスト」をレビュー待ちに変更',
        ]);
    }

    public function test_it_does_not_log_for_a_human_admin(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin']);

        app(AiStaffActivityLogger::class)->log(
            $admin,
            AiStaffActivityLog::ACTION_TASK_STATUS_CHANGED,
            'タスク「テスト」をレビュー待ちに変更'
        );

        $this->assertDatabaseCount('ai_staff_activity_logs', 0);
    }

    public function test_it_swallows_exceptions_and_does_not_rethrow(): void
    {
        $admin = Admin::factory()->aiStaff('marketing')->create();
        // action文字列がstring型カラムの上限(255文字)を超えると、素のcreate()なら
        // QueryExceptionが飛ぶ。呼び出し元の本処理を止めない設計になっているかを確認する。
        $tooLongAction = str_repeat('a', 300);

        app(AiStaffActivityLogger::class)->log($admin, $tooLongAction, 'テスト');

        $this->assertDatabaseCount('ai_staff_activity_logs', 0);
    }
}
