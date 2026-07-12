<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;

class NotificationController extends Controller
{
    /**
     * 通知を既読にして、対象URLへ遷移する
     */
    public function read(string $id): RedirectResponse
    {
        $user = auth('users')->user();
        $notification = $user->notifications()->where('id', $id)->first();

        abort_unless($notification, 404);

        $notification->markAsRead();

        return redirect($notification->data['url'] ?? route('user.dashboard'));
    }

    /**
     * すべての通知を既読にする
     */
    public function readAll(): RedirectResponse
    {
        auth('users')->user()->unreadNotifications()->update(['read_at' => now()]);

        return back();
    }
}
