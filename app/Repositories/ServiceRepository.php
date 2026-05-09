<?php

namespace App\Repositories;

use App\Models\Service;
use App\Repositories\Contracts\ServiceRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class ServiceRepository implements ServiceRepositoryInterface
{
  /**
   * Get base query with common eager loads.
   */
  public function query(): Builder
  {
    return Service::with(['serviceCategory', 'creator', 'updater']);
  }

  /**
   * Find service by ID with relations.
   */
  public function findById(string $id): ?Service
  {
    return $this->query()->find($id);
  }

  /**
   * Find service by slug.
   */
  public function findBySlug(string $slug): ?Service
  {
    return $this->query()->where('slug', $slug)->first();
  }

  /**
   * Find services with filters.
   */
  public function findWithFilters(array $filters): Collection
  {
    $query = $this->query();

    // Trashed filter
    $query = $this->applyTrashedFilter($query, $filters['trashed'] ?? 'without_trashed');

    if (!empty($filters['search'])) {
      $query = $this->buildSearchQuery($query, $filters['search']);
    }

    if (!empty($filters['status'])) {
      $query = $this->buildStatusFilter($query, $filters['status']);
    }

    if (!empty($filters['category'])) {
      $query = $this->buildCategoryFilter($query, $filters['category']);
    }

    if (isset($filters['is_featured']) && $filters['is_featured'] !== '') {
      $query = $this->buildFeaturedFilter($query, (bool)$filters['is_featured']);
    }

    return $query->ordered()->get();
  }

  /**
   * Get paginated services.
   */
  public function paginate(array $filters = [], array $sort = [], int $perPage = 15): LengthAwarePaginator
  {
    $query = $this->query();

    // Apply trashed filter
    $query = $this->applyTrashedFilter($query, $filters['trashed'] ?? 'without_trashed');

    // Apply filters
    if (!empty($filters['search'])) {
      $query = $this->buildSearchQuery($query, $filters['search']);
    }

    if (!empty($filters['status'])) {
      $query = $this->buildStatusFilter($query, $filters['status']);
    }

    if (!empty($filters['category'])) {
      $query = $this->buildCategoryFilter($query, $filters['category']);
    }

    if (isset($filters['is_featured']) && $filters['is_featured'] !== '') {
      $query = $this->buildFeaturedFilter($query, (bool)$filters['is_featured']);
    }

    // Apply sorting
    $sortField = $sort['field'] ?? 'sort_order';
    $sortDirection = $sort['direction'] ?? 'asc';
    $query = $this->applySorting($query, $sortField, $sortDirection);

    return $query->paginate($perPage);
  }

  /**
   * Get all services.
   */
  public function getAll(): Collection
  {
    return $this->query()->ordered()->get();
  }

  /**
   * Get active services.
   */
  public function getActive(): Collection
  {
    return $this->query()->active()->ordered()->get();
  }

  /**
   * Get featured services.
   */
  public function getFeatured(): Collection
  {
    return $this->query()->featured()->active()->ordered()->get();
  }

  /**
   * Get services by category.
   */
  public function getByCategory(string $categoryId): Collection
  {
    return $this->query()->byCategory($categoryId)->ordered()->get();
  }

  /**
   * Build search query.
   */
  public function buildSearchQuery(Builder $query, string $search): Builder
  {
    return $query->where(function ($q) use ($search) {
      $q->where('name', 'LIKE', "%{$search}%")
        ->orWhere('slug', 'LIKE', "%{$search}%")
        ->orWhere('description', 'LIKE', "%{$search}%")
        ->orWhereHas('serviceCategory', function ($q) use ($search) {
          $q->where('name', 'LIKE', "%{$search}%");
        });
    });
  }

  /**
   * Build status filter.
   */
  public function buildStatusFilter(Builder $query, string $status): Builder
  {
    return $query->where('status', $status);
  }

  /**
   * Build category filter.
   */
  public function buildCategoryFilter(Builder $query, string $categoryId): Builder
  {
    return $query->where('service_category_id', $categoryId);
  }

  /**
   * Build featured filter.
   */
  public function buildFeaturedFilter(Builder $query, bool $featured): Builder
  {
    return $query->where('is_featured', $featured);
  }

  /**
   * Apply trashed filter.
   */
  public function applyTrashedFilter(Builder $query, string $trashed): Builder
  {
    return match ($trashed) {
      'only_trashed' => $query->onlyTrashed(),
      'with_trashed' => $query->withTrashed(),
      default => $query, // 'without_trashed'
    };
  }

  /**
   * Apply sorting.
   */
  public function applySorting(Builder $query, string $field, string $direction): Builder
  {
    $allowedFields = ['name', 'sort_order', 'created_at', 'updated_at', 'status'];

    if (!in_array($field, $allowedFields)) {
      $field = 'sort_order';
    }

    $direction = strtolower($direction) === 'desc' ? 'desc' : 'asc';

    return $query->orderBy($field, $direction);
  }

  /**
   * Create new service.
   */
  public function create(array $data): Service
  {
    return Service::create($data);
  }

  /**
   * Update service.
   */
  public function update(Service $service, array $data): bool
  {
    return $service->update($data);
  }

  /**
   * Delete service.
   */
  public function delete(Service $service): bool
  {
    return $service->delete();
  }

  /**
   * Restore soft deleted service.
   */
  public function restore(Service $service): bool
  {
    return $service->restore();
  }

  /**
   * Force delete service.
   */
  public function forceDelete(Service $service): bool
  {
    return $service->forceDelete();
  }

  /**
   * Check if slug exists (excluding given service).
   */
  public function slugExists(string $slug, ?string $excludeId = null): bool
  {
    $query = Service::where('slug', $slug);

    if ($excludeId) {
      $query->where('id', '!=', $excludeId);
    }

    return $query->exists();
  }
}
