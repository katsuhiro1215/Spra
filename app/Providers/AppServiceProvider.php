<?php

namespace App\Providers;

use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // 管理者エリアでのセッション設定変更
        if (request()->is('admin/*')) {
            config([
                'session.cookie' => config('session.admin_cookie'),
                'session.lifetime' => 60, // 管理者は60分でタイムアウト
            ]);
        }

        // Viteのパフォーマンス最適化
        Vite::prefetch(concurrency: 3);
        
        // 本番環境でのHTTPS強制
        if (app()->environment('production')) {
            URL::forceScheme('https');
        }
        
        // 全ビューで現在のユーザー情報を共有
        View::composer('*', function ($view) {
            $view->with([
                'currentUser' => auth()->user(),
                'isAdmin' => request()->is('admin/*'),
            ]);
        });
    }
}
