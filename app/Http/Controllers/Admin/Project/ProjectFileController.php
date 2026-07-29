<?php

namespace App\Http\Controllers\Admin\Project;

use App\Http\Controllers\Controller;
use App\Http\Requests\Project\StoreProjectFileRequest;
use App\Models\Project;
use App\Models\ProjectFile;
use App\Services\ProjectFileService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ProjectFileController extends Controller
{
    public function __construct(
        private ProjectFileService $service,
    ) {}

    public function store(StoreProjectFileRequest $request, Project $project): RedirectResponse
    {
        $this->service->upload(
            $project,
            $request->file('file'),
            $request->validated(),
            Auth::guard('admins')->id(),
        );

        return back()->with('success', __('messages.added', ['attribute' => 'ファイル']));
    }

    public function download(Project $project, ProjectFile $file): StreamedResponse
    {
        $this->assertBelongsToProject($project, $file);

        return Storage::disk($file->disk)->download($file->path, $file->original_filename);
    }

    public function destroy(Project $project, ProjectFile $file): RedirectResponse
    {
        $this->assertBelongsToProject($project, $file);

        $this->service->delete($file);

        return back()->with('success', __('messages.deleted', ['attribute' => 'ファイル']));
    }

    private function assertBelongsToProject(Project $project, ProjectFile $file): void
    {
        abort_unless($file->project_id === $project->id, 404);
    }
}
