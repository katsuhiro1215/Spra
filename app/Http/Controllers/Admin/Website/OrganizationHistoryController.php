<?php

namespace App\Http\Controllers\Admin\Website;

use App\Http\Controllers\Controller;
use App\Http\Requests\Website\OrganizationHistoryRequest;
use App\Models\Organization;
use App\Models\OrganizationHistory;
use App\Services\OrganizationHistoryService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrganizationHistoryController extends Controller
{
    public function __construct(private OrganizationHistoryService $historyService)
    {
    }

    /**
     * 自社組織情報（シングルトン）を取得、なければ空レコードを作成
     */
    private function resolveOrganization(): Organization
    {
        return Organization::query()->firstOrCreate([], ['name' => '未設定']);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $organization = $this->resolveOrganization();

        $filters = [
            'search' => $request->input('search'),
            'organization_id' => $organization->id,
        ];

        $sort = [
            'field' => $request->input('sort_field', 'sort_order'),
            'direction' => $request->input('sort_direction', 'asc'),
        ];

        $histories = OrganizationHistory::where('organization_id', $organization->id)
            ->when($filters['search'], function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'LIKE', "%{$search}%")
                        ->orWhere('description', 'LIKE', "%{$search}%");
                });
            })
            ->orderBy($sort['field'], $sort['direction'])
            ->paginate(20)
            ->withQueryString();

        $stats = $this->historyService->getStats();

        return Inertia::render('Admin/Organization/History/Index', [
            'histories' => $histories,
            'stats' => $stats,
            'filters' => $filters,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Organization/History/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(OrganizationHistoryRequest $request): RedirectResponse
    {
        try {
            $organization = $this->resolveOrganization();
            $data = $request->validated();
            $data['organization_id'] = $organization->id;

            $this->historyService->createHistory($data);

            return redirect()
                ->route('admin.organization.history.index')
                ->with('success', __('messages.created', ['attribute' => '沿革']));
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withInput()
                ->withErrors(['error' => '沿革の作成に失敗しました。']);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(OrganizationHistory $history): Response
    {
        return Inertia::render('Admin/Organization/History/Edit', [
            'history' => $history,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(OrganizationHistoryRequest $request, OrganizationHistory $history): RedirectResponse
    {
        try {
            $this->historyService->updateHistory($history, $request->validated());

            return redirect()
                ->route('admin.organization.history.index')
                ->with('success', __('messages.updated', ['attribute' => '沿革']));
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withInput()
                ->withErrors(['error' => '沿革の更新に失敗しました。']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(OrganizationHistory $history): RedirectResponse
    {
        try {
            $this->historyService->deleteHistory($history);

            return redirect()
                ->route('admin.organization.history.index')
                ->with('success', __('messages.deleted', ['attribute' => '沿革']));
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withErrors(['error' => $e->getMessage()]);
        }
    }
}
