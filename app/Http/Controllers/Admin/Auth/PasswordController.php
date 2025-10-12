<?php

namespace App\Http\Controllers\Admin\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;

class PasswordController extends Controller
{
    /**
     * パスワード変更画面
     * @return \Illuminate\Http\RedirectResponse|\Inertia\Response
     * @throws \Exception
     */
    public function update(Request $request): RedirectResponse
    {
        try {
            $validated = $request->validate([
                'current_password' => ['required', 'current_password:admins'],
                'password' => ['required', Password::defaults(), 'confirmed'],
            ], [
                'current_password.required' => __('validation.required', ['attribute' => '現在のパスワード']),
                'current_password.current_password' => __('validation.current_password'),
                'password.required' => __('validation.required', ['attribute' => __('validation.attributes.password')]),
                'password.confirmed' => __('validation.confirmed', ['attribute' => __('validation.attributes.password')]),
            ]);

            $admin = $request->user('admins');
            $admin->update([
                'password' => Hash::make($validated['password']),
            ]);

            return back()->with('success', __('messages.auth.password_updated'));
        } catch (ValidationException $e) {
            return back()->withErrors($e->errors())
                ->with('error', __('messages.form.validation_error'));
        } catch (\Exception $e) {
            Log::error('Admin password update error: ' . $e->getMessage());

            return back()->with('error', __('messages.general.action_failed'));
        }
    }
}
