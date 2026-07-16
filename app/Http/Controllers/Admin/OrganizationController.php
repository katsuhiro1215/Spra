<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\OrganizationRequest;
use App\Models\Organization;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class OrganizationController extends Controller
{
    /**
     * 自社組織情報（シングルトン）を取得、なければ空レコードを作成
     */
    private function resolveOrganization(): Organization
    {
        return Organization::query()->firstOrCreate([], ['name' => '未設定']);
    }

    /**
     * 組織設定画面
     */
    public function edit(): Response
    {
        $organization = $this->resolveOrganization();
        $organization->load('defaultAddress');

        return Inertia::render('Admin/Organization/Edit', [
            'organization' => $organization,
            'address' => $organization->defaultAddress()->first(),
        ]);
    }

    /**
     * 組織設定更新
     */
    public function update(OrganizationRequest $request): RedirectResponse
    {
        $organization = $this->resolveOrganization();
        $validated = $request->validated();
        $addressData = $validated['address'] ?? null;
        unset($validated['address']);

        DB::transaction(function () use ($organization, $validated, $addressData) {
            $organization->update($validated);

            if ($addressData && array_filter($addressData)) {
                $organization->addresses()->updateOrCreate(
                    ['is_default' => true],
                    [
                        ...$addressData,
                        'type' => 'office',
                        'is_default' => true,
                        'is_active' => true,
                    ],
                );
            }
        });

        return redirect()
            ->route('admin.organization.edit')
            ->with('success', '組織情報を更新しました。');
    }
}
