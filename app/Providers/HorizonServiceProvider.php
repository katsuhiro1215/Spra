<?php

namespace App\Providers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Laravel\Horizon\Horizon;
use Laravel\Horizon\HorizonApplicationServiceProvider;

class HorizonServiceProvider extends HorizonApplicationServiceProvider
{
    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        parent::boot();

        // parent::boot()が設定するデフォルトの認可(local環境は無条件で許可)を上書きする。
        // このアプリは管理者にオーナー/編集者/閲覧者などロールがあり、
        // ローカル環境でも役割に応じたアクセス制御を維持したいため、
        // 環境を問わず viewHorizon ゲートのみで判定する。
        Horizon::auth(function ($request) {
            return Gate::check('viewHorizon', [$request->user()]);
        });

        // Horizon::routeSmsNotificationsTo('15556667777');
        // Horizon::routeMailNotificationsTo('example@example.com');
        // Horizon::routeSlackNotificationsTo('slack-webhook-url', '#channel');
    }

    /**
     * Register the Horizon gate.
     *
     * This gate determines who can access Horizon in non-local environments.
     */
    protected function gate(): void
    {
        // 管理画面は 'admins' ガードを使用しているため、デフォルトガードではなく
        // 明示的に 'admins' ガードのログインユーザーで判定する。
        // 権限系統(owner/super_admin)のみ閲覧可能とし、それ以外(admin/editor/viewer)は不可。
        Gate::define('viewHorizon', function () {
            $admin = Auth::guard('admins')->user();

            return $admin?->isSuperAdmin() ?? false;
        });
    }
}
