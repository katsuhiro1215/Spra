<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VirtualOfficeControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
    }

    public function test_admin_can_view_the_virtual_office_placeholder_page(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);

        $response = $this->actingAs($admin, 'admins')->get(route('admin.virtual-office.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('Admin/VirtualOffice/Index'));
    }

    public function test_guest_cannot_view_the_virtual_office_page(): void
    {
        $response = $this->get(route('admin.virtual-office.index'));

        $response->assertRedirect(route('admin.login'));
    }
}
