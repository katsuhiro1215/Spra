<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use App\Models\AiStaffActivityLog;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class QuoteControllerActivityLogTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);

        // ai_staffロールは現状view専用(index/show)に権限制限されているため(config/admin_permissions.php)、
        // この専用ミドルウェアだけテストスコープでバイパスする。本番の権限設定・ロール定義は変更しない。
        // AI社員への書き込み権限付与自体は別途未決定事項(design memo §1.4参照)。
        $this->withoutMiddleware(\App\Http\Middleware\EnsureAdminPermission::class);
    }

    public function test_ai_staff_creating_a_quote_logs_the_activity(): void
    {
        $aiStaff = Admin::factory()->aiStaff('sales')->create(['status' => 'active']);
        $user = \App\Models\User::factory()->create();

        $this->actingAs($aiStaff, 'admins')
            ->post(route('admin.quote.store'), [
                'user_id' => $user->id,
                'title' => 'コーポレートサイト制作',
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('ai_staff_activity_logs', [
            'admin_id' => $aiStaff->id,
            'action' => AiStaffActivityLog::ACTION_QUOTE_CREATED,
        ]);
    }

    public function test_human_admin_creating_a_quote_does_not_log_activity(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);
        $user = \App\Models\User::factory()->create();

        $this->actingAs($admin, 'admins')
            ->post(route('admin.quote.store'), [
                'user_id' => $user->id,
                'title' => 'コーポレートサイト制作',
            ])
            ->assertRedirect();

        $this->assertDatabaseCount('ai_staff_activity_logs', 0);
    }
}
