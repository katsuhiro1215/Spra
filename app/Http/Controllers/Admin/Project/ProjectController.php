<?php

namespace App\Http\Controllers\Admin\Project;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Contract;
use App\Models\Admin;
use App\Services\ProjectTemplateService;
use App\Services\ProjectService;
use App\Http\Requests\StoreProjectFromTemplateRequest;
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
    $admins = Admin::select('id', 'name', 'email')->orderBy('name')->get();
    $contract = null;

    // URLパラメータから contract_id を取得
    if (request()->has('contract_id')) {
      $contract = Contract::with('user', 'company')
        ->findOrFail(request()->input('contract_id'));
    }

    return Inertia::render('Admin/Project/Create', [
      'contract' => $contract,
      'templates' => $templates->map(fn($template) => [
        'id' => $template->id,
        'name' => $template->name,
        'description' => $template->description,
        'icon' => $template->icon,
        'milestones' => $template->milestones->map(fn($milestone) => [
          'id' => $milestone->id,
          'milestone_name' => $milestone->milestone_name,
          'description' => $milestone->description,
          'order' => $milestone->order,
        ])->all(),
      ])->all(),
      'admins' => $admins,
    ]);
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(StoreProjectFromTemplateRequest $request): RedirectResponse
  {
    $project = $this->projectService->createFromTemplate($request->validated());

    return redirect()
      ->route('admin.project.show', $project->id)
      ->with('success', 'プロジェクトを作成しました。');
  }

  /**
   * Display the specified resource.
   */
  public function show(Project $project): Response
  {
    $project->load(['user', 'company', 'admin', 'contract', 'milestones', 'updates', 'items']);

    return Inertia::render('Admin/Project/Show', [
      'project' => $project,
    ]);
  }

  /**
   * Show the form for editing the specified resource.
   */
  public function edit(Project $project): void
  {
    // TODO: Implement edit logic
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(Project $project): void
  {
    // TODO: Implement update logic
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(Project $project): void
  {
    // TODO: Implement destroy logic
  }
}
