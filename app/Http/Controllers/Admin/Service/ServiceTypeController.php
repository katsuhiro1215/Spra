<?php

namespace App\Http\Controllers\Admin\Service;

use App\Http\Controllers\Controller;
use App\Models\ServiceType;
use App\Services\ServiceTypeService;
use App\Http\Requests\StoreServiceTypeRequest;
use App\Http\Requests\UpdateServiceTypeRequest;
use App\Http\Resources\Admin\ServiceTypeResource;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class ServiceTypeController extends Controller
{
  public function __construct(
    private ServiceTypeService $serviceTypeService
  ) {
    // 必要に応じて個別の権限制御を追加
    // $this->middleware('can:manage,ServiceType');
  }

  /**
   * サービスタイプ一覧
   * @return Response
   */
  public function index(Request $request): Response
  {
    try {
      $filters = $request->only(['search', 'category_id', 'pricing_model', 'status']);
      $sort = [
        'field' => $request->get('sort', 'sort_order'),
        'direction' => $request->get('direction', 'asc')
      ];

      $serviceTypes = $this->serviceTypeService->getPaginatedServiceTypes($filters, $sort);
      $serviceCategories = $this->serviceTypeService->getActiveServiceCategories();
      $pricingModels = $this->serviceTypeService->getPricingModels();

      $paginatedData = $serviceTypes->toArray();
      $paginatedData['data'] = ServiceTypeResource::collection($serviceTypes->items())->toArray(request());

      return Inertia::render('Admin/Service/ServiceTypes/Index', [
        'serviceTypes' => $paginatedData,
        'serviceCategories' => $serviceCategories,
        'pricingModels' => $pricingModels,
        'filters' => $filters,
        'sort' => $sort
      ]);
    } catch (\Exception $e) {
      Log::error('ServiceType index error: ' . $e->getMessage());
      return Inertia::render('Admin/Service/ServiceTypes/Index', [
        'serviceTypes' => [],
        'serviceCategories' => [],
        'pricingModels' => [],
        'filters' => [],
        'sort' => [],
        'error' => 'データの取得に失敗しました。'
      ]);
    }
  }

  /**
   * サービスタイプ作成
   * @return Response
   */
  public function create(): Response
  {
    try {
      $serviceCategories = $this->serviceTypeService->getActiveServiceCategories();

      return Inertia::render('Admin/Service/ServiceTypes/Create', [
        'serviceCategories' => $serviceCategories,
      ]);
    } catch (\Exception $e) {
      Log::error('ServiceType create error: ' . $e->getMessage());
      return Inertia::render('Admin/Service/ServiceTypes/Create', [
        'serviceCategories' => [],
        'error' => 'ページの表示に失敗しました。'
      ]);
    }
  }

  /**
   * サービスタイプ保存
   * @return RedirectResponse
   */
  public function store(StoreServiceTypeRequest $request): RedirectResponse
  {
    try {
      $this->serviceTypeService->createServiceType($request->validated());

      return redirect()
        ->route('admin.service.service-types.index')
        ->with('success', 'サービスタイプを作成しました。');
    } catch (\Exception $e) {
      Log::error('ServiceType store error: ' . $e->getMessage());
      return redirect()->back()
        ->withInput()
        ->with('error', 'サービスタイプの作成に失敗しました。');
    }
  }

  /**
   * サービスタイプ詳細
   * @param ServiceType $serviceType
   * @return Response
   */
  public function show(ServiceType $serviceType): Response
  {
    try {
      $serviceType->load(['serviceCategory', 'createdBy', 'updatedBy', 'parentService', 'childServices']);

      return Inertia::render('Admin/Service/ServiceTypes/Show', [
        'serviceType' => new ServiceTypeResource($serviceType),
      ]);
    } catch (\Exception $e) {
      Log::error('ServiceType show error: ' . $e->getMessage());
      return Inertia::render('Admin/Service/ServiceTypes/Show', [
        'serviceType' => null,
        'error' => 'データの取得に失敗しました。'
      ]);
    }
  }

  /**
   * サービスタイプ編集
   * @param ServiceType $serviceType
   * @return Response
   */
  public function edit(ServiceType $serviceType): Response
  {
    try {
      $serviceCategories = $this->serviceTypeService->getActiveServiceCategories();

      return Inertia::render('Admin/Service/ServiceTypes/Edit', [
        'serviceType' => new ServiceTypeResource($serviceType),
        'serviceCategories' => $serviceCategories,
      ]);
    } catch (\Exception $e) {
      Log::error('ServiceType edit error: ' . $e->getMessage());
      return Inertia::render('Admin/Service/ServiceTypes/Edit', [
        'serviceType' => null,
        'serviceCategories' => [],
        'error' => 'ページの表示に失敗しました。'
      ]);
    }
  }

  /**
   * サービスタイプ更新
   * @param ServiceType $serviceType
   * @return RedirectResponse
   */
  public function update(UpdateServiceTypeRequest $request, ServiceType $serviceType): RedirectResponse
  {
    try {
      $this->serviceTypeService->updateServiceType($serviceType, $request->validated());

      return redirect()
        ->route('admin.service.service-types.show', $serviceType)
        ->with('success', 'サービスタイプを更新しました。');
    } catch (\Exception $e) {
      Log::error('ServiceType update error: ' . $e->getMessage());
      return redirect()->back()
        ->withInput()
        ->with('error', 'サービスタイプの更新に失敗しました。');
    }
  }

  /**
   * サービスタイプ削除
   * @param ServiceType $serviceType
   * @return RedirectResponse
   */
  public function destroy(ServiceType $serviceType): RedirectResponse
  {
    try {
      $this->serviceTypeService->deleteServiceType($serviceType);

      return redirect()
        ->route('admin.service.service-types.index')
        ->with('success', 'サービスタイプを削除しました。');
    } catch (\Exception $e) {
      Log::error('ServiceType destroy error: ' . $e->getMessage());
      return redirect()->back()->with('error', 'サービスタイプの削除に失敗しました。');
    }
  }

  /**
   * サービスタイプ複製
   * @param ServiceType $serviceType
   * @return RedirectResponse
   */
  public function duplicate(ServiceType $serviceType): RedirectResponse
  {
    try {
      $duplicatedServiceType = $this->serviceTypeService->duplicateServiceType($serviceType);

      return redirect()
        ->route('admin.service.service-types.edit', $duplicatedServiceType)
        ->with('success', 'サービスタイプを複製しました。');
    } catch (\Exception $e) {
      Log::error('ServiceType duplicate error: ' . $e->getMessage());
      return redirect()->back()->with('error', 'サービスタイプの複製に失敗しました。');
    }
  }

  /**
   * サービスタイプ一括操作
   * @param Request $request
   * @return RedirectResponse
   */
  public function bulkAction(Request $request): RedirectResponse
  {
    $request->validate([
      'ids' => 'required|array',
      'ids.*' => 'exists:service_types,id',
      'action' => 'required|in:activate,deactivate,feature,unfeature,delete'
    ]);

    try {
      $count = $this->serviceTypeService->bulkAction($request->ids, $request->action);

      $messages = [
        'activate' => "{$count}件のサービスタイプをアクティブにしました。",
        'deactivate' => "{$count}件のサービスタイプを非アクティブにしました。",
        'feature' => "{$count}件のサービスタイプをおすすめに設定しました。",
        'unfeature' => "{$count}件のサービスタイプをおすすめから外しました。",
        'delete' => "{$count}件のサービスタイプを削除しました。",
      ];

      return redirect()->back()->with('success', $messages[$request->action]);
    } catch (\Exception $e) {
      Log::error('ServiceType bulk action error: ' . $e->getMessage());
      return redirect()->back()->with('error', '一括操作に失敗しました。');
    }
  }

  /**
   * サービスタイプ表示順序更新
   * @param Request $request
   * @return RedirectResponse
   */
  public function updateOrder(Request $request): RedirectResponse
  {
    $request->validate([
      'orders' => 'required|array',
      'orders.*.id' => 'required|exists:service_types,id',
      'orders.*.sort_order' => 'required|integer|min:0'
    ]);

    try {
      $this->serviceTypeService->updateOrder($request->orders);

      return redirect()->back()->with('success', '表示順序を更新しました。');
    } catch (\Exception $e) {
      Log::error('ServiceType update order error: ' . $e->getMessage());
      return redirect()->back()->with('error', '表示順序の更新に失敗しました。');
    }
  }
}
