<?php

namespace App\Http\Controllers\Admin\Service;

use App\Http\Controllers\Controller;
use App\Models\PlanPricing;
use App\Models\ServicePlan;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Inertia\Response;

class PlanPricingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, ServicePlan $servicePlan): Response
    {
        $query = $servicePlan->planPricings()
            ->with(['creator', 'updater'])
            ->orderBy('sort_order')
            ->orderBy('created_at');

        // 検索フィルター
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('display_name', 'like', "%{$search}%");
            });
        }

        // タイプフィルター
        if ($request->filled('type')) {
            $query->where('type', $request->get('type'));
        }

        // 課金タイプフィルター
        if ($request->filled('billing_type')) {
            $query->where('billing_type', $request->get('billing_type'));
        }

        // ステータスフィルター
        if ($request->filled('status')) {
            $status = $request->get('status');
            switch ($status) {
                case 'active':
                    $query->where('is_active', true);
                    break;
                case 'inactive':
                    $query->where('is_active', false);
                    break;
                case 'visible':
                    $query->where('is_visible', true);
                    break;
                case 'hidden':
                    $query->where('is_visible', false);
                    break;
                case 'default':
                    $query->where('is_default', true);
                    break;
                case 'featured':
                    $query->where('is_featured', true);
                    break;
            }
        }

        $planPricings = $query->paginate(15)->withQueryString();

        // 統計情報
        $stats = [
            'total' => $servicePlan->planPricings()->count(),
            'active' => $servicePlan->planPricings()->where('is_active', true)->count(),
            'visible' => $servicePlan->planPricings()->where('is_visible', true)->count(),
            'default' => $servicePlan->planPricings()->where('is_default', true)->count(),
            'featured' => $servicePlan->planPricings()->where('is_featured', true)->count(),
        ];

        return Inertia::render('Admin/Service/PlanPricing/Index', [
            'servicePlan' => $servicePlan->load('serviceType'),
            'planPricings' => $planPricings,
            'stats' => $stats,
            'filters' => $request->only(['search', 'type', 'billing_type', 'status']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(ServicePlan $servicePlan): Response
    {
        return Inertia::render('Admin/Service/PlanPricing/Create', [
            'servicePlan' => $servicePlan->load('serviceType'),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, ServicePlan $servicePlan): RedirectResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:base,addon,discount,tier',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'price_unit' => 'nullable|string|max:50',
            'billing_type' => 'required|string|in:fixed,per_unit,tiered,volume',
            'min_quantity' => 'nullable|numeric|min:0',
            'max_quantity' => 'nullable|numeric|min:0|gte:min_quantity',
            'tier_rules' => 'nullable|array',
            'tier_start_quantity' => 'nullable|numeric|min:0',
            'tier_end_quantity' => 'nullable|numeric|min:0',
            'discount_percentage' => 'nullable|numeric|min:0|max:100',
            'discount_amount' => 'nullable|numeric|min:0',
            'discount_start_date' => 'nullable|date',
            'discount_end_date' => 'nullable|date|after_or_equal:discount_start_date',
            'conditions' => 'nullable|array',
            'requires_approval' => 'boolean',
            'approval_notes' => 'nullable|string',
            'is_default' => 'boolean',
            'is_negotiable' => 'boolean',
            'is_recurring' => 'boolean',
            'recurring_months' => 'nullable|integer|min:1',
            'is_visible' => 'boolean',
            'is_featured' => 'boolean',
            'sort_order' => 'nullable|integer|min:0',
            'display_name' => 'nullable|string|max:255',
            'is_active' => 'boolean',
            'effective_from' => 'nullable|date',
            'effective_until' => 'nullable|date|after_or_equal:effective_from',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        $data = $validator->validated();
        $data['service_plan_id'] = $servicePlan->id;
        $data['created_by'] = Auth::guard('admin')->id();
        $data['updated_by'] = Auth::guard('admin')->id();

        // デフォルト設定の処理
        if ($data['is_default'] ?? false) {
            $servicePlan->planPricings()->update(['is_default' => false]);
        }

        $planPricing = PlanPricing::create($data);

        return redirect()
            ->route('admin.service.plans.pricing.index', $servicePlan)
            ->with('success', '価格設定を作成しました。');
    }

    /**
     * Display the specified resource.
     */
    public function show(ServicePlan $servicePlan, PlanPricing $pricing): Response
    {
        $pricing->load(['creator', 'updater']);

        return Inertia::render('Admin/Service/PlanPricing/Show', [
            'servicePlan' => $servicePlan->load('serviceType'),
            'planPricing' => $pricing,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ServicePlan $servicePlan, PlanPricing $pricing): Response
    {
        return Inertia::render('Admin/Service/PlanPricing/Edit', [
            'servicePlan' => $servicePlan->load('serviceType'),
            'planPricing' => $pricing,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ServicePlan $servicePlan, PlanPricing $pricing): RedirectResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:base,addon,discount,tier',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'price_unit' => 'nullable|string|max:50',
            'billing_type' => 'required|string|in:fixed,per_unit,tiered,volume',
            'min_quantity' => 'nullable|numeric|min:0',
            'max_quantity' => 'nullable|numeric|min:0|gte:min_quantity',
            'tier_rules' => 'nullable|array',
            'tier_start_quantity' => 'nullable|numeric|min:0',
            'tier_end_quantity' => 'nullable|numeric|min:0',
            'discount_percentage' => 'nullable|numeric|min:0|max:100',
            'discount_amount' => 'nullable|numeric|min:0',
            'discount_start_date' => 'nullable|date',
            'discount_end_date' => 'nullable|date|after_or_equal:discount_start_date',
            'conditions' => 'nullable|array',
            'requires_approval' => 'boolean',
            'approval_notes' => 'nullable|string',
            'is_default' => 'boolean',
            'is_negotiable' => 'boolean',
            'is_recurring' => 'boolean',
            'recurring_months' => 'nullable|integer|min:1',
            'is_visible' => 'boolean',
            'is_featured' => 'boolean',
            'sort_order' => 'nullable|integer|min:0',
            'display_name' => 'nullable|string|max:255',
            'is_active' => 'boolean',
            'effective_from' => 'nullable|date',
            'effective_until' => 'nullable|date|after_or_equal:effective_from',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        $data = $validator->validated();
        $data['updated_by'] = Auth::guard('admin')->id();

        // デフォルト設定の処理
        if ($data['is_default'] ?? false) {
            $servicePlan->planPricings()
                ->where('id', '!=', $pricing->id)
                ->update(['is_default' => false]);
        }

        $pricing->update($data);

        return redirect()
            ->route('admin.service.plans.pricing.show', [$servicePlan, $pricing])
            ->with('success', '価格設定を更新しました。');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ServicePlan $servicePlan, PlanPricing $pricing): RedirectResponse
    {
        $pricing->delete();

        return redirect()
            ->route('admin.service.plans.pricing.index', $servicePlan)
            ->with('success', '価格設定を削除しました。');
    }

    /**
     * Bulk delete plan pricings
     */
    public function bulkDelete(Request $request, ServicePlan $servicePlan): RedirectResponse
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:plan_pricings,id',
        ]);

        $count = PlanPricing::whereIn('id', $request->ids)
            ->where('service_plan_id', $servicePlan->id)
            ->delete();

        return redirect()
            ->route('admin.service.plans.pricing.index', $servicePlan)
            ->with('success', "{$count}件の価格設定を削除しました。");
    }

    /**
     * Toggle active status
     */
    public function toggleActive(ServicePlan $servicePlan, PlanPricing $pricing): RedirectResponse
    {
        $pricing->update([
            'is_active' => !$pricing->is_active,
            'updated_by' => Auth::guard('admin')->id(),
        ]);

        $status = $pricing->is_active ? 'アクティブ' : '非アクティブ';

        return redirect()->back()
            ->with('success', "価格設定を{$status}にしました。");
    }

    /**
     * Set as default pricing
     */
    public function setDefault(ServicePlan $servicePlan, PlanPricing $pricing): RedirectResponse
    {
        // 他の価格設定のデフォルトを解除
        $servicePlan->planPricings()->update(['is_default' => false]);

        // 指定された価格設定をデフォルトに設定
        $pricing->update([
            'is_default' => true,
            'updated_by' => Auth::guard('admin')->id(),
        ]);

        return redirect()->back()
            ->with('success', 'デフォルト価格設定に設定しました。');
    }

    /**
     * Calculate price for given quantity
     */
    public function calculatePrice(Request $request, ServicePlan $servicePlan, PlanPricing $pricing)
    {
        $request->validate([
            'quantity' => 'required|numeric|min:0',
        ]);

        $quantity = $request->get('quantity', 1);
        $calculatedPrice = $pricing->calculatePrice($quantity);

        return response()->json([
            'quantity' => $quantity,
            'unit_price' => $pricing->discounted_price,
            'total_price' => $calculatedPrice,
            'formatted_total_price' => '¥' . number_format($calculatedPrice),
            'billing_type' => $pricing->billing_type,
            'billing_type_label' => $pricing->getBillingTypeLabel(),
        ]);
    }
}
