<?php

namespace App\Services;

use App\Models\Project;
use App\Models\ProjectVersion;
use App\Models\ProjectMilestone;
use App\Models\ProjectUpdate;
use App\Models\ProjectItem;
use App\Models\ProjectTemplate;
use App\Repositories\ProjectRepository;
use App\Repositories\ProjectVersionRepository;
use Carbon\Carbon;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProjectService
{
  public function __construct(
    private ProjectRepository $repository,
    private ProjectVersionRepository $versionRepository
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

  public function create(array $data): Project
  {
    return DB::transaction(function () use ($data) {
      $technologyIds = $data['technology_ids'] ?? null;
      unset($data['technology_ids']);

      // Generate unique project code if not provided
      if (empty($data['project_code'])) {
        $timestamp = time() % 10000; // Last 4 digits of timestamp
        $random = Str::random(4, '0123456789');
        $code = 'PRJ-' . date('Y') . '-' . str_pad($timestamp, 4, '0', STR_PAD_LEFT) . $random;

        // Ensure uniqueness (unlikely but possible)
        $counter = 0;
        while (Project::where('project_code', $code)->exists() && $counter < 10) {
          $random = Str::random(4, '0123456789');
          $code = 'PRJ-' . date('Y') . '-' . str_pad($timestamp, 4, '0', STR_PAD_LEFT) . $random;
          $counter++;
        }
        $data['project_code'] = $code;
      }

      // Set created_by if not already set
      if (empty($data['created_by'])) {
        $data['created_by'] = auth('admins')->id();
      }

      // Create project
      $project = $this->repository->create($data);

      $this->syncTechnologies($project, $technologyIds);

      // Create initial ProjectVersion (v1, is_current = true)
      $versionData = [
        'project_id' => $project->id,
        'version' => 1,
        'title' => sprintf('%s - Version 1', $project->title),
        'description' => $project->description ?? null,
        'start_date' => $project->start_date,
        'estimated_end_date' => $project->estimated_end_date ?? null,
        'status' => 'draft',
        'is_current' => true,
        'created_by' => auth('admins')->id(),
      ];

      $this->versionRepository->create($versionData);

      return $project;
    });
  }

  /**
   * Create project from template with milestones and items
   */
  public function createFromTemplate(array $data): Project
  {
    return DB::transaction(function () use ($data) {
      // Validate template exists
      $template = ProjectTemplate::findOrFail($data['template_id']);

      // Prepare project data
      $projectData = [
        'contract_id' => $data['contract_id'] ?? null,
        'admin_id' => $data['admin_id'],
        'title' => $data['title'],
        'description' => $data['description'] ?? null,
        'status' => 'planning',
        'start_date' => $data['start_date'],
        'estimated_end_date' => $data['estimated_end_date'],
        'created_by' => auth('admins')->id(),
      ];

      // Create project
      $project = $this->repository->create($projectData);

      // Create initial ProjectVersion (v1, is_current = true)
      $versionData = [
        'project_id' => $project->id,
        'version' => 1,
        'title' => sprintf('%s - Version 1', $project->title),
        'description' => $project->description,
        'start_date' => $project->start_date,
        'estimated_end_date' => $project->estimated_end_date,
        'status' => 'draft',
        'is_current' => true,
        'created_by' => auth('admins')->id(),
      ];

      $version = $this->versionRepository->create($versionData);

      // Get selected milestone IDs
      $selectedMilestoneIds = $data['milestone_ids'] ?? [];
      $selectedMilestones = $template->milestones()
        ->whereIn('id', $selectedMilestoneIds)
        ->orderBy('order')
        ->get();

      // Calculate milestone dates
      $startDate = Carbon::parse($data['start_date']);
      $endDate = Carbon::parse($data['estimated_end_date']);
      $totalDays = $endDate->diffInDays($startDate);
      $daysPerMilestone = $selectedMilestones->count() > 0
        ? intval($totalDays / $selectedMilestones->count())
        : $totalDays;

      // Create milestones and items via ProjectVersion
      foreach ($selectedMilestones as $index => $templateMilestone) {
        $milestoneStartDate = (clone $startDate)
          ->addDays($daysPerMilestone * $index);
        $milestoneEndDate = (clone $milestoneStartDate)
          ->addDays($daysPerMilestone - 1);

        // Create milestone
        $milestone = $version->milestones()->create([
          'title' => $templateMilestone->milestone_name,
          'description' => $templateMilestone->description,
          'status' => 'pending',
          'due_date' => $milestoneEndDate,
          'sort_order' => $index,
          'is_client_visible' => true,
        ]);

        // Create item for this milestone
        ProjectItem::create([
          'project_version_id' => $version->id,
          'milestone_id' => $milestone->id,
          'name' => $templateMilestone->milestone_name,
          'description' => $templateMilestone->description,
          'type' => 'milestone',
          'start_date' => $milestoneStartDate,
          'end_date' => $milestoneEndDate,
          'status' => 'not_started',
          'progress' => 0,
          'priority' => 'medium',
          'sort_order' => $index,
          'is_client_visible' => true,
          'category' => 'milestone',
        ]);
      }

      // Create initial project update
      $project->updates()->create([
        'admin_id' => auth('admins')->id(),
        'title' => 'プロジェクト開始',
        'content' => sprintf(
          'プロジェクト「%s」が作成されました。テンプレート: %s、開始予定日: %s、納期: %s',
          $project->title,
          $template->name,
          $project->start_date->format('Y年m月d日'),
          $project->estimated_end_date->format('Y年m月d日')
        ),
        'type' => 'general',
        'is_client_visible' => false,
      ]);

      return $project;
    });
  }

  public function update(Project $project, array $data, array $categoryIds = []): Project
  {
    return DB::transaction(function () use ($project, $data, $categoryIds) {
      $technologyIds = $data['technology_ids'] ?? null;
      unset($data['technology_ids']);

      $updated = $this->repository->update($project, $data);

      $this->syncTechnologies($updated, $technologyIds);

      if ($categoryIds !== []) {
        $this->repository->syncCategories($updated, $categoryIds);
      }

      return $updated;
    });
  }

  /**
   * 使用技術タグを同期する。project_technologyは複合主キーのため、
   * service_technology/service_mediaのような明示的なULID採番は不要。
   */
  private function syncTechnologies(Project $project, ?array $technologyIds): void
  {
    if ($technologyIds === null) {
      return;
    }

    $pivotData = [];
    foreach (array_values($technologyIds) as $index => $technologyId) {
      $pivotData[$technologyId] = ['sort_order' => $index];
    }

    $project->technologies()->sync($pivotData);
  }

  public function delete(Project $project): bool
  {
    return $this->repository->delete($project);
  }

  public function getActiveByUser(string $userId): Collection
  {
    return $this->repository->getActiveByUser($userId);
  }

  public function addMilestone(ProjectVersion $version, array $data): ProjectMilestone
  {
    return $version->milestones()->create($data);
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
