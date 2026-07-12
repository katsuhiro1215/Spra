<?php

namespace App\Http\Controllers\Admin\Project;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Contract;
use App\Models\Admin;
use App\Services\ProjectTemplateService;
use App\Services\ProjectService;
use App\Http\Requests\StoreProjectRequest;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class ProjectController extends Controller
{
    public function __construct(
        private ProjectTemplateService $templateService,
        private ProjectService $projectService
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $projects = Project::with(['user', 'company', 'admin'])
            ->orderByDesc('created_at')
            ->paginate(20);

        return Inertia::render('Admin/Project/Index', [
            'projects' => $projects,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $templates = $this->templateService->getAll();
        $admins = Admin::select('id', 'email')->with('profile')->get();
        $users = \App\Models\User::select('id', 'email')->with('profile')->get();
        $companies = \App\Models\Company::all();
        $contracts = \App\Models\Contract::select('id', 'contract_number', 'title')->get();
        $contract = null;

        // URLパラメータから contract_id を取得
        if (request()->has('contract_id')) {
            $contract = \App\Models\Contract::with('user', 'company')
                ->findOrFail(request()->input('contract_id'));
        }

        return Inertia::render('Admin/Project/Create', [
            'contract' => $contract,
            'contracts' => $contracts,
            'users' => $users,
            'companies' => $companies,
            'admins' => $admins,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProjectRequest $request): RedirectResponse
    {
        $project = $this->projectService->create($request->validated());

        if ($project->is_client_visible && $project->user) {
            $project->user->notify(new \App\Notifications\ProjectCreatedForUser($project));
        }

        return redirect()
            ->route('admin.project.show', $project->id)
            ->with('success', 'プロジェクトを作成しました。');
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project): Response
    {
        $project->load([
            'user',
            'company',
            'admin',
            'contract',
            'versions',
            'updates'
        ]);

        $currentVersion = $project->versions()
            ->where('is_current', true)
            ->first();

        if ($currentVersion) {
            $currentVersion->load(['milestones', 'items']);
        }

        return Inertia::render('Admin/Project/Show', [
            'project' => $project,
            'currentVersion' => $currentVersion,
            'progress' => $project->calculateProgress($currentVersion),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Project $project): Response
    {
        $admins = Admin::select('id', 'email')->with('profile')->get();
        $users = \App\Models\User::select('id', 'email')->with('profile')->get();
        $companies = \App\Models\Company::all();
        $contracts = \App\Models\Contract::select('id', 'contract_number', 'title')->get();

        return Inertia::render('Admin/Project/Edit', [
            'project' => $project,
            'contracts' => $contracts,
            'users' => $users,
            'companies' => $companies,
            'admins' => $admins,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreProjectRequest $request, Project $project): RedirectResponse
    {
        $wasClientVisible = $project->is_client_visible;

        $project = $this->projectService->update($project, $request->validated());

        // 非公開→公開に変わったタイミングでクライアントに通知
        if (!$wasClientVisible && $project->is_client_visible && $project->user) {
            $project->user->notify(new \App\Notifications\ProjectCreatedForUser($project));
        }

        return redirect()
            ->route('admin.project.show', $project->id)
            ->with('success', 'プロジェクトを更新しました。');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project): RedirectResponse
    {
        $this->projectService->delete($project);

        return redirect()
            ->route('admin.project.index')
            ->with('success', 'プロジェクトを削除しました。');
    }
}
