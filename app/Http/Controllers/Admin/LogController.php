<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\LoginLog;
use App\Models\User;
use App\Models\UserActivityLog;
use App\Models\UserLoginHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Inertia\Inertia;

class LogController extends Controller
{
    /**
     * ログ一覧画面
     */
    public function index(Request $request)
    {
        $logs = [
            'activity' => $this->getActivityLogs(),
            'warning' => $this->getWarningLogs(),
            'event' => $this->getEventLogs(),
            'login' => $this->getLoginLogs(),
        ];

        return Inertia::render('Admin/Logs/Index', [
            'logs' => $logs,
        ]);
    }

    /**
     * 操作ログ（正常に完了したユーザー操作）
     */
    private function getActivityLogs(): array
    {
        return UserActivityLog::with(['user.profile', 'admin.profile'])
            ->where('status', UserActivityLog::STATUS_SUCCESS)
            ->latest('performed_at')
            ->limit(50)
            ->get()
            ->map(fn (UserActivityLog $log) => [
                'id' => $log->id,
                'performed_at' => $log->performed_at,
                'description' => $log->description ?? $log->action_name,
                'action_name' => $log->action_name,
                'actor_type' => $log->actor_type,
                'user_name' => $this->actorDisplayName($log),
                'ip_address' => $log->ip_address,
                'status' => $log->status,
                'status_name' => $log->status_name,
                'status_color' => $log->status_color,
            ])
            ->all();
    }

    /**
     * 警告ログ（エラー・警告ステータスの操作）
     */
    private function getWarningLogs(): array
    {
        return UserActivityLog::with(['user.profile', 'admin.profile'])
            ->whereIn('status', [UserActivityLog::STATUS_ERROR, UserActivityLog::STATUS_WARNING])
            ->latest('performed_at')
            ->limit(50)
            ->get()
            ->map(fn (UserActivityLog $log) => [
                'id' => $log->id,
                'performed_at' => $log->performed_at,
                'description' => $log->description ?? $log->action_name,
                'action_name' => $log->action_name,
                'actor_type' => $log->actor_type,
                'user_name' => $this->actorDisplayName($log),
                'ip_address' => $log->ip_address,
                'status' => $log->status,
                'status_name' => $log->status_name,
                'status_color' => $log->status_color,
            ])
            ->all();
    }

    /**
     * イベントログ（Admin・User 両方のログイン関連イベント）
     */
    private function getEventLogs(): array
    {
        $events = LoginLog::latest()->limit(50)->get();

        $userNames = $this->resolveNames($events->where('user_type', LoginLog::USER_TYPE_USER)->pluck('user_id')->filter(), User::class);
        $adminNames = $this->resolveNames($events->where('user_type', LoginLog::USER_TYPE_ADMIN)->pluck('user_id')->filter(), Admin::class);

        return $events->map(function (LoginLog $log) use ($userNames, $adminNames) {
            $names = $log->user_type === LoginLog::USER_TYPE_ADMIN ? $adminNames : $userNames;

            return [
                'id' => $log->id,
                'performed_at' => $log->created_at,
                'action_name' => $log->action_name,
                'user_name' => $names[$log->user_id] ?? $log->email,
                'ip_address' => $log->ip_address,
                'status_color' => $log->status_color,
            ];
        })->all();
    }

    /**
     * ログイン履歴（詳細なセッション情報付き）
     */
    private function getLoginLogs(): array
    {
        return UserLoginHistory::with('user.profile')
            ->latest('logged_in_at')
            ->limit(50)
            ->get()
            ->map(fn (UserLoginHistory $log) => [
                'id' => $log->id,
                'logged_in_at' => $log->logged_in_at,
                'logged_out_at' => $log->logged_out_at,
                'user_name' => $this->userDisplayName($log->user),
                'ip_address' => $log->ip_address,
                'device_name' => $log->device,
                'browser' => $log->browser,
                'type_name' => $log->type_name,
                'status_color' => $log->status_color,
                'formatted_duration' => $log->formatted_duration,
            ])
            ->all();
    }

    /**
     * ユーザーの表示名（プロフィール名 → メールアドレス）
     */
    private function userDisplayName(?User $user): ?string
    {
        if (!$user) {
            return null;
        }

        return $user->profile?->full_name ?: $user->email;
    }

    /**
     * UserActivityLog の操作主体（Admin または User）の表示名
     */
    private function actorDisplayName(UserActivityLog $log): ?string
    {
        if ($log->actor_type === UserActivityLog::ACTOR_SYSTEM) {
            return 'システム';
        }

        if ($log->actor_type === UserActivityLog::ACTOR_ADMIN) {
            return $log->admin ? ($log->admin->profile?->full_name ?: $log->admin->email) : null;
        }

        return $this->userDisplayName($log->user);
    }

    /**
     * User/Admin の id => 表示名 マップをまとめて解決（N+1回避）
     *
     * @return array<string, string>
     */
    private function resolveNames(Collection $ids, string $modelClass): array
    {
        if ($ids->isEmpty()) {
            return [];
        }

        return $modelClass::with('profile')
            ->whereIn('id', $ids->unique())
            ->get()
            ->mapWithKeys(fn ($model) => [$model->id => $model->profile?->full_name ?: $model->email])
            ->all();
    }
}
