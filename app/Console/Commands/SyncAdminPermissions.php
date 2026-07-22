<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Permission;

class SyncAdminPermissions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'admin:sync-permissions';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = '管理画面の全ルート（admin.permissionミドルウェア適用ルート）から権限カタログを自動生成する';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $whitelist = config('admin_permissions.whitelist', []);
        $actionLabels = config('admin_permissions.action_labels', []);

        $synced = 0;

        foreach (Route::getRoutes() as $route) {
            $name = $route->getName();

            if (! $name || ! in_array('admin.permission', $route->gatherMiddleware(), true)) {
                continue;
            }

            $permission = Str::startsWith($name, 'admin.') ? Str::after($name, 'admin.') : $name;

            if (in_array($permission, $whitelist, true)) {
                continue;
            }

            $segments = explode('.', $permission);
            $action = end($segments);
            $group = implode('.', array_slice($segments, 0, -1)) ?: $permission;

            Permission::updateOrCreate(
                ['name' => $permission, 'guard_name' => 'admins'],
                [
                    'group_label' => $group,
                    'action_label' => $actionLabels[$action] ?? $action,
                ]
            );

            $synced++;
        }

        $this->info("{$synced} 件の権限を同期しました。");

        return self::SUCCESS;
    }
}
