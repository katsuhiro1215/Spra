<?php

namespace App\Http\Controllers\Admin\Contract;

use App\Http\Controllers\Controller;
use App\Http\Requests\ContractItemRequest;
use App\Models\Contract;
use App\Models\Service;
use App\Models\ServiceCategory;
use App\Models\ServicePlan;
use App\Services\ContractService;
use App\Services\ServiceCategoryService;
use App\Services\ServiceItemService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContractItemController extends Controller
{
    public function __construct(
        private ContractService $contractService,
        private ServiceCategoryService $serviceCategoryService,
        private ServiceItemService $serviceItemService
    ) {}

    /**
     * 契約明細追加画面
     */
    public function create(string $contractId): Response|RedirectResponse
    {
        $contract = Contract::with([
            'user.profile',
            'company',
            'currentVersion',
            'quote.currentVersion.items'
        ])->findOrFail($contractId);

        // 既に契約明細がある場合は編集画面へリダイレクト
        if ($contract->currentVersion && $contract->currentVersion->items()->exists()) {
            return redirect()->route('admin.contract.items.edit', $contract->id);
        }

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

        // 見積もりから遷移した場合、見積明細を取得
        $quoteItems = [];
        $fromQuote = false;
        if ($contract->quote && $contract->quote->currentVersion) {
            $fromQuote = true;
            $quoteItems = $contract->quote->currentVersion->items->map(function ($item) {
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
            })->toArray();
        }

        return Inertia::render('Admin/Contracts/ContractItems/Create', [
            'contract' => $contract,
            'serviceCategories' => $serviceCategories,
            'services' => $services,
            'serviceItems' => $serviceItems,
            'servicePlans' => $servicePlans,
            'quoteItems' => $quoteItems,
            'fromQuote' => $fromQuote,
            'discount_amount' => $contract->currentVersion->discount_amount ?? 0,
            'tax_rate' => $contract->currentVersion->tax_rate ?? 10,
            'base_amount' => $contract->currentVersion->base_amount ?? 0,
            'tax_amount' => $contract->currentVersion->tax_amount ?? 0,
            'total_amount' => $contract->currentVersion->total_amount ?? 0,
            'custom_specifications' => $contract->currentVersion->custom_specifications ?? "",
        ]);
    }

    /**
     * 契約明細を保存
     */
    public function store(ContractItemRequest $request, string $contractId): RedirectResponse
    {
        $contract = Contract::with('currentVersion')->findOrFail($contractId);

        if (!$contract->currentVersion) {
            return back()->with('error', '現在のバージョンが見つかりません。');
        }

        $validated = $request->validated();

        try {
            $currentVersion = $contract->currentVersion;

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
            $currentVersion->save();

            // 明細を追加
            foreach ($validated['items'] as $itemData) {
                // 選択されていない場合はスキップ
                if (isset($itemData['selected']) && !$itemData['selected']) {
                    continue;
                }

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
            $this->contractService->recalculateVersionAmounts($currentVersion);

            return redirect()->route('admin.contract.show', $contractId)
                ->with('success', '契約明細を追加しました。');
        } catch (\Exception $e) {
            return back()->with('error', '明細の追加に失敗しました: ' . $e->getMessage())
                ->withInput();
        }
    }

    /**
     * 契約明細編集画面
     */
    public function edit(string $contractId): Response
    {
        $contract = Contract::with([
            'user.profile',
            'company',
            'currentVersion.items.service',
            'currentVersion.items.serviceItem',
            'quote.currentVersion.items'
        ])->findOrFail($contractId);

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
        $items = $contract->currentVersion ?
            $contract->currentVersion->items->map(function ($item) {
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
                    'selected' => true,
                ];
            })->toArray() : [];

        // 見積もりから遷移した場合、見積明細を取得
        $quoteItems = [];
        $fromQuote = false;
        if ($contract->quote && $contract->quote->currentVersion) {
            $fromQuote = true;
            $quoteItems = $contract->quote->currentVersion->items->map(function ($item) {
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
            })->toArray();
        }

        return Inertia::render('Admin/Contracts/ContractItems/Edit', [
            'contract' => $contract,
            'items' => $items,
            'serviceCategories' => $serviceCategories,
            'services' => $services,
            'serviceItems' => $serviceItems,
            'servicePlans' => $servicePlans,
            'quoteItems' => $quoteItems,
            'fromQuote' => $fromQuote,
            'discount_amount' => $contract->currentVersion->discount_amount ?? 0,
            'tax_rate' => $contract->currentVersion->tax_rate ?? 10,
            'base_amount' => $contract->currentVersion->base_amount ?? 0,
            'tax_amount' => $contract->currentVersion->tax_amount ?? 0,
            'total_amount' => $contract->currentVersion->total_amount ?? 0,
            'custom_specifications' => $contract->currentVersion->custom_specifications ?? "",
        ]);
    }

    /**
     * 契約明細を更新
     */
    public function update(ContractItemRequest $request, string $contractId): RedirectResponse
    {
        $contract = Contract::with('currentVersion.items')->findOrFail($contractId);

        if (!$contract->currentVersion) {
            return back()->with('error', '現在のバージョンが見つかりません。');
        }

        $validated = $request->validated();

        try {
            $currentVersion = $contract->currentVersion;

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
            $this->contractService->recalculateVersionAmounts($currentVersion);

            return redirect()->route('admin.contract.show', $contractId)
                ->with('success', '契約明細を更新しました。');
        } catch (\Exception $e) {
            return back()->with('error', '明細の更新に失敗しました: ' . $e->getMessage())
                ->withInput();
        }
    }

    /**
     * 契約明細を削除
     */
    public function destroy(string $contractId): RedirectResponse
    {
        $contract = Contract::with('currentVersion.items')->findOrFail($contractId);

        if (!$contract->currentVersion) {
            return back()->with('error', '現在のバージョンが見つかりません。');
        }

        try {
            $currentVersion = $contract->currentVersion;

            // 明細を全て削除
            $currentVersion->items()->delete();

            // 金額を再計算（全て0になる）
            $this->contractService->recalculateVersionAmounts($currentVersion);

            return redirect()->route('admin.contract.show', $contractId)
                ->with('success', '契約明細を削除しました。');
        } catch (\Exception $e) {
            return back()->with('error', '明細の削除に失敗しました: ' . $e->getMessage());
        }
    }
}
