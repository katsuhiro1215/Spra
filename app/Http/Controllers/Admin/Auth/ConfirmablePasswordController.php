<?php

namespace App\Http\Controllers\Admin\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ConfirmablePasswordController extends Controller
{
    /**
     * パスワード確認画面
     * 
     * @return \Inertia\Response
     */
    public function show(): Response
    {
        return Inertia::render('Admin/Auth/ConfirmPassword');
    }

    /**
     * ユーザーのパスワードを確認
     * @return \Illuminate\Http\RedirectResponse
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        try {
            $request->validate([
                'password' => 'required',
            ], [
                'password.required' => __('validation.required', ['attribute' => __('validation.attributes.password')]),
            ]);

            if (! Auth::guard('admins')->validate([
                'email' => $request->user('admins')->email,
                'password' => $request->password,
            ])) {
                return back()->withErrors([
                    'password' => __('auth.password'),
                ])->with('error', __('auth.password'));
            }

            $request->session()->put('auth.password_confirmed_at', time());

            return redirect()->intended(route('admin.dashboard'))
                ->with('success', __('messages.auth.password_confirmed'));
        } catch (ValidationException $e) {
            return back()->withErrors($e->errors())
                ->with('error', __('messages.form.validation_error'));
        } catch (\Exception $e) {
            Log::error('Admin password confirmation error: ' . $e->getMessage());

            return back()->with('error', __('messages.general.action_failed'));
        }
    }
}
