<?php

namespace App\Http\Controllers\Admin\Project;

use App\Http\Controllers\Controller;
use App\Http\Requests\Project\ProjectDocumentSectionDetailsRequest;
use App\Http\Requests\Project\ProjectDocumentSectionRequest;
use App\Models\Project;
use App\Models\ProjectDocument;
use App\Models\ProjectDocumentSection;
use App\Services\ProjectDocumentMigrationService;
use App\Services\ProjectDocumentSectionService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;

class ProjectDocumentSectionController extends Controller
{
    public function __construct(
        private ProjectDocumentSectionService $service,
        private ProjectDocumentMigrationService $migrationService,
    ) {}

    public function store(ProjectDocumentSectionRequest $request, Project $project, ProjectDocument $document): RedirectResponse
    {
        $version = $document->currentVersion;
        abort_if(!$version, 404, '編集中のバージョンが見つかりません。');

        $this->service->create($version, $request->validated('section_type'), $request->validated('title'));

        return back()->with('success', __('messages.added', ['attribute' => 'セクション']));
    }

    public function update(ProjectDocumentSectionRequest $request, Project $project, ProjectDocument $document, ProjectDocumentSection $section): RedirectResponse
    {
        $this->assertBelongsToDocument($document, $section);

        $this->service->updateMeta($section, $request->validated());

        return back()->with('success', __('messages.updated', ['attribute' => 'セクション']));
    }

    public function updateDetails(ProjectDocumentSectionDetailsRequest $request, Project $project, ProjectDocument $document, ProjectDocumentSection $section): RedirectResponse
    {
        $this->assertBelongsToDocument($document, $section);

        $this->service->replaceDetails($section, $request->validated('rows', []));

        return back()->with('success', __('messages.saved', ['attribute' => 'セクションの内容']));
    }

    public function destroy(Project $project, ProjectDocument $document, ProjectDocumentSection $section): RedirectResponse
    {
        $this->assertBelongsToDocument($document, $section);

        $this->service->delete($section);

        return back()->with('success', __('messages.deleted', ['attribute' => 'セクション']));
    }

    public function reorder(Request $request, Project $project, ProjectDocument $document): RedirectResponse
    {
        $data = $request->validate([
            'order' => 'required|array',
            'order.*' => 'string',
        ]);

        $version = $document->currentVersion;
        abort_if(!$version, 404, '編集中のバージョンが見つかりません。');

        $this->service->reorder($version, $data['order']);

        return back();
    }

    public function migration(Project $project, ProjectDocument $document, ProjectDocumentSection $section): HttpResponse
    {
        $this->assertBelongsToDocument($document, $section);
        abort_unless($section->section_type === 'db_table', 404);

        $code = $this->migrationService->generate($section);

        return response($code, 200, [
            'Content-Type' => 'text/x-php; charset=utf-8',
            'Content-Disposition' => 'attachment; filename="' . $this->migrationService->getFileName($section) . '"',
        ]);
    }

    private function assertBelongsToDocument(ProjectDocument $document, ProjectDocumentSection $section): void
    {
        abort_unless($section->version->project_document_id === $document->id, 404);
    }
}
