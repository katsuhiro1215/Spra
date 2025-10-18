<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\UserAddress;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;

class CompanyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = Company::with(['addresses', 'users']);

        // 検索フィルター
        if ($request->filled('search')) {
            $query->search($request->search);
        }

        if ($request->filled('company_type')) {
            $query->byType($request->company_type);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('prefecture')) {
            $query->where('prefecture', $request->prefecture);
        }

        // ソート
        $sortField = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        $companies = $query->paginate(15)->withQueryString();

        // 統計情報
        $stats = [
            'total' => Company::count(),
            'individual' => Company::byType('individual')->count(),
            'corporate' => Company::byType('corporate')->count(),
            'active' => Company::active()->count(),
            'inactive' => Company::where('status', 'inactive')->count(),
        ];

        // 都道府県リスト（フィルター用）
        $prefectures = Company::select('prefecture')
            ->whereNotNull('prefecture')
            ->distinct()
            ->orderBy('prefecture')
            ->pluck('prefecture');

        return Inertia::render('Admin/Companies/Index', [
            'companies' => $companies,
            'stats' => $stats,
            'prefectures' => $prefectures,
            'filters' => $request->only(['search', 'company_type', 'status', 'prefecture']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Companies/Create', [
            'companyTypes' => Company::COMPANY_TYPES,
            'statuses' => Company::STATUSES,
            'addressTypes' => UserAddress::TYPES,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'company_type' => ['required', Rule::in(array_keys(Company::COMPANY_TYPES))],
            'legal_name' => 'nullable|string|max:255',
            'registration_number' => 'nullable|string|max:20|unique:companies,registration_number',
            'tax_number' => 'nullable|string|max:20',
            'phone' => 'nullable|string|max:20',
            'fax' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'website' => 'nullable|url|max:255',
            'representative_name' => 'nullable|string|max:255',
            'representative_title' => 'nullable|string|max:100',
            'representative_email' => 'nullable|email|max:255',
            'representative_phone' => 'nullable|string|max:20',
            'business_description' => 'nullable|string|max:1000',
            'industry' => 'nullable|string|max:100',
            'employee_count' => 'nullable|integer|min:1',
            'capital' => 'nullable|numeric|min:0',
            'established_date' => 'nullable|date',
            'status' => ['required', Rule::in(array_keys(Company::STATUSES))],
            'notes' => 'nullable|string|max:1000',

            // 住所情報
            'addresses' => 'nullable|array',
            'addresses.*.type' => ['required', Rule::in(array_keys(UserAddress::TYPES))],
            'addresses.*.label' => 'nullable|string|max:100',
            'addresses.*.postal_code' => 'required|string|max:8',
            'addresses.*.prefecture' => 'required|string|max:10',
            'addresses.*.city' => 'required|string|max:100',
            'addresses.*.district' => 'nullable|string|max:100',
            'addresses.*.address_other' => 'nullable|string|max:255',
            'addresses.*.phone' => 'nullable|string|max:20',
            'addresses.*.contact_person' => 'nullable|string|max:100',
            'addresses.*.is_default' => 'boolean',
        ]);

        DB::transaction(function () use ($validated) {
            // 会社情報を作成
            $company = Company::create($validated);

            // 住所情報を作成
            if (!empty($validated['addresses'])) {
                foreach ($validated['addresses'] as $addressData) {
                    $company->addresses()->create($addressData);
                }
            }
        });

        return redirect()->route('admin.companies.index')
            ->with('success', '会社情報を作成しました。');
    }

    /**
     * Display the specified resource.
     */
    public function show(Company $company): Response
    {
        $company->load(['addresses', 'users.addresses']);

        return Inertia::render('Admin/Companies/Show', [
            'company' => $company,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Company $company): Response
    {
        $company->load('addresses');

        return Inertia::render('Admin/Companies/Edit', [
            'company' => $company,
            'companyTypes' => Company::COMPANY_TYPES,
            'statuses' => Company::STATUSES,
            'addressTypes' => UserAddress::TYPES,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Company $company): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'company_type' => ['required', Rule::in(array_keys(Company::COMPANY_TYPES))],
            'legal_name' => 'nullable|string|max:255',
            'registration_number' => [
                'nullable',
                'string',
                'max:20',
                Rule::unique('companies', 'registration_number')->ignore($company->id)
            ],
            'tax_number' => 'nullable|string|max:20',
            'phone' => 'nullable|string|max:20',
            'fax' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'website' => 'nullable|url|max:255',
            'representative_name' => 'nullable|string|max:255',
            'representative_title' => 'nullable|string|max:100',
            'representative_email' => 'nullable|email|max:255',
            'representative_phone' => 'nullable|string|max:20',
            'business_description' => 'nullable|string|max:1000',
            'industry' => 'nullable|string|max:100',
            'employee_count' => 'nullable|integer|min:1',
            'capital' => 'nullable|numeric|min:0',
            'established_date' => 'nullable|date',
            'status' => ['required', Rule::in(array_keys(Company::STATUSES))],
            'notes' => 'nullable|string|max:1000',

            // 住所情報
            'addresses' => 'nullable|array',
            'addresses.*.id' => 'nullable|integer|exists:user_addresses,id',
            'addresses.*.type' => ['required', Rule::in(array_keys(UserAddress::TYPES))],
            'addresses.*.label' => 'nullable|string|max:100',
            'addresses.*.postal_code' => 'required|string|max:8',
            'addresses.*.prefecture' => 'required|string|max:10',
            'addresses.*.city' => 'required|string|max:100',
            'addresses.*.district' => 'nullable|string|max:100',
            'addresses.*.address_other' => 'nullable|string|max:255',
            'addresses.*.phone' => 'nullable|string|max:20',
            'addresses.*.contact_person' => 'nullable|string|max:100',
            'addresses.*.is_default' => 'boolean',
            'addresses.*.is_active' => 'boolean',
        ]);

        DB::transaction(function () use ($validated, $company) {
            // 会社情報を更新
            $company->update($validated);

            // 住所情報を更新
            if (isset($validated['addresses'])) {
                $existingAddressIds = collect($validated['addresses'])
                    ->pluck('id')
                    ->filter()
                    ->toArray();

                // 削除された住所を削除
                $company->addresses()
                    ->whereNotIn('id', $existingAddressIds)
                    ->delete();

                // 住所を更新または作成
                foreach ($validated['addresses'] as $addressData) {
                    if (isset($addressData['id'])) {
                        // 既存住所を更新
                        $address = $company->addresses()->find($addressData['id']);
                        if ($address) {
                            $address->update($addressData);
                        }
                    } else {
                        // 新規住所を作成
                        $company->addresses()->create($addressData);
                    }
                }
            }
        });

        return redirect()->route('admin.companies.index')
            ->with('success', '会社情報を更新しました。');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Company $company): RedirectResponse
    {
        // 関連するユーザーがいる場合は削除を防ぐ
        if ($company->users()->exists()) {
            return redirect()->route('admin.companies.index')
                ->with('error', 'この会社には関連するユーザーが存在するため削除できません。');
        }

        $company->delete();

        return redirect()->route('admin.companies.index')
            ->with('success', '会社情報を削除しました。');
    }

    /**
     * 一括削除
     */
    public function bulkDestroy(Request $request): RedirectResponse
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:companies,id',
        ]);

        $companies = Company::whereIn('id', $request->ids);

        // ユーザーが関連している会社があるかチェック
        $companiesWithUsers = $companies->whereHas('users')->count();
        if ($companiesWithUsers > 0) {
            return redirect()->route('admin.companies.index')
                ->with('error', '選択した会社の中に関連するユーザーが存在するものがあるため削除できません。');
        }

        $count = $companies->count();
        $companies->delete();

        return redirect()->route('admin.companies.index')
            ->with('success', "{$count}件の会社情報を削除しました。");
    }

    /**
     * ステータス切り替え
     */
    public function toggleStatus(Company $company): RedirectResponse
    {
        $newStatus = $company->status === 'active' ? 'inactive' : 'active';
        $company->update(['status' => $newStatus]);

        $statusName = Company::STATUSES[$newStatus];
        return redirect()->route('admin.companies.index')
            ->with('success', "会社のステータスを「{$statusName}」に変更しました。");
    }

    /**
     * 住所を追加
     */
    public function storeAddress(Request $request, Company $company)
    {
        $validated = $request->validate([
            'type' => 'required|in:home,office,billing,shipping,branch,other',
            'label' => 'nullable|string|max:255',
            'postal_code' => 'required|string|max:8',
            'prefecture' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'district' => 'nullable|string|max:255',
            'address_other' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:255',
            'contact_person' => 'nullable|string|max:255',
            'is_default' => 'boolean',
            'notes' => 'nullable|string',
        ]);

        // デフォルト住所の場合、他のデフォルトを解除
        if ($validated['is_default'] ?? false) {
            $company->addresses()->update(['is_default' => false]);
        }

        $address = $company->addresses()->create($validated);

        return response()->json($address);
    }

    /**
     * 住所を更新
     */
    public function updateAddress(Request $request, Company $company, UserAddress $address)
    {
        // この住所が指定された会社のものかチェック
        if ($address->addressable_id !== $company->id || $address->addressable_type !== Company::class) {
            abort(404);
        }

        $validated = $request->validate([
            'type' => 'required|in:home,office,billing,shipping,branch,other',
            'label' => 'nullable|string|max:255',
            'postal_code' => 'required|string|max:8',
            'prefecture' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'district' => 'nullable|string|max:255',
            'address_other' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:255',
            'contact_person' => 'nullable|string|max:255',
            'is_default' => 'boolean',
            'notes' => 'nullable|string',
        ]);

        // デフォルト住所の場合、他のデフォルトを解除
        if ($validated['is_default'] ?? false) {
            $company->addresses()->where('id', '!=', $address->id)->update(['is_default' => false]);
        }

        $address->update($validated);

        return response()->json($address);
    }

    /**
     * 住所を削除
     */
    public function destroyAddress(Company $company, UserAddress $address)
    {
        // この住所が指定された会社のものかチェック
        if ($address->addressable_id !== $company->id || $address->addressable_type !== Company::class) {
            abort(404);
        }

        $address->delete();

        return response()->json(['message' => '住所を削除しました']);
    }
}
