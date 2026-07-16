<?php

namespace App\Http\Controllers\Admin\Service;

use App\Http\Controllers\Controller;
use App\Models\ServiceCategory;
use App\Services\ServiceCategoryService;
use App\Http\Requests\ServiceCategoryRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class ServiceCategoryController extends Controller
{
    public function __construct(
        private ServiceCategoryService $serviceCategoryService
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        try {
            $filters = $request->only(['search', 'status', 'trashed']);
            $sort = [
                'field' => $request->get('sort', 'sort_order'),
                'direction' => $request->get('direction', 'asc')
            ];

            $serviceCategories = $this->serviceCategoryService->getPaginated($filters, $sort, 20);
            $statuses = $this->serviceCategoryService->getStatuses();
            $stats = $this->serviceCategoryService->getServiceCategoryStats();

            return Inertia::render('Admin/ServiceCategories/Index', [
                'serviceCategories' => $serviceCategories,
                'statuses' => $statuses,
                'filters' => $filters,
                'sort' => $sort,
                'stats' => $stats,
            ]);
        } catch (\Exception $e) {
            Log::error('ServiceCategory index error: ' . $e->getMessage());
            return Inertia::render('Admin/ServiceCategories/Index', [
                'serviceCategories' => [],
                'statuses' => [],
                'filters' => [],
                'sort' => [],
                'error' => 'データの取得に失敗しました。'
            ]);
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $statuses = $this->serviceCategoryService->getStatuses();

        return Inertia::render('Admin/ServiceCategories/Create', [
            'statuses' => $statuses,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ServiceCategoryRequest $request)
    {
        try {
            $this->serviceCategoryService->createServiceCategory($request->validated());

            return redirect()->route('admin.service.category.index')
                ->with('success', 'サービスカテゴリが作成されました。');
        } catch (\Exception $e) {
            Log::error('ServiceCategory store error: ' . $e->getMessage());
            return redirect()->back()
                ->withInput()
                ->with('error', 'サービスカテゴリの作成に失敗しました。');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(ServiceCategory $serviceCategory): Response
    {
        return Inertia::render('Admin/ServiceCategories/Show', [
            'serviceCategory' => $serviceCategory->load(['creator', 'updater']),
            'servicesCount' => $serviceCategory->services()->count(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ServiceCategory $serviceCategory): Response
    {
        $statuses = $this->serviceCategoryService->getStatuses();

        return Inertia::render('Admin/ServiceCategories/Edit', [
            'serviceCategory' => $serviceCategory,
            'statuses' => $statuses,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ServiceCategoryRequest $request, ServiceCategory $serviceCategory)
    {
        try {
            $this->serviceCategoryService->updateServiceCategory($serviceCategory, $request->validated());

            return redirect()->route('admin.service.category.index')
                ->with('success', 'サービスカテゴリが更新されました。');
        } catch (\Exception $e) {
            Log::error('ServiceCategory update error: ' . $e->getMessage());
            return redirect()->back()
                ->withInput()
                ->with('error', 'サービスカテゴリの更新に失敗しました。');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ServiceCategory $serviceCategory)
    {
        try {
            $this->serviceCategoryService->deleteServiceCategory($serviceCategory);

            return redirect()->route('admin.service.category.index')
                ->with('success', 'サービスカテゴリが削除されました。');
        } catch (\Exception $e) {
            Log::error('ServiceCategory destroy error: ' . $e->getMessage());
            return redirect()->back()
                ->with('error', $e->getMessage());
        }
    }
}
