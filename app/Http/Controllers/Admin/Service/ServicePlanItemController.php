<?php

namespace App\Http\Controllers\Admin\Service;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ServicePlan;
use App\Models\ServicePlanItem;
use App\Models\ServiceItem;
use App\Http\Requests\ServicePlanItemRequest;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class ServicePlanItemController extends Controller
{
    /**
     * ServicePlanItemを追加する画面を表示
     */
    public function addItems(ServicePlan $servicePlan): Response
    {
        // 利用可能なServiceItem（既に追加されているものは除外）
        $existingItemIds = $servicePlan->serviceItems()->pluck('service_item_id')->toArray();
        $available_items = ServiceItem::where('status', 'active')
            ->whereNotIn('id', $existingItemIds)
            ->orderBy('sort_order')
            ->get(['id', 'name', 'item_type', 'standard_price', 'internal_cost', 'service_id'])
            ->toArray();

        return Inertia::render('Admin/Service/ServicePlanItem/Create', [
            'servicePlan' => $servicePlan->load(['service'])->toArray(),
            'available_items' => $available_items,
        ]);
    }

    /**
     * ServicePlanItemを保存
     */
    public function storeItems(ServicePlanItemRequest $request, ServicePlan $servicePlan)
    {
        try {
            $validated = $request->validated();

            foreach ($validated['items'] as $index => $itemData) {
                ServicePlanItem::create([
                    'service_plan_id' => $servicePlan->id,
                    'service_item_id' => $itemData['service_item_id'],
                    'quantity' => $itemData['quantity'] ?? 1,
                    'estimated_days' => $itemData['estimated_days'] ?? null,
                    'sort_order' => $itemData['sort_order'] ?? $index,
                ]);
            }

            // discount_amount をServicePlanに保存
            if (isset($validated['discount_amount'])) {
                $servicePlan->update(['discount_amount' => $validated['discount_amount']]);
            }

            return redirect()->route('admin.service.plan.show', $servicePlan)
                ->with('success', 'サービスアイテムが追加されました。');
        } catch (\Exception $e) {
            Log::error('ServicePlanItem store error: ' . $e->getMessage());
            return redirect()->back()
                ->withInput()
                ->with('error', 'アイテムの追加に失敗しました。');
        }
    }

    /**
     * ServicePlanItemを編集する画面を表示
     */
    public function editItems(ServicePlan $servicePlan): Response
    {
        // servicePlanItemsをロードしてデータを構築
        $servicePlanItemsRaw = $servicePlan->servicePlanItems()
            ->with('serviceItem:id,name,item_type,standard_price,internal_cost,service_id')
            ->get();

        // 明示的に配列化してリレーション情報を含める
        $servicePlanItems = $servicePlanItemsRaw->map(function ($item) {
            return [
                'id' => $item->id,
                'service_item_id' => $item->service_item_id,
                'quantity' => $item->quantity,
                'estimated_days' => $item->estimated_days,
                'sort_order' => $item->sort_order,
                'serviceItem' => $item->serviceItem ? [
                    'id' => $item->serviceItem->id,
                    'name' => $item->serviceItem->name,
                    'item_type' => $item->serviceItem->item_type,
                    'standard_price' => $item->serviceItem->standard_price,
                    'internal_cost' => $item->serviceItem->internal_cost,
                    'service_id' => $item->serviceItem->service_id,
                ] : null,
            ];
        })->toArray();

        // 利用可能なServiceItem（既に追加されているものは除外）
        $existingItemIds = $servicePlan->serviceItems()->pluck('service_item_id')->toArray();
        $available_items = ServiceItem::where('status', 'active')
            ->whereNotIn('id', $existingItemIds)
            ->orderBy('sort_order')
            ->get(['id', 'name', 'item_type', 'standard_price', 'internal_cost', 'service_id'])
            ->toArray();

        // servicePlanを配列化して必要なフィールドを明示的に含める
        $servicePlan->load(['service']);

        return Inertia::render('Admin/Service/ServicePlanItem/Edit', [
            'servicePlan' => $servicePlan->toArray(),
            'servicePlanItems' => $servicePlanItems,
            'available_items' => $available_items,
        ]);
    }

    /**
     * ServicePlanItemを更新
     */
    public function updateItems(ServicePlanItemRequest $request, ServicePlan $servicePlan)
    {
        try {
            $validated = $request->validated();

            // 新規・更新アイテムを処理
            $processedIds = [];
            foreach ($validated['items'] as $index => $itemData) {
                if (!empty($itemData['id'])) {
                    // 既存アイテムの更新
                    $planItem = ServicePlanItem::find($itemData['id']);
                    if ($planItem && $planItem->service_plan_id === $servicePlan->id) {
                        $planItem->update([
                            'quantity' => $itemData['quantity'] ?? 1,
                            'estimated_days' => $itemData['estimated_days'] ?? null,
                            'sort_order' => $itemData['sort_order'] ?? $index,
                        ]);
                        $processedIds[] = $planItem->id;
                    }
                } else {
                    // 新規アイテム追加
                    $planItem = ServicePlanItem::create([
                        'service_plan_id' => $servicePlan->id,
                        'service_item_id' => $itemData['service_item_id'],
                        'quantity' => $itemData['quantity'] ?? 1,
                        'estimated_days' => $itemData['estimated_days'] ?? null,
                        'sort_order' => $itemData['sort_order'] ?? $index,
                    ]);
                    $processedIds[] = $planItem->id;
                }
            }

            // 処理されなかったアイテム（削除対象）を削除
            ServicePlanItem::where('service_plan_id', $servicePlan->id)
                ->whereNotIn('id', $processedIds)
                ->delete();

            // discount_amount をServicePlanに保存
            if (isset($validated['discount_amount'])) {
                $servicePlan->update(['discount_amount' => $validated['discount_amount']]);
            }

            return redirect()->route('admin.service.plan.show', $servicePlan)
                ->with('success', 'サービスアイテムが更新されました。');
        } catch (\Exception $e) {
            Log::error('ServicePlanItem update error: ' . $e->getMessage());
            return redirect()->back()
                ->withInput()
                ->with('error', 'アイテムの更新に失敗しました。');
        }
    }

    /**
     * ServicePlanItemを削除
     */
    public function destroyItem(ServicePlan $servicePlan, ServicePlanItem $servicePlanItem)
    {
        try {
            // 権限チェック：このアイテムがこのプランに属しているか確認
            if ($servicePlanItem->service_plan_id !== $servicePlan->id) {
                return redirect()->back()->with('error', 'アイテムが見つかりません。');
            }

            $servicePlanItem->delete();

            return redirect()->back()
                ->with('success', 'アイテムが削除されました。');
        } catch (\Exception $e) {
            Log::error('ServicePlanItem destroy error: ' . $e->getMessage());
            return redirect()->back()
                ->with('error', 'アイテムの削除に失敗しました。');
        }
    }
}
