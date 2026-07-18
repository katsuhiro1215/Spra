<?php

namespace App\Services;

use App\Models\Project;
use App\Models\ProjectDocument;
use App\Repositories\ProjectDocumentRepository;
use Illuminate\Support\Facades\DB;

class ProjectDocumentService
{
    public function __construct(
        private ProjectDocumentRepository $repository,
    ) {}

    /**
     * 文書を作成し、同時に最初のドラフト版(v1)を発行する。
     * 文書はバージョンを持たない状態では編集できないため、必ずセットで作成する。
     */
    public function createForProject(Project $project, string $documentType, ?string $title = null): ProjectDocument
    {
        return DB::transaction(function () use ($project, $documentType, $title) {
            $document = $this->repository->create([
                'project_id'     => $project->id,
                'document_type'  => $documentType,
                'title'          => $title,
                'status'         => 'draft',
                'created_by'     => auth('admins')->id(),
            ]);

            $document->versions()->create([
                'version'    => 1,
                'status'     => 'draft',
                'is_current' => true,
                'created_by' => auth('admins')->id(),
            ]);

            return $document->load('currentVersion');
        });
    }

    public function update(ProjectDocument $document, array $data): ProjectDocument
    {
        return $this->repository->update($document, $data);
    }

    public function delete(ProjectDocument $document): bool
    {
        return $this->repository->delete($document);
    }
}
