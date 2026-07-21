<?php

namespace App\Http\Controllers\Admin\Contract;

use App\Http\Controllers\Controller;
use App\Http\Requests\ContractTemplateRequest;
use App\Models\ContractTemplate;
use App\Services\ContractTemplateService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContractTemplateController extends Controller
{
    public function __construct(
        private ContractTemplateService $service,
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        // is_active("1"/"0") を status(active/inactive) に変換
        $isActive = $request->input('is_active');
        $status = match ($isActive) {
            '1' => 'active',
            '0' => 'inactive',
            default => null,
        };

        $filters = [
            'search' => $request->input('search'),
            'status' => $status,
            'trashed' => $request->input('trashed', 'without_trashed'),
        ];

        $templates = $this->service->getPaginated($filters, [], 20);
        $stats = $this->service->getStats();

        return Inertia::render('Admin/Contracts/Template/Index', [
            'templates' => $templates,
            'filters' => [
                'search' => $filters['search'],
                'is_active' => $isActive,
                'trashed' => $filters['trashed'],
            ],
            'stats' => $stats,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Contracts/Template/Create', []);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ContractTemplateRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['created_by'] = auth('admins')->id();

        $template = $this->service->create($data);

        return redirect()
            ->route('admin.contract.template.show', $template->id)
            ->with('success', 'テンプレートを作成しました。');
    }

    /**
     * Display the specified resource.
     */
    public function show(ContractTemplate $contractTemplate): Response
    {
        return Inertia::render('Admin/Contracts/Template/Show', [
            'template' => $contractTemplate,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ContractTemplate $contractTemplate): Response
    {
        return Inertia::render('Admin/Contracts/Template/Edit', [
            'template' => $contractTemplate,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ContractTemplateRequest $request, ContractTemplate $contractTemplate): RedirectResponse
    {
        $data = $request->validated();
        $data['updated_by'] = auth('admins')->id();

        $this->service->update($contractTemplate, $data);

        return redirect()
            ->route('admin.contract.template.show', $contractTemplate->id)
            ->with('success', 'テンプレートを更新しました。');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ContractTemplate $contractTemplate): RedirectResponse
    {
        $this->service->delete($contractTemplate);

        return redirect()
            ->route('admin.contract.template.index')
            ->with('success', 'テンプレートを削除しました。');
    }
}
