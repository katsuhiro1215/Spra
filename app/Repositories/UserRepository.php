<?php

namespace App\Repositories;

use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class UserRepository implements UserRepositoryInterface
{
  public function query(): Builder
  {
    return User::query();
  }

  public function findById(string $id): ?User
  {
    return User::find($id);
  }

  public function findByEmail(string $email): ?User
  {
    return User::where('email', $email)->first();
  }

  public function findWithFilters(array $filters): Builder
  {
    $query = User::query();

    if (!empty($filters['search'])) {
      $search = $filters['search'];
      $query->where(function ($q) use ($search) {
        $q->where('email', 'like', "%{$search}%")
          ->orWhereHas('profile', function ($pq) use ($search) {
            $pq->where('last_name', 'like', "%{$search}%")
              ->orWhere('first_name', 'like', "%{$search}%");
          });
      });
    }

    if (isset($filters['status'])) {
      $query->where('status', $filters['status']);
    }

    return $query;
  }

  public function paginate(int $perPage = 20, array $filters = []): LengthAwarePaginator
  {
    return $this->findWithFilters($filters)->latest()->paginate($perPage);
  }

  public function create(array $data): User
  {
    return User::create($data);
  }

  public function update(User $user, array $data): User
  {
    $user->update($data);
    return $user->fresh();
  }

  public function delete(User $user): bool
  {
    return $user->delete();
  }
}
