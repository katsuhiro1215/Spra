<?php

namespace Tests\Feature\Console;

use App\Models\Admin;
use App\Models\AiStaffActivityLog;
use App\Models\AiStaffDailyReport;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GenerateDailyReportsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    public function test_it_generates_one_report_per_ai_staff_with_activity_on_the_target_date(): void
    {
        $marketing = Admin::factory()->aiStaff('marketing')->create();
        $sales = Admin::factory()->aiStaff('sales')->create();
        $targetDate = '2026-09-23';

        AiStaffActivityLog::create([
            'admin_id' => $marketing->id,
            'action' => AiStaffActivityLog::ACTION_TASK_STATUS_CHANGED,
            'description' => 'タスクA完了',
            'occurred_at' => "{$targetDate} 09:00:00",
        ]);
        AiStaffActivityLog::create([
            'admin_id' => $marketing->id,
            'action' => AiStaffActivityLog::ACTION_RESPONSE_CREATED,
            'description' => '返信B作成',
            'occurred_at' => "{$targetDate} 15:30:00",
        ]);
        AiStaffActivityLog::create([
            'admin_id' => $sales->id,
            'action' => AiStaffActivityLog::ACTION_QUOTE_CREATED,
            'description' => '見積C作成',
            'occurred_at' => "{$targetDate} 11:00:00",
        ]);
        // 対象日でないログ（集計対象に含まれてはいけない）
        AiStaffActivityLog::create([
            'admin_id' => $marketing->id,
            'action' => AiStaffActivityLog::ACTION_TASK_STATUS_CHANGED,
            'description' => '別の日のログ',
            'occurred_at' => '2026-09-22 09:00:00',
        ]);

        $this->artisan("ai-staff:generate-daily-reports {$targetDate}")
            ->assertExitCode(0);

        $this->assertDatabaseCount('ai_staff_daily_reports', 2);

        $marketingReport = AiStaffDailyReport::where('admin_id', $marketing->id)
            ->where('report_date', $targetDate)
            ->firstOrFail();
        $this->assertSame(2, $marketingReport->activity_count);
        $this->assertStringContainsString('タスクA完了', $marketingReport->body);
        $this->assertStringContainsString('返信B作成', $marketingReport->body);

        $salesReport = AiStaffDailyReport::where('admin_id', $sales->id)
            ->where('report_date', $targetDate)
            ->firstOrFail();
        $this->assertSame(1, $salesReport->activity_count);
    }

    public function test_it_does_not_create_a_report_for_an_ai_staff_with_no_activity(): void
    {
        Admin::factory()->aiStaff('marketing')->create();

        $this->artisan('ai-staff:generate-daily-reports 2026-09-23')
            ->assertExitCode(0);

        $this->assertDatabaseCount('ai_staff_daily_reports', 0);
    }

    public function test_running_twice_for_the_same_date_does_not_duplicate_reports(): void
    {
        $admin = Admin::factory()->aiStaff('marketing')->create();
        AiStaffActivityLog::create([
            'admin_id' => $admin->id,
            'action' => AiStaffActivityLog::ACTION_TASK_STATUS_CHANGED,
            'description' => 'タスクA完了',
            'occurred_at' => '2026-09-23 09:00:00',
        ]);

        $this->artisan('ai-staff:generate-daily-reports 2026-09-23')->assertExitCode(0);
        $this->artisan('ai-staff:generate-daily-reports 2026-09-23')->assertExitCode(0);

        $this->assertDatabaseCount('ai_staff_daily_reports', 1);
    }

    public function test_it_defaults_to_yesterday_when_no_date_is_given(): void
    {
        $admin = Admin::factory()->aiStaff('marketing')->create();
        AiStaffActivityLog::create([
            'admin_id' => $admin->id,
            'action' => AiStaffActivityLog::ACTION_TASK_STATUS_CHANGED,
            'description' => 'タスクA完了',
            'occurred_at' => now()->subDay()->setTime(9, 0),
        ]);

        $this->artisan('ai-staff:generate-daily-reports')->assertExitCode(0);

        $this->assertDatabaseHas('ai_staff_daily_reports', [
            'admin_id' => $admin->id,
            'report_date' => now()->subDay()->toDateString(),
        ]);
    }
}
