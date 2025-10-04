<?php

if (!function_exists('user_home_url')) {
    /**
     * Get the user home URL
     */
    function user_home_url(): string
    {
        return config('app.redirect_urls.user_home', '/dashboard');
    }
}

if (!function_exists('admin_home_url')) {
    /**
     * Get the admin home URL
     */
    function admin_home_url(): string
    {
        return config('app.redirect_urls.admin_home', '/admin/dashboard');
    }
}

if (!function_exists('redirect_to_user_home')) {
    /**
     * Redirect to user home with intended fallback
     */
    function redirect_to_user_home()
    {
        return redirect()->intended(user_home_url());
    }
}

if (!function_exists('redirect_to_admin_home')) {
    /**
     * Redirect to admin home with intended fallback
     */
    function redirect_to_admin_home()
    {
        return redirect()->intended(admin_home_url());
    }
}