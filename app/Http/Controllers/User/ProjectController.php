<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
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
}
