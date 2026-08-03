<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\TaskCategoryRequest;
use App\Models\TaskCategory;
use App\Services\TaskCategoryService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class TaskCategoryController extends Controller
{
    public function __construct(private TaskCategoryService $service) {}

    public function index(): Response
    {
        return Inertia::render('Admin/TaskCategories/Index', [
            'categories' => $this->service->listAll(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/TaskCategories/Create');
    }

    public function store(TaskCategoryRequest $request): RedirectResponse
    {
        $this->service->create($request->validated());

        return redirect()->route('admin.task-category.index')
            ->with('success', __('messages.created', ['attribute' => 'タスクカテゴリ']));
    }

    public function edit(TaskCategory $taskCategory): Response
    {
        return Inertia::render('Admin/TaskCategories/Edit', [
            'category' => $taskCategory,
        ]);
    }

    public function update(TaskCategoryRequest $request, TaskCategory $taskCategory): RedirectResponse
    {
        $this->service->update($taskCategory, $request->validated());

        return redirect()->route('admin.task-category.index')
            ->with('success', __('messages.updated', ['attribute' => 'タスクカテゴリ']));
    }

    public function destroy(TaskCategory $taskCategory): RedirectResponse
    {
        $this->service->delete($taskCategory);

        return redirect()->route('admin.task-category.index')
            ->with('success', __('messages.deleted', ['attribute' => 'タスクカテゴリ']));
    }
}
