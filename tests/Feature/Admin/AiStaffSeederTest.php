<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use Database\Seeders\AiStaffSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class AiStaffSeederTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // AiStaffSeederが作成する各AdminのsyncRoles()呼び出しが解決できるよう、
        // 先にSpatieのRoleレコードを用意しておく。
        $this->seed(\Database\Seeders\RolePermissionSeeder::class);
    }

    public function test_seeder_creates_ten_ai_staff_with_expected_departments(): void
    {
        Mail::fake();

        $this->seed(AiStaffSeeder::class);

        $aiStaff = Admin::where('role', 'ai_staff')->get();

        $this->assertCount(10, $aiStaff);
        $this->assertEqualsCanonicalizing(
            AiStaffSeeder::DEPARTMENTS,
            $aiStaff->pluck('department')->all()
        );
    }

    public function test_seeder_is_idempotent_when_run_twice(): void
    {
        Mail::fake();

        $this->seed(AiStaffSeeder::class);
        $this->seed(AiStaffSeeder::class);

        $this->assertSame(10, Admin::where('role', 'ai_staff')->count());
    }
}
