<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use App\Models\Task;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminDashboardTaskWidgetTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    public function test_dashboard_shows_only_logged_in_admins_today_tasks(): void
    {
        $admin = Admin::factory()->create(['status' => 'active']);
        $otherAdmin = Admin::factory()->create(['status' => 'active']);

        $mine = Task::factory()->for($admin, 'creator')->create([
            'admin_id' => $admin->id,
            'due_date' => today(),
            'title' => 'X投稿',
        ]);
        Task::factory()->create(['admin_id' => $otherAdmin->id, 'due_date' => today()]);

        $response = $this->actingAs($admin, 'admins')->get(route('admin.dashboard'));

        $response->assertInertia(fn ($page) => $page
            ->has('todayTasks', 1)
            ->where('todayTasks.0.id', $mine->id));
    }
}
