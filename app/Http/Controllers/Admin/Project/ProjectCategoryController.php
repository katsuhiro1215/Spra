<?php

namespace App\Http\Controllers\Admin\Project;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProjectCategoryRequest;
use App\Models\ProjectCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProjectCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = ProjectCategory::query();

        // Search
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Filter by status
        if ($request->has('is_active') && $request->input('is_active') !== null) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        $categories = $query
            ->withCount('projects')
            ->orderBy('sort_order')
            ->orderBy('name')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Projects/Categories/Index', [
            'categories' => $categories,
            'filters' => $request->only(['search', 'is_active']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Projects/Categories/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ProjectCategoryRequest $request): RedirectResponse
    {
        ProjectCategory::create($request->validated());

        return redirect()
            ->route('admin.project-categories.index')
            ->with('success', 'プロジェクトカテゴリを作成しました。');
    }

    /**
     * Display the specified resource.
     */
    public function show(ProjectCategory $projectCategory): Response
    {
        $projectCategory->load(['projects' => function ($query) {
            $query->orderByDesc('created_at')->take(10);
        }]);

        return Inertia::render('Admin/Projects/Categories/Show', [
            'category' => $projectCategory,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ProjectCategory $projectCategory): Response
    {
        return Inertia::render('Admin/Projects/Categories/Edit', [
            'category' => $projectCategory,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ProjectCategoryRequest $request, ProjectCategory $projectCategory): RedirectResponse
    {
        $projectCategory->update($request->validated());

        return redirect()
            ->route('admin.project-categories.index')
            ->with('success', 'プロジェクトカテゴリを更新しました。');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProjectCategory $projectCategory): RedirectResponse
    {
        $projectCategory->delete();

        return redirect()
            ->route('admin.project-categories.index')
            ->with('success', 'プロジェクトカテゴリを削除しました。');
    }
}
