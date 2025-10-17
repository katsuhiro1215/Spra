<?php

namespace App\Http\Controllers\Admin\Service;

use App\Http\Controllers\Controller;
use App\Models\ServiceType;
use App\Models\ServiceTypePriceItem;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ServiceTypePriceItemController extends Controller
{
    /**
     * 価格項目一覧表示
     */
    public function index(Request $request, ServiceType $serviceType): Response|RedirectResponse
    {
        try {
            Log::info('ServiceTypePriceItem index - ServiceType ID: ' . $serviceType->id);

            $priceItems = $serviceType->priceItems()
                ->orderBy('sort_order')
                ->orderBy('created_at')
                ->get()
                ->groupBy('category');

            Log::info('ServiceTypePriceItem index - PriceItems count: ' . $priceItems->count());

            return Inertia::render('Admin/Service/ServiceTypePriceItems/Index', [
                'serviceType' => $serviceType->load('serviceCategory'),
                'priceItems' => $priceItems,
                'categories' => ServiceTypePriceItem::CATEGORIES,
                'totalPrice' => $serviceType->priceItems()->sum('total_price'),
            ]);
        } catch (\Exception $e) {
            Log::error('ServiceTypePriceItem index error: ' . $e->getMessage());
            Log::error('ServiceTypePriceItem index stack trace: ' . $e->getTraceAsString());

            return redirect()->route('admin.service.service-types.index')
                ->with('error', __('messages.general.action_failed'));
        }
    }

    /**
     * 価格項目作成フォーム
     */
    public function create(ServiceType $serviceType): Response
    {
        return Inertia::render('Admin/Service/ServiceTypePriceItems/Create', [
            'serviceType' => $serviceType->load('serviceCategory'),
            'categories' => ServiceTypePriceItem::CATEGORIES,
            'units' => ['式', 'ページ', '時間', '機能', '個', 'セット'],
        ]);
    }

    /**
     * 価格項目保存
     */
    public function store(Request $request, ServiceType $serviceType): RedirectResponse
    {
        try {
            $validated = $request->validate([
                'category' => ['required', 'string', Rule::in(array_keys(ServiceTypePriceItem::CATEGORIES))],
                'name' => ['required', 'string', 'max:255'],
                'description' => ['nullable', 'string'],
                'price' => ['required', 'numeric', 'min:0'],
                'unit' => ['required', 'string', 'max:50'],
                'quantity' => ['required', 'integer', 'min:1'],
                'is_optional' => ['boolean'],
                'is_variable' => ['boolean'],
                'sort_order' => ['nullable', 'integer', 'min:0'],
            ], [
                'category.required' => __('validation.required', ['attribute' => 'カテゴリ']),
                'category.in' => __('validation.in', ['attribute' => 'カテゴリ']),
                'name.required' => __('validation.required', ['attribute' => '項目名']),
                'name.max' => __('validation.max.string', ['attribute' => '項目名', 'max' => 255]),
                'price.required' => __('validation.required', ['attribute' => '価格']),
                'price.numeric' => __('validation.numeric', ['attribute' => '価格']),
                'price.min' => __('validation.min.numeric', ['attribute' => '価格', 'min' => 0]),
                'unit.required' => __('validation.required', ['attribute' => '単位']),
                'quantity.required' => __('validation.required', ['attribute' => '数量']),
                'quantity.integer' => __('validation.integer', ['attribute' => '数量']),
                'quantity.min' => __('validation.min.numeric', ['attribute' => '数量', 'min' => 1]),
            ]);

            // sort_orderが指定されていない場合は最大値+1を設定
            if (!isset($validated['sort_order'])) {
                $validated['sort_order'] = $serviceType->priceItems()
                    ->where('category', $validated['category'])
                    ->max('sort_order') + 1;
            }

            $priceItem = $serviceType->priceItems()->create($validated);

            return redirect()->route('admin.service-types.price-items.index', $serviceType)
                ->with('success', __('messages.general.save_success'));
        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()->withInput()
                ->withErrors($e->errors())
                ->with('error', __('messages.form.validation_error'));
        } catch (\Exception $e) {
            Log::error('ServiceTypePriceItem store error: ' . $e->getMessage());

            return back()->withInput()
                ->with('error', __('messages.general.action_failed'));
        }
    }

    /**
     * 価格項目詳細表示
     */
    public function show(ServiceType $serviceType, ServiceTypePriceItem $priceItem): Response
    {
        // サービスタイプに所属する項目かチェック
        if ($priceItem->service_type_id !== $serviceType->id) {
            abort(404);
        }

        return Inertia::render('Admin/Service/ServiceTypePriceItems/Show', [
            'serviceType' => $serviceType->load('serviceCategory'),
            'priceItem' => $priceItem,
            'categories' => ServiceTypePriceItem::CATEGORIES,
        ]);
    }

    /**
     * 価格項目編集フォーム
     */
    public function edit(ServiceType $serviceType, ServiceTypePriceItem $priceItem): Response
    {
        // サービスタイプに所属する項目かチェック
        if ($priceItem->service_type_id !== $serviceType->id) {
            abort(404);
        }

        return Inertia::render('Admin/Service/ServiceTypePriceItems/Edit', [
            'serviceType' => $serviceType->load('serviceCategory'),
            'priceItem' => $priceItem,
            'categories' => ServiceTypePriceItem::CATEGORIES,
            'units' => ['式', 'ページ', '時間', '機能', '個', 'セット'],
        ]);
    }

    /**
     * 価格項目更新
     */
    public function update(Request $request, ServiceType $serviceType, ServiceTypePriceItem $priceItem): RedirectResponse
    {
        // サービスタイプに所属する項目かチェック
        if ($priceItem->service_type_id !== $serviceType->id) {
            abort(404);
        }

        try {
            $validated = $request->validate([
                'category' => ['required', 'string', Rule::in(array_keys(ServiceTypePriceItem::CATEGORIES))],
                'name' => ['required', 'string', 'max:255'],
                'description' => ['nullable', 'string'],
                'price' => ['required', 'numeric', 'min:0'],
                'unit' => ['required', 'string', 'max:50'],
                'quantity' => ['required', 'integer', 'min:1'],
                'is_optional' => ['boolean'],
                'is_variable' => ['boolean'],
                'sort_order' => ['nullable', 'integer', 'min:0'],
            ], [
                'category.required' => __('validation.required', ['attribute' => 'カテゴリ']),
                'category.in' => __('validation.in', ['attribute' => 'カテゴリ']),
                'name.required' => __('validation.required', ['attribute' => '項目名']),
                'name.max' => __('validation.max.string', ['attribute' => '項目名', 'max' => 255]),
                'price.required' => __('validation.required', ['attribute' => '価格']),
                'price.numeric' => __('validation.numeric', ['attribute' => '価格']),
                'price.min' => __('validation.min.numeric', ['attribute' => '価格', 'min' => 0]),
                'unit.required' => __('validation.required', ['attribute' => '単位']),
                'quantity.required' => __('validation.required', ['attribute' => '数量']),
                'quantity.integer' => __('validation.integer', ['attribute' => '数量']),
                'quantity.min' => __('validation.min.numeric', ['attribute' => '数量', 'min' => 1]),
            ]);

            $priceItem->update($validated);

            return redirect()->route('admin.service.priceItem.index', $serviceType)
                ->with('success', __('messages.general.save_success'));
        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()->withInput()
                ->withErrors($e->errors())
                ->with('error', __('messages.form.validation_error'));
        } catch (\Exception $e) {
            Log::error('ServiceTypePriceItem update error: ' . $e->getMessage());

            return back()->withInput()
                ->with('error', __('messages.general.action_failed'));
        }
    }

    /**
     * 価格項目削除
     */
    public function destroy(ServiceType $serviceType, ServiceTypePriceItem $priceItem): RedirectResponse
    {
        // サービスタイプに所属する項目かチェック
        if ($priceItem->service_type_id !== $serviceType->id) {
            abort(404);
        }

        try {
            $priceItem->delete();

            return redirect()->route('admin.service.priceItem.index', $serviceType)
                ->with('success', __('messages.general.delete_success'));
        } catch (\Exception $e) {
            Log::error('ServiceTypePriceItem destroy error: ' . $e->getMessage());

            return back()->with('error', __('messages.general.action_failed'));
        }
    }

    /**
     * 表示順序の更新
     */
    public function updateSortOrder(Request $request, ServiceType $serviceType): RedirectResponse
    {
        try {
            $validated = $request->validate([
                'items' => ['required', 'array'],
                'items.*.id' => ['required', 'integer', 'exists:service_type_price_items,id'],
                'items.*.sort_order' => ['required', 'integer', 'min:0'],
            ]);

            DB::transaction(function () use ($validated, $serviceType) {
                foreach ($validated['items'] as $item) {
                    $priceItem = ServiceTypePriceItem::where('id', $item['id'])
                        ->where('service_type_id', $serviceType->id)
                        ->first();

                    if ($priceItem) {
                        $priceItem->update(['sort_order' => $item['sort_order']]);
                    }
                }
            });

            return back()->with('success', __('messages.general.save_success'));
        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()->withErrors($e->errors())
                ->with('error', __('messages.form.validation_error'));
        } catch (\Exception $e) {
            Log::error('ServiceTypePriceItem sort order update error: ' . $e->getMessage());

            return back()->with('error', __('messages.general.action_failed'));
        }
    }

    /**
     * 一括作成（テンプレートから）
     */
    public function createFromTemplate(Request $request, ServiceType $serviceType): RedirectResponse
    {
        try {
            $validated = $request->validate([
                'template' => ['required', 'string', Rule::in(['basic', 'standard', 'premium'])],
            ]);

            $templates = $this->getPriceItemTemplates();
            $templateItems = $templates[$validated['template']] ?? [];

            DB::transaction(function () use ($templateItems, $serviceType) {
                foreach ($templateItems as $item) {
                    $serviceType->priceItems()->create($item);
                }
            });

            return redirect()->route('admin.service.priceItem.index', $serviceType)
                ->with('success', 'テンプレートから価格項目を作成しました。');
        } catch (\Exception $e) {
            Log::error('ServiceTypePriceItem template creation error: ' . $e->getMessage());

            return back()->with('error', __('messages.general.action_failed'));
        }
    }

    /**
     * 価格項目テンプレートの定義
     */
    private function getPriceItemTemplates(): array
    {
        return [
            'basic' => [
                [
                    'category' => 'design',
                    'name' => 'デザイン設計',
                    'description' => '基本的なデザイン設計',
                    'price' => 50000,
                    'unit' => '式',
                    'quantity' => 1,
                    'sort_order' => 1,
                ],
                [
                    'category' => 'coding',
                    'name' => 'フロントエンド開発',
                    'description' => 'HTML/CSS/JavaScript実装',
                    'price' => 100000,
                    'unit' => '式',
                    'quantity' => 1,
                    'sort_order' => 2,
                ],
            ],
            'standard' => [
                [
                    'category' => 'design',
                    'name' => 'UI/UXデザイン',
                    'description' => '詳細なUI/UXデザイン設計',
                    'price' => 80000,
                    'unit' => '式',
                    'quantity' => 1,
                    'sort_order' => 1,
                ],
                [
                    'category' => 'coding',
                    'name' => 'フロントエンド開発',
                    'description' => 'React/Vue.js等を使用した実装',
                    'price' => 150000,
                    'unit' => '式',
                    'quantity' => 1,
                    'sort_order' => 2,
                ],
                [
                    'category' => 'coding',
                    'name' => 'バックエンド開発',
                    'description' => 'API・データベース設計実装',
                    'price' => 120000,
                    'unit' => '式',
                    'quantity' => 1,
                    'sort_order' => 3,
                ],
            ],
            'premium' => [
                [
                    'category' => 'design',
                    'name' => 'ブランディングデザイン',
                    'description' => '総合的なブランディングデザイン',
                    'price' => 120000,
                    'unit' => '式',
                    'quantity' => 1,
                    'sort_order' => 1,
                ],
                [
                    'category' => 'coding',
                    'name' => 'フルスタック開発',
                    'description' => 'フロント・バックエンド統合開発',
                    'price' => 200000,
                    'unit' => '式',
                    'quantity' => 1,
                    'sort_order' => 2,
                ],
                [
                    'category' => 'infrastructure',
                    'name' => 'インフラ構築',
                    'description' => 'AWS/GCP等クラウドインフラ',
                    'price' => 80000,
                    'unit' => '式',
                    'quantity' => 1,
                    'sort_order' => 3,
                ],
                [
                    'category' => 'testing',
                    'name' => '品質保証・テスト',
                    'description' => '総合的なテスト・品質保証',
                    'price' => 60000,
                    'unit' => '式',
                    'quantity' => 1,
                    'sort_order' => 4,
                ],
            ],
        ];
    }
}
