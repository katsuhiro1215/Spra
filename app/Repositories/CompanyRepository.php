<?php

namespace App\Repositories;

use App\Models\Company;
use App\Repositories\Contracts\CompanyRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class CompanyRepository implements CompanyRepositoryInterface
{
  public function query(): Builder
  {
    return Company::query();
  }

  public function all(array $filters = []): Collection
  {
    return $this->findWithFilters($filters)->get();
  }

  public function findById(string $id, array $with = []): ?Company
  {
    return Company::with($with)->find($id);
  }

  public function findWithFilters(array $filters): Builder
  {
    $query = Company::query();

    if (!empty($filters['search'])) {
      $query->search($filters['search']);
    }

    if (!empty($filters['company_type'])) {
      $query->byType($filters['company_type']);
    }

    if (!empty($filters['status'])) {
      $query->where('status', $filters['status']);
    }

    return $query;
  }

  public function paginate(
    int $perPage = 15,
    array $filters = [],
    string $sortField = 'created_at',
    string $sortDirection = 'desc'
  ): LengthAwarePaginator {
    return $this->findWithFilters($filters)
      ->with(['addresses', 'users'])
      ->orderBy($sortField, $sortDirection)
      ->paginate($perPage)
      ->withQueryString();
  }

  public function create(array $data): Company
  {
    return Company::create($data);
  }

  public function update(Company $company, array $data): Company
  {
    $company->update($data);
    return $company->fresh();
  }

  public function delete(Company $company): bool
  {
    return (bool) $company->delete();
  }

  public function bulkDelete(array $ids): int
  {
    return Company::whereIn('id', $ids)->delete();
  }

  public function attachUser(Company $company, string $userId, array $pivotData = []): void
  {
    // ULID PK のため attach() は使えない。DB::table を使う
    \Illuminate\Support\Facades\DB::table('company_user')->insert(array_merge([
      'id'         => (string) \Illuminate\Support\Str::ulid(),
      'company_id' => $company->id,
      'user_id'    => $userId,
      'created_at' => now(),
      'updated_at' => now(),
    ], $pivotData));
  }

  public function detachUser(Company $company, string $userId): void
  {
    \Illuminate\Support\Facades\DB::table('company_user')
      ->where('company_id', $company->id)
      ->where('user_id', $userId)
      ->delete();
  }

  public function getStats(): array
  {
    return [
      'total'      => Company::count(),
      'individual' => Company::byType('individual')->count(),
      'corporate'  => Company::byType('corporate')->count(),
      'active'     => Company::active()->count(),
      'inactive'   => Company::where('status', 'inactive')->count(),
    ];
  }
}
