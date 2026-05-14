<?php

namespace App\Repositories\Contracts;

use App\Models\FaqCategory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;

interface FaqCategoryRepositoryInterface
{
    public function query(): Builder;
    public function findById(string $id): ?FaqCategory;
    public function findWithFilters(array $filters): Builder;
    public function paginate(int $perPage = 20, array $filters = [], array $sort = []): LengthAwarePaginator;
    public function buildSearchQuery(Builder $query, string $search): Builder;
    public function buildStatusFilter(Builder $query, string $status): Builder;
    public function applySorting(Builder $query, string $field, string $direction = 'desc'): Builder;
    public function create(array $data): FaqCategory;
    public function update(FaqCategory $faqCategory, array $data): FaqCategory;
    public function delete(FaqCategory $faqCategory): bool;
    public function getStats(): array;
}
