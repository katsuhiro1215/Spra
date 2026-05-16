<?php

namespace App\Http\Controllers\Admin\Project;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProjectMilestoneRequest;
use App\Models\Project;
use App\Models\ProjectMilestone;
use Illuminate\Http\RedirectResponse;

class ProjectMilestoneController extends Controller
{
  /**
   * Store a newly created resource in storage.
   */
  public function store(ProjectMilestoneRequest $request, Project $project): RedirectResponse
  {
    $data = $request->validated();
    $data['project_id'] = $project->id;

    // Set sort_order if not provided
    if (!isset($data['sort_order'])) {
      $maxOrder = $project->milestones()->max('sort_order') ?? 0;
      $data['sort_order'] = $maxOrder + 1;
    }

    ProjectMilestone::create($data);

    return back()->with('success', 'マイルストーンを追加しました。');
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(ProjectMilestoneRequest $request, Project $project, ProjectMilestone $milestone): RedirectResponse
  {
    $milestone->update($request->validated());

    return back()->with('success', 'マイルストーンを更新しました。');
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(Project $project, ProjectMilestone $milestone): RedirectResponse
  {
    $milestone->delete();

    return back()->with('success', 'マイルストーンを削除しました。');
  }
}
