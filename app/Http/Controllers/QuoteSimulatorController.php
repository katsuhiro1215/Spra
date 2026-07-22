<?php

namespace App\Http\Controllers;

use App\Services\ServiceCategoryService;
use App\Services\ServiceItemService;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class QuoteSimulatorController extends Controller
{
  public function __construct(
    private ServiceCategoryService $serviceCategoryService,
    private ServiceItemService $serviceItemService
  ) {}

  /**
   * 見積もりシミュレーターを表示
   */
  public function index(): InertiaResponse
  {
    // サービスカテゴリとServiceItemを取得
    $serviceCategories = $this->serviceCategoryService->getActiveForSelect();
    $serviceItems = $this->serviceItemService->getActiveForQuote();

    return Inertia::render('Public/QuoteSimulator', [
      'serviceCategories' => $serviceCategories,
      'serviceItems' => $serviceItems,
      'canLogin' => route('user.login'),
      'canRegister' => Route::has('user.register') ? route('user.register') : null,
    ]);
  }
}
