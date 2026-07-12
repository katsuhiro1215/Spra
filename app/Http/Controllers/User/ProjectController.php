<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\ProjectUpdate;
use App\Services\ProjectService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
  public function __construct(
    private ProjectService $service
  ) {}

  public function index(Request $request): Response
  {
    $userId = auth('users')->id();
    $filters = $request->only(['status']);

    $projects = $this->service->getPaginatedForClient($userId, $filters, 15);

    return Inertia::render('User/Project/Index', [
      'projects' => $projects,
      'filters'  => $filters,
    ]);
  }

  public function show(string $id): Response
  {
    $userId = auth('users')->id();

    $project = $this->service->findByIdForClient($id, $userId);
    abort_unless($project, 404);

    return Inertia::render('User/Project/Show', [
      'project' => $project,
    ]);
  }

  /**
   * 自分のプロジェクトに紐づく進捗状況（ProjectUpdate）の一覧
   */
  public function progress(): Response
  {
    $userId = auth('users')->id();

    $updates = ProjectUpdate::whereHas('project', function ($q) use ($userId) {
      $q->where('user_id', $userId)->where('is_client_visible', true);
    })
      ->clientVisible()
      ->with('project:id,title')
      ->orderByDesc('created_at')
      ->paginate(15);

    return Inertia::render('User/Progress/Index', [
      'updates' => $updates,
    ]);
  }
}
