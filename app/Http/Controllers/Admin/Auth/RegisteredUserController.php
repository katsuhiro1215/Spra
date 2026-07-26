<?php

namespace App\Http\Controllers\Admin\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
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
     *
     * 管理者アカウントの一般公開された自己登録は許可していない
     * （resources/js/Pages/Admin/Auth/Register.jsx もその前提でフォームを描画しない）。
     * 管理者アカウントは既存の管理者が管理画面から作成する。
     */
    public function store(): RedirectResponse
    {
        abort(404);
    }
}
