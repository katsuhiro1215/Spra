<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Logout;
use Illuminate\Auth\Events\Failed;
use App\Models\UserLoginHistory;
use App\Models\UserActivityLog;
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
     */
    public function handleLogin(Login $event): void
    {
        if ($event->guard === 'users' && $event->user) {
            $this->recordLoginHistory($event->user->id, UserLoginHistory::TYPE_LOGIN);
            $this->recordActivityLog($event->user->id, UserActivityLog::ACTION_LOGIN, 'ユーザーがログインしました');
        }
    }

    /**
     * Handle logout event.
     */
    public function handleLogout(Logout $event): void
    {
        if ($event->guard === 'users' && $event->user) {
            UserLoginHistory::recordLogout($event->user->id, session()->getId());
            $this->recordActivityLog($event->user->id, UserActivityLog::ACTION_LOGOUT, 'ユーザーがログアウトしました');
        }
    }

    /**
     * Handle failed login event.
     */
    public function handleFailed(Failed $event): void
    {
        if ($event->guard === 'users') {
            $userId = $event->user?->id;
            $email = request('email');

            UserLoginHistory::recordFailedLogin($userId, 'Invalid credentials');

            $description = $userId ? 'ログインに失敗しました' : "メールアドレス「{$email}」でのログインに失敗しました";
            $this->recordActivityLog($userId, UserActivityLog::ACTION_LOGIN, $description, UserActivityLog::STATUS_ERROR);
        }
    }

    /**
     * Record login history.
     */
    private function recordLoginHistory(int $userId, string $type): void
    {
        $request = Request::instance();
        $agent = new Agent();
        $agent->setUserAgent($request->userAgent());

        $deviceType = $this->getDeviceType($agent);
        $browser = $agent->browser();
        $browserVersion = $agent->version($browser);
        $platform = $agent->platform();
        $platformVersion = $agent->version($platform);

        UserLoginHistory::create([
            'user_id' => $userId,
            'type' => $type,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'device_type' => $deviceType,
            'browser' => $browser,
            'browser_version' => $browserVersion,
            'platform' => $platform,
            'platform_version' => $platformVersion,
            'session_id' => session()->getId(),
            'login_method' => UserLoginHistory::METHOD_PASSWORD,
            'is_successful' => $type !== UserLoginHistory::TYPE_FAILED_LOGIN,
            'logged_in_at' => now(),
        ]);
    }

    /**
     * Record activity log.
     */
    private function recordActivityLog(?int $userId, string $action, string $description, string $status = UserActivityLog::STATUS_SUCCESS): void
    {
        $request = Request::instance();
        $agent = new Agent();
        $agent->setUserAgent($request->userAgent());

        UserActivityLog::create([
            'user_id' => $userId,
            'action' => $action,
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'route_name' => $request->route()?->getName(),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'device_type' => $this->getDeviceType($agent),
            'browser' => $agent->browser(),
            'platform' => $agent->platform(),
            'session_id' => session()->getId(),
            'status' => $status,
            'description' => $description,
            'performed_at' => now(),
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
