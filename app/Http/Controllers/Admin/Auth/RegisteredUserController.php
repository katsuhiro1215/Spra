<?php

namespace App\Http\Controllers\Admin\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AdminRegistrationRequest;
use App\Models\Admin;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
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
     * Handle an incoming registration request.
     */
    public function store(AdminRegistrationRequest $request): RedirectResponse
    {
        try {
            $admin = Admin::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            event(new Registered($admin));

            Auth::guard('admins')->login($admin);

            return redirect_to_admin_home()->with('success', __('messages.auth.registration_success'));
        } catch (\Exception $e) {
            Log::error('Admin registration error: ' . $e->getMessage());

            return back()->withInput($request->only('name', 'email'))
                ->with('error', __('messages.auth.registration_failed'));
        }
    }
}
