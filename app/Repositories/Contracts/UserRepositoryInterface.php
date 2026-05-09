<?php

namespace App\Repositories\Contracts;

use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

interface UserRepositoryInterface
{
  public function query(): Builder;

  public function findById(string $id): ?User;

  public function findByEmail(string $email): ?User;

  public function findWithFilters(array $filters): Builder;

  public function paginate(int $perPage = 20, array $filters = []): LengthAwarePaginator;

  public function create(array $data): User;

  public function update(User $user, array $data): User;

  public function delete(User $user): bool;
}
