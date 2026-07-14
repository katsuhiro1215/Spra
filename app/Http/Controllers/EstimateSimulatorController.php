<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use App\Models\Contact;
use App\Models\ContactCategory;
use App\Models\Quote;
use App\Models\Service;
use App\Models\ServiceItem;
use App\Models\ServicePlan;
use App\Models\ServicePlanItem;
use App\Models\UserActivityLog;
use App\Notifications\ContactReceived;
use App\Services\ServiceCategoryService;
use App\Services\ServiceItemService;
use App\Services\ServicePlanService;
use App\Services\ServiceService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class EstimateSimulatorController extends Controller
{
    public function __construct(
        private ServiceCategoryService $serviceCategoryService,
        private ServiceService $serviceService,
        private ServicePlanService $servicePlanService,
        private ServiceItemService $serviceItemService
    ) {}

    /**
     * 見積もりシミュレーター画面を表示
     */
    public function index(): InertiaResponse
    {
        // ServiceCategoryを取得（ステップ1: カテゴリ選択）※Web公開中のものだけ
        $serviceCategories = $this->serviceCategoryService->getActiveForSelect(onlyDisplayed: true);

        // 全Serviceをカテゴリ別にグループ化（ステップ2: サービス選択）※Web公開中のものだけ
        $services = $this->serviceService->getRepository()->query()
            ->where('status', 'active')
            ->where('is_displayed', true)
            ->orderBy('sort_order')
            ->get()
            ->groupBy('service_category_id');

        // 全ServicePlanをサービス別にグループ化（ステップ3: プラン選択）※Web公開中のものだけ
        $servicePlans = $this->servicePlanService->getRepository()->query()
            ->where('status', 'active')
            ->where('is_displayed', true)
            ->orderBy('sort_order')
            ->get()
            ->groupBy('service_id');

        // 全ServiceItem（addonタイプ）をサービス別にグループ化（ステップ4: 追加機能）
        $serviceItems = $this->serviceItemService->getRepository()->query()
            ->where('status', 'active')
            ->orderBy('sort_order')
            ->get()
            ->groupBy('service_id');

        // プランに内包される項目（service_plan_items 中間テーブル経由）※Web公開中のプランのみ
        $servicePlanItems = ServicePlanItem::with('serviceItem')
            ->whereIn('service_plan_id', $servicePlans->flatten()->pluck('id'))
            ->get()
            ->groupBy('service_plan_id')
            ->map(fn ($items) => $items->map(fn (ServicePlanItem $pivot) => [
                'id' => $pivot->serviceItem->id,
                'name' => $pivot->serviceItem->name,
                'description' => $pivot->serviceItem->description,
                'estimated_days' => $pivot->estimated_days ?? $pivot->serviceItem->estimated_days,
                'quantity' => $pivot->quantity,
                'is_required' => $pivot->is_required,
            ])->values());

        return Inertia::render('Public/EstimateSimulator', [
            'serviceCategories' => $serviceCategories,
            'services' => $services,
            'servicePlans' => $servicePlans,
            'serviceItems' => $serviceItems,
            'servicePlanItems' => $servicePlanItems,
            'canLogin' => route('user.login'),
            'canRegister' => route('user.register'),
        ]);
    }

    /**
     * シミュレーション結果から「見積依頼」のお問い合わせと、
     * 管理者が確認・調整するためのQuote（ドラフト）を作成する。
     * ログイン不要（ゲストも送信可能）。
     */
    public function save(Request $request): RedirectResponse
    {
        $user = auth('users')->user();
        $isGuest = !$user;

        $rules = [
            'service_id' => ['required', 'exists:services,id'],
            'service_plan_id' => ['required', 'exists:service_plans,id'],
            'selected_addon_ids' => ['nullable', 'array'],
            'selected_addon_ids.*' => ['string', 'exists:service_items,id'],
            'estimated_price' => ['required', 'numeric', 'min:0'],
            'estimated_days' => ['nullable', 'integer', 'min:0'],
            'title' => ['required', 'string', 'max:255'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];

        if ($isGuest) {
            $rules['name'] = ['required', 'string', 'max:255'];
            $rules['email'] = ['required', 'email', 'max:255'];
            $rules['phone'] = ['nullable', 'string', 'max:20'];
            $rules['company'] = ['nullable', 'string', 'max:255'];
        }

        $validated = $request->validate($rules);

        $service = Service::findOrFail($validated['service_id']);
        $plan = ServicePlan::findOrFail($validated['service_plan_id']);
        $quoteCategory = ContactCategory::where('slug', ContactCategory::SLUG_QUOTE_REQUEST)->first();
        $admin = Admin::first();

        if (!$quoteCategory || !$admin) {
            return back()->withErrors([
                'error' => 'システムエラーが発生しました。お手数ですがお問い合わせフォームよりご連絡ください。',
            ])->withInput();
        }

        if (!$service->isActive() || !$service->isDisplayed() || !$plan->isActive() || !$plan->isDisplayed()) {
            return back()->withErrors([
                'error' => '選択されたサービス・プランは現在ご利用いただけません。お手数ですが最初からやり直してください。',
            ])->withInput();
        }

        $name = $isGuest ? $validated['name'] : ($user->profile?->full_name ?: $user->email);
        $email = $isGuest ? $validated['email'] : $user->email;
        $phone = $isGuest ? ($validated['phone'] ?? null) : null;
        $company = $isGuest ? ($validated['company'] ?? null) : null;

        DB::transaction(function () use (
            $request,
            $validated,
            $service,
            $plan,
            $quoteCategory,
            $admin,
            $user,
            $name,
            $email,
            $phone,
            $company
        ) {
            $contact = Contact::create([
                'name' => $name,
                'email' => $email,
                'user_id' => $user?->id,
                'phone' => $phone,
                'company' => $company,
                'contact_category_id' => $quoteCategory->id,
                'subject' => "【見積シミュレーター】{$validated['title']}",
                'message' => $validated['notes'] ?: '見積もりシミュレーターから送信されました。詳細は添付のドラフト見積をご確認ください。',
                'status' => 'new',
                'source' => 'estimate_simulator',
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            $planItems = ServicePlanItem::where('service_plan_id', $plan->id)
                ->with('serviceItem')
                ->get();

            $addonItems = ServiceItem::whereIn('id', $validated['selected_addon_ids'] ?? [])->get();

            $baseAmount = (float) $plan->base_price + $addonItems->sum(fn (ServiceItem $item) => (float) $item->standard_price);
            $taxRate = 10;
            $taxAmount = round($baseAmount * $taxRate / 100, 2);
            $totalAmount = $baseAmount + $taxAmount;

            $quote = Quote::create([
                'quote_number' => 'Q' . now()->format('Ymd') . '-' . Str::upper(Str::random(6)),
                'user_id' => $user?->id,
                'contact_id' => $contact->id,
                'title' => $validated['title'],
                'requirements' => $validated['notes'] ?? null,
                'status' => 'draft',
                'created_by' => $admin->id,
            ]);

            $version = $quote->versions()->create([
                'version' => 1,
                'title' => $validated['title'],
                'requirements' => $validated['notes'] ?? null,
                'base_amount' => $baseAmount,
                'discount_amount' => 0,
                'tax_rate' => $taxRate,
                'tax_amount' => $taxAmount,
                'total_amount' => $totalAmount,
                'status' => 'draft',
                'is_current' => true,
                'created_by' => $admin->id,
            ]);

            $quote->update(['current_version_id' => $version->id]);

            $sortOrder = 1;

            foreach ($planItems as $planItem) {
                $version->items()->create([
                    'service_id' => $planItem->serviceItem->service_id,
                    'service_item_id' => $planItem->service_item_id,
                    'name' => $planItem->serviceItem->name,
                    'description' => $planItem->serviceItem->description,
                    'item_type' => $planItem->serviceItem->item_type,
                    'billing_type' => 'one_time',
                    'quantity' => $planItem->quantity,
                    'unit_price' => $planItem->serviceItem->standard_price,
                    'amount' => $planItem->serviceItem->standard_price * $planItem->quantity,
                    'estimated_days' => $planItem->estimated_days,
                    'sort_order' => $sortOrder++,
                ]);
            }

            foreach ($addonItems as $addonItem) {
                $version->items()->create([
                    'service_id' => $addonItem->service_id,
                    'service_item_id' => $addonItem->id,
                    'name' => $addonItem->name,
                    'description' => $addonItem->description,
                    'item_type' => 'addon',
                    'billing_type' => 'one_time',
                    'quantity' => 1,
                    'unit_price' => $addonItem->standard_price,
                    'amount' => $addonItem->standard_price,
                    'estimated_days' => $addonItem->estimated_days,
                    'sort_order' => $sortOrder++,
                ]);
            }

            // 管理者への通知（ベルアイコン）
            Notification::send(Admin::all(), new ContactReceived($contact));

            // ログに記録
            UserActivityLog::logActivity([
                'user_id' => $user?->id,
                'action' => UserActivityLog::ACTION_CONTACT_RECEIVED,
                'description' => "{$name}様より見積もりシミュレーターからのご依頼がありました（{$validated['title']}・概算¥" . number_format($totalAmount) . '）',
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'status' => UserActivityLog::STATUS_SUCCESS,
            ]);
        });

        return back()->with('success', '見積もり依頼を送信しました。担当者より2営業日以内にご連絡いたします。');
    }
}
