<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\PointCatalogItemRequest;
use App\Models\PointCatalogItem;
use App\Services\PointCatalogItemService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class PointCatalogItemController extends Controller
{
    public function __construct(
        private PointCatalogItemService $pointCatalogItemService
    ) {}

    /**
     * カタログ商品一覧
     */
    public function index(Request $request): Response
    {
        $filters = [
            'search' => $request->input('search'),
            'is_active' => $request->input('is_active'),
        ];

        $sort = [
            'field' => $request->input('sort_field', 'sort_order'),
            'direction' => $request->input('sort_direction', 'asc'),
        ];

        $pointCatalogItems = $this->pointCatalogItemService->getPaginated($filters, $sort, 20);
        $stats = $this->pointCatalogItemService->getStats();

        return Inertia::render('Admin/PointCatalogItem/Index', [
            'pointCatalogItems' => $pointCatalogItems,
            'stats' => $stats,
            'filters' => $filters,
        ]);
    }

    /**
     * 新規作成フォーム
     */
    public function create(): Response
    {
        return Inertia::render('Admin/PointCatalogItem/Create');
    }

    /**
     * 保存
     */
    public function store(PointCatalogItemRequest $request): RedirectResponse
    {
        try {
            $this->pointCatalogItemService->createPointCatalogItem($request->validated());

            return redirect()->route('admin.point-catalog-item.index')
                ->with('success', __('messages.created', ['attribute' => 'カタログ商品']));
        } catch (\Exception $e) {
            Log::error('PointCatalogItem store error: ' . $e->getMessage());
            return redirect()->back()
                ->withInput()
                ->with('error', __('messages.create_failed', ['attribute' => 'カタログ商品']));
        }
    }

    /**
     * 編集フォーム
     */
    public function edit(PointCatalogItem $pointCatalogItem): Response
    {
        return Inertia::render('Admin/PointCatalogItem/Edit', [
            'pointCatalogItem' => $pointCatalogItem,
        ]);
    }

    /**
     * 更新
     */
    public function update(PointCatalogItemRequest $request, PointCatalogItem $pointCatalogItem): RedirectResponse
    {
        try {
            $this->pointCatalogItemService->updatePointCatalogItem($pointCatalogItem, $request->validated());

            return redirect()->route('admin.point-catalog-item.index')
                ->with('success', __('messages.updated', ['attribute' => 'カタログ商品']));
        } catch (\Exception $e) {
            Log::error('PointCatalogItem update error: ' . $e->getMessage());
            return redirect()->back()
                ->withInput()
                ->with('error', __('messages.update_failed', ['attribute' => 'カタログ商品']));
        }
    }

    /**
     * 削除
     */
    public function destroy(PointCatalogItem $pointCatalogItem): RedirectResponse
    {
        try {
            $this->pointCatalogItemService->deletePointCatalogItem($pointCatalogItem);

            return redirect()->route('admin.point-catalog-item.index')
                ->with('success', __('messages.deleted', ['attribute' => 'カタログ商品']));
        } catch (\Exception $e) {
            Log::error('PointCatalogItem destroy error: ' . $e->getMessage());
            return redirect()->back()
                ->with('error', $e->getMessage());
        }
    }
}
