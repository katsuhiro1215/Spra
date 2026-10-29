<?php

namespace App\Services;

use App\Models\Admin;
use App\Models\Contact;
use App\Models\ContactCategory;
use App\Models\Quote;
use App\Models\Service;
use App\Models\ServiceItem;
use App\Models\ServicePlan;
use App\Models\ServicePlanItem;
use App\Models\User;
use App\Models\UserActivityLog;
use App\Notifications\ContactReceived;
use App\Repositories\QuoteRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Str;

/**
 * 見積もりシミュレーター（概算見積もり）のビジネスロジック
 *
 * Public/EstimateSimulatorController（社内Web UI）と
 * Api/EstimateSimulatorApiController（外部サイト向けAPI）の両方から
 * 同じロジックを呼び出せるようにするため、選択肢の取得・見積依頼の作成を
 * ここに集約する。
 */
class EstimateSimulatorService extends BaseService
{
    public function __construct(
        QuoteRepository $repository,
        private ServiceCategoryService $serviceCategoryService,
        private ServiceService $serviceService,
        private ServicePlanService $servicePlanService,
        private ServiceItemService $serviceItemService,
    ) {
        parent::__construct($repository);
    }

    protected function getEntityName(): string
    {
        return 'Quote';
    }

    /**
     * シミュレーターの選択肢（カテゴリ・サービス・プラン・追加項目）を取得する
     *
     * @return array{
     *     serviceCategories: \Illuminate\Support\Collection,
     *     services: \Illuminate\Support\Collection,
     *     servicePlans: \Illuminate\Support\Collection,
     *     serviceItems: \Illuminate\Support\Collection,
     *     servicePlanItems: \Illuminate\Support\Collection,
     * }
     */
    public function getSimulatorOptions(): array
    {
        $serviceCategories = $this->serviceCategoryService->getActiveForSelect(onlyDisplayed: true);

        $services = $this->serviceService->getRepository()->query()
            ->where('status', 'active')
            ->where('is_displayed', true)
            ->orderBy('sort_order')
            ->get()
            ->groupBy('service_category_id');

        $servicePlans = $this->servicePlanService->getRepository()->query()
            ->where('status', 'active')
            ->where('is_displayed', true)
            ->orderBy('sort_order')
            ->get()
            ->groupBy('service_id');

        $serviceItems = $this->serviceItemService->getRepository()->query()
            ->where('status', 'active')
            ->orderBy('sort_order')
            ->get()
            ->groupBy('service_id');

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

        return compact('serviceCategories', 'services', 'servicePlans', 'serviceItems', 'servicePlanItems');
    }

