<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\Contracts\ServiceCategoryRepositoryInterface;
use App\Repositories\ServiceCategoryRepository;
use App\Repositories\Contracts\ServiceRepositoryInterface;
use App\Repositories\ServiceRepository;

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
  }

  /**
   * Bootstrap services.
   */
  public function boot(): void
  {
    //
  }
}
