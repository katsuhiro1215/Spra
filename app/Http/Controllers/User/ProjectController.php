<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\Project;
use App\Models\ProjectAdmin;
use App\Models\ProjectUpdate;
use App\Services\ProjectService;
use Illuminate\Database\Eloquent\Collection;
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

    $projects->getCollection()->transform(function (Project $project) {
      return $this->withTeam($project);
    });

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
      'project' => $this->withTeam($project),
    ]);
  }

  /**
   * クライアントに公開する担当チーム情報を組み立てる。
   * リーダーのみ実名・写真を公開し、それ以外は役割ラベルとイニシャルのみとする（個人情報保護のため）。
   */
  private function withTeam(Project $project): Project
  {
    $project->setAttribute('team', $this->formatTeam($project->admins));
    $project->makeHidden('admins');

    return $project;
  }

  /**
   * @param Collection<int, Admin> $admins
   * @return array<int, array<string, mixed>>
   */
  private function formatTeam(Collection $admins): array
  {
    return $admins->map(function (Admin $admin) {
      $isLeader = $admin->pivot->role === 'leader';
      $fullName = $admin->profile?->full_name;

      return [
        'role' => $admin->pivot->role,
        'role_label' => ProjectAdmin::ROLES[$admin->pivot->role] ?? $admin->pivot->role,
        'is_leader' => $isLeader,
        'name' => $isLeader ? ($fullName ?: $admin->email) : $this->initial($fullName ?: $admin->email),
        'avatar_url' => $isLeader ? $admin->profile?->media?->url : null,
      ];
    })->values()->all();
  }

  /**
   * 表示用のイニシャル（氏名の先頭1文字、無ければメールアドレスの先頭1文字）
   */
  private function initial(string $name): string
  {
    return mb_strtoupper(mb_substr($name, 0, 1));
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
