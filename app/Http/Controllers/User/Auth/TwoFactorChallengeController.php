<?php

namespace App\Http\Controllers\User\Auth;

use App\Http\Controllers\Controller;
use App\Models\OneTimePassword;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class TwoFactorChallengeController extends Controller
{
    /**
     * 認証コード入力画面を表示
     */
    public function create(Request $request): Response|RedirectResponse
    {
        if (!$this->pendingIsValid($request)) {
            return redirect()->route('user.login');
        }

        return Inertia::render('User/Auth/TwoFactorChallenge');
    }

    /**
     * 認証コードを検証してログインを確定する
     */
    public function store(Request $request): RedirectResponse
    {
        if (!$this->pendingIsValid($request)) {
            return redirect()->route('user.login');
        }

        $request->validate(['code' => 'required|string']);

        $pending = $request->session()->get('2fa_pending');
        $user = User::find($pending['id']);
        abort_unless($user, 419);

        if (!OneTimePassword::verifyFor($user, $request->input('code'))) {
            return back()->withErrors(['code' => '認証コードが正しくないか、有効期限が切れています。']);
        }

        $request->session()->forget('2fa_pending');
        Auth::guard('users')->login($user, $pending['remember'] ?? false);
        $request->session()->regenerate();

        return redirect_to_user_home();
    }

    /**
     * 認証コードを再送信する
     */
    public function resend(Request $request): RedirectResponse
    {
        if (!$this->pendingIsValid($request)) {
            return redirect()->route('user.login');
        }

        $pending = $request->session()->get('2fa_pending');
        $user = User::find($pending['id']);
        abort_unless($user, 419);

        if (!OneTimePassword::canResendFor($user)) {
            return back()->withErrors(['code' => 'しばらく待ってから再送信してください。']);
        }

        OneTimePassword::generateFor($user);

        return back()->with('status', '認証コードを再送信しました。');
    }

    private function pendingIsValid(Request $request): bool
    {
        $pending = $request->session()->get('2fa_pending');

        return is_array($pending) && ($pending['guard'] ?? null) === 'users';
    }
}
