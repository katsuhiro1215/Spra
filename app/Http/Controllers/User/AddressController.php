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
        $user = auth('users')->user();
        $company = $user->companies()->first();
        $address = $company?->addresses()->where('type', 'office')->first();

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
        ]);
    }

    /**
     * Store address information
     */
    public function store(Request $request): RedirectResponse
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
            'district' => $validated['district'],
            'address_other' => $validated['address_other'],
            'phone' => $validated['phone'],
        ]);

        if (!$address->exists) {
            $address->addressable_type = 'App\Models\Company';
            $address->addressable_id = $company->id;
        }

        $address->save();

        return redirect()->route('user.dashboard')
            ->with('success', '登録完了！管理者の確認後、契約書をお送りします。');
    }
}
