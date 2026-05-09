<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProfileRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class UserProfileController extends Controller
{
    /**
     * プロフィール作成画面
     */
    public function create(User $user): Response
    {
        return Inertia::render('Admin/Users/Profile/Create', [
            'user' => $user,
        ]);
    }

    /**
     * プロフィール作成処理
     */
    public function store(ProfileRequest $request, User $user): RedirectResponse
    {
        $user->profile()->create($request->validated());

        return redirect()
            ->route('admin.user.show', $user)
            ->with('success', 'プロフィールを作成しました。');
    }

    /**
     * プロフィール編集画面
     */
    public function edit(User $user): Response
    {
        $user->load('profile');

        return Inertia::render('Admin/Users/Profile/Edit', [
            'user' => $user,
        ]);
    }

    /**
     * プロフィール更新処理
     */
    public function update(ProfileRequest $request, User $user): RedirectResponse
    {
        $user->profile->update($request->validated());

        return redirect()
            ->route('admin.user.show', $user)
            ->with('success', 'プロフィールを更新しました。');
    }

    /**
     * プロフィール画像を設定
     */
    public function attachMedia(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'media_id' => ['required', 'exists:media,id'],
        ]);

        try {
            // プロフィールが存在しない場合は作成
            if (!$user->profile) {
                // メールアドレスから仮の名前を作成
                $emailParts = explode('@', $user->email);
                $displayName = $emailParts[0];

                $user->profile()->create([
                    'display_name' => $displayName,
                    'media_id' => $validated['media_id'],
                ]);
            } else {
                // メディアを設定
                $user->profile->update([
                    'media_id' => $validated['media_id'],
                ]);
            }

            return back()->with('success', 'プロフィール画像を設定しました。');
        } catch (\Exception $e) {
            Log::error('プロフィール画像設定エラー', [
                'message' => $e->getMessage(),
                'user_id' => $user->id,
                'media_id' => $validated['media_id'],
            ]);

            return back()->with('error', '画像の設定に失敗しました。');
        }
    }

    /**
     * プロフィール画像を削除
     */
    public function detachMedia(User $user): RedirectResponse
    {
        try {
            if ($user->profile) {
                $user->profile->update([
                    'media_id' => null,
                ]);
            }

            return back()->with('success', 'プロフィール画像を削除しました。');
        } catch (\Exception $e) {
            Log::error('プロフィール画像削除エラー', [
                'message' => $e->getMessage(),
                'user_id' => $user->id,
            ]);

            return back()->with('error', '画像の削除に失敗しました。');
        }
    }
}
