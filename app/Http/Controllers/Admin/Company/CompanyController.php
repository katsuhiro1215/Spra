<?php

namespace App\Http\Controllers\Admin\Company;

use App\Http\Controllers\Controller;
use App\Http\Requests\CompanyRequest;
use App\Models\Address;
use App\Models\Company;
use App\Models\CompanyMembership;
use App\Models\Media;
use App\Models\PointReward;
use App\Services\CompanyService;
use App\Services\PointService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class CompanyController extends Controller
{
    public function __construct(
        private CompanyService $companyService,
        private PointService $pointService,
    ) {}

    /**
     * 一覧
     */
    public function index(Request $request): Response
    {
        // フィルター
        $filters = [
            'search' => $request->input('search'),
            'status' => $request->input('status'),
            'company_type' => $request->input('company_type'),
            'industry' => $request->input('industry'),
            'trashed' => $request->input('trashed', 'without_trashed'), // デフォルトは削除されていないもの
        ];
        // ソート
        $sort = [
            'field' => $request->input('sort_field', 'created_at'),
            'direction' => $request->input('sort_direction', 'desc'),
        ];
        // 会社のページネーション取得
        $companies = $this->companyService->getPaginated($filters, $sort, 20);
        // 統計情報の取得
        $stats = $this->companyService->getStats();

        return Inertia::render('Admin/Company/Index', [
            'companies' => $companies,
            'stats'     => $stats,
            'filters'   => $filters,
            'statuses'  => $this->companyService->getStatuses(),
        ]);
    }

    /**
     * 新規作成フォーム
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Company/Create', [
            'companyTypes' => Company::TYPES,
            'statuses'     => Company::STATUSES,
            'addressTypes' => Address::TYPES,
        ]);
    }

    /**
     * 保存
     */
    public function store(CompanyRequest $request): RedirectResponse
    {
        try {
            $this->companyService->create($request->validated());

            return redirect()->route('admin.company.index')
                ->with('success', __('messages.created', ['attribute' => '会社情報']));
        } catch (\Exception $e) {
            Log::error('Service store error: ' . $e->getMessage());
            return redirect()->back()
                ->withInput()
                ->with('error', __('messages.create_failed', ['attribute' => '会社情報']));
        }
    }

    /**
     * 詳細表示
     */
    public function show(Company $company): Response
    {
        $company->load(['addresses', 'users.profile', 'media']);
        // 見積もりを取得
        $quotes = $company->quotes()
            ->with(['user.profile', 'contact', 'currentVersion'])
            ->orderBy('created_at', 'desc')
            ->get();
        // 請求書を取得
        $invoices = $company->invoices()
            ->with('client_downloaded_by')
            ->orderBy('issue_date', 'desc')
            ->get();
        // 領収書を取得
        $receipts = $company->receipts()
            ->with(['invoice', 'client_downloaded_by'])
            ->orderBy('issued_at', 'desc')
            ->get();
        // 決済を取得
        $payments = $company->payments()
            ->with(['invoice', 'confirmed_by'])
            ->orderBy('payment_date', 'desc')
            ->get();
        // 統計情報を計算
        $stats = [
            'totalPaid' => $invoices->where('status', 'paid')->sum('total_amount'),
        ];

        // 画像選択用のメディア一覧を取得
        $mediaList = Media::where('type', 'image')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn ($media) => [
                'id' => $media->id,
                'title' => $media->title,
                'file_name' => $media->original_filename,
                'alt_text' => $media->alt_text,
                'url' => $media->url,
                'file_size' => $media->original_file_size,
            ]);

        // ポイント残高・履歴を取得
        $membership = $company->membership()->with('currentRank')->first() ?: new CompanyMembership([
            'points_balance' => 0,
            'lifetime_points' => 0,
            'annual_usage_amount' => 0,
        ]);
        $pointTransactions = $company->pointTransactions()
            ->with(['pointReward', 'receipt', 'referral'])
            ->limit(100)
            ->get();
        $activePointRewards = PointReward::active()->orderBy('name')->get(['id', 'code', 'name', 'points']);

        return Inertia::render('Admin/Company/Show', [
            'company'            => $company,
            'addressTypes'       => Address::TYPES,
            'quotes'             => $quotes,
            'invoices'           => $invoices,
            'receipts'           => $receipts,
            'payments'           => $payments,
            'stats'              => $stats,
            'mediaList'          => $mediaList,
            'membership'         => $membership,
            'pointTransactions'  => $pointTransactions,
            'activePointRewards' => $activePointRewards,
        ]);
    }

    /**
     * 編集フォーム
     */
    public function edit(Company $company): Response
    {
        $company->load('addresses');

        return Inertia::render('Admin/Company/Edit', [
            'company'      => $company,
            'companyTypes' => Company::TYPES,
            'statuses'     => Company::STATUSES,
            'addressTypes' => Address::TYPES,
        ]);
    }

    /**
     * 更新
     */
    public function update(CompanyRequest $request, Company $company): RedirectResponse
    {
        // 更新処理
        try {
            $this->companyService->update($company, $request->validated());

            return redirect()->route('admin.company.index')
                ->with('success', __('messages.updated', ['attribute' => '会社情報']));
        } catch (\Exception $e) {
            Log::error('Service update error: ' . $e->getMessage());
            return redirect()->back()
                ->withInput()
                ->with('error', __('messages.update_failed', ['attribute' => '会社情報']));
        }
    }

    /**
     * 削除
     */
    public function destroy(Company $company): RedirectResponse
    {
        // 関連するユーザーが存在する場合は削除できないようにする
        if ($company->users()->exists()) {
            return redirect()->route('admin.company.index')
                ->with('error', __('messages.company.has_users'));
        }
        // 削除処理
        try {
            $this->companyService->delete($company);

            return redirect()->route('admin.company.index')
                ->with('success', __('messages.deleted', ['attribute' => '会社情報']));
        } catch (\Exception $e) {
            Log::error('Company delete error: ' . $e->getMessage());
            return redirect()->back()
                ->with('error', __('messages.delete_failed', ['attribute' => '会社情報']));
        }
    }

    /**
     * 一括削除
     */
    public function bulkDestroy(Request $request): RedirectResponse
    {
        $request->validate([
            'ids'   => 'required|array',
            'ids.*' => 'string|exists:companies,id',
        ]);
        // 関連するユーザーが存在する会社が含まれている場合は削除できないようにする
        $ids = $request->ids;

        if (Company::whereIn('id', $ids)->whereHas('users')->exists()) {
            return redirect()->route('admin.company.index')
                ->with('error', __('messages.company.has_users_selected'));
        }

        $count = $this->companyService->bulkDelete($ids);

        return redirect()->route('admin.company.index')
            ->with('success', "{$count}件の会社情報を削除しました。");
    }

    /**
     * ステータス切り替え
     */
    public function toggleStatus(Company $company): RedirectResponse
    {
        $newStatus = $company->status === 'active' ? 'inactive' : 'active';
        $this->companyService->update($company, ['status' => $newStatus]);
        // ステータス名を取得
        $statusName = Company::STATUSES[$newStatus];

        return redirect()->route('admin.company.index')
            ->with('success', "会社のステータスを「{$statusName}」に変更しました。");
    }

    // -------------------------
    // 住所 API
    // -------------------------

    /**
     * 住所を追加
     */
    public function storeAddress(Request $request, Company $company)
    {
        $validated = $request->validate([
            'type'           => ['required', 'string', 'in:' . implode(',', array_keys(Address::TYPES))],
            'label'          => 'nullable|string|max:100',
            'postal_code'    => 'required|string|max:8',
            'prefecture'     => 'required|string|max:10',
            'city'           => 'required|string|max:100',
            'district'       => 'nullable|string|max:100',
            'address_other'  => 'nullable|string|max:255',
            'phone'          => 'nullable|string|max:20',
            'contact_person' => 'nullable|string|max:100',
            'is_default'     => 'boolean',
            'is_active'      => 'boolean',
            'notes'          => 'nullable|string|max:1000',
        ]);

        $address = $this->companyService->addAddress($company, $validated);

        return response()->json($address, 201);
    }

    /**
     * 住所を更新
     */
    public function updateAddress(Request $request, Company $company, Address $address)
    {
        $validated = $request->validate([
            'type'           => ['required', 'string', 'in:' . implode(',', array_keys(Address::TYPES))],
            'label'          => 'nullable|string|max:100',
            'postal_code'    => 'required|string|max:8',
            'prefecture'     => 'required|string|max:10',
            'city'           => 'required|string|max:100',
            'district'       => 'nullable|string|max:100',
            'address_other'  => 'nullable|string|max:255',
            'phone'          => 'nullable|string|max:20',
            'contact_person' => 'nullable|string|max:100',
            'is_default'     => 'boolean',
            'is_active'      => 'boolean',
            'notes'          => 'nullable|string|max:1000',
        ]);

        $address = $this->companyService->updateAddress($company, $address, $validated);

        return response()->json($address);
    }

    /**
     * 住所を削除
     */
    public function destroyAddress(Company $company, Address $address)
    {
        $this->companyService->deleteAddress($company, $address);

        return response()->json(['message' => '住所を削除しました']);
    }

    // -------------------------
    // 会社画像（ロゴ）
    // -------------------------

    /**
     * 会社画像を設定
     */
    public function attachMedia(Request $request, Company $company): RedirectResponse
    {
        $validated = $request->validate([
            'media_id' => ['required', 'exists:media,id'],
        ]);

        try {
            $company->update(['media_id' => $validated['media_id']]);

            return back()->with('success', __('messages.set', ['attribute' => '会社画像']));
        } catch (\Exception $e) {
            Log::error('会社画像設定エラー', [
                'message' => $e->getMessage(),
                'company_id' => $company->id,
                'media_id' => $validated['media_id'],
            ]);

            return back()->with('error', __('messages.set_failed', ['attribute' => '画像']));
        }
    }

    /**
     * 会社画像を削除
     */
    public function detachMedia(Company $company): RedirectResponse
    {
        try {
            $company->update(['media_id' => null]);

            return back()->with('success', __('messages.deleted', ['attribute' => '会社画像']));
        } catch (\Exception $e) {
            Log::error('会社画像削除エラー', [
                'message' => $e->getMessage(),
                'company_id' => $company->id,
            ]);

            return back()->with('error', __('messages.delete_failed', ['attribute' => '画像']));
        }
    }

    /**
     * ポイントを手動付与（PointRewardマスタのルールに基づく）
     */
    public function grantPoints(Request $request, Company $company): RedirectResponse
    {
        $validated = $request->validate([
            'reward_code' => ['required', 'exists:point_rewards,code'],
        ]);

        $transaction = $this->pointService->grantReward($company->id, $validated['reward_code']);

        if (!$transaction) {
            return back()->with('error', __('messages.company.point_grant_failed'));
        }

        return back()->with('success', "{$transaction->points}ポイントを付与しました。");
    }
}
