<?php

namespace App\Services;

use App\Models\Project;
use App\Models\ProjectMilestone;
use App\Models\ProjectUpdate;
use App\Repositories\ProjectRepository;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class ProjectService
{
  public function __construct(
    private ProjectRepository $repository
  ) {}

  public function getPaginated(array $filters = [], int $perPage = 20): LengthAwarePaginator
  {
    return $this->repository->paginate($perPage, $filters);
  }

  public function getPaginatedForClient(string $userId, array $filters = [], int $perPage = 20): LengthAwarePaginator
  {
    return $this->repository->paginateForClient($userId, $perPage, $filters);
  }

  public function findById(string $id): ?Project
  {
    return $this->repository->findById($id);
  }

  public function findByIdForClient(string $id, string $userId): ?Project
  {
    return $this->repository->findByIdForClient($id, $userId);
  }

  public function create(array $data, array $categoryIds = []): Project
  {
    return DB::transaction(function () use ($data, $categoryIds) {
      $project = $this->repository->create($data);

      if (!empty($categoryIds)) {
        $this->repository->syncCategories($project, $categoryIds);
      }

      return $project;
    });
  }

  public function update(Project $project, array $data, array $categoryIds = []): Project
  {
    return DB::transaction(function () use ($project, $data, $categoryIds) {
      $updated = $this->repository->update($project, $data);

      if ($categoryIds !== []) {
        $this->repository->syncCategories($updated, $categoryIds);
      }

      return $updated;
    });
  }

  public function delete(Project $project): bool
  {
    return $this->repository->delete($project);
  }

  public function getActiveByUser(string $userId): Collection
  {
    return $this->repository->getActiveByUser($userId);
  }

  public function addMilestone(Project $project, array $data): ProjectMilestone
  {
    return $project->milestones()->create($data);
  }

  public function updateMilestone(ProjectMilestone $milestone, array $data): ProjectMilestone
  {
    $milestone->update($data);
    return $milestone->fresh();
  }

  public function addUpdate(Project $project, array $data): ProjectUpdate
  {
    return $project->updates()->create($data);
  }

  /**
   * プロジェクトステータスの遷移可否を検証する
   */
  public function canTransitionStatus(Project $project, string $newStatus): bool
  {
    $allowedTransitions = [
      'planning'    => ['in_progress', 'on_hold', 'cancelled'],
      'in_progress' => ['review', 'on_hold', 'cancelled'],
      'review'      => ['in_progress', 'completed', 'on_hold'],
      'on_hold'     => ['in_progress', 'cancelled'],
      'completed'   => [],
      'cancelled'   => [],
    ];

    return in_array($newStatus, $allowedTransitions[$project->status] ?? []);
  }
}
