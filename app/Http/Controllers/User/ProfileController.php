<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    // User(自分のみ)のProfile

    /**
     * Show profile form for onboarding
     */
    public function create(): Response
    {
        $user = auth('users')->user();
        $profile = $user->profile;

        return Inertia::render('User/Onboarding/ProfileForm', [
            'user' => $user,
            'profile' => $profile ? [
                'first_name' => $profile->first_name,
                'last_name' => $profile->last_name,
                'first_name_kana' => $profile->first_name_kana,
                'last_name_kana' => $profile->last_name_kana,
                'phone' => $profile->phone,
                'mobile' => $profile->mobile,
                'birth_date' => $profile->birth_date,
                'gender' => $profile->gender,
            ] : [],
        ]);
    }

    /**
     * Store profile information
     */
    public function store(Request $request): RedirectResponse
    {
        $user = auth('users')->user();

        $validated = $request->validate([
            'first_name' => 'required|string|max:50',
            'last_name' => 'required|string|max:50',
            'first_name_kana' => 'required|string|max:50',
            'last_name_kana' => 'required|string|max:50',
            'phone' => 'nullable|string|max:20',
            'mobile' => 'required|string|regex:/^[\d\-]+$/',
            'birth_date' => 'nullable|date',
            'gender' => 'nullable|in:male,female,other',
        ]);

        // Create or update profile
        $profile = $user->profile ?? new Profile();
        $profile->fill([
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'first_name_kana' => $validated['first_name_kana'],
            'last_name_kana' => $validated['last_name_kana'],
            'phone' => $validated['phone'],
            'mobile' => $validated['mobile'],
            'birth_date' => $validated['birth_date'],
            'gender' => $validated['gender'],
        ]);

        if (!$profile->exists) {
            $profile->profilable_type = 'App\Models\User';
            $profile->profilable_id = $user->id;
        }

        $profile->save();

        return redirect()->route('user.onboarding.company')
            ->with('success', 'プロフィール情報を保存しました');
    }
}
