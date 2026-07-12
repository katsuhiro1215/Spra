<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AddressController extends Controller
{
    // UserのAddress

    // CompanyのAddress

    /**
     * Show address form for onboarding
     */
    public function create(): Response
    {
        return $this->form(
            route('user.onboarding.address.store'),
            route('user.dashboard'),
            '登録完了',
        );
    }

    /**
     * Show address form for editing from Settings
     */
    public function edit(): Response
    {
        return $this->form(
            route('user.settings.company-address.update'),
            route('user.settings.index'),
            '保存する',
        );
    }

    private function form(string $submitRoute, string $cancelRoute, string $submitLabel): Response
    {
        $user = auth('users')->user();
        $company = $user->companies()->first();
        $address = $company?->addresses()->where('type', 'office')->first();

        return Inertia::render('User/Onboarding/AddressForm', [
            'user' => $user,
            'submitRoute' => $submitRoute,
            'cancelRoute' => $cancelRoute,
            'submitLabel' => $submitLabel,
            'heading' => '会社住所',
            'description' => '会社の住所を入力してください',
            'address' => $address ? [
                'postal_code' => $address->postal_code,
                'prefecture' => $address->prefecture,
                'city' => $address->city,
                'district' => $address->district,
                'address_other' => $address->address_other,
                'phone' => $address->phone,
            ] : [],
        ]);
    }

    /**
     * Store address information (onboarding)
     */
    public function store(Request $request): RedirectResponse
    {
        $this->save($request);

        return redirect()->route('user.dashboard')
            ->with('success', '登録完了！管理者の確認後、契約書をお送りします。');
    }

    /**
     * Update address information (Settings)
     */
    public function update(Request $request): RedirectResponse
    {
        $this->save($request);

        return redirect()->route('user.settings.index')
            ->with('success', '会社住所を更新しました');
    }

    private function save(Request $request): void
    {
        $user = auth('users')->user();

        $validated = $request->validate([
            'postal_code' => 'required|string|regex:/^\d{3}-\d{4}$/',
            'prefecture' => 'required|string|max:50',
            'city' => 'required|string|max:100',
            'district' => 'nullable|string|max:100',
            'address_other' => 'required|string|max:255',
            'phone' => 'nullable|string|regex:/^[\d\-]+$/',
        ]);

        $company = $user->companies()->firstOrFail();
        $address = $company->addresses()->where('type', 'office')->first() ??
            $company->addresses()->make(['type' => 'office']);

        $address->fill([
            'postal_code' => $validated['postal_code'],
            'prefecture' => $validated['prefecture'],
            'city' => $validated['city'],
            'district' => $validated['district'] ?? null,
            'address_other' => $validated['address_other'],
            'phone' => $validated['phone'] ?? null,
        ]);

        if (!$address->exists) {
            $address->addressable_type = 'App\Models\Company';
            $address->addressable_id = $company->id;
        }

        $address->save();
    }
}
