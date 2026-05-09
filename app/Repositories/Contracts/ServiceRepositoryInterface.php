<?php

namespace App\Repositories\Contracts;

use App\Models\Service;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface ServiceRepositoryInterface
{
    /**
     * Get base query with common eager loads.
     */
    public function query(): Builder;

    /**
     * Find service by ID with relations.
     */
    public function findById(string $id): ?Service;

    /**
     * Find service by slug.
     */
    public function findBySlug(string $slug): ?Service;

    /**
     * Find services with filters.
     */
    public function findWithFilters(array $filters): Collection;

    /**
     * Get paginated services.
     */
    public function paginate(array $filters = [], array $sort = [], int $perPage = 15): LengthAwarePaginator;

    /**
     * Get all services.
     */
    public function getAll(): Collection;

    /**
     * Get active services.
     */
    public function getActive(): Collection;

    /**
     * Get featured services.
     */
    public function getFeatured(): Collection;

    /**
     * Get services by category.
     */
    public function getByCategory(string $categoryId): Collection;

    /**
     * Build search query.
     */
    public function buildSearchQuery(Builder $query, string $search): Builder;

    /**
     * Build status filter.
     */
    public function buildStatusFilter(Builder $query, string $status): Builder;

    /**
     * Build category filter.
     */
    public function buildCategoryFilter(Builder $query, string $categoryId): Builder;

    /**
     * Build featured filter.
     */
    public function buildFeaturedFilter(Builder $query, bool $featured): Builder;

    /**
     * Apply sorting.
     */
    public function applySorting(Builder $query, string $field, string $direction): Builder;

    /**
     * Create new service.
     */
    public function create(array $data): Service;

    /**
     * Update service.
     */
    public function update(Service $service, array $data): bool;

    /**
     * Delete service.
     */
    public function delete(Service $service): bool;

    /**
     * Restore soft deleted service.
     */
    public function restore(Service $service): bool;

    /**
     * Force delete service.
     */
    public function forceDelete(Service $service): bool;

    /**
     * Check if slug exists (excluding given service).
     */
    public function slugExists(string $slug, ?string $excludeId = null): bool;
}
