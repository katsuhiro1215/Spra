<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskCategoryControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
    }

    public function test_super_admin_can_create_task_category(): void
    {
        $admin = Admin::factory()->create(['role' => 'super_admin', 'status' => 'active']);

        $this->actingAs($admin, 'admins')
            ->post(route('admin.task-category.store'), [
                'name' => 'SNS投稿',
                'color' => '#4F46E5',
            ])
            ->assertRedirect(route('admin.task-category.index'));

        $this->assertDatabaseHas('task_categories', ['name' => 'SNS投稿']);
    }
}
