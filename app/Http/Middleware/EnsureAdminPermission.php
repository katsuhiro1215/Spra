<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class EnsureAdminPermission
{
    /**
     * 自分自身のプロフィール（氏名・アバター等。役職や権限は含まない）を編集する
     * ルートは、ロール・権限に関わらず全管理者に許可する。
     */
    private const SELF_SERVICE_PROFILE_ROUTES = [
        'admin.admin.profile.edit',
        'admin.admin.profile.update',
        'admin.admin.profile.attachMedia',
        'admin.admin.profile.detachMedia',
    ];

    /**
     * 現在のルート名から権限スラッグを算出し、実効権限を持たない場合は403にする。
     * ルート名は "admin.xxx.yyy" 形式のため、先頭の "admin." を除いたものを権限名として扱う。
     */
    public function handle(Request $request, Closure $next): Response
    {
        $routeName = $request->route()?->getName();

        if (! $routeName) {
            return $next($request);
        }

        $permission = Str::startsWith($routeName, 'admin.')
            ? Str::after($routeName, 'admin.')
            : $routeName;

        if (in_array($permission, config('admin_permissions.whitelist', []), true)) {
            return $next($request);
        }

        $admin = $request->user('admins');

        if ($admin && $this->isOwnProfileRoute($routeName, $request, $admin)) {
            return $next($request);
        }

        abort_unless($admin && $admin->hasEffectivePermission($permission), 403, 'この操作を行う権限がありません。');

        return $next($request);
    }

    private function isOwnProfileRoute(string $routeName, Request $request, \App\Models\Admin $admin): bool
    {
        if (! in_array($routeName, self::SELF_SERVICE_PROFILE_ROUTES, true)) {
            return false;
        }

        $routeAdmin = $request->route('admin');
        $routeAdminId = $routeAdmin instanceof \App\Models\Admin ? $routeAdmin->id : $routeAdmin;

        return $routeAdminId === $admin->id;
    }
}
