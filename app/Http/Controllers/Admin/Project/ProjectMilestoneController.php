<?php

namespace App\Http\Controllers\Admin\Project;

use App\Http\Controllers\Controller;
use App\Http\Requests\Project\ProjectMilestoneRequest;
use App\Models\Project;
use App\Models\ProjectVersion;
use App\Models\ProjectMilestone;
use App\Services\ProjectService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ProjectMilestoneController extends Controller
{
  public function __construct(
    private ProjectService $projectService
  ) {}

  /**
   * Show the form for creating a new resource.
   */
  public function create(Project $project, ProjectVersion $version): Response
  {
    return Inertia::render('Admin/ProjectMilestone/Create', [
      'project' => $project,
      'version' => $version,
    ]);
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(ProjectMilestoneRequest $request, Project $project, ProjectVersion $version): RedirectResponse
  {
    $data = $request->validated();

    // Convert order to sort_order
    if (isset($data['order'])) {
      $data['sort_order'] = $data['order'];
      unset($data['order']);
    }

    // Set sort_order if not provided
    if (!isset($data['sort_order'])) {
      $maxOrder = $version->milestones()->max('sort_order') ?? 0;
      $data['sort_order'] = $maxOrder + 1;
    }

    // Map target_date to due_date if needed
    if (isset($data['target_date'])) {
      $data['due_date'] = $data['target_date'];
      unset($data['target_date']);
    }

    $version->milestones()->create($data);

    return back()->with('success', 'マイルストーンを追加しました。');
  }

  /**
   * Show the form for editing the specified resource.
   */
  public function edit(Project $project, ProjectVersion $version, ProjectMilestone $milestone): Response
  {
    return Inertia::render('Admin/ProjectMilestone/Edit', [
      'project' => $project,
      'version' => $version,
      'milestone' => $milestone,
    ]);
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(ProjectMilestoneRequest $request, Project $project, ProjectVersion $version, ProjectMilestone $milestone): RedirectResponse
  {
    $data = $request->validated();

    // Convert order to sort_order
    if (isset($data['order'])) {
      $data['sort_order'] = $data['order'];
      unset($data['order']);
    }

    // Map target_date to due_date if needed
    if (isset($data['target_date'])) {
      $data['due_date'] = $data['target_date'];
      unset($data['target_date']);
    }

    $milestone->update($data);

    return back()->with('success', 'マイルストーンを更新しました。');
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(Project $project, ProjectVersion $version, ProjectMilestone $milestone): RedirectResponse
  {
    $milestone->delete();

    return back()->with('success', 'マイルストーンを削除しました。');
  }
}
