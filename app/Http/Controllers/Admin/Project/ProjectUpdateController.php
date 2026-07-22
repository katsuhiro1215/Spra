<?php

namespace App\Http\Controllers\Admin\Project;

use App\Http\Controllers\Controller;
use App\Http\Requests\Project\ProjectUpdateRequest;
use App\Models\Project;
use App\Models\ProjectUpdate;
use Illuminate\Http\RedirectResponse;

class ProjectUpdateController extends Controller
{
  /**
   * Store a newly created resource in storage.
   */
  public function store(ProjectUpdateRequest $request, Project $project): RedirectResponse
  {
    $data = $request->validated();
    $data['project_id'] = $project->id;
    $data['admin_id'] = auth('admins')->id();

    ProjectUpdate::create($data);

    return back()->with('success', __('messages.added', ['attribute' => '更新情報']));
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(ProjectUpdateRequest $request, Project $project, ProjectUpdate $update): RedirectResponse
  {
    $update->update($request->validated());

    return back()->with('success', __('messages.project.update_changed'));
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(Project $project, ProjectUpdate $update): RedirectResponse
  {
    $update->delete();

    return back()->with('success', __('messages.deleted', ['attribute' => '更新情報']));
  }
}
