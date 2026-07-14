<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\Contracts\ServiceCategoryRepositoryInterface;
use App\Repositories\ServiceCategoryRepository;
use App\Repositories\Contracts\ServiceRepositoryInterface;
use App\Repositories\ServiceRepository;
use App\Repositories\Contracts\TechnologyRepositoryInterface;
use App\Repositories\TechnologyRepository;
use App\Repositories\Contracts\PortfolioRepositoryInterface;
use App\Repositories\PortfolioRepository;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        // ServiceCategory Repository Binding
        $this->app->bind(
            ServiceCategoryRepositoryInterface::class,
            ServiceCategoryRepository::class
        );

        // Service Repository Binding
        $this->app->bind(
            ServiceRepositoryInterface::class,
            ServiceRepository::class
        );

        // Technology Repository Binding
        $this->app->bind(
            TechnologyRepositoryInterface::class,
            TechnologyRepository::class
        );

        // Portfolio Repository Binding
        $this->app->bind(
            PortfolioRepositoryInterface::class,
            PortfolioRepository::class
        );
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
