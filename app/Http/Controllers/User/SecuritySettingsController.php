<?php

namespace App\Http\Controllers\User;

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
        return Inertia::render('User/Settings/Security', [
            'twoFactorEnabled' => auth('users')->user()->two_factor_enabled,
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

        $user = auth('users')->user();

        if (! $request->boolean('two_factor_enabled')) {
            $user->disableTwoFactor();

            return back()->with('success', '二段階認証を無効にしました。');
        }

        // two_factor_enabled/two_factor_method は $fillable に含めていない
        // （2FAのマスタースイッチをまとめてマス代入可能にしたくないため）ので、
        // update()ではなく直接プロパティ代入+save()で永続化する。
        $user->two_factor_enabled = true;
        $user->two_factor_method = \App\Models\User::TWO_FACTOR_METHOD_EMAIL;
        $user->save();

        return back()->with(
            'success',
            '二段階認証を有効にしました。次回ログイン時からメールで認証コードが送信されます。'
        );
    }
}
