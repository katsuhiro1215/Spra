<?php

namespace App\Http\Controllers\Admin\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmailVerificationPromptController extends Controller
{
    /**
     * メールアドレス確認の促し表示
     * @return \Illuminate\Http\RedirectResponse|\Inertia\Response
     * @throws \Exception
     */
    public function __invoke(Request $request): RedirectResponse|Response
    {
        $admin = $request->user('admins');

        return $admin->hasVerifiedEmail()
            ? redirect()->route('admin.dashboard')
            : Inertia::render('Admin/Auth/VerifyEmail', [
                'status' => session('status')
            ]);
    }
}
