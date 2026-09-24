<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use App\Models\AiStaffDailyReport;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AiStaffDailyReportControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
    }

    public function test_admin_can_view_the_daily_report_list(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);
        $aiStaff = Admin::factory()->aiStaff('marketing')->create();
        AiStaffDailyReport::create([
            'admin_id' => $aiStaff->id,
            'report_date' => '2026-09-23',
            'body' => '[09:00] タスクA完了',
            'activity_count' => 1,
            'generated_at' => now(),
        ]);

        $response = $this->actingAs($admin, 'admins')->get(route('admin.ai-staff-daily-reports.index'));

        $response->assertInertia(fn ($page) => $page
            ->component('Admin/AiStaffDailyReports/Index')
            ->has('reports.data', 1)
            ->where('reports.data.0.report_date', '2026-09-23')
        );
    }

    public function test_admin_can_view_a_single_daily_report(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);
        $aiStaff = Admin::factory()->aiStaff('marketing')->create();
        $report = AiStaffDailyReport::create([
            'admin_id' => $aiStaff->id,
            'report_date' => '2026-09-23',
            'body' => '[09:00] タスクA完了',
            'activity_count' => 1,
            'generated_at' => now(),
        ]);

        $response = $this->actingAs($admin, 'admins')->get(route('admin.ai-staff-daily-reports.show', $report));

        $response->assertInertia(fn ($page) => $page
            ->component('Admin/AiStaffDailyReports/Show')
            ->where('report.id', $report->id)
        );
    }

    public function test_guest_cannot_view_the_daily_report_list(): void
    {
        $response = $this->get(route('admin.ai-staff-daily-reports.index'));

        $response->assertRedirect(route('admin.login'));
    }
}
