<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Services\TaskCategoryService;
use App\Services\TaskService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * 完了済みタスクの月別アーカイブ。カンバンの完了列に出なくなった過去の完了タスクを確認する。
 */
class CompletedTaskController extends Controller
{
    public function __construct(
        private TaskService $service,
        private TaskCategoryService $categoryService,
    ) {}

    public function index(Request $request): Response
    {
        $request->validate([
            'month' => ['nullable', 'date_format:Y-m'],
            'keyword' => ['nullable', 'string', 'max:100'],
        ]);

        $month = $request->input('month') ?: now()->format('Y-m');
        $filters = [
            'admin_id' => $request->input('admin_id'),
            'task_category_id' => $request->input('task_category_id'),
            'keyword' => trim((string) $request->input('keyword')) ?: null,
        ];

        return Inertia::render('Admin/Tasks/Completed/Index', [
            'month' => $month,
            'tasks' => $this->service->getCompletedInMonth($month, array_filter($filters)),
            'monthlyCounts' => $this->service->getCompletedMonthlyCounts([]),
            'categories' => $this->categoryService->listAll(),
            'admins' => Admin::where('status', 'active')->orderBy('email')->get(['id', 'email', 'role']),
            'filters' => $filters,
        ]);
    }
}
