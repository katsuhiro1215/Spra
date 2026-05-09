<?php

namespace App\Repositories;

use App\Models\Project;
use App\Repositories\Contracts\ProjectRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class ProjectRepository implements ProjectRepositoryInterface
{
  public function query(): Builder
  {
    return Project::query();
  }

  public function findById(string $id): ?Project
  {
    return Project::with(['user', 'company', 'admin', 'categories', 'milestones', 'contracts'])->find($id);
  }

  public function findByIdForClient(string $id, string $userId): ?Project
  {
    return Project::where('id', $id)
      ->where('user_id', $userId)
      ->where('is_client_visible', true)
      ->with(['milestones' => fn($q) => $q->where('is_client_visible', true), 'updates' => fn($q) => $q->clientVisible(), 'contracts'])
      ->first();
  }

  public function findWithFilters(array $filters): Builder
  {
    $query = Project::query()->with(['user', 'company', 'admin', 'categories']);

    if (!empty($filters['search'])) {
      $search = $filters['search'];
      $query->where(function ($q) use ($search) {
        $q->where('title', 'like', "%{$search}%")
          ->orWhere('description', 'like', "%{$search}%");
      });
    }

    if (!empty($filters['status'])) {
      $query->where('status', $filters['status']);
    }

    if (!empty($filters['user_id'])) {
      $query->where('user_id', $filters['user_id']);
    }

    if (!empty($filters['company_id'])) {
      $query->where('company_id', $filters['company_id']);
    }

    if (!empty($filters['admin_id'])) {
      $query->where('admin_id', $filters['admin_id']);
    }

    return $query;
  }

  public function paginate(int $perPage = 20, array $filters = []): LengthAwarePaginator
  {
    return $this->findWithFilters($filters)->latest()->paginate($perPage);
  }

  public function paginateForClient(string $userId, int $perPage = 20, array $filters = []): LengthAwarePaginator
  {
    $query = Project::where('user_id', $userId)
      ->where('is_client_visible', true)
      ->with(['categories', 'milestones' => fn($q) => $q->where('is_client_visible', true)]);

    if (!empty($filters['status'])) {
      $query->where('status', $filters['status']);
    }

    return $query->latest()->paginate($perPage);
  }

  public function create(array $data): Project
  {
    return Project::create($data);
  }

  public function update(Project $project, array $data): Project
  {
    $project->update($data);
    return $project->fresh();
  }

  public function delete(Project $project): bool
  {
    return $project->delete();
  }

  public function syncCategories(Project $project, array $categoryIds): void
  {
    $project->categories()->sync($categoryIds);
  }

  public function getActiveByUser(string $userId): Collection
  {
    return Project::where('user_id', $userId)
      ->whereIn('status', ['in_progress', 'review'])
      ->where('is_client_visible', true)
      ->get();
  }
}
