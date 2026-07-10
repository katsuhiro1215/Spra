<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    /**
     * お問い合わせフォーム表示
     *
     * @return Response
     */
    public function index(): Response
    {
        // Userがログインしている場合、ユーザー情報とプロフィールを取得
        // user - > profile - > first_name, last_name, email
        $user = auth('users')->user();

        return Inertia::render('User/Contacts/Index', [
            'user' => $user ? [
                'email' => $user->email,
            ] : null,
        ]);
    }

    /**
     * お問い合わせ送信処理
     *
     * @param Request $request
     * @return RedirectResponse
     */
    public function send(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'message' => 'required|string|max:2000',
        ]);

        return redirect()->route('user.contact.index')->with('success', 'お問い合わせを送信しました。');
    }
}
