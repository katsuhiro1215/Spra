<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\TaskRequest;
use App\Models\Admin;
use App\Models\AiStaffActivityLog;
use App\Models\Task;
use App\Services\AiStaffActivityLogger;
use App\Services\TaskCategoryService;
use App\Services\TaskService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class TaskController extends Controller
{
    private const STATUS_LABELS = [
        'todo' => '未着手',
        'in_progress' => '対応中',
        'review' => 'レビュー待ち',
        'done' => '完了',
    ];

    public function __construct(
        private TaskService $service,
        private TaskCategoryService $categoryService,
        private AiStaffActivityLogger $activityLogger,
    ) {}

    public function index(Request $request): Response
    {
        $filters = [
            'admin_id' => $request->input('admin_id'),
            'task_category_id' => $request->input('task_category_id'),
            'priority' => $request->input('priority'),
            'tag' => trim((string) $request->input('tag')) ?: null,
        ];

        $tasks = $this->service->getForBoard(array_filter($filters));

        return Inertia::render('Admin/Tasks/Index', [
            'tasks' => $tasks,
            'categories' => $this->categoryService->listAll(),
            'admins' => Admin::where('status', 'active')->orderBy('email')->get(['id', 'email', 'role']),
            'filters' => $filters,
        ]);
    }

    public function show(Task $task): Response
    {
        $task->load(['category', 'admin', 'creator']);

        return Inertia::render('Admin/Tasks/Show', [
            'task' => $task,
        ]);
    }

    public function store(TaskRequest $request): RedirectResponse
    {
        $this->service->createTask($request->validated(), Auth::guard('admins')->id());

        return redirect()->route('admin.task.index')
            ->with('success', __('messages.created', ['attribute' => 'タスク']));
    }

    public function update(TaskRequest $request, Task $task): RedirectResponse
    {
        $oldStatus = $task->status;
        $validated = $request->validated();

        $updatedTask = $this->service->update($task, $validated);

        if (
            array_key_exists('status', $validated)
            && $validated['status'] !== $oldStatus
            && $updatedTask->admin
        ) {
            $label = self::STATUS_LABELS[$updatedTask->status] ?? $updatedTask->status;
            $this->activityLogger->log(
                $updatedTask->admin,
                AiStaffActivityLog::ACTION_TASK_STATUS_CHANGED,
                "タスク「{$updatedTask->title}」を「{$label}」に変更",
                $updatedTask
            );
        }

        return redirect()->route('admin.task.index')
            ->with('success', __('messages.updated', ['attribute' => 'タスク']));
    }

    public function updateStatus(Request $request, Task $task): RedirectResponse
    {
        $request->validate(['status' => ['required', Rule::in(Task::STATUSES)]]);

        $status = $request->input('status');
        $oldStatus = $task->status;
        $this->service->updateStatus($task, $status);

        if ($task->admin && $oldStatus !== $status) {
            $label = self::STATUS_LABELS[$status] ?? $status;
            $this->activityLogger->log(
                $task->admin,
                AiStaffActivityLog::ACTION_TASK_STATUS_CHANGED,
                "タスク「{$task->title}」を「{$label}」に変更",
                $task
            );
        }

        return redirect()->back();
    }

    public function destroy(Task $task): RedirectResponse
    {
        $this->service->delete($task);

        return redirect()->route('admin.task.index')
            ->with('success', __('messages.deleted', ['attribute' => 'タスク']));
    }
}
