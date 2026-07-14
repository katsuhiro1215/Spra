<?php

namespace App\Services;

use App\Models\Admin;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

/**
 * Role/Permission (spatie/laravel-permission) 周りの権限管理画面向けロジック。
 * ページネーション付きCRUDエンティティを前提とするBaseServiceには馴染まないため独立クラスとする。
 */
class PermissionService
{
    /**
     * 権限マトリクス編集画面用のデータ一式を取得
     */
    public function getRoleMatrix(): array
    {
        $permissions = Permission::where('guard_name', 'admins')
            ->orderBy('group_label')
            ->orderBy('action_label')
            ->get();

        $permissionGroups = $permissions
            ->groupBy('group_label')
            ->map(function ($group, $groupLabel) {
                return [
                    'group' => $groupLabel,
                    'permissions' => $group->map(fn(Permission $p) => [
                        'id' => $p->id,
                        'name' => $p->name,
                        'actionLabel' => $p->action_label,
                    ])->values(),
                ];
            })
            ->values();

        $allIds = $permissions->pluck('id')->all();

        $roles = collect(Admin::ROLES)->mapWithKeys(function (string $label, string $role) use ($allIds) {
            $editable = in_array($role, Admin::RESTRICTABLE_ROLES, true);

            if (! $editable) {
                return [$role => ['label' => $label, 'editable' => false, 'permissionIds' => $allIds]];
            }

            $roleModel = Role::where('name', $role)->where('guard_name', 'admins')->first();

            return [$role => [
                'label' => $label,
                'editable' => true,
                'permissionIds' => $roleModel?->permissions()->pluck('id')->all() ?? [],
            ]];
        });

        return [
            'permissionGroups' => $permissionGroups,
            'roles' => $roles,
        ];
    }

    /**
     * admin/editorロールのデフォルト権限セットを更新する
     *
     * @param array<string, array<int, int>> $rolePermissionIds 例: ['admin' => [1,2], 'editor' => [1]]
     */
    public function updateRoleMatrix(array $rolePermissionIds): void
    {
        DB::transaction(function () use ($rolePermissionIds) {
            foreach (Admin::RESTRICTABLE_ROLES as $role) {
                $roleModel = Role::firstOrCreate(['name' => $role, 'guard_name' => 'admins']);
                $roleModel->syncPermissions($rolePermissionIds[$role] ?? []);
            }
        });
    }

    /**
     * 個別Adminの権限制限編集画面用のデータ一式を取得
     */
    public function getOverridesFor(Admin $admin): array
    {
        $grantedPermissions = $admin->getAllPermissions();

        $restrictedIds = $admin->restrictedPermissions()->pluck('permissions.id')->all();

        $permissionGroups = $grantedPermissions
            ->groupBy('group_label')
            ->map(function ($group, $groupLabel) {
                return [
                    'group' => $groupLabel,
                    'permissions' => $group->map(fn(Permission $p) => [
                        'id' => $p->id,
                        'name' => $p->name,
                        'actionLabel' => $p->action_label,
                    ])->values(),
                ];
            })
            ->values();

        return [
            'permissionGroups' => $permissionGroups,
            'restrictedPermissionIds' => $restrictedIds,
        ];
    }

    /**
     * 個別Adminへの権限制限を更新する。ロールが本来許可していない権限は無視する。
     *
     * @param array<int, int> $restrictedPermissionIds
     */
    public function updateOverridesFor(Admin $admin, array $restrictedPermissionIds): void
    {
        $grantedIds = $admin->getAllPermissions()->pluck('id')->all();
        $validIds = array_values(array_intersect($restrictedPermissionIds, $grantedIds));

        $admin->restrictedPermissions()->sync($validIds);
    }
}
