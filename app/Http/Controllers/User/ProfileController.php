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
        return $this->form(
            route('user.onboarding.profile.store'),
            route('user.dashboard'),
            '次に進む',
        );
    }

    /**
     * Show profile form for editing from Settings
     */
    public function edit(): Response
    {
        return $this->form(
            route('user.settings.profile.update'),
            route('user.settings.index'),
            '保存する',
        );
    }

    private function form(string $submitRoute, string $cancelRoute, string $submitLabel): Response
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
            'submitRoute' => $submitRoute,
            'cancelRoute' => $cancelRoute,
            'submitLabel' => $submitLabel,
        ]);
    }

    /**
     * Store profile information (onboarding)
     */
    public function store(Request $request): RedirectResponse
    {
        $this->save($request);

        return redirect()->route('user.dashboard')
            ->with('success', 'プロフィール情報を保存しました');
    }

    /**
     * Update profile information (Settings)
     */
    public function update(Request $request): RedirectResponse
    {
        $this->save($request);

        return redirect()->route('user.settings.index')
            ->with('success', 'プロフィール情報を更新しました');
    }

    private function save(Request $request): Profile
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
            'phone' => $validated['phone'] ?? null,
            'mobile' => $validated['mobile'],
            'birth_date' => $validated['birth_date'] ?? null,
            'gender' => $validated['gender'] ?? null,
        ]);

        if (!$profile->exists) {
            $profile->profilable_type = 'App\Models\User';
            $profile->profilable_id = $user->id;
        }

        $profile->save();

        return $profile;
    }
}
