<?php

namespace App\Repositories\Contracts;

use App\Models\Faq;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;

interface FaqRepositoryInterface
{
    public function query(): Builder;
    public function findById(string $id): ?Faq;
    public function findByEmail(string $email): ?Faq;
    public function findWithFilters(array $filters): Builder;
    public function paginate(int $perPage = 20, array $filters = [], array $sort = []): LengthAwarePaginator;
    public function buildSearchQuery(Builder $query, string $search): Builder;
    public function buildRoleFilter(Builder $query, string $role): Builder;
    public function buildStatusFilter(Builder $query, string $status): Builder;
    public function applySorting(Builder $query, string $field, string $direction = 'desc'): Builder;
    public function create(array $data): Faq;
    public function update(Faq $faq, array $data): Faq;
    public function delete(Faq $faq): bool;
    public function getStats(): array;
}
