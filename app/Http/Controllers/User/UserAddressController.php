<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class UserAddressController extends Controller
{
    // Userご本人のAddress（会社住所とは別に管理する個人の住所）

    /**
     * Show personal address form for editing from Settings
     */
    public function edit(): Response
    {
        $user = auth('users')->user();
        $address = $user->addresses()->where('type', 'home')->first();

        return Inertia::render('User/Onboarding/AddressForm', [
            'user' => $user,
            'address' => $address ? [
                'postal_code' => $address->postal_code,
                'prefecture' => $address->prefecture,
                'city' => $address->city,
                'district' => $address->district,
                'address_other' => $address->address_other,
                'phone' => $address->phone,
            ] : [],
            'submitRoute' => route('user.settings.address.update'),
            'cancelRoute' => route('user.settings.index'),
            'submitLabel' => '保存する',
            'heading' => 'ご自身の住所',
            'description' => 'ご自身の住所を入力してください',
        ]);
    }

    /**
     * Update personal address information
     */
    public function update(Request $request): RedirectResponse
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

        $address = $user->addresses()->where('type', 'home')->first() ??
            $user->addresses()->make(['type' => 'home']);

        $address->fill([
            'postal_code' => $validated['postal_code'],
            'prefecture' => $validated['prefecture'],
            'city' => $validated['city'],
            'district' => $validated['district'] ?? null,
            'address_other' => $validated['address_other'],
            'phone' => $validated['phone'] ?? null,
        ]);

        if (!$address->exists) {
            $address->addressable_type = 'App\Models\User';
            $address->addressable_id = $user->id;
        }

        $address->save();

        return redirect()->route('user.settings.index')
            ->with('success', 'ご自身の住所を更新しました');
    }
}
