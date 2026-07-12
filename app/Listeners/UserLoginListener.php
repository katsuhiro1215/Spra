<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Logout;
use Illuminate\Auth\Events\Failed;
use App\Models\UserLoginHistory;
use App\Models\UserActivityLog;
use App\Models\LoginLog;
use Jenssegers\Agent\Agent;
use Illuminate\Support\Facades\Request;

class UserLoginListener
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle login event.
     *
     * users/admins 両ガードのログインを LoginLog に記録する。
     * UserLoginHistory/UserActivityLog は users テーブルにしか紐付けられないため users ガードのみ記録する。
     */
    public function handleLogin(Login $event): void
    {
        if (!$event->user) {
            return;
        }

        $userType = $event->guard === 'admins' ? LoginLog::USER_TYPE_ADMIN : LoginLog::USER_TYPE_USER;
        LoginLog::recordSuccess($event->guard, $userType, $event->user->id, $event->user->email);

        if ($event->guard === 'users') {
            $this->recordLoginHistory($event->user->id, UserLoginHistory::TYPE_LOGIN);
            $this->recordActivityLog($event->user->id, UserActivityLog::ACTION_LOGIN, 'ユーザーがログインしました');
        }
    }

    /**
     * Handle logout event.
     */
    public function handleLogout(Logout $event): void
    {
        if (!$event->user) {
            return;
        }

        $userType = $event->guard === 'admins' ? LoginLog::USER_TYPE_ADMIN : LoginLog::USER_TYPE_USER;
        LoginLog::recordLogout($event->guard, $userType, $event->user->id, $event->user->email);

        if ($event->guard === 'users') {
            UserLoginHistory::recordLogout($event->user->id, session()->getId());
            $this->recordActivityLog($event->user->id, UserActivityLog::ACTION_LOGOUT, 'ユーザーがログアウトしました');
        }
    }

    /**
     * Handle failed login event.
     */
    public function handleFailed(Failed $event): void
    {
        if (!in_array($event->guard, ['users', 'admins'], true)) {
            return;
        }

        $userType = $event->guard === 'admins' ? LoginLog::USER_TYPE_ADMIN : LoginLog::USER_TYPE_USER;
        $userId = $event->user?->id;
        $email = $event->credentials['email'] ?? null;

        LoginLog::recordFailed($event->guard, $userType, $email, 'invalid_credentials');

        if ($event->guard === 'users') {
            UserLoginHistory::recordFailedLogin($userId, 'Invalid credentials');

            $description = $userId ? 'ログインに失敗しました' : "メールアドレス「{$email}」でのログインに失敗しました";
            $this->recordActivityLog($userId, UserActivityLog::ACTION_LOGIN, $description, UserActivityLog::STATUS_ERROR);
        }
    }

    /**
     * Record login history.
     */
    private function recordLoginHistory(string $userId, string $type): void
    {
        $request = Request::instance();
        $agent = new Agent();
        $agent->setUserAgent($request->userAgent());

        $deviceType = $this->getDeviceType($agent);
        $browser = $agent->browser();
        $platform = $agent->platform();

        UserLoginHistory::create([
            'user_id' => $userId,
            'type' => $type,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'device' => $deviceType,
            'browser' => $browser,
            'platform' => $platform,
            'session_id' => session()->getId(),
            'login_method' => UserLoginHistory::METHOD_PASSWORD,
            'is_success' => $type !== UserLoginHistory::TYPE_FAILED_LOGIN,
            'logged_in_at' => now(),
        ]);
    }

    /**
     * Record activity log.
     */
    private function recordActivityLog(?string $userId, string $action, string $description, string $status = UserActivityLog::STATUS_SUCCESS): void
    {
        $request = Request::instance();

        UserActivityLog::create([
            'user_id' => $userId,
            'action' => $action,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'description' => $description,
        ]);
    }

    /**
     * Get device type from agent.
     */
    private function getDeviceType(Agent $agent): string
    {
        if ($agent->isMobile()) {
            return UserLoginHistory::DEVICE_MOBILE;
        } elseif ($agent->isTablet()) {
            return UserLoginHistory::DEVICE_TABLET;
        } else {
            return UserLoginHistory::DEVICE_DESKTOP;
        }
    }
}
