<?php

namespace App\Http\Controllers\Admin\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\AddressRequest;
use App\Models\Admin;
use App\Models\Address;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AdminAddressController extends Controller
{
    /**
     * 住所作成画面
     */
    public function create(Admin $admin): Response
    {
        $currentAdminId = auth('admins')->id();
        $isOtherAdmin = $admin->id !== $currentAdminId;

        return Inertia::render('Admin/Admin/Address/Create', [
            'admin' => $admin,
            'types' => $this->getAddressTypes(),
            'isOtherAdmin' => $isOtherAdmin,
        ]);
    }

    /**
     * 住所作成処理
     */
    public function store(AddressRequest $request, Admin $admin): RedirectResponse
    {
        $admin->addresses()->create($request->validated());

        return redirect()
            ->route('admin.admin.show', $admin)
            ->with('success', __('messages.added', ['attribute' => '住所']));
    }

    /**
     * 住所編集画面
     */
    public function edit(Admin $admin, Address $address): Response
    {
        $currentAdminId = auth('admins')->id();
        $isOtherAdmin = $admin->id !== $currentAdminId;

        return Inertia::render('Admin/Admin/Address/Edit', [
            'admin' => $admin,
            'address' => $address,
            'types' => $this->getAddressTypes(),
            'isOtherAdmin' => $isOtherAdmin,
        ]);
    }

    /**
     * 住所更新処理
     */
    public function update(AddressRequest $request, Admin $admin, Address $address): RedirectResponse
    {
        $address->update($request->validated());

        return redirect()
            ->route('admin.admin.show', $admin)
            ->with('success', __('messages.updated', ['attribute' => '住所']));
    }

    /**
     * 住所削除処理
     */
    public function destroy(Admin $admin, Address $address): RedirectResponse
    {
        $address->delete();

        return redirect()
            ->route('admin.admin.show', $admin)
            ->with('success', __('messages.deleted', ['attribute' => '住所']));
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
