<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProjectUpdateRequest;
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

    return back()->with('success', '更新情報を追加しました。');
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(ProjectUpdateRequest $request, Project $project, ProjectUpdate $update): RedirectResponse
  {
    $update->update($request->validated());

    return back()->with('success', '更新情報を変更しました。');
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(Project $project, ProjectUpdate $update): RedirectResponse
  {
    $update->delete();

    return back()->with('success', '更新情報を削除しました。');
  }
}
