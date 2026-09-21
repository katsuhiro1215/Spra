<?php

namespace Database\Seeders;

use App\Models\Admin;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    /**
     * ロール・権限の初期データを投入する
     */
    public function run(): void
    {
        // ルート定義から権限カタログを生成
        Artisan::call('admin:sync-permissions');

        $allPermissionNames = Permission::where('guard_name', 'admins')->pluck('name');

        foreach (Admin::ROLES as $role => $label) {
            Role::firstOrCreate(['name' => $role, 'guard_name' => 'admins']);
        }

        // owner / super_admin は常に全権限バイパスだが、UI表示の一貫性のため全権限を割り当てておく
        $bypassRoles = array_diff(array_keys(Admin::ROLES), Admin::RESTRICTABLE_ROLES);
        foreach ($bypassRoles as $role) {
            Role::where('name', $role)->where('guard_name', 'admins')->first()
                ?->syncPermissions($allPermissionNames);
        }

        $excludedActions = config('admin_permissions.admin_role_excluded_actions', []);
        $adminPermissions = $allPermissionNames->reject(function (string $name) use ($excludedActions) {
            $action = Str::afterLast($name, '.');

            return in_array($action, $excludedActions, true);
        });
        Role::where('name', 'admin')->where('guard_name', 'admins')->first()
            ?->syncPermissions($adminPermissions);

        $editorActions = config('admin_permissions.editor_role_allowed_actions', []);
        $editorPermissions = $allPermissionNames->filter(function (string $name) use ($editorActions) {
            $action = Str::afterLast($name, '.');

            return in_array($action, $editorActions, true);
        });
        Role::where('name', 'editor')->where('guard_name', 'admins')->first()
            ?->syncPermissions($editorPermissions);

        $aiStaffActions = config('admin_permissions.ai_staff_role_allowed_actions', []);
        $aiStaffPermissions = $allPermissionNames->filter(function (string $name) use ($aiStaffActions) {
            $action = Str::afterLast($name, '.');

            return in_array($action, $aiStaffActions, true);
        });
        Role::where('name', 'ai_staff')->where('guard_name', 'admins')->first()
            ?->syncPermissions($aiStaffPermissions);
    }
}
