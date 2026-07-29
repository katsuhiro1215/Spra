<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use App\Models\Media;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

class MediaUpdateRequestTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    public function test_admin_can_update_media_metadata_without_guard_error(): void
    {
        $admin = Admin::factory()->create(['role' => 'owner', 'status' => 'active']);
        $media = Media::factory()->create();

        $this->actingAs($admin, 'admins')
            ->put(route('admin.media.update', $media), [
                'title' => '更新後タイトル',
            ])
            ->assertRedirect();

        $this->assertSame('更新後タイトル', $media->fresh()->title);
    }

    public function test_media_update_rejects_disallowed_mime_type(): void
    {
        $admin = Admin::factory()->create(['role' => 'owner', 'status' => 'active']);
        $media = Media::factory()->create();

        $this->actingAs($admin, 'admins')
            ->put(route('admin.media.update', $media), [
                'title' => 'タイトル',
                'file' => UploadedFile::fake()->create('malicious.php', 10, 'application/x-php'),
            ])
            ->assertSessionHasErrors('file');
    }
}
