<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\AccountUpdateRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

/**
 * User自身のログイン用メールアドレス・パスワード・アカウント削除。
 * 氏名・電話番号などの個人情報は別コントローラー（app/Http/Controllers/User/ProfileController）が担当する。
 */
class AccountController extends Controller
{
    /**
     * アカウント設定画面
     */
    public function edit(): Response
    {
        return Inertia::render('User/Account/Edit', [
            'status' => session('status'),
        ]);
    }

    /**
     * メールアドレスの更新
     */
    public function update(AccountUpdateRequest $request): RedirectResponse
    {
        $user = $request->user('users');
        $user->fill($request->validated());
        $user->save();

        return Redirect::route('user.profile.edit');
    }

    /**
     * アカウントの削除
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password:users'],
        ]);

        $user = Auth::guard('users')->user();

        Auth::guard('users')->logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
