<?php

namespace App\Http\Controllers\Admin\Service;

use App\Http\Controllers\Controller;
use App\Models\ServiceType;
use App\Services\ServiceTypeService;
use App\Http\Requests\Admin\Service\ServiceTypeRequest;
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
  public function store(ServiceTypeRequest $request): RedirectResponse
  {
    try {
      $this->serviceTypeService->createServiceType($request->validated());

      return redirect()
        ->route('admin.service.type.index')
        ->with('success', __('messages.service_type.created'));
    } catch (\Exception $e) {
      Log::error('ServiceType store error: ' . $e->getMessage());
      return redirect()->back()
        ->withInput()
        ->with('error', __('messages.service_type.create_failed'));
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
  public function update(ServiceTypeRequest $request, ServiceType $serviceType): RedirectResponse
  {
    try {
      $this->serviceTypeService->updateServiceType($serviceType, $request->validated());

      return redirect()
        ->route('admin.service.type.show', $serviceType)
        ->with('success', __('messages.service_type.updated'));
    } catch (\Exception $e) {
      Log::error('ServiceType update error: ' . $e->getMessage());
      return redirect()->back()
        ->withInput()
        ->with('error', __('messages.service_type.update_failed'));
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
        ->route('admin.service.type.index')
        ->with('success', __('messages.service_type.deleted'));
    } catch (\Exception $e) {
      Log::error('ServiceType destroy error: ' . $e->getMessage());
      return redirect()->back()->with('error', __('messages.service_type.delete_failed'));
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
        ->route('admin.service.type.edit', $duplicatedServiceType)
        ->with('success', __('messages.service_type.duplicated'));
    } catch (\Exception $e) {
      Log::error('ServiceType duplicate error: ' . $e->getMessage());
      return redirect()->back()->with('error', __('messages.service_type.duplicate_failed'));
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
        'activate' => __('messages.service_type.bulk_activated', ['count' => $count]),
        'deactivate' => __('messages.service_type.bulk_deactivated', ['count' => $count]),
        'feature' => __('messages.service_type.bulk_featured', ['count' => $count]),
        'unfeature' => __('messages.service_type.bulk_unfeatured', ['count' => $count]),
        'delete' => __('messages.service_type.bulk_deleted', ['count' => $count]),
      ];

      return redirect()->back()->with('success', $messages[$request->action]);
    } catch (\Exception $e) {
      Log::error('ServiceType bulk action error: ' . $e->getMessage());
      return redirect()->back()->with('error', __('messages.service_type.bulk_action_failed'));
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

      return redirect()->back()->with('success', __('messages.service_type.order_updated'));
    } catch (\Exception $e) {
      Log::error('ServiceType update order error: ' . $e->getMessage());
      return redirect()->back()->with('error', __('messages.service_type.order_update_failed'));
    }
  }
}
