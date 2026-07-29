<?php

namespace App\Repositories;

use App\Models\ProjectFile;
use App\Repositories\Contracts\ProjectFileRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class ProjectFileRepository extends BaseRepository implements ProjectFileRepositoryInterface
{
    protected function getModelClass(): string
    {
        return ProjectFile::class;
    }

    protected function getSearchableFields(): array
    {
        return ['original_filename', 'description'];
    }

    protected function getSortableFields(): array
    {
        return ['created_at', 'original_filename', 'file_size'];
    }

    protected function getDefaultRelations(): array
    {
        return ['uploadedBy.profile'];
    }

    public function getForProject(string $projectId): Collection
    {
        return ProjectFile::where('project_id', $projectId)
            ->with($this->getDefaultRelations())
            ->orderBy('created_at', 'desc')
            ->get();
    }
}
