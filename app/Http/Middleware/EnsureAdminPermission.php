<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class EnsureAdminPermission
{
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

        abort_unless($admin && $admin->hasEffectivePermission($permission), 403, 'この操作を行う権限がありません。');

        return $next($request);
    }
}
