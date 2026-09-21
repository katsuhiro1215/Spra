<?php

namespace Tests\Feature\Admin;

use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class AiStaffRolePermissionSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_ai_staff_role_gets_only_configured_view_actions(): void
    {
        $this->seed(RolePermissionSeeder::class);

        $role = Role::where('name', 'ai_staff')->where('guard_name', 'admins')->firstOrFail();
        $permissionNames = $role->permissions->pluck('name');

        $this->assertTrue($permissionNames->isNotEmpty());
        $permissionNames->each(function (string $name) {
            $action = Str::afterLast($name, '.');
            $this->assertContains($action, ['index', 'show']);
        });
    }

    public function test_ai_staff_role_does_not_receive_destroy_permission(): void
    {
        $this->seed(RolePermissionSeeder::class);

        $role = Role::where('name', 'ai_staff')->where('guard_name', 'admins')->firstOrFail();
        $hasDestroy = $role->permissions->contains(
            fn($permission) => str_ends_with($permission->name, '.destroy')
        );

        $this->assertFalse($hasDestroy);
    }
}
