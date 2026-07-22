<?php

namespace App\Http\Controllers\Admin\Quote;

use App\Http\Controllers\Controller;
use App\Http\Requests\QuoteItemRequest;
use App\Models\Quote;
use App\Models\Service;
use App\Models\ServiceCategory;
use App\Models\ServicePlan;
use App\Services\CampaignService;
use App\Services\QuoteService;
use App\Services\ServiceCategoryService;
use App\Services\ServiceItemService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class QuoteItemController extends Controller
{
    public function __construct(
        private QuoteService $quoteService,
        private ServiceCategoryService $serviceCategoryService,
        private ServiceItemService $serviceItemService,
        private CampaignService $campaignService
    ) {}

    /**
     * 見積明細追加画面
     */
    public function create(Quote $quote): Response|RedirectResponse
    {
        $quote = Quote::with([
            'user.profile',
            'company',
            'currentVersion',
            'contact'
        ])->findOrFail($quote->id);

        // 既に見積明細がある場合は編集画面へリダイレクト
        if ($quote->currentVersion && $quote->currentVersion->items()->exists()) {
            return redirect()->route('admin.quote.item.edit', $quote->id);
        }

        // サービスカテゴリ、Service、ServiceItemを取得
        $serviceCategories = $this->serviceCategoryService->getActiveForSelect();
        $services = Service::where('status', 'active')
            ->orderBy('name')
            ->select('id', 'name', 'service_category_id')
            ->get();
        $serviceItems = $this->serviceItemService->getActiveForQuote();

        // ServicePlansを取得（serviceItemsとピボットデータをeager loadする）
        $servicePlans = ServicePlan::where('status', 'active')
            ->with([
                'serviceItems' => function ($query) {
                    $query->select('service_items.id', 'service_items.name', 'service_items.description', 'service_items.standard_price', 'service_items.item_type')
                        ->withPivot('quantity', 'estimated_days', 'sort_order')
                        ->orderBy('service_plan_items.sort_order');
                }
            ])
            ->select('id', 'name', 'service_id', 'description', 'base_price')
            ->orderBy('sort_order')
            ->get()
            ->map(function ($plan) {
                return [
                    'id' => $plan->id,
                    'name' => $plan->name,
                    'service_id' => $plan->service_id,
                    'description' => $plan->description,
                    'base_price' => $plan->base_price,
                    'service_items' => $plan->serviceItems->map(function ($item) {
                        return [
                            'id' => $item->id,
                            'name' => $item->name,
                            'description' => $item->description,
                            'standard_price' => $item->standard_price,
                            'item_type' => $item->item_type,
                            'quantity' => $item->pivot->quantity,
                            'estimated_days' => $item->pivot->estimated_days,
                        ];
                    })->toArray(),
                ];
            });

        return Inertia::render('Admin/QuoteItems/Create', [
            'quote' => $quote,
            'serviceCategories' => $serviceCategories,
            'services' => $services,
            'serviceItems' => $serviceItems,
            'servicePlans' => $servicePlans,
            'campaigns' => $this->campaignService->getActiveForSelect(),
            'discount_amount' => $quote->currentVersion->discount_amount ?? 0,
            'campaign_id' => $quote->currentVersion->campaign_id ?? '',
            'service_plan_id' => $quote->currentVersion->service_plan_id ?? '',
            'tax_rate' => $quote->currentVersion->tax_rate ?? 10,
            'base_amount' => $quote->currentVersion->base_amount ?? 0,
            'tax_amount' => $quote->currentVersion->tax_amount ?? 0,
            'total_amount' => $quote->currentVersion->total_amount ?? 0,
            'custom_specifications' => $quote->currentVersion->custom_specifications ?? "",
        ]);
    }

    /**
     * 見積明細を保存
     */
    public function store(QuoteItemRequest $request, string $quoteId): RedirectResponse
    {
        $quote = Quote::with('currentVersion')->findOrFail($quoteId);

        if (!$quote->currentVersion) {
            return back()->with('error', __('messages.not_found', ['attribute' => '現在のバージョン']));
        }

        $validated = $request->validated();

        try {
            $currentVersion = $quote->currentVersion;

            // discount_amount、tax_rate、custom_specifications を更新（提供されている場合）
            if (isset($validated['discount_amount'])) {
                $currentVersion->discount_amount = $validated['discount_amount'];
            }
            if (isset($validated['tax_rate'])) {
                $currentVersion->tax_rate = $validated['tax_rate'];
            }
            if (isset($validated['custom_specifications'])) {
                $currentVersion->custom_specifications = $validated['custom_specifications'];
            }
            $campaignId = array_key_exists('campaign_id', $validated) ? ($validated['campaign_id'] ?: null) : $currentVersion->campaign_id;
            $servicePlanId = array_key_exists('service_plan_id', $validated) ? ($validated['service_plan_id'] ?: null) : $currentVersion->service_plan_id;

            // キャンペーンやプランの選択自体が変わる場合のみ適用可否を再検証する
            // （無関係な明細の編集のたびに、他の見積の消費によって事後的に対象外になったキャンペーンでエラーになるのを防ぐ）
            if ($campaignId !== $currentVersion->campaign_id || $servicePlanId !== $currentVersion->service_plan_id) {
                $this->quoteService->assertCampaignEligible($campaignId, $servicePlanId);
            }

            $currentVersion->campaign_id = $campaignId;
            $currentVersion->service_plan_id = $servicePlanId;
            $currentVersion->save();

            // 明細を追加
            foreach ($validated['items'] as $itemData) {
                // 金額計算
                $quantity = (float)$itemData['quantity'];
                $unitPrice = (float)$itemData['unit_price'];
                $amount = $quantity * $unitPrice;

                $currentVersion->items()->create([
                    'service_id' => $itemData['service_id'],
                    'service_item_id' => $itemData['service_item_id'],
                    'name' => $itemData['name'],
                    'description' => $itemData['description'] ?? null,
                    'item_type' => $itemData['item_type'] ?? null,
                    'billing_type' => $itemData['billing_type'],
                    'quantity' => $quantity,
                    'unit_price' => $unitPrice,
                    'amount' => $amount,
                    'estimated_days' => $itemData['estimated_days'] ?? null,
                    'sort_order' => $itemData['sort_order'] ?? 0,
                ]);
            }

            // 金額を再計算
            $this->quoteService->recalculateVersionAmounts($currentVersion);

            return redirect()->route('admin.quote.show', $quoteId)
                ->with('success', __('messages.added', ['attribute' => '見積明細']));
        } catch (\Exception $e) {
            return back()->with('error', __('messages.action_failed_detail', ['attribute' => '明細の追加', 'message' => $e->getMessage()]))
                ->withInput();
        }
    }

    /**
     * 見積明細編集画面
     */
    public function edit(Quote $quote): Response
    {
        $quote->load([
            'user.profile',
            'company',
            'currentVersion.items.service',
            'currentVersion.items.serviceItem',
        ]);

        // サービスカテゴリ、Service、ServiceItemを取得
        $serviceCategories = $this->serviceCategoryService->getActiveForSelect();
        $services = Service::where('status', 'active')
            ->orderBy('name')
            ->select('id', 'name', 'service_category_id')
            ->get();
        $serviceItems = $this->serviceItemService->getActiveForQuote();

        // ServicePlansを取得
        $servicePlans = ServicePlan::where('status', 'active')
            ->with([
                'serviceItems' => function ($query) {
                    $query->select('service_items.id', 'service_items.name', 'service_items.description', 'service_items.standard_price', 'service_items.item_type')
                        ->withPivot('quantity', 'estimated_days', 'sort_order')
                        ->orderBy('service_plan_items.sort_order');
                }
            ])
            ->select('id', 'name', 'service_id', 'description', 'base_price')
            ->orderBy('sort_order')
            ->get()
            ->map(function ($plan) {
                return [
                    'id' => $plan->id,
                    'name' => $plan->name,
                    'service_id' => $plan->service_id,
                    'description' => $plan->description,
                    'base_price' => $plan->base_price,
                    'service_items' => $plan->serviceItems->map(function ($item) {
                        return [
                            'id' => $item->id,
                            'name' => $item->name,
                            'description' => $item->description,
                            'standard_price' => $item->standard_price,
                            'item_type' => $item->item_type,
                            'quantity' => $item->pivot->quantity,
                            'estimated_days' => $item->pivot->estimated_days,
                        ];
                    })->toArray(),
                ];
            });

        // 既存の明細を取得
        $items = $quote->currentVersion ?
            $quote->currentVersion->items->map(function ($item) {
                return [
                    'service_id' => $item->service_id,
                    'service_item_id' => $item->service_item_id,
                    'name' => $item->name,
                    'description' => $item->description,
                    'item_type' => $item->item_type,
                    'billing_type' => $item->billing_type,
                    'quantity' => $item->quantity,
                    'unit_price' => $item->unit_price,
                    'amount' => $item->amount,
                    'estimated_days' => $item->estimated_days,
                    'sort_order' => $item->sort_order,
                ];
            })->toArray() : [];

        return Inertia::render('Admin/QuoteItems/Edit', [
            'quote' => $quote,
            'items' => $items,
            'serviceCategories' => $serviceCategories,
            'services' => $services,
            'serviceItems' => $serviceItems,
            'servicePlans' => $servicePlans,
            'campaigns' => $this->campaignService->getActiveForSelect(),
            'discount_amount' => $quote->currentVersion->discount_amount ?? 0,
            'campaign_id' => $quote->currentVersion->campaign_id ?? '',
            'service_plan_id' => $quote->currentVersion->service_plan_id ?? '',
            'tax_rate' => $quote->currentVersion->tax_rate ?? 10,
            'base_amount' => $quote->currentVersion->base_amount ?? 0,
            'tax_amount' => $quote->currentVersion->tax_amount ?? 0,
            'total_amount' => $quote->currentVersion->total_amount ?? 0,
            'custom_specifications' => $quote->currentVersion->custom_specifications ?? "",
        ]);
    }

    /**
     * 見積明細を更新
     */
    public function update(QuoteItemRequest $request, Quote $quote): RedirectResponse
    {
        $quote->load('currentVersion.items');

        if (!$quote->currentVersion) {
            return back()->with('error', __('messages.not_found', ['attribute' => '現在のバージョン']));
        }

        $validated = $request->validated();

        try {
            $currentVersion = $quote->currentVersion;

            // discount_amount、tax_rate、custom_specifications を更新（提供されている場合）
            if (isset($validated['discount_amount'])) {
                $currentVersion->discount_amount = $validated['discount_amount'];
            }
            if (isset($validated['tax_rate'])) {
                $currentVersion->tax_rate = $validated['tax_rate'];
            }
            if (isset($validated['custom_specifications'])) {
                $currentVersion->custom_specifications = $validated['custom_specifications'];
            }
            $campaignId = array_key_exists('campaign_id', $validated) ? ($validated['campaign_id'] ?: null) : $currentVersion->campaign_id;
            $servicePlanId = array_key_exists('service_plan_id', $validated) ? ($validated['service_plan_id'] ?: null) : $currentVersion->service_plan_id;

            // キャンペーンやプランの選択自体が変わる場合のみ適用可否を再検証する
            // （無関係な明細の編集のたびに、他の見積の消費によって事後的に対象外になったキャンペーンでエラーになるのを防ぐ）
            if ($campaignId !== $currentVersion->campaign_id || $servicePlanId !== $currentVersion->service_plan_id) {
                $this->quoteService->assertCampaignEligible($campaignId, $servicePlanId);
            }

            $currentVersion->campaign_id = $campaignId;
            $currentVersion->service_plan_id = $servicePlanId;
            $currentVersion->save();

            // 既存の明細を全て削除
            $currentVersion->items()->delete();

            // 新しい明細を追加
            foreach ($validated['items'] as $itemData) {
                $quantity = (float)$itemData['quantity'];
                $unitPrice = (float)$itemData['unit_price'];
                $amount = $quantity * $unitPrice;

                $currentVersion->items()->create([
                    'service_id' => $itemData['service_id'],
                    'service_item_id' => $itemData['service_item_id'],
                    'name' => $itemData['name'],
                    'description' => $itemData['description'] ?? null,
                    'item_type' => $itemData['item_type'] ?? null,
                    'billing_type' => $itemData['billing_type'],
                    'quantity' => $quantity,
                    'unit_price' => $unitPrice,
                    'amount' => $amount,
                    'estimated_days' => $itemData['estimated_days'] ?? null,
                    'sort_order' => $itemData['sort_order'] ?? 0,
                ]);
            }

            // 金額を再計算
            $this->quoteService->recalculateVersionAmounts($currentVersion);

            return redirect()->route('admin.quote.show', $quote->id)
                ->with('success', __('messages.updated', ['attribute' => '見積明細']));
        } catch (\Exception $e) {
            return back()->with('error', __('messages.action_failed_detail', ['attribute' => '明細の更新', 'message' => $e->getMessage()]))
                ->withInput();
        }
    }

    /**
     * 見積明細を削除
     */
    public function destroy(Quote $quote): RedirectResponse
    {
        $quote->load('currentVersion.items');

        if (!$quote->currentVersion) {
            return back()->with('error', __('messages.not_found', ['attribute' => '現在のバージョン']));
        }

        try {
            $currentVersion = $quote->currentVersion;

            // 明細を全て削除
            $currentVersion->items()->delete();

            // 金額を再計算（全て0になる）
            $this->quoteService->recalculateVersionAmounts($currentVersion);

            return redirect()->route('admin.quote.show', $quote->id)
                ->with('success', __('messages.deleted', ['attribute' => '見積明細']));
        } catch (\Exception $e) {
            return back()->with('error', __('messages.action_failed_detail', ['attribute' => '明細の削除', 'message' => $e->getMessage()]));
        }
    }
}
