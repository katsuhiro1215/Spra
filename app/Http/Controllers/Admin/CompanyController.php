<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\CompanyRequest;
use App\Models\Address;
use App\Models\Company;
use App\Services\CompanyService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CompanyController extends Controller
{
    public function __construct(
        private CompanyService $service
    ) {}

    /**
     * 一覧
     */
    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'company_type', 'status']);
        $sortField     = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');

        $companies = $this->service->getPaginated(
            $filters,
            15,
            $sortField,
            $sortDirection
        );

        return Inertia::render('Admin/Companies/Index', [
            'companies' => $companies,
            'stats'     => $this->service->getStats(),
            'filters'   => $filters,
        ]);
    }

    /**
     * 新規作成フォーム
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Companies/Create', [
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
        $this->service->create($request->validated());

        return redirect()->route('admin.companies.index')
            ->with('success', '会社情報を作成しました。');
    }

    /**
     * 詳細表示
     */
    public function show(Company $company): Response
    {
        $company->load(['addresses', 'users.profile']);

        return Inertia::render('Admin/Companies/Show', [
            'company'      => $company,
            'addressTypes' => Address::TYPES,
        ]);
    }

    /**
     * 編集フォーム
     */
    public function edit(Company $company): Response
    {
        $company->load('addresses');

        return Inertia::render('Admin/Companies/Edit', [
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
        $this->service->update($company, $request->validated());

        return redirect()->route('admin.companies.index')
            ->with('success', '会社情報を更新しました。');
    }

    /**
     * 削除
     */
    public function destroy(Company $company): RedirectResponse
    {
        if ($company->users()->exists()) {
            return redirect()->route('admin.companies.index')
                ->with('error', 'この会社には関連するユーザーが存在するため削除できません。');
        }

        $this->service->delete($company);

        return redirect()->route('admin.companies.index')
            ->with('success', '会社情報を削除しました。');
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

        $ids = $request->ids;

        if (Company::whereIn('id', $ids)->whereHas('users')->exists()) {
            return redirect()->route('admin.companies.index')
                ->with('error', '選択した会社の中に関連するユーザーが存在するものがあるため削除できません。');
        }

        $count = $this->service->bulkDelete($ids);

        return redirect()->route('admin.companies.index')
            ->with('success', "{$count}件の会社情報を削除しました。");
    }

    /**
     * ステータス切り替え
     */
    public function toggleStatus(Company $company): RedirectResponse
    {
        $newStatus = $company->status === 'active' ? 'inactive' : 'active';
        $this->service->update($company, ['status' => $newStatus]);

        $statusName = Company::STATUSES[$newStatus];
        return redirect()->route('admin.companies.index')
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

        $address = $this->service->addAddress($company, $validated);

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

        $address = $this->service->updateAddress($company, $address, $validated);

        return response()->json($address);
    }

    /**
     * 住所を削除
     */
    public function destroyAddress(Company $company, Address $address)
    {
        $this->service->deleteAddress($company, $address);

        return response()->json(['message' => '住所を削除しました']);
    }
}
