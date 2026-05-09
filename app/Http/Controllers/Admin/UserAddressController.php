<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\AddressRequest;
use App\Models\User;
use App\Models\Address;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class UserAddressController extends Controller
{
    /**
     * 住所作成画面
     */
    public function create(User $user): Response
    {
        return Inertia::render('Admin/Users/Address/Create', [
            'user' => $user,
            'types' => $this->getAddressTypes(),
        ]);
    }

    /**
     * 住所作成処理
     */
    public function store(AddressRequest $request, User $user): RedirectResponse
    {
        $user->addresses()->create($request->validated());

        return redirect()
            ->route('admin.users.show', $user)
            ->with('success', '住所を追加しました。');
    }

    /**
     * 住所編集画面
     */
    public function edit(User $user, Address $address): Response
    {
        return Inertia::render('Admin/Users/Address/Edit', [
            'user' => $user,
            'address' => $address,
            'types' => $this->getAddressTypes(),
        ]);
    }

    /**
     * 住所更新処理
     */
    public function update(AddressRequest $request, User $user, Address $address): RedirectResponse
    {
        $address->update($request->validated());

        return redirect()
            ->route('admin.users.show', $user)
            ->with('success', '住所を更新しました。');
    }

    /**
     * 住所削除処理
     */
    public function destroy(User $user, Address $address): RedirectResponse
    {
        $address->delete();

        return redirect()
            ->route('admin.users.show', $user)
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
