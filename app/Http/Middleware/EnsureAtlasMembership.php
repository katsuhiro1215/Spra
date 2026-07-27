<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureAtlasMembership
{
    /**
     * Private Roomへのアクセスには、ログインに加えて有効なAtlas会員資格が必要
     */
    public function handle(Request $request, Closure $next): Response
    {
        $membership = $request->user('users')?->atlasMembership;

        if (!$membership || !$membership->isActive()) {
            return redirect()->route('atlas.membership-required');
        }

        return $next($request);
    }
}
