<?php

namespace App\Http\Controllers\Admin\Project;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Contract;
use App\Models\Admin;
use App\Models\User;
use App\Models\Company;
use App\Services\ProjectTemplateService;
use App\Services\ProjectService;
use App\Http\Requests\Project\StoreProjectRequest;
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
        $projects = Project::with(['user', 'company', 'admins.profile'])
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
        $users = User::select('id', 'email')->with('profile')->get();
        $companies = Company::all();
        $contracts = Contract::select('id', 'contract_number', 'title', 'service_plan_id')
            ->with('servicePlan.service.technologies')
            ->get();
        $contract = null;

        // URLパラメータから contract_id を取得
        if (request()->has('contract_id')) {
            $contract = Contract::with('user', 'company')
                ->findOrFail(request()->input('contract_id'));
        }

        return Inertia::render('Admin/Project/Create', [
            'contract' => $contract,
            'contracts' => $contracts,
            'users' => $users,
            'companies' => $companies,
            'admins' => $admins,
            'technologiesByContract' => $this->buildTechnologiesByContract($contracts),
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
            ->with('success', __('messages.created', ['attribute' => 'プロジェクト']));
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project): Response
    {
        $project->load([
            'user',
            'company',
            'admins.profile',
            'contract',
            'versions',
            'updates',
            'updates.admin.profile',
            'files',
            'files.uploadedBy.profile',
            'technologies',
            'documents.currentVersion',
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
        $users = User::select('id', 'email')->with('profile')->get();
        $companies = Company::all();
        $contracts = Contract::select('id', 'contract_number', 'title', 'service_plan_id')
            ->with('servicePlan.service.technologies')
            ->get();

        $project->load(['technologies', 'admins.profile']);

        return Inertia::render('Admin/Project/Edit', [
            'project' => $project,
            'contracts' => $contracts,
            'users' => $users,
            'companies' => $companies,
            'admins' => $admins,
            'technologiesByContract' => $this->buildTechnologiesByContract($contracts),
        ]);
    }

    /**
     * 契約ID => その契約のServicePlan→Serviceが持つ使用技術一覧、のマップを作る
     * （Create/Edit画面で「契約先サービスの候補技術」から選ばせるため）
     *
     * @param \Illuminate\Support\Collection<int, \App\Models\Contract> $contracts
     * @return array<string, array<int, array{id: string, name: string}>>
     */
    private function buildTechnologiesByContract($contracts): array
    {
        return $contracts->mapWithKeys(function ($contract) {
            $technologies = $contract->servicePlan?->service?->technologies ?? collect();

            return [
                $contract->id => $technologies
                    ->map(fn ($technology) => ['id' => $technology->id, 'name' => $technology->name])
                    ->values()
                    ->all(),
            ];
        })->all();
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
            ->with('success', __('messages.updated', ['attribute' => 'プロジェクト']));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project): RedirectResponse
    {
        $this->projectService->delete($project);

        return redirect()
            ->route('admin.project.index')
            ->with('success', __('messages.deleted', ['attribute' => 'プロジェクト']));
    }
}
