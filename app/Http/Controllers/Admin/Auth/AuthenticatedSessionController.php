<?php

namespace App\Http\Controllers\Admin\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): RedirectResponse|Response
    {
        // 既にログイン済みの場合はダッシュボードにリダイレクト
        if (Auth::guard('admins')->check()) {
            return redirect_to_admin_home();
        }

        return Inertia::render('Admin/Auth/Login', [
            'canResetPassword' => Route::has('admin.password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        try {
            $request->authenticate();

            $request->session()->regenerate();

            return redirect_to_admin_home()->with('success', __('messages.auth.login_success'));
        } catch (\Illuminate\Validation\ValidationException $e) {
            // 認証失敗時の処理
            return back()->withErrors([
                'email' => __('messages.auth.login_failed'),
            ])->withInput($request->only('email', 'remember'))
                ->with('error', __('messages.auth.login_failed'));
        } catch (\Exception $e) {
            // その他のエラー
            Log::error('Admin login error: ' . $e->getMessage());

            return back()->withErrors([
                'email' => __('messages.general.action_failed'),
            ])->withInput($request->only('email', 'remember'))
                ->with('error', __('messages.general.action_failed'));
        }
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        try {
            Auth::guard('admins')->logout();

            $request->session()->invalidate();

            $request->session()->regenerateToken();

            return redirect('/admin/login')->with('success', __('messages.auth.logout_success'));
        } catch (\Exception $e) {
            // ログアウトエラー
            Log::error('Admin logout error: ' . $e->getMessage());

            return redirect('/admin/login')->with('error', __('messages.auth.session_expired'));
        }
    }
}
