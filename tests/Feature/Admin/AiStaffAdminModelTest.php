<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AiStaffAdminModelTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Admin保存時にbooted()フックがsyncRoles()を呼ぶため、対象ロールの
        // Spatie Roleレコードを先に用意しておく必要がある。
        $this->seed(\Database\Seeders\RolePermissionSeeder::class);
    }

    public function test_admin_can_be_created_with_ai_staff_role_and_department(): void
    {
        $admin = Admin::factory()->aiStaff('marketing')->create();

        $this->assertDatabaseHas('admins', [
            'id' => $admin->id,
            'role' => 'ai_staff',
            'department' => 'marketing',
        ]);
        $this->assertTrue($admin->fresh()->isAiStaff());
    }

    public function test_ai_staff_role_is_restrictable(): void
    {
        $this->assertContains('ai_staff', Admin::RESTRICTABLE_ROLES);
    }
}
