<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use App\Models\Project;
use App\Models\ProjectUpdate;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProjectUpdateTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    public function test_admin_can_create_project_update(): void
    {
        $admin = Admin::factory()->create(['role' => 'owner', 'status' => 'active']);
        $project = Project::factory()->create();

        $this->actingAs($admin, 'admins')
            ->post(route('admin.project.updates.store', $project), [
                'title' => '進捗報告',
                'content' => '要件定義が完了しました。',
                'type' => 'progress',
                'is_client_visible' => true,
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('project_updates', [
            'project_id' => $project->id,
            'admin_id' => $admin->id,
            'title' => '進捗報告',
            'type' => 'progress',
            'is_client_visible' => true,
        ]);
    }

    public function test_project_update_requires_title_content_and_type(): void
    {
        $admin = Admin::factory()->create(['role' => 'owner', 'status' => 'active']);
        $project = Project::factory()->create();

        $this->actingAs($admin, 'admins')
            ->post(route('admin.project.updates.store', $project), [])
            ->assertSessionHasErrors(['title', 'content', 'type']);
    }

    public function test_admin_can_update_and_delete_project_update(): void
    {
        $admin = Admin::factory()->create(['role' => 'owner', 'status' => 'active']);
        $project = Project::factory()->create();
        $update = ProjectUpdate::create([
            'project_id' => $project->id,
            'admin_id' => $admin->id,
            'title' => '旧タイトル',
            'content' => '内容',
            'type' => 'general',
            'is_client_visible' => false,
        ]);

        $this->actingAs($admin, 'admins')
            ->put(route('admin.project.updates.update', ['project' => $project, 'update' => $update]), [
                'title' => '新タイトル',
                'content' => '内容',
                'type' => 'general',
                'is_client_visible' => true,
            ])
            ->assertRedirect();

        $this->assertSame('新タイトル', $update->fresh()->title);

        $this->actingAs($admin, 'admins')
            ->delete(route('admin.project.updates.destroy', ['project' => $project, 'update' => $update]))
            ->assertRedirect();

        $this->assertDatabaseMissing('project_updates', ['id' => $update->id]);
    }

    public function test_project_show_page_exposes_update_author(): void
    {
        $admin = Admin::factory()->create(['role' => 'owner', 'status' => 'active']);
        $project = Project::factory()->create();
        ProjectUpdate::create([
            'project_id' => $project->id,
            'admin_id' => $admin->id,
            'title' => '進捗報告',
            'content' => '内容',
            'type' => 'general',
        ]);

        $response = $this->actingAs($admin, 'admins')
            ->get(route('admin.project.show', $project));

        $response->assertInertia(fn($page) => $page
            ->where('project.updates.0.admin.id', $admin->id));
    }
}
