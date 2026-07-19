<?php

namespace App\Http\Controllers\Admin\Project;

use App\Http\Controllers\Controller;
use App\Http\Requests\Project\ProjectDocumentVersionReleaseRequest;
use App\Models\Project;
use App\Models\ProjectDocument;
use App\Models\ProjectDocumentVersion;
use App\Services\ProjectDocumentPdfService;
use App\Services\ProjectDocumentVersionService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Response as HttpResponse;

class ProjectDocumentVersionController extends Controller
{
    public function __construct(
        private ProjectDocumentVersionService $service,
        private ProjectDocumentPdfService $pdfService,
    ) {}

    /**
     * 現在のドラフト版を確定し、次のドラフト版を発行する（＝「版を確定」）
     */
    public function store(ProjectDocumentVersionReleaseRequest $request, Project $project, ProjectDocument $document): RedirectResponse
    {
        $draft = $document->currentVersion;

        abort_if(!$draft, 404, '編集中のバージョンが見つかりません。');
        abort_if($draft->sections()->count() === 0, 422, 'セクションが1件もない状態では確定できません。');

        $this->service->release($draft, $request->validated('next_revision_reason'));

        return back()->with('success', "v{$draft->version} を確定しました。");
    }

    public function pdf(Project $project, ProjectDocument $document, ProjectDocumentVersion $version): HttpResponse
    {
        abort_unless($version->project_document_id === $document->id, 404);

        $mpdf = $this->pdfService->generate($document, $version);

        return response($mpdf->Output('', 'S'), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="' . $this->pdfService->getFileName($document, $version) . '"',
        ]);
    }
}
