<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RedirectIfAuthenticated
{
    private const GUARD_USER = 'users';
    private const GUARD_ADMIN = 'admins';
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$guards): Response
    {
        $guards = empty($guards) ? [null] : $guards;

        foreach ($guards as $guard) {
            if (Auth::guard($guard)->check()) {
                if ($guard === self::GUARD_ADMIN) {
                    return redirect(admin_home_url());
                } elseif ($guard === self::GUARD_USER) {
                    return redirect(user_home_url());
                } else {
                    // Default case for null guard (users)
                    return redirect(user_home_url());
                }
            }
        }

        return $next($request);
    }
}