    /**
     * シミュレーション結果から「見積依頼」のお問い合わせと、
     * 管理者が確認・調整するためのQuote（ドラフト、バージョン・明細付き）を作成する。
     *
     * @param  array  $validated  service_id/service_plan_id/selected_addon_ids/title/notes、
     *                            ゲストの場合はname/email/phone/companyを含むバリデーション済み配列
     * @param  User|null  $user  ログイン中のUser（ゲストの場合はnull）
     * @param  array{source?: string, api_client_id?: string|null, ip_address?: string|null, user_agent?: string|null}  $context
     *
     * @throws \RuntimeException 事前条件（カテゴリ/管理者未設定、サービス・プラン非公開）を満たさない場合
     */
    public function createEstimateRequest(array $validated, ?User $user, array $context = []): Quote
    {
        $isGuest = ! $user;

        $service = Service::findOrFail($validated['service_id']);
        $plan = ServicePlan::findOrFail($validated['service_plan_id']);
        $quoteCategory = ContactCategory::where('slug', ContactCategory::SLUG_QUOTE_REQUEST)->first();
        $admin = Admin::first();

        if (! $quoteCategory || ! $admin) {
            throw new \RuntimeException('システムエラーが発生しました。お手数ですがお問い合わせフォームよりご連絡ください。');
        }

        if (! $service->isActive() || ! $service->isDisplayed() || ! $plan->isActive() || ! $plan->isDisplayed()) {
            throw new \RuntimeException('選択されたサービス・プランは現在ご利用いただけません。お手数ですが最初からやり直してください。');
        }

        $name = $isGuest ? $validated['name'] : ($user->profile?->full_name ?: $user->email);
        $email = $isGuest ? $validated['email'] : $user->email;
        $phone = $isGuest ? ($validated['phone'] ?? null) : null;
        $company = $isGuest ? ($validated['company'] ?? null) : null;

        $source = $context['source'] ?? 'estimate_simulator';
        $apiClientId = $context['api_client_id'] ?? null;
        $ipAddress = $context['ip_address'] ?? null;
        $userAgent = $context['user_agent'] ?? null;

        return DB::transaction(function () use (
            $validated,
            $plan,
            $quoteCategory,
            $admin,
            $user,
            $name,
            $email,
            $phone,
            $company,
            $source,
            $apiClientId,
            $ipAddress,
            $userAgent,
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
                'source' => $source,
                'api_client_id' => $apiClientId,
                'ip' => $ipAddress,
                'user_agent' => $userAgent,
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
                'quote_number' => 'Q'.now()->format('Ymd').'-'.Str::upper(Str::random(6)),
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
                'service_plan_id' => $plan->id,
            ]);

            $quote->update(['current_version_id' => $version->id]);

            $sortOrder = 1;

            // プランに含まれるItem（item_type=included）はプラン価格に内包されているため単価0円で記録し、
            // 定価の合計とプラン価格(base_price)との差額は「プラン割引」の調整行として追加する。
            // （管理画面のForm.jsx::handleAddServicePlan と同じ計算方法に揃えることで、
            // 　見積明細の合計とプラン価格を常に一致させる）
            $planItemsTotal = 0;
            $planItemRows = [];

            foreach ($planItems as $planItem) {
                $unitPrice = $planItem->serviceItem->item_type === 'included'
                    ? 0
                    : (float) $planItem->serviceItem->standard_price;
                $itemAmount = $unitPrice * $planItem->quantity;
                $planItemsTotal += $itemAmount;

                $planItemRows[] = [
                    'service_id' => $planItem->serviceItem->service_id,
                    'service_item_id' => $planItem->service_item_id,
                    'name' => $planItem->serviceItem->name,
                    'description' => $planItem->serviceItem->description,
                    'item_type' => $planItem->serviceItem->item_type,
                    'billing_type' => 'one_time',
                    'quantity' => $planItem->quantity,
                    'unit_price' => $unitPrice,
                    'amount' => $itemAmount,
                    'estimated_days' => $planItem->estimated_days,
                ];
            }

            foreach ($planItemRows as $row) {
                $version->items()->create($row + ['sort_order' => $sortOrder++]);
            }

            $priceDifference = $planItemsTotal - (float) $plan->base_price;

            if (round($priceDifference, 2) !== 0.0) {
                $version->items()->create([
                    'service_id' => $plan->service_id,
                    'service_item_id' => null,
                    'name' => $priceDifference > 0
                        ? "{$plan->name} プラン割引"
                        : "{$plan->name} プラン追加料金",
                    'description' => 'プラン選択による価格調整',
                    'item_type' => 'custom',
                    'billing_type' => 'one_time',
                    'quantity' => 1,
                    'unit_price' => -$priceDifference,
                    'amount' => -$priceDifference,
                    'estimated_days' => 0,
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
                'description' => "{$name}様より見積もりシミュレーターからのご依頼がありました（{$validated['title']}・概算¥".number_format($totalAmount).'）',
                'ip_address' => $ipAddress,
                'user_agent' => $userAgent,
                'status' => UserActivityLog::STATUS_SUCCESS,
            ]);

            return $quote->fresh(['currentVersion.items']);
        });
    }
}
