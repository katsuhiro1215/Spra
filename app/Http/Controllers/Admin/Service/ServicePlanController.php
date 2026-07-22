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

            return Inertia::render('Admin/ServicePlans/Index', [
                'servicePlans' => $servicePlans,
                'statuses' => $statuses,
                'billingCycles' => $billingCycles,
                'services' => $services,
                'filters' => $filters,
                'sort' => $sort,
            ]);
        } catch (\Exception $e) {
            Log::error('ServicePlan index error: ' . $e->getMessage());
            return Inertia::render('Admin/ServicePlans/Index', [
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

        return Inertia::render('Admin/ServicePlans/Create', [
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
            $validated = $request->validated();
            $servicePlan = $this->servicePlanService->createServicePlan($validated);

            // ServicePlan詳細ページへリダイレクト
            return redirect()->route('admin.service.plan.show', $servicePlan)
                ->with('success', __('messages.created', ['attribute' => 'サービスプラン']));
        } catch (\Exception $e) {
            Log::error('ServicePlan store error: ' . $e->getMessage());
            return redirect()->back()
                ->withInput()
                ->with('error', __('messages.create_failed', ['attribute' => 'サービスプラン']));
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(ServicePlan $servicePlan): Response
    {
        return Inertia::render('Admin/ServicePlans/Show', [
            'servicePlan' => $servicePlan->load([
                'service.serviceCategory',
                'servicePlanItems.serviceItem',
                'creator',
                'updater'
            ]),
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

        return Inertia::render('Admin/ServicePlans/Edit', [
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
            $validated = $request->validated();
            $this->servicePlanService->updateServicePlan($servicePlan, $validated);

            // ServicePlan詳細ページへリダイレクト
            return redirect()->route('admin.service.plan.show', $servicePlan)
                ->with('success', __('messages.updated', ['attribute' => 'サービスプラン']));
        } catch (\Exception $e) {
            Log::error('ServicePlan update error: ' . $e->getMessage());
            return redirect()->back()
                ->withInput()
                ->with('error', __('messages.update_failed', ['attribute' => 'サービスプラン']));
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
                ->with('success', __('messages.deleted', ['attribute' => 'サービスプラン']));
        } catch (\Exception $e) {
            Log::error('ServicePlan destroy error: ' . $e->getMessage());
            return redirect()->back()
                ->with('error', $e->getMessage());
        }
    }
}
