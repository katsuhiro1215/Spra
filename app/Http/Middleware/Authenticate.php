<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

class Authenticate extends Middleware
{
    protected $user_route = 'user.login';
    protected $admin_route = 'admin.login';
    protected $atlas_route = 'atlas.login';
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     */
    protected function redirectTo(Request $request): ?string
    {
        if (! $request->expectsJson()) {
            if (Route::is('admin.*')) {
                return route($this->admin_route);
            } elseif (Route::is('atlas.*')) {
                return route($this->atlas_route);
            } else {
                return route($this->user_route);
            }
        }
        return null;
    }
}
