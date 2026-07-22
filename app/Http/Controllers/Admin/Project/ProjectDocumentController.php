<?php

namespace App\Http\Controllers\Admin\Project;

use App\Http\Controllers\Controller;
use App\Http\Requests\Project\ProjectDocumentRequest;
use App\Models\Project;
use App\Models\ProjectDocument;
use App\Models\ProjectDocumentVersion;
use App\Repositories\ProjectDocumentRepository;
use App\Services\ProjectDocumentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProjectDocumentController extends Controller
{
    public function __construct(
        private ProjectDocumentRepository $repository,
        private ProjectDocumentService $service,
    ) {}

    public function index(Project $project): Response
    {
        return Inertia::render('Admin/Project/Document/Index', [
            'project' => $project,
            'documents' => $this->repository->getByProjectId($project->id),
        ]);
    }

    public function store(ProjectDocumentRequest $request, Project $project): RedirectResponse
    {
        $document = $this->service->createForProject(
            $project,
            $request->validated('document_type'),
            $request->validated('title'),
        );

        return redirect()
            ->route('admin.project.documents.show', [$project->id, $document->id])
            ->with('success', __('messages.created', ['attribute' => '文書']));
    }

    public function show(Project $project, ProjectDocument $document): Response
    {
        $document = $this->repository->findById($document->id);

        return Inertia::render('Admin/Project/Document/Show', [
            'project' => $project,
            'document' => $document,
        ]);
    }

    public function update(ProjectDocumentRequest $request, Project $project, ProjectDocument $document): RedirectResponse
    {
        $this->service->update($document, $request->validated());

        return back()->with('success', __('messages.updated', ['attribute' => '文書情報']));
    }

    public function compare(Request $request, Project $project, ProjectDocument $document): Response
    {
        $validated = $request->validate([
            'from' => 'required|string',
            'to' => 'required|string',
        ]);

        $versions = ProjectDocumentVersion::with([
            'sections.columns',
            'sections.endpoints',
            'sections.features',
            'sections.screens',
            'sections.permissions',
        ])
            ->where('project_document_id', $document->id)
            ->whereIn('id', [$validated['from'], $validated['to']])
            ->get()
            ->keyBy('id');

        abort_unless($versions->has($validated['from']) && $versions->has($validated['to']), 404);

        return Inertia::render('Admin/Project/Document/Compare', [
            'project' => $project,
            'document' => $document,
            'fromVersion' => $versions->get($validated['from']),
            'toVersion' => $versions->get($validated['to']),
        ]);
    }

    public function destroy(Project $project, ProjectDocument $document): RedirectResponse
    {
        $this->service->delete($document);

        return redirect()
            ->route('admin.project.show', $project->id)
            ->with('success', __('messages.deleted', ['attribute' => '文書']));
    }
}
