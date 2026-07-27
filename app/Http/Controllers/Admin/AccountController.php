<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AccountUpdateRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

/**
 * 管理者自身のログイン用メールアドレス・パスワード・アカウント削除。
 * Userとは完全に別コントローラー（app/Http/Controllers/User/AccountController）。
 */
class AccountController extends Controller
{
    /**
     * アカウント設定画面
     */
    public function edit(): Response
    {
        return Inertia::render('Admin/Account/Edit', [
            'status' => session('status'),
        ]);
    }

    /**
     * メールアドレスの更新
     */
    public function update(AccountUpdateRequest $request): RedirectResponse
    {
        $admin = $request->user('admins');
        $admin->fill($request->validated());
        $admin->save();

        return Redirect::route('admin.profile.edit');
    }

    /**
     * アカウントの削除
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password:admins'],
        ]);

        $admin = Auth::guard('admins')->user();

        Auth::guard('admins')->logout();

        $admin->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::route('admin.login');
    }
}
