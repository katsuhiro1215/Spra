<?php

namespace App\Repositories;

use App\Models\Project;
use App\Models\ProjectVersion;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class ProjectVersionRepository
{
  public function query(): Builder
  {
    return ProjectVersion::query();
  }

  public function create(array $data): ProjectVersion
  {
    return ProjectVersion::create($data);
  }

  public function findById(string $id): ?ProjectVersion
  {
    return ProjectVersion::with(['project', 'milestones', 'items', 'createdBy'])->find($id);
  }

  public function findCurrentByProjectId(string $projectId): ?ProjectVersion
  {
    return ProjectVersion::where('project_id', $projectId)
      ->where('is_current', true)
      ->first();
  }

  public function getByProjectId(string $projectId): Collection
  {
    return ProjectVersion::where('project_id', $projectId)
      ->orderBy('version')
      ->get();
  }

  public function getLatestVersion(string $projectId): ?ProjectVersion
  {
    return ProjectVersion::where('project_id', $projectId)
      ->orderByDesc('version')
      ->first();
  }

  public function update(ProjectVersion $version, array $data): ProjectVersion
  {
    $version->update($data);
    return $version;
  }

  public function delete(ProjectVersion $version): bool
  {
    return $version->delete();
  }

  public function setCurrentVersion(string $projectId, string $versionId): void
  {
    // Set is_current to false for all versions of this project
    ProjectVersion::where('project_id', $projectId)
      ->where('is_current', true)
      ->update(['is_current' => false]);

    // Set is_current to true for the specified version
    ProjectVersion::where('id', $versionId)
      ->where('project_id', $projectId)
      ->update(['is_current' => true]);
  }

  public function createNewVersion(Project $project, ProjectVersion $fromVersion, array $data): ProjectVersion
  {
    $latestVersion = $this->getLatestVersion($project->id);
    $newVersionNumber = ($latestVersion?->version ?? 0) + 1;

    $newVersionData = array_merge(
      [
        'project_id' => $project->id,
        'version' => $newVersionNumber,
        'is_current' => false,
        'created_by' => auth('admins')?->id(),
      ],
      $data
    );

    return $this->create($newVersionData);
  }
}
