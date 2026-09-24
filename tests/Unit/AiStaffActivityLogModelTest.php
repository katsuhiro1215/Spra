<?php

namespace Tests\Unit;

use App\Models\Admin;
use App\Models\AiStaffActivityLog;
use App\Models\AiStaffDailyReport;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AiStaffActivityLogModelTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Admin保存時にbooted()フックがsyncRoles()を呼ぶため、対象ロールの
        // Spatie Roleレコードを先に用意しておく必要がある。
        $this->seed(\Database\Seeders\RolePermissionSeeder::class);
    }

    public function test_activity_log_can_be_created_for_an_ai_staff_admin(): void
    {
        $admin = Admin::factory()->aiStaff('marketing')->create();

        $log = AiStaffActivityLog::create([
            'admin_id' => $admin->id,
            'action' => AiStaffActivityLog::ACTION_TASK_STATUS_CHANGED,
            'description' => 'テストログ',
            'occurred_at' => now(),
        ]);

        $this->assertDatabaseHas('ai_staff_activity_logs', ['id' => $log->id]);
        $this->assertTrue($log->admin->is($admin));
    }

    public function test_daily_report_enforces_one_row_per_admin_per_date(): void
    {
        $admin = Admin::factory()->aiStaff('marketing')->create();

        AiStaffDailyReport::create([
            'admin_id' => $admin->id,
            'report_date' => '2026-09-23',
            'body' => '1回目',
            'activity_count' => 1,
            'generated_at' => now(),
        ]);

        $this->expectException(\Illuminate\Database\QueryException::class);

        AiStaffDailyReport::create([
            'admin_id' => $admin->id,
            'report_date' => '2026-09-23',
            'body' => '2回目（重複のはず）',
            'activity_count' => 1,
            'generated_at' => now(),
        ]);
    }
}
