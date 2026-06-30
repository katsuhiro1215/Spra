<?php

namespace App\Http\Controllers\Admin\Service;

use App\Http\Controllers\Controller;
use App\Models\ServicePlan;
use App\Services\ServicePlanService;
use App\Services\ServiceService;
use App\Http\Requests\ServicePlanRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class ServicePlanController extends Controller
{
    public function __construct(
        private ServicePlanService $servicePlanService,
        private ServiceService $serviceService
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        try {
            $filters = $request->only(['search', 'status', 'service_id', 'is_featured']);
            $sort = [
                'field' => $request->get('sort', 'sort_order'),
                'direction' => $request->get('direction', 'asc')
            ];

            $servicePlans = $this->servicePlanService->getPaginated($filters, $sort, 20);
            $statuses = $this->servicePlanService->getStatuses();
            $billingCycles = $this->servicePlanService->getBillingCycles();
            $services = $this->serviceService->getActiveForSelect();

            return Inertia::render('Admin/Service/ServicePlans/Index', [
                'servicePlans' => $servicePlans,
                'statuses' => $statuses,
                'billingCycles' => $billingCycles,
                'services' => $services,
                'filters' => $filters,
                'sort' => $sort,
            ]);
        } catch (\Exception $e) {
            Log::error('ServicePlan index error: ' . $e->getMessage());
            return Inertia::render('Admin/Service/ServicePlans/Index', [
                'servicePlans' => [],
                'statuses' => [],
                'billingCycles' => [],
                'services' => [],
                'filters' => [],
                'sort' => [],
                'error' => 'データの取得に失敗しました。'
            ]);
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request): Response
    {
        $statuses = $this->servicePlanService->getStatuses();
        $billingCycles = $this->servicePlanService->getBillingCycles();
        $services = $this->serviceService->getActiveForSelect();

        return Inertia::render('Admin/Service/ServicePlans/Create', [
            'statuses' => $statuses,
            'billingCycles' => $billingCycles,
            'services' => $services,
            'service_id' => $request->query('service_id'),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ServicePlanRequest $request)
    {
        try {
            $this->servicePlanService->createServicePlan($request->validated());
            $service = $request->service_id;

            return redirect()->route('admin.service.show', $service)
                ->with('success', 'サービスプランが作成されました。');
        } catch (\Exception $e) {
            Log::error('ServicePlan store error: ' . $e->getMessage());
            return redirect()->back()
                ->withInput()
                ->with('error', 'サービスプランの作成に失敗しました。');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(ServicePlan $servicePlan): Response
    {
        return Inertia::render('Admin/Service/ServicePlans/Show', [
            'servicePlan' => $servicePlan->load(['service.serviceCategory', 'serviceItems', 'creator', 'updater']),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ServicePlan $servicePlan): Response
    {
        $statuses = $this->servicePlanService->getStatuses();
        $billingCycles = $this->servicePlanService->getBillingCycles();
        $services = $this->serviceService->getActiveForSelect();

        return Inertia::render('Admin/Service/ServicePlans/Edit', [
            'servicePlan' => $servicePlan,
            'statuses' => $statuses,
            'billingCycles' => $billingCycles,
            'services' => $services,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ServicePlanRequest $request, ServicePlan $servicePlan)
    {
        try {
            $this->servicePlanService->updateServicePlan($servicePlan, $request->validated());
            $service = $request->service_id;

            return redirect()->route('admin.service.show', $service)
                ->with('success', 'サービスプランが更新されました。');
        } catch (\Exception $e) {
            Log::error('ServicePlan update error: ' . $e->getMessage());
            return redirect()->back()
                ->withInput()
                ->with('error', 'サービスプランの更新に失敗しました。');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ServicePlan $servicePlan)
    {
        try {
            $this->servicePlanService->deleteServicePlan($servicePlan);
            $service = $servicePlan->service_id;

            return redirect()->route('admin.service.show', $service)
                ->with('success', 'サービスプランが削除されました。');
        } catch (\Exception $e) {
            Log::error('ServicePlan destroy error: ' . $e->getMessage());
            return redirect()->back()
                ->with('error', $e->getMessage());
        }
    }
}
