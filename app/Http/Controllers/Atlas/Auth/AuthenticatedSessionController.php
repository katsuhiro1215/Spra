<?php

namespace App\Http\Controllers\Atlas\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the Atlas login view.
     */
    public function create(): Response
    {
        return Inertia::render('Atlas/Auth/Login', [
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     *
     * Atlasはメインサイトとセッションを共有しないため、ログインもAtlasサブドメイン内で完結させる。
     * 認証ロジック自体はUser側のLoginRequestをそのまま再利用する（guardは'users'で共通）。
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        if ($request->session()->has('2fa_pending')) {
            return redirect()->route('user.two-factor.challenge');
        }

        return redirect()->intended(route('atlas.room'));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('users')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('atlas');
    }
}
