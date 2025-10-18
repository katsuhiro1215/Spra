<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserProfile;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;

class UserProfileController extends Controller
{
    /**
     * Show the form for creating a new resource.
     */
    public function create(User $user): Response|RedirectResponse
    {
        // 既にプロフィールが存在する場合は編集画面にリダイレクト
        if ($user->profile) {
            return redirect()->route('admin.users.profile.edit', $user);
        }

        return Inertia::render('Admin/Users/ProfileForm', [
            'user' => $user,
            'profile' => null,
            'formAction' => route('admin.users.profile.store', $user),
            'genders' => UserProfile::GENDERS,
            'languages' => UserProfile::LANGUAGES,
            'timezones' => UserProfile::TIMEZONES,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user): Response
    {
        return Inertia::render('Admin/Users/ProfileDetail', [
            'user' => $user,
            'profile' => $user->profile,
            'genders' => UserProfile::GENDERS,
            'languages' => UserProfile::LANGUAGES,
            'timezones' => UserProfile::TIMEZONES,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, User $user): RedirectResponse
    {
        // 既にプロフィールが存在する場合はエラー
        if ($user->profile) {
            return redirect()->route('admin.users.show', $user)
                ->with('error', 'このユーザーのプロフィールは既に作成されています。');
        }

        $validated = $request->validate([
            'display_name' => 'nullable|string|max:255',
            'first_name' => 'nullable|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'first_name_kana' => 'nullable|string|max:255',
            'last_name_kana' => 'nullable|string|max:255',
            'birth_date' => 'nullable|date|before:today',
            'gender' => ['nullable', Rule::in(array_keys(UserProfile::GENDERS))],
            'phone_number' => 'nullable|string|max:20',
            'mobile_number' => 'nullable|string|max:20',
            'emergency_contact_name' => 'nullable|string|max:255',
            'emergency_contact_phone' => 'nullable|string|max:20',
            'emergency_contact_relationship' => 'nullable|string|max:100',
            'bio' => 'nullable|string|max:1000',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'website' => 'nullable|url|max:255',
            'social_links' => 'nullable|array',
            'occupation' => 'nullable|string|max:255',
            'job_title' => 'nullable|string|max:255',
            'education' => 'nullable|string|max:255',
            'skills' => 'nullable|string|max:1000',
            'preferred_language' => ['required', Rule::in(array_keys(UserProfile::LANGUAGES))],
            'timezone' => ['required', Rule::in(array_keys(UserProfile::TIMEZONES))],
            'notification_preferences' => 'nullable|array',
            'privacy_settings' => 'nullable|array',
            'postal_code' => 'nullable|string|max:8',
            'prefecture' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'district' => 'nullable|string|max:255',
            'address_other' => 'nullable|string|max:255',
            'is_public' => 'boolean',
            'notes' => 'nullable|string',
        ]);

        // アバター画像の処理
        if ($request->hasFile('avatar')) {
            $validated['avatar'] = $request->file('avatar')->store('avatars', 'public');
        }

        $validated['user_id'] = $user->id;

        UserProfile::create($validated);

        return redirect()->route('admin.users.show', $user)
            ->with('success', 'ユーザープロフィールを作成しました。');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user): Response|RedirectResponse
    {
        $profile = $user->profile;

        // プロフィールが存在しない場合は作成画面にリダイレクト
        if (!$profile) {
            return redirect()->route('admin.users.profile.create', $user);
        }

        return Inertia::render('Admin/Users/ProfileForm', [
            'user' => $user,
            'profile' => $profile,
            'formAction' => route('admin.users.profile.update', $user),
            'genders' => UserProfile::GENDERS,
            'languages' => UserProfile::LANGUAGES,
            'timezones' => UserProfile::TIMEZONES,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user): RedirectResponse
    {
        $profile = $user->profile;

        // プロフィールが存在しない場合はエラー
        if (!$profile) {
            return redirect()->route('admin.users.show', $user)
                ->with('error', 'プロフィールが見つかりません。');
        }

        $validated = $request->validate([
            'display_name' => 'nullable|string|max:255',
            'first_name' => 'nullable|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'first_name_kana' => 'nullable|string|max:255',
            'last_name_kana' => 'nullable|string|max:255',
            'birth_date' => 'nullable|date|before:today',
            'gender' => ['nullable', Rule::in(array_keys(UserProfile::GENDERS))],
            'phone_number' => 'nullable|string|max:20',
            'mobile_number' => 'nullable|string|max:20',
            'emergency_contact_name' => 'nullable|string|max:255',
            'emergency_contact_phone' => 'nullable|string|max:20',
            'emergency_contact_relationship' => 'nullable|string|max:100',
            'bio' => 'nullable|string|max:1000',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'website' => 'nullable|url|max:255',
            'social_links' => 'nullable|array',
            'occupation' => 'nullable|string|max:255',
            'job_title' => 'nullable|string|max:255',
            'education' => 'nullable|string|max:255',
            'skills' => 'nullable|string|max:1000',
            'preferred_language' => ['required', Rule::in(array_keys(UserProfile::LANGUAGES))],
            'timezone' => ['required', Rule::in(array_keys(UserProfile::TIMEZONES))],
            'notification_preferences' => 'nullable|array',
            'privacy_settings' => 'nullable|array',
            'postal_code' => 'nullable|string|max:8',
            'prefecture' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'district' => 'nullable|string|max:255',
            'address_other' => 'nullable|string|max:255',
            'is_public' => 'boolean',
            'is_verified' => 'boolean',
            'notes' => 'nullable|string',
        ]);

        // アバター画像の処理
        if ($request->hasFile('avatar')) {
            // 古い画像を削除
            if ($profile->avatar) {
                Storage::disk('public')->delete($profile->avatar);
            }
            $validated['avatar'] = $request->file('avatar')->store('avatars', 'public');
        }

        // 認証フラグが変更された場合、認証日時を更新
        if (isset($validated['is_verified']) && $validated['is_verified'] && !$profile->is_verified) {
            $validated['verified_at'] = now();
        } elseif (isset($validated['is_verified']) && !$validated['is_verified'] && $profile->is_verified) {
            $validated['verified_at'] = null;
        }

        $profile->update($validated);

        return redirect()->route('admin.users.show', $user)
            ->with('success', 'ユーザープロフィールを更新しました。');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user): RedirectResponse
    {
        $profile = $user->profile;

        // プロフィールが存在しない場合はエラー
        if (!$profile) {
            return redirect()->route('admin.users.show', $user)
                ->with('error', 'プロフィールが見つかりません。');
        }

        // アバター画像を削除
        if ($profile->avatar) {
            Storage::disk('public')->delete($profile->avatar);
        }

        $profile->delete();

        return redirect()->route('admin.users.show', $user)
            ->with('success', 'ユーザープロフィールを削除しました。');
    }

    /**
     * プロフィール認証の切り替え
     */
    public function toggleVerification(User $user): RedirectResponse
    {
        $profile = $user->profile;

        // プロフィールが存在しない場合はエラー
        if (!$profile) {
            return redirect()->route('admin.users.show', $user)
                ->with('error', 'プロフィールが見つかりません。');
        }

        $newStatus = !$profile->is_verified;
        $profile->update([
            'is_verified' => $newStatus,
            'verified_at' => $newStatus ? now() : null,
        ]);

        $statusText = $newStatus ? '認証済み' : '未認証';
        return redirect()->route('admin.users.show', $user)
            ->with('success', "プロフィールを「{$statusText}」に変更しました。");
    }
}
