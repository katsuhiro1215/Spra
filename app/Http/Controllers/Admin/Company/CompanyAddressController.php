<?php

namespace App\Http\Controllers\Admin\Company;

use App\Http\Controllers\Controller;
use App\Http\Requests\AddressRequest;
use App\Models\Company;
use App\Models\Address;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CompanyAddressController extends Controller
{
    /**
     * 住所作成画面
     */
    public function create(Company $company): Response
    {
        return Inertia::render('Admin/Companies/Address/Create', [
            'company' => $company,
            'types' => $this->getAddressTypes(),
        ]);
    }

    /**
     * 住所作成処理
     */
    public function store(AddressRequest $request, Company $company): RedirectResponse
    {
        $company->addresses()->create($request->validated());

        return redirect()
            ->route('admin.company.show', $company)
            ->with('success', '住所を追加しました。');
    }

    /**
     * 住所編集画面
     */
    public function edit(Company $company, Address $address): Response
    {
        return Inertia::render('Admin/Companies/Address/Edit', [
            'company' => $company,
            'address' => $address,
            'types' => $this->getAddressTypes(),
        ]);
    }

    /**
     * 住所更新処理
     */
    public function update(AddressRequest $request, Company $company, Address $address): RedirectResponse
    {
        $address->update($request->validated());

        return redirect()
            ->route('admin.company.show', $company)
            ->with('success', '住所を更新しました。');
    }

    /**
     * 住所削除処理
     */
    public function destroy(Company $company, Address $address): RedirectResponse
    {
        $address->delete();

        return redirect()
            ->route('admin.company.show', $company)
            ->with('success', '住所を削除しました。');
    }

    /**
     * 住所タイプ定義を取得
     */
    private function getAddressTypes(): array
    {
        return [
            ['value' => 'home', 'label' => '自宅'],
            ['value' => 'office', 'label' => 'オフィス'],
            ['value' => 'billing', 'label' => '請求先'],
            ['value' => 'shipping', 'label' => '配送先'],
            ['value' => 'other', 'label' => 'その他'],
        ];
    }
}
