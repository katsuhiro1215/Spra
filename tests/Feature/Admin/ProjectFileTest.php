<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use App\Models\Project;
use App\Models\ProjectFile;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProjectFileTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    public function test_admin_can_upload_file_to_project(): void
    {
        Storage::fake('private');

        $admin = Admin::factory()->create(['role' => 'owner', 'status' => 'active']);
        $project = Project::factory()->create();

        $this->actingAs($admin, 'admins')
            ->post(route('admin.project.files.store', $project), [
                'file' => UploadedFile::fake()->create('spec.pdf', 100, 'application/pdf'),
                'description' => '仕様書',
                'is_client_visible' => true,
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('project_files', [
            'project_id' => $project->id,
            'original_filename' => 'spec.pdf',
            'description' => '仕様書',
            'is_client_visible' => true,
        ]);

        $file = ProjectFile::where('project_id', $project->id)->firstOrFail();
        Storage::disk('private')->assertExists($file->path);
    }

    public function test_project_file_upload_rejects_disallowed_mime_type(): void
    {
        Storage::fake('private');

        $admin = Admin::factory()->create(['role' => 'owner', 'status' => 'active']);
        $project = Project::factory()->create();

        $this->actingAs($admin, 'admins')
            ->post(route('admin.project.files.store', $project), [
                'file' => UploadedFile::fake()->create('malicious.php', 10, 'application/x-php'),
            ])
            ->assertSessionHasErrors('file');
    }

    public function test_admin_can_delete_project_file_and_underlying_file_is_removed(): void
    {
        Storage::fake('private');

        $admin = Admin::factory()->create(['role' => 'owner', 'status' => 'active']);
        $project = Project::factory()->create();

        $path = Storage::disk('private')->putFile("projects/{$project->id}/files", UploadedFile::fake()->create('doc.pdf', 50));
        $file = ProjectFile::create([
            'project_id' => $project->id,
            'uploaded_by' => $admin->id,
            'disk' => 'private',
            'path' => $path,
            'original_filename' => 'doc.pdf',
            'mime_type' => 'application/pdf',
            'file_size' => 50 * 1024,
        ]);

        $this->actingAs($admin, 'admins')
            ->delete(route('admin.project.files.destroy', [$project, $file]))
            ->assertRedirect();

        $this->assertDatabaseMissing('project_files', ['id' => $file->id]);
        Storage::disk('private')->assertMissing($path);
    }

    public function test_project_file_belonging_to_another_project_returns_404(): void
    {
        $admin = Admin::factory()->create(['role' => 'owner', 'status' => 'active']);
        $projectA = Project::factory()->create();
        $projectB = Project::factory()->create();

        $file = ProjectFile::create([
            'project_id' => $projectA->id,
            'disk' => 'private',
            'path' => 'projects/dummy/doc.pdf',
            'original_filename' => 'doc.pdf',
            'file_size' => 100,
        ]);

        $this->actingAs($admin, 'admins')
            ->delete(route('admin.project.files.destroy', [$projectB, $file]))
            ->assertNotFound();
    }
}
