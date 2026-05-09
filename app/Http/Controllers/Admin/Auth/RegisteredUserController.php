<?php

namespace App\Http\Controllers\Admin\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\AdminRequest;
use App\Models\Admin;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * 新規登録画面
     */
    public function create(): RedirectResponse|Response
    {
        // 既にログイン済みの場合はダッシュボードにリダイレクト
        if (Auth::guard('admins')->check()) {
            return redirect_to_admin_home();
        }

        return Inertia::render('Admin/Auth/Register');
    }

    /**
     * 新規登録処理
     */
    public function store(AdminRequest $request): RedirectResponse
    {
        // 新規登録処理
        try {
            $admin = Admin::create($request->validated());

            event(new Registered($admin));

            Auth::guard('admins')->login($admin);

            return redirect_to_admin_home()->with('success', __('messages.auth.registration_success'));
        } catch (\Exception $e) {
            // その他のエラー
            Log::error('Admin registration error: ' . $e->getMessage());

            return back()->withInput($request->only('name', 'email'))
                ->with('error', __('messages.auth.registration_failed'));
        }
    }
}
