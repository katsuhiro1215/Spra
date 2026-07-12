<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SecuritySettingsController extends Controller
{
    /**
     * セキュリティ設定画面を表示
     */
    public function edit(): Response
    {
        return Inertia::render('Admin/Settings/Security', [
            'twoFactorEnabled' => auth('admins')->user()->two_factor_enabled,
        ]);
    }

    /**
     * 二段階認証の有効・無効を更新
     */
    public function update(Request $request): RedirectResponse
    {
        $request->validate([
            'two_factor_enabled' => ['required', 'boolean'],
        ]);

        auth('admins')->user()->update([
            'two_factor_enabled' => $request->boolean('two_factor_enabled'),
        ]);

        return back()->with(
            'success',
            $request->boolean('two_factor_enabled')
                ? '二段階認証を有効にしました。次回ログイン時からメールで認証コードが送信されます。'
                : '二段階認証を無効にしました。'
        );
    }
}
