<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        using: function () {
            // User routes with user. prefix
            Route::as('user.')
                ->middleware('web')
                ->group(base_path('routes/web.php'));

            // Admin routes with admin. prefix
            Route::prefix('admin')
                ->as('admin.')
                ->middleware('web')
                ->group(base_path('routes/admin.php'));
                
            // 互換性のため、loginとregisterルートのグローバルエイリアスを作成
            Route::middleware('web')->group(function () {
                Route::get('login', function() {
                    return redirect()->route('user.login');
                })->name('login');
                
                Route::get('register', function() {
                    return redirect()->route('user.register');
                })->name('register');
            });
        },
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // 全ての例外をログに記録
        $exceptions->report(function (Throwable $e) {
            Log::error('Exception occurred: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
        });

        // 認証例外の処理
        $exceptions->render(function (\Illuminate\Auth\AuthenticationException $e, $request) {
            Log::info('Authentication exception: ' . $e->getMessage(), [
                'request_path' => $request->path(),
                'request_url' => $request->url(),
                'is_admin' => $request->is('admin/*')
            ]);

            // 管理画面の場合
            if ($request->is('admin/*')) {
                if ($request->expectsJson() || $request->header('X-Inertia')) {
                    return \Inertia\Inertia::location(route('admin.login'));
                }
                return redirect()->route('admin.login');
            }

            // 一般ユーザーの場合
            if ($request->expectsJson() || $request->header('X-Inertia')) {
                return \Inertia\Inertia::location(route('user.login'));
            }
            return redirect()->route('user.login');
        });

        // ルート例外の処理
        $exceptions->render(function (\Symfony\Component\Routing\Exception\RouteNotFoundException $e, $request) {
            Log::error('Route not found: ' . $e->getMessage(), [
                'request_path' => $request->path(),
                'request_url' => $request->url(),
                'user_agent' => $request->userAgent()
            ]);

            // 管理画面の場合
            if ($request->is('admin/*')) {
                return redirect()->route('admin.login')->with('error', 'セッションが切れました。再度ログインしてください。');
            }

            // 一般ユーザーの場合
            return redirect()->route('user.login')->with('error', 'セッションが切れました。再度ログインしてください。');
        });

        // 一般的な例外の処理
        $exceptions->render(function (Throwable $e, $request) {
            // 開発環境では詳細なエラーを表示
            if (app()->environment('local', 'testing')) {
                return null; // デフォルトの例外処理を使用
            }

            Log::error('General exception: ' . $e->getMessage(), [
                'request_path' => $request->path(),
                'request_url' => $request->url(),
                'exception_class' => get_class($e)
            ]);

            // 本番環境では一般的なエラーページを表示
            return response()->view('errors.500', [], 500);
        });
    })->create();
