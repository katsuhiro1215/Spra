<?php

namespace App\Repositories;

use App\Models\ProjectDocument;
use Illuminate\Database\Eloquent\Collection;

class ProjectDocumentRepository
{
    public function getByProjectId(string $projectId): Collection
    {
        return ProjectDocument::where('project_id', $projectId)
            ->with('currentVersion')
            ->get();
    }

    public function findById(string $id): ?ProjectDocument
    {
        return ProjectDocument::with([
            'currentVersion.sections.columns',
            'currentVersion.sections.endpoints',
            'currentVersion.sections.features',
            'currentVersion.sections.screens',
            'currentVersion.sections.permissions',
            'versions' => fn ($q) => $q->orderByDesc('version'),
        ])->find($id);
    }

    public function create(array $data): ProjectDocument
    {
        return ProjectDocument::create($data);
    }

    public function update(ProjectDocument $document, array $data): ProjectDocument
    {
        $document->update($data);

        return $document;
    }

    public function delete(ProjectDocument $document): bool
    {
        return $document->delete();
    }
}
