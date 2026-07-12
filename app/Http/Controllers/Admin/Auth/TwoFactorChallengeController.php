<?php

namespace App\Http\Controllers\Admin\Auth;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\OneTimePassword;
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
            return redirect()->route('admin.login');
        }

        return Inertia::render('Admin/Auth/TwoFactorChallenge');
    }

    /**
     * 認証コードを検証してログインを確定する
     */
    public function store(Request $request): RedirectResponse
    {
        if (!$this->pendingIsValid($request)) {
            return redirect()->route('admin.login');
        }

        $request->validate(['code' => 'required|string']);

        $pending = $request->session()->get('2fa_pending');
        $admin = Admin::find($pending['id']);
        abort_unless($admin, 419);

        if (!OneTimePassword::verifyFor($admin, $request->input('code'))) {
            return back()->withErrors(['code' => '認証コードが正しくないか、有効期限が切れています。']);
        }

        $request->session()->forget('2fa_pending');
        Auth::guard('admins')->login($admin, $pending['remember'] ?? false);
        $request->session()->regenerate();

        return redirect_to_admin_home()->with('success', __('messages.auth.login_success'));
    }

    /**
     * 認証コードを再送信する
     */
    public function resend(Request $request): RedirectResponse
    {
        if (!$this->pendingIsValid($request)) {
            return redirect()->route('admin.login');
        }

        $pending = $request->session()->get('2fa_pending');
        $admin = Admin::find($pending['id']);
        abort_unless($admin, 419);

        if (!OneTimePassword::canResendFor($admin)) {
            return back()->withErrors(['code' => 'しばらく待ってから再送信してください。']);
        }

        OneTimePassword::generateFor($admin);

        return back()->with('status', '認証コードを再送信しました。');
    }

    private function pendingIsValid(Request $request): bool
    {
        $pending = $request->session()->get('2fa_pending');

        return is_array($pending) && ($pending['guard'] ?? null) === 'admins';
    }
}
