<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Logout;
use Illuminate\Auth\Events\Failed;
use Illuminate\Auth\Events\Lockout;
use App\Models\Admin;
use App\Models\User;
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
        $agent = new Agent();
        $agent->setUserAgent(Request::instance()->userAgent());

        LoginLog::recordSuccess($event->guard, $userType, $event->user->id, $event->user->email, [
            'browser' => $agent->browser(),
            'os' => $agent->platform(),
            'device_type' => $this->getDeviceType($agent),
        ]);

        if (method_exists($event->user, 'updateLastLogin')) {
            $event->user->updateLastLogin();
        }

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
     * Handle lockout event (レート制限による一時ロック).
     *
     * ThrottlesLogins/RateLimiterによる制限発動時はAuth::validate()自体が
     * 呼ばれないためFailedイベントは発火しない。ここで別途記録する。
     */
    public function handleLockout(Lockout $event): void
    {
        $request = $event->request;
        $guard = $request->routeIs('admin.*') ? 'admins' : 'users';
        $userType = $guard === 'admins' ? LoginLog::USER_TYPE_ADMIN : LoginLog::USER_TYPE_USER;
        $email = $request->input('email');

        $modelClass = $guard === 'admins' ? Admin::class : User::class;
        $userId = $email ? $modelClass::where('email', $email)->value('id') : null;

        LoginLog::recordFailed($guard, $userType, $email, 'too_many_attempts');

        if ($guard === 'users') {
            UserLoginHistory::recordFailedLogin($userId, 'Too many login attempts');

            $description = $email
                ? "メールアドレス「{$email}」でログイン試行回数の上限に達しました"
                : 'ログイン試行回数の上限に達しました';
            $this->recordActivityLog($userId, UserActivityLog::ACTION_LOGIN, $description, UserActivityLog::STATUS_WARNING);
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
            'status' => $status,
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
