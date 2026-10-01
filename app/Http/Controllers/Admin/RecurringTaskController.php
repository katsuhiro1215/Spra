<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\RecurringTaskRequest;
use App\Models\Admin;
use App\Models\Task;
use App\Services\TaskCategoryService;
use App\Services\TaskService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

/**
 * 繰り返しタスクの設定（テンプレート行）を管理する。
 * テンプレート行はカンバンボードに表示されないため、変更・停止はこの画面から行う。
 */
class RecurringTaskController extends Controller
{
    public function __construct(
        private TaskService $service,
        private TaskCategoryService $categoryService,
    ) {}

    public function index(): Response
    {
        return Inertia::render('Admin/Tasks/Recurring/Index', [
            'templates' => $this->service->getRecurringTemplates(),
            'categories' => $this->categoryService->listAll(),
            'admins' => Admin::where('status', 'active')->orderBy('email')->get(['id', 'email', 'role']),
        ]);
    }

    public function update(RecurringTaskRequest $request, Task $recurringTask): RedirectResponse
    {
        abort_unless($recurringTask->isRecurringTemplate(), 404);

        $validated = $request->validated();
        if (($validated['recurrence_rule']['freq'] ?? null) === 'daily') {
            unset($validated['recurrence_rule']['byweekday']);
        }

        $this->service->updateRecurringTemplate($recurringTask, $validated);

        return redirect()->route('admin.recurring-task.index')
            ->with('success', __('messages.updated', ['attribute' => '繰り返し設定']));
    }

    public function destroy(Task $recurringTask): RedirectResponse
    {
        abort_unless($recurringTask->isRecurringTemplate(), 404);

        $this->service->stopRecurringTemplate($recurringTask);

        return redirect()->route('admin.recurring-task.index')
            ->with('success', "「{$recurringTask->title}」の繰り返しを停止しました。");
    }
}
