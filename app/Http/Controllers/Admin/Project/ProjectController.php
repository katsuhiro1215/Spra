<?php

namespace App\Http\Controllers\Admin\Project;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProjectRequest;
use App\Models\Project;
use App\Models\ProjectCategory;
use App\Models\ProjectInquiry;
use App\Models\Contract;
use App\Models\User;
use App\Models\Company;
use App\Models\Admin;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
  /**
   * Display a listing of the resource.
   */
  public function index(Request $request): Response
  {
    $query = Project::with(['user', 'company', 'admin', 'categories']);

    // Search
    if ($search = $request->input('search')) {
      $query->where(function ($q) use ($search) {
        $q->where('project_code', 'like', "%{$search}%")
          ->orWhere('title', 'like', "%{$search}%")
          ->orWhereHas('user', function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%");
          });
      });
    }

    // Filter by status
    if ($status = $request->input('status')) {
      $query->where('status', $status);
    }

    // Filter by priority
    if ($priority = $request->input('priority')) {
      $query->where('priority', $priority);
    }

    // Filter by category
    if ($categoryId = $request->input('category_id')) {
      $query->whereHas('categories', function ($q) use ($categoryId) {
        $q->where('project_categories.id', $categoryId);
      });
    }

    // Filter by admin
    if ($adminId = $request->input('admin_id')) {
      $query->where('admin_id', $adminId);
    }

    $projects = $query
      ->orderByDesc('created_at')
      ->paginate(20)
      ->withQueryString();

    $categories = ProjectCategory::where('is_active', true)->orderBy('sort_order')->get();
    $admins = Admin::select('id', 'email')->get();

    return Inertia::render('Admin/Projects/Index', [
      'projects' => $projects,
      'categories' => $categories,
      'admins' => $admins,
      'filters' => $request->only(['search', 'status', 'priority', 'category_id', 'admin_id']),
    ]);
  }

  /**
   * Show the form for creating a new resource.
   */
  public function create(): Response
  {
    $inquiries = ProjectInquiry::with('user')
      ->whereIn('status', ['new', 'in_discussion', 'estimated'])
      ->orderByDesc('created_at')
      ->get();
    $contracts = Contract::with('user')
      ->where('status', 'active')
      ->orderByDesc('created_at')
      ->get();
    $users = User::select('id', 'name', 'email')->orderBy('name')->get();
    $companies = Company::select('id', 'name')->where('status', 'active')->orderBy('name')->get();
    $admins = Admin::select('id', 'name', 'email')->orderBy('name')->get();
    $categories = ProjectCategory::where('is_active', true)->orderBy('sort_order')->get();

    return Inertia::render('Admin/Projects/Create', [
      'inquiries' => $inquiries,
      'contracts' => $contracts,
      'users' => $users,
      'companies' => $companies,
      'admins' => $admins,
      'categories' => $categories,
    ]);
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(ProjectRequest $request): RedirectResponse
  {
    $data = $request->validated();
    $data['project_code'] = $this->generateProjectCode();
    $data['created_by'] = auth('admins')->id();

    $categoryIds = $data['category_ids'] ?? [];
    unset($data['category_ids']);

    $project = Project::create($data);

    if (!empty($categoryIds)) {
      $project->categories()->attach($categoryIds);
    }

    return redirect()
      ->route('admin.projects.show', $project->id)
      ->with('success', 'プロジェクトを作成しました。');
  }

  /**
   * Display the specified resource.
   */
  public function show(string $id): Response
  {
    $project = Project::with([
      'user',
      'company',
      'admin',
      'inquiry',
      'contract',
      'categories',
      'milestones' => function ($query) {
        $query->orderBy('sort_order');
      },
      'updates' => function ($query) {
        $query->orderByDesc('created_at');
      },
    ])->findOrFail($id);

    return Inertia::render('Admin/Projects/Show', [
      'project' => $project,
    ]);
  }

  /**
   * Show the form for editing the specified resource.
   */
  public function edit(string $id): Response
  {
    $project = Project::with('categories')->findOrFail($id);

    $inquiries = ProjectInquiry::with('user')
      ->whereIn('status', ['new', 'in_discussion', 'estimated'])
      ->orderByDesc('created_at')
      ->get();
    $contracts = Contract::with('user')
      ->where('status', 'active')
      ->orderByDesc('created_at')
      ->get();
    $users = User::select('id', 'name', 'email')->orderBy('name')->get();
    $companies = Company::select('id', 'name')->where('status', 'active')->orderBy('name')->get();
    $admins = Admin::select('id', 'name', 'email')->orderBy('name')->get();
    $categories = ProjectCategory::where('is_active', true)->orderBy('sort_order')->get();

    return Inertia::render('Admin/Projects/Edit', [
      'project' => $project,
      'inquiries' => $inquiries,
      'contracts' => $contracts,
      'users' => $users,
      'companies' => $companies,
      'admins' => $admins,
      'categories' => $categories,
    ]);
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(ProjectRequest $request, string $id): RedirectResponse
  {
    $project = Project::findOrFail($id);

    $data = $request->validated();
    $data['updated_by'] = auth('admins')->id();

    $categoryIds = $data['category_ids'] ?? [];
    unset($data['category_ids']);

    $project->update($data);

    $project->categories()->sync($categoryIds);

    return redirect()
      ->route('admin.projects.show', $project->id)
      ->with('success', 'プロジェクトを更新しました。');
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(string $id): RedirectResponse
  {
    $project = Project::findOrFail($id);
    $project->deleted_by = auth('admins')->id();
    $project->save();
    $project->delete();

    return redirect()
      ->route('admin.projects.index')
      ->with('success', 'プロジェクトを削除しました。');
  }

  /**
   * Generate unique project code
   */
  private function generateProjectCode(): string
  {
    $year = date('Y');
    $lastProject = Project::where('project_code', 'like', "PRJ{$year}-%")
      ->orderByDesc('project_code')
      ->first();

    if ($lastProject) {
      $lastNumber = (int)substr($lastProject->project_code, -4);
      $newNumber = $lastNumber + 1;
    } else {
      $newNumber = 1;
    }

    return sprintf('PRJ%s-%04d', $year, $newNumber);
  }
}
