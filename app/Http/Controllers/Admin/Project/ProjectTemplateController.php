<?php

namespace App\Http\Controllers\Admin\Project;

use App\Http\Controllers\Controller;
use App\Http\Requests\Project\ProjectTemplateRequest;
use App\Models\ProjectTemplate;
use App\Services\ProjectTemplateService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProjectTemplateController extends Controller
{
    public function __construct(
        private ProjectTemplateService $service
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        // フィルター
        $filters = [
            'search' => $request->input('search'),
            'is_active' => $request->input('is_active'),
            'trashed' => $request->input('trashed', 'without_trashed'), // デフォルトは削除されていないもの
        ];
        // ソート
        $sort = [
            'field' => $request->get('sort', 'sort_order'),
            'direction' => $request->get('direction', 'asc')
        ];
        // テンプレートのページネーション取得
        $templates = $this->service->getPaginated($filters, $sort, 20);
        // 統計情報の取得
        $stats = $this->service->getStats($filters);

        return Inertia::render('Admin/Project/Template/Index', [
            'filters' => $filters,
            'sort' => $sort,
            'templates' => $templates,
            'stats' => $stats,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Project/Template/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ProjectTemplateRequest $request)
    {
        $template = $this->service->create($request->validated());

        return redirect()
            ->route('admin.project.template.show', $template->id)
            ->with('success', 'テンプレートを作成しました。');
    }

    /**
     * Display the specified resource.
     */
    public function show(ProjectTemplate $template): Response
    {
        $template->load('milestones');

        return Inertia::render('Admin/Project/Template/Show', [
            'template' => $template,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ProjectTemplate $template): Response
    {
        $template->load('milestones');

        return Inertia::render('Admin/Project/Template/Edit', [
            'template' => $template,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ProjectTemplateRequest $request, ProjectTemplate $template)
    {
        $this->service->update($template, $request->validated());

        return redirect()
            ->route('admin.project.template.show', $template->id)
            ->with('success', 'テンプレートを更新しました。');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProjectTemplate $template)
    {
        $this->service->delete($template);

        return redirect()
            ->route('admin.project.template.index')
            ->with('success', 'テンプレートを削除しました。');
    }
}
