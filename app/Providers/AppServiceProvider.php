<?php

namespace App\Providers;

use App\Repositories\AdminRepository;
use App\Repositories\CompanyRepository;
use App\Repositories\ContactRepository;
use App\Repositories\ContractRepository;
use App\Repositories\InvoiceRepository;
use App\Repositories\PaymentRepository;
use App\Repositories\ProjectRepository;
use App\Repositories\QuoteRepository;
use App\Repositories\ResponseRepository;
use App\Repositories\ResponseTemplateRepository;
use App\Repositories\UserRepository;
use App\Repositories\ServiceCategoryRepository;
use App\Repositories\ServiceRepository;
use App\Repositories\ServicePlanRepository;
use App\Repositories\ServiceItemRepository;
use App\Repositories\Contracts\AdminRepositoryInterface;
use App\Repositories\Contracts\CompanyRepositoryInterface;
use App\Repositories\Contracts\ContactRepositoryInterface;
use App\Repositories\Contracts\ContractRepositoryInterface;
use App\Repositories\Contracts\InvoiceRepositoryInterface;
use App\Repositories\Contracts\PaymentRepositoryInterface;
use App\Repositories\Contracts\ProjectRepositoryInterface;
use App\Repositories\Contracts\QuoteRepositoryInterface;
use App\Repositories\Contracts\ResponseRepositoryInterface;
use App\Repositories\Contracts\ResponseTemplateRepositoryInterface;
use App\Repositories\Contracts\UserRepositoryInterface;
use App\Repositories\Contracts\ServiceCategoryRepositoryInterface;
use App\Repositories\Contracts\ServiceRepositoryInterface;
use App\Repositories\Contracts\ServicePlanRepositoryInterface;
use App\Repositories\Contracts\ServiceItemRepositoryInterface;
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
        $this->app->bind(AdminRepositoryInterface::class, AdminRepository::class);
        $this->app->bind(UserRepositoryInterface::class, UserRepository::class);
        $this->app->bind(CompanyRepositoryInterface::class, CompanyRepository::class);
        $this->app->bind(ContactRepositoryInterface::class, ContactRepository::class);
        $this->app->bind(QuoteRepositoryInterface::class, QuoteRepository::class);
        $this->app->bind(ResponseRepositoryInterface::class, ResponseRepository::class);
        $this->app->bind(ResponseTemplateRepositoryInterface::class, ResponseTemplateRepository::class);
        $this->app->bind(ProjectRepositoryInterface::class, ProjectRepository::class);
        $this->app->bind(ContractRepositoryInterface::class, ContractRepository::class);
        $this->app->bind(InvoiceRepositoryInterface::class, InvoiceRepository::class);
        $this->app->bind(PaymentRepositoryInterface::class, PaymentRepository::class);
        $this->app->bind(ServiceCategoryRepositoryInterface::class, ServiceCategoryRepository::class);
        $this->app->bind(ServiceRepositoryInterface::class, ServiceRepository::class);
        $this->app->bind(ServicePlanRepositoryInterface::class, ServicePlanRepository::class);
        $this->app->bind(ServiceItemRepositoryInterface::class, ServiceItemRepository::class);
        $this->app->singleton(\App\Repositories\QuoteResponseRepository::class);
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
