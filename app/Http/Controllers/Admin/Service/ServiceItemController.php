<?php

namespace App\Http\Controllers\Admin\Service;

use App\Http\Controllers\Controller;
use App\Models\ServiceItem;
use App\Services\ServiceItemService;
use App\Services\ServiceService;
use App\Services\ServicePlanService;
use App\Http\Requests\ServiceItemRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class ServiceItemController extends Controller
{
    public function __construct(
        private ServiceItemService $serviceItemService,
        private ServiceService $serviceService,
        private ServicePlanService $servicePlanService
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        try {
            $filters = $request->only(['search', 'status', 'service_id', 'item_type']);

            // Get the query builder with filters
            $query = ServiceItem::query();

            // Apply filters
            if (!empty($filters['search'])) {
                $query->where('name', 'like', '%' . $filters['search'] . '%');
            }
            if (!empty($filters['status'])) {
                $query->where('status', $filters['status']);
            }
            if (!empty($filters['service_id'])) {
                $query->where('service_id', $filters['service_id']);
            }
            if (!empty($filters['item_type'])) {
                $query->where('item_type', $filters['item_type']);
            }

            // Paginate results
            $serviceItems = $query->orderBy('sort_order', 'asc')->paginate(20);

            $statuses = $this->serviceItemService->getStatuses();
            $itemTypes = $this->serviceItemService->getItemTypes();
            $services = $this->serviceService->getActiveForSelect();
            $servicePlans = $this->servicePlanService->getActiveForSelect();

            return Inertia::render('Admin/Service/ServiceItems/Index', [
                'serviceItems' => $serviceItems,
                'statuses' => $statuses,
                'itemTypes' => $itemTypes,
                'services' => $services,
                'servicePlans' => $servicePlans,
                'filters' => $filters,
            ]);
        } catch (\Exception $e) {
            Log::error('ServiceItem index error: ' . $e->getMessage());
            return Inertia::render('Admin/Service/ServiceItems/Index', [
                'serviceItems' => ['data' => []],
                'statuses' => [],
                'itemTypes' => [],
                'services' => [],
                'servicePlans' => [],
                'filters' => [],
                'error' => 'データの取得に失敗しました。'
            ]);
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request): Response
    {
        $statuses = $this->serviceItemService->getStatuses();
        $itemTypes = $this->serviceItemService->getItemTypes();
        $services = $this->serviceService->getActiveForSelect();

        return Inertia::render('Admin/Service/ServiceItems/Create', [
            'statuses' => $statuses,
            'itemTypes' => $itemTypes,
            'services' => $services,
            'service_id' => $request->query('service_id'),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ServiceItemRequest $request)
    {
        try {
            $this->serviceItemService->createServiceItem($request->validated());

            return redirect()->route('admin.service.item.index')
                ->with('success', 'サービス項目が作成されました。');
        } catch (\Exception $e) {
            Log::error('ServiceItem store error: ' . $e->getMessage());
            return redirect()->back()
                ->withInput()
                ->with('error', 'サービス項目の作成に失敗しました。');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(ServiceItem $serviceItem): Response
    {
        return Inertia::render('Admin/Service/ServiceItems/Show', [
            'serviceItem' => $serviceItem->load(['service.serviceCategory', 'servicePlans', 'creator', 'updater']),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ServiceItem $serviceItem): Response
    {
        $statuses = $this->serviceItemService->getStatuses();
        $itemTypes = $this->serviceItemService->getItemTypes();
        $services = $this->serviceService->getActiveForSelect();

        return Inertia::render('Admin/Service/ServiceItems/Edit', [
            'serviceItem' => $serviceItem,
            'statuses' => $statuses,
            'itemTypes' => $itemTypes,
            'services' => $services,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ServiceItemRequest $request, ServiceItem $serviceItem)
    {
        try {
            $this->serviceItemService->updateServiceItem($serviceItem, $request->validated());

            return redirect()->route('admin.service.item.index')
                ->with('success', 'サービス項目が更新されました。');
        } catch (\Exception $e) {
            Log::error('ServiceItem update error: ' . $e->getMessage());
            return redirect()->back()
                ->withInput()
                ->with('error', 'サービス項目の更新に失敗しました。');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ServiceItem $serviceItem)
    {
        try {
            $this->serviceItemService->deleteServiceItem($serviceItem);

            return redirect()->route('admin.service.item.index')
                ->with('success', 'サービス項目が削除されました。');
        } catch (\Exception $e) {
            Log::error('ServiceItem destroy error: ' . $e->getMessage());
            return redirect()->back()
                ->with('error', $e->getMessage());
        }
    }
}
