<?php

namespace App\Http\Controllers\Admin\Service;

use App\Http\Controllers\Controller;
use App\Models\ServicePlan;
use App\Models\ServiceType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ServicePlanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(ServiceType $serviceType)
    {
        $servicePlans = $serviceType->servicePlans()
            ->with(['serviceType', 'creator'])
            ->ordered()
            ->paginate(15);

        return Inertia::render('Admin/Service/ServicePlans/Index', [
            'serviceType' => $serviceType->load('serviceCategory'),
            'servicePlans' => $servicePlans,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(ServiceType $serviceType)
    {
        return Inertia::render('Admin/Service/ServicePlans/Create', [
            'serviceType' => $serviceType->load('serviceCategory'),
            'billingCycles' => $this->getBillingCycles(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, ServiceType $serviceType)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('service_plans')->where(function ($query) use ($serviceType) {
                    return $query->where('service_type_id', $serviceType->id);
                }),
            ],
            'description' => 'required|string',
            'detailed_description' => 'nullable|string',
            'base_price' => 'required|numeric|min:0',
            'price_unit' => 'nullable|string|max:50',
            'billing_cycle' => 'required|in:one_time,monthly,quarterly,yearly',
            'setup_fee' => 'nullable|numeric|min:0',
            'features' => 'nullable|array',
            'features.*' => 'string',
            'included_items' => 'nullable|array',
            'included_items.*' => 'string',
            'limitations' => 'nullable|array',
            'limitations.*' => 'string',
            'max_revisions' => 'nullable|integer|min:0',
            'estimated_delivery_days' => 'nullable|integer|min:0',
            'is_popular' => 'boolean',
            'is_recommended' => 'boolean',
            'sort_order' => 'nullable|integer|min:0',
            'color' => 'nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'badge_text' => 'nullable|string|max:50',
            'icon' => 'nullable|string|max:100',
        ]);

        try {
            DB::transaction(function () use ($validated, $serviceType, $request) {
                $validated['service_type_id'] = $serviceType->id;
                $validated['created_by'] = Auth::guard('admin')->id();
                $validated['setup_fee'] = $validated['setup_fee'] ?? 0;
                $validated['sort_order'] = $validated['sort_order'] ?? 0;

                // slugが未入力の場合は自動生成
                if (empty($validated['slug'])) {
                    $validated['slug'] = Str::slug($validated['name'] . '-' . $serviceType->id);
                }

                ServicePlan::create($validated);
            });

            return redirect()
                ->route('admin.service.plans.index', $serviceType)
                ->with('success', 'サービスプランを作成しました。');

        } catch (\Exception $e) {
            Log::error('ServicePlan creation error: ' . $e->getMessage());
            return back()
                ->withInput()
                ->with('error', 'サービスプランの作成に失敗しました。');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(ServiceType $serviceType, ServicePlan $servicePlan)
    {
        $servicePlan->load(['serviceType.serviceCategory', 'creator', 'updater']);

        return Inertia::render('Admin/Service/ServicePlans/Show', [
            'serviceType' => $serviceType,
            'servicePlan' => $servicePlan,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ServiceType $serviceType, ServicePlan $servicePlan)
    {
        $servicePlan->load('serviceType');

        return Inertia::render('Admin/Service/ServicePlans/Edit', [
            'serviceType' => $serviceType->load('serviceCategory'),
            'servicePlan' => $servicePlan,
            'billingCycles' => $this->getBillingCycles(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ServiceType $serviceType, ServicePlan $servicePlan)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('service_plans')->where(function ($query) use ($serviceType) {
                    return $query->where('service_type_id', $serviceType->id);
                })->ignore($servicePlan->id),
            ],
            'description' => 'required|string',
            'detailed_description' => 'nullable|string',
            'base_price' => 'required|numeric|min:0',
            'price_unit' => 'nullable|string|max:50',
            'billing_cycle' => 'required|in:one_time,monthly,quarterly,yearly',
            'setup_fee' => 'nullable|numeric|min:0',
            'features' => 'nullable|array',
            'features.*' => 'string',
            'included_items' => 'nullable|array',
            'included_items.*' => 'string',
            'limitations' => 'nullable|array',
            'limitations.*' => 'string',
            'max_revisions' => 'nullable|integer|min:0',
            'estimated_delivery_days' => 'nullable|integer|min:0',
            'is_popular' => 'boolean',
            'is_recommended' => 'boolean',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
            'color' => 'nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'badge_text' => 'nullable|string|max:50',
            'icon' => 'nullable|string|max:100',
        ]);

        try {
            DB::transaction(function () use ($validated, $servicePlan) {
                $validated['updated_by'] = Auth::guard('admin')->id();
                $validated['setup_fee'] = $validated['setup_fee'] ?? 0;
                $validated['sort_order'] = $validated['sort_order'] ?? 0;

                // slugが未入力の場合は自動生成
                if (empty($validated['slug'])) {
                    $validated['slug'] = Str::slug($validated['name'] . '-' . $servicePlan->service_type_id);
                }

                $servicePlan->update($validated);
            });

            return redirect()
                ->route('admin.service.plans.index', $serviceType)
                ->with('success', 'サービスプランを更新しました。');

        } catch (\Exception $e) {
            Log::error('ServicePlan update error: ' . $e->getMessage());
            return back()
                ->withInput()
                ->with('error', 'サービスプランの更新に失敗しました。');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ServiceType $serviceType, ServicePlan $servicePlan)
    {
        try {
            $servicePlan->delete();

            return redirect()
                ->route('admin.service.plans.index', $serviceType)
                ->with('success', 'サービスプランを削除しました。');

        } catch (\Exception $e) {
            Log::error('ServicePlan deletion error: ' . $e->getMessage());
            return back()->with('error', 'サービスプランの削除に失敗しました。');
        }
    }

    /**
     * 複数のサービスプランを一括削除
     */
    public function bulkDestroy(Request $request, ServiceType $serviceType)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:service_plans,id',
        ]);

        try {
            DB::transaction(function () use ($request, $serviceType) {
                ServicePlan::whereIn('id', $request->ids)
                    ->where('service_type_id', $serviceType->id)
                    ->delete();
            });

            return redirect()
                ->route('admin.service.plans.index', $serviceType)
                ->with('success', count($request->ids) . '件のサービスプランを削除しました。');

        } catch (\Exception $e) {
            Log::error('ServicePlan bulk deletion error: ' . $e->getMessage());
            return back()->with('error', 'サービスプランの一括削除に失敗しました。');
        }
    }

    /**
     * 請求サイクルの選択肢を取得
     */
    private function getBillingCycles(): array
    {
        return [
            'one_time' => '一回払い',
            'monthly' => '月額',
            'quarterly' => '四半期',
            'yearly' => '年額',
        ];
    }
}
