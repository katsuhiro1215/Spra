<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use App\Models\Quote;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class PermissionEnforcementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
    }

    public function test_editor_can_view_but_not_create_or_delete_quotes(): void
    {
        $editor = Admin::factory()->create(['role' => 'editor', 'status' => 'active']);

        $this->actingAs($editor, 'admins')
            ->get(route('admin.quote.index'))
            ->assertOk();

        $this->actingAs($editor, 'admins')
            ->get(route('admin.quote.create'))
            ->assertForbidden();

        $this->actingAs($editor, 'admins')
            ->post(route('admin.quote.store'), [])
            ->assertForbidden();
    }

    public function test_admin_can_update_but_not_delete_quotes(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);
        $quote = Quote::create([
            'quote_number' => 'Q-TEST-0001',
            'title' => 'テスト見積',
            'created_by' => $admin->id,
        ]);

        $this->actingAs($admin, 'admins')
            ->get(route('admin.quote.index'))
            ->assertOk();

        $this->actingAs($admin, 'admins')
            ->get(route('admin.quote.edit', $quote))
            ->assertOk();

        // 実在するQuoteに対してもadminロールはdestroy権限を持たないため403になる
        $this->actingAs($admin, 'admins')
            ->delete(route('admin.quote.destroy', $quote))
            ->assertForbidden();
    }

    public function test_owner_and_super_admin_bypass_all_permission_checks(): void
    {
        foreach (['owner', 'super_admin'] as $role) {
            $admin = Admin::factory()->create(['role' => $role, 'status' => 'active']);

            $this->actingAs($admin, 'admins')
                ->get(route('admin.quote.index'))
                ->assertOk();

            $this->actingAs($admin, 'admins')
                ->get(route('admin.quote.create'))
                ->assertOk();
        }
    }

    public function test_individual_restriction_overrides_role_grant_for_admin_role(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);

        // adminロールは本来 quote.create を許可されている
        $this->actingAs($admin, 'admins')
            ->get(route('admin.quote.create'))
            ->assertOk();

        $permission = Permission::where('name', 'quote.create')->where('guard_name', 'admins')->firstOrFail();
        $admin->restrictedPermissions()->attach($permission->id);

        $this->actingAs($admin->fresh(), 'admins')
            ->get(route('admin.quote.create'))
            ->assertForbidden();

        $admin->restrictedPermissions()->detach($permission->id);

        $this->actingAs($admin->fresh(), 'admins')
            ->get(route('admin.quote.create'))
            ->assertOk();
    }

    public function test_only_owner_or_super_admin_can_access_permission_management_screen(): void
    {
        $admin = Admin::factory()->create(['role' => 'admin', 'status' => 'active']);

        $this->actingAs($admin, 'admins')
            ->get(route('admin.permissions.index'))
            ->assertForbidden();

        $owner = Admin::factory()->create(['role' => 'owner', 'status' => 'active']);

        $this->actingAs($owner, 'admins')
            ->get(route('admin.permissions.index'))
            ->assertOk();
    }
}
