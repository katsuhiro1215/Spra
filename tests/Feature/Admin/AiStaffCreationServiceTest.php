<?php

namespace Tests\Feature\Admin;

use App\Services\AdminService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class AiStaffCreationServiceTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\RolePermissionSeeder::class);
    }

    public function test_create_ai_staff_generates_department_based_email_and_role(): void
    {
        Mail::fake();

        $result = app(AdminService::class)->createAiStaff('marketing');

        $this->assertSame('ai-marketing@smartsprouts.jp', $result['admin']->email);
        $this->assertSame('ai_staff', $result['admin']->role);
        $this->assertSame('marketing', $result['admin']->department);
        $this->assertNotEmpty($result['password']);
        $this->assertDatabaseHas('admins', [
            'email' => 'ai-marketing@smartsprouts.jp',
            'role' => 'ai_staff',
            'department' => 'marketing',
        ]);
    }
}
