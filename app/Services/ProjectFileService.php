<?php

namespace App\Services;

use App\Models\Project;
use App\Models\ProjectFile;
use App\Repositories\Contracts\ProjectFileRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ProjectFileService extends BaseService
{
    public function __construct(ProjectFileRepositoryInterface $repository)
    {
        parent::__construct($repository);
    }

    protected function getEntityName(): string
    {
        return 'ProjectFile';
    }

    public function getForProject(string $projectId): Collection
    {
        return $this->repository->getForProject($projectId);
    }

    public function upload(Project $project, UploadedFile $file, array $data, ?string $adminId): ProjectFile
    {
        return DB::transaction(function () use ($project, $file, $data, $adminId) {
            $disk = 'private';
            $path = $file->store("projects/{$project->id}/files", $disk);

            return $this->repository->create([
                'project_id' => $project->id,
                'uploaded_by' => $adminId,
                'disk' => $disk,
                'path' => $path,
                'original_filename' => $file->getClientOriginalName(),
                'mime_type' => $file->getClientMimeType(),
                'file_size' => $file->getSize(),
                'description' => $data['description'] ?? null,
                'is_client_visible' => $data['is_client_visible'] ?? false,
            ]);
        });
    }

    /**
     * @param ProjectFile $model
     */
    public function delete(mixed $model): bool
    {
        return DB::transaction(function () use ($model) {
            Storage::disk($model->disk)->delete($model->path);

            return $this->repository->delete($model);
        });
    }
}
