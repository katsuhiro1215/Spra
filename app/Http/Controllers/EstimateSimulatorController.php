<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use App\Services\ServiceCategoryService;
use App\Services\ServiceService;
use App\Services\ServicePlanService;
use App\Services\ServiceItemService;
use App\Services\ProjectInquiryService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class EstimateSimulatorController extends Controller
{
    public function __construct(
        private ServiceCategoryService $serviceCategoryService,
        private ServiceService $serviceService,
        private ServicePlanService $servicePlanService,
        private ServiceItemService $serviceItemService,
        private ProjectInquiryService $projectInquiryService
    ) {}

    /**
     * 見積もりシミュレーター画面を表示
     *
     * @return InertiaResponse
     */
    public function index(): InertiaResponse
    {
        // ServiceCategoryを取得（質問1: カテゴリ選択）
        $serviceCategories = $this->serviceCategoryService->getActiveForSelect();

        // 全Serviceをカテゴリ別にグループ化（質問2: サービス選択）
        $services = $this->serviceService->getRepository()->query()
            ->with(['serviceCategory'])
            ->where('status', 'active')
            ->orderBy('sort_order')
            ->get()
            ->groupBy('service_category_id');

        // 全ServicePlanをサービス別にグループ化（質問3: プラン選択）
        $servicePlans = $this->servicePlanService->getRepository()->query()
            ->with(['service'])
            ->where('status', 'active')
            ->orderBy('sort_order')
            ->get()
            ->groupBy('service_id');

        // 全ServiceItemをサービス別・タイプ別にグループ化（質問4: 追加機能）
        $serviceItems = $this->serviceItemService->getRepository()->query()
            ->with(['service', 'servicePlan'])
            ->where('status', 'active')
            ->orderBy('sort_order')
            ->get()
            ->groupBy(function ($item) {
                return $item->service_id . '_' . $item->item_type;
            });

        // 質問データを動的生成
        $questions = $this->generateQuestions($serviceCategories, $services, $servicePlans, $serviceItems);

        return Inertia::render('Public/EstimateSimulator', [
            'questions' => $questions,
            'serviceCategories' => $serviceCategories,
            'services' => $services,
            'servicePlans' => $servicePlans,
            'serviceItems' => $serviceItems,
            'canLogin' => route('user.login'),
            'canRegister' => route('user.register'),
        ]);
    }

    /**
     * ServiceItemデータから質問データを生成
     *
     * @param \Illuminate\Support\Collection $serviceCategories
     * @param \Illuminate\Support\Collection $services
     * @param \Illuminate\Support\Collection $servicePlans
     * @param \Illuminate\Support\Collection $serviceItems
     * @return array
     */
    private function generateQuestions($serviceCategories, $services, $servicePlans, $serviceItems): array
    {
        $questions = [];

        // 質問1: カテゴリ選択
        $categoryOptions = [];
        foreach ($serviceCategories as $category) {
            $categoryServices = $services->get($category['id'], collect());
            if ($categoryServices->count() > 0) {
                $categoryOptions[] = [
                    'id' => $category['id'],
                    'label' => $category['name'],
                    'description' => $category['description'] ?? '',
                    'icon' => $this->getCategoryIcon($category['name']),
                ];
            }
        }

        if (count($categoryOptions) > 0) {
            $questions[] = [
                'id' => 1,
                'question' => 'どのようなサービスをお探しですか？',
                'type' => 'single',
                'step' => 'category',
                'options' => $categoryOptions,
            ];
        }

        return $questions;
    }

    /**
     * カテゴリ名から適切なアイコンを返す
     *
     * @param string $categoryName
     * @return string
     */
    private function getCategoryIcon(string $categoryName): string
    {
        $iconMap = [
            'Web制作' => '🌐',
            'Webサイト制作' => '🌐',
            'システム開発' => '💻',
            'アプリ開発' => '📱',
            'ECサイト' => '🛒',
            'デザイン' => '🎨',
            'マーケティング' => '📈',
            'コンサルティング' => '💡',
        ];

        foreach ($iconMap as $key => $icon) {
            if (str_contains($categoryName, $key)) {
                return $icon;
            }
        }

        return '✨';
    }

    /**
     * 見積もり依頼を保存
     *
     * @param Request $request
     * @return RedirectResponse
     */
    public function save(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'service_category_id' => 'required|exists:service_categories,id',
            'service_id' => 'required|exists:services,id',
            'service_plan_id' => 'required|exists:service_plans,id',
            'simulator_data' => 'required|array',
            'estimated_price' => 'required|numeric|min:0',
            'estimated_days' => 'nullable|integer|min:0',
            'title' => 'required|string|max:255',
            'summary' => 'nullable|string',
        ]);

        $this->projectInquiryService->createFromEstimateSimulator(
            $validated,
            auth()->id()
        );

        return redirect()->back()->with('success', '見積もり依頼を保存しました。');
    }
}
