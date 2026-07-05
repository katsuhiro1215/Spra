<?php

namespace App\Http\Controllers\Admin\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProfileRequest;
use App\Models\Admin;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class AdminProfileController extends Controller
{
    /**
     * プロフィール作成画面
     */
    public function create(Admin $admin): Response
    {
        $currentAdminId = auth('admins')->id();
        $isOtherAdmin = $admin->id !== $currentAdminId;

        return Inertia::render('Admin/Admin/Profile/Create', [
            'admin' => $admin,
            'isOtherAdmin' => $isOtherAdmin,
        ]);
    }

    /**
     * プロフィール作成処理
     */
    public function store(ProfileRequest $request, Admin $admin): RedirectResponse
    {
        $admin->profile()->create($request->validated());

        return redirect()
            ->route('admin.admin.show', $admin)
            ->with('success', 'プロフィールを作成しました。');
    }

    /**
     * プロフィール編集画面
     */
    public function edit(Admin $admin): Response
    {
        $currentAdminId = auth('admins')->id();
        $isOtherAdmin = $admin->id !== $currentAdminId;

        $admin->load('profile');

        return Inertia::render('Admin/Admin/Profile/Edit', [
            'admin' => $admin,
            'isOtherAdmin' => $isOtherAdmin,
        ]);
    }

    /**
     * プロフィール更新処理
     */
    public function update(ProfileRequest $request, Admin $admin): RedirectResponse
    {
        $admin->profile->update($request->validated());

        return redirect()
            ->route('admin.admin.show', $admin)
            ->with('success', 'プロフィールを更新しました。');
    }

    /**
     * プロフィール画像を設定
     */
    public function attachMedia(Request $request, Admin $admin): RedirectResponse
    {
        $validated = $request->validate([
            'media_id' => ['required', 'exists:media,id'],
        ]);

        try {
            // プロフィールが存在しない場合は作成
            if (!$admin->profile) {
                // メールアドレスから仮の名前を作成
                $emailParts = explode('@', $admin->email);
                $displayName = $emailParts[0];

                $admin->profile()->create([
                    'display_name' => $displayName,
                    'media_id' => $validated['media_id'],
                ]);
            } else {
                // メディアを設定
                $admin->profile->update([
                    'media_id' => $validated['media_id'],
                ]);
            }

            return back()->with('success', 'プロフィール画像を設定しました。');
        } catch (\Exception $e) {
            Log::error('プロフィール画像設定エラー', [
                'message' => $e->getMessage(),
                'admin_id' => $admin->id,
                'media_id' => $validated['media_id'],
            ]);

            return back()->with('error', '画像の設定に失敗しました。');
        }
    }

    /**
     * プロフィール画像を削除
     */
    public function detachMedia(Admin $admin): RedirectResponse
    {
        try {
            if ($admin->profile) {
                $admin->profile->update([
                    'media_id' => null,
                ]);
            }

            return back()->with('success', 'プロフィール画像を削除しました。');
        } catch (\Exception $e) {
            Log::error('プロフィール画像削除エラー', [
                'message' => $e->getMessage(),
                'admin_id' => $admin->id,
            ]);

            return back()->with('error', '画像の削除に失敗しました。');
        }
    }
}
