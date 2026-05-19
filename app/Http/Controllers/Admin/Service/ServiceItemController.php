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
      $filters = $request->only(['search', 'status', 'service_id', 'service_plan_id', 'item_type']);
      $sort = [
        'field' => $request->get('sort', 'sort_order'),
        'direction' => $request->get('direction', 'asc')
      ];

      $serviceItems = $this->serviceItemService->getPaginated($filters, $sort, 20);
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
        'sort' => $sort,
      ]);
    } catch (\Exception $e) {
      Log::error('ServiceItem index error: ' . $e->getMessage());
      return Inertia::render('Admin/Service/ServiceItems/Index', [
        'serviceItems' => [],
        'statuses' => [],
        'itemTypes' => [],
        'services' => [],
        'servicePlans' => [],
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
    $statuses = $this->serviceItemService->getStatuses();
    $itemTypes = $this->serviceItemService->getItemTypes();
    $services = $this->serviceService->getActiveForSelect();
    $servicePlans = $this->servicePlanService->getActiveForSelect();

    return Inertia::render('Admin/Service/ServiceItems/Create', [
      'statuses' => $statuses,
      'itemTypes' => $itemTypes,
      'services' => $services,
      'servicePlans' => $servicePlans,
    ]);
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(ServiceItemRequest $request)
  {
    try {
      $this->serviceItemService->createServiceItem($request->validated());

      return redirect()->route('admin.service.service-items.index')
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
      'serviceItem' => $serviceItem->load(['service.serviceCategory', 'servicePlan', 'creator', 'updater']),
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
    $servicePlans = $this->servicePlanService->getActiveForSelect();

    return Inertia::render('Admin/Service/ServiceItems/Edit', [
      'serviceItem' => $serviceItem,
      'statuses' => $statuses,
      'itemTypes' => $itemTypes,
      'services' => $services,
      'servicePlans' => $servicePlans,
    ]);
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(ServiceItemRequest $request, ServiceItem $serviceItem)
  {
    try {
      $this->serviceItemService->updateServiceItem($serviceItem, $request->validated());

      return redirect()->route('admin.service.service-items.index')
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

      return redirect()->route('admin.service.service-items.index')
        ->with('success', 'サービス項目が削除されました。');
    } catch (\Exception $e) {
      Log::error('ServiceItem destroy error: ' . $e->getMessage());
      return redirect()->back()
        ->with('error', $e->getMessage());
    }
  }
}
