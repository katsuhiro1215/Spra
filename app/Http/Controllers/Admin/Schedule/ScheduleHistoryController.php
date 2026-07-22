<?php

namespace App\Http\Controllers\Admin\Schedule;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserActivityLog;
use Inertia\Inertia;
use Inertia\Response;

class ScheduleHistoryController extends Controller
{
    /**
     * 営業時間管理関連の変更履歴一覧
     */
    public function index(): Response
    {
        $logs = UserActivityLog::with(['user.profile', 'admin.profile'])
            ->byRoutePrefix('admin.schedules.')
            ->latest('performed_at')
            ->limit(100)
            ->get()
            ->map(fn (UserActivityLog $log) => [
                'id' => $log->id,
                'performed_at' => $log->performed_at,
                'description' => $log->description ?? $log->action_name,
                'route_name' => $log->route_name,
                'actor_type' => $log->actor_type,
                'user_name' => $this->actorDisplayName($log),
                'ip_address' => $log->ip_address,
                'status' => $log->status,
                'status_name' => $log->status_name,
                'status_color' => $log->status_color,
            ]);

        return Inertia::render('Admin/Schedules/History', [
            'logs' => $logs,
        ]);
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

    private function userDisplayName(?User $user): ?string
    {
        if (!$user) {
            return null;
        }

        return $user->profile?->full_name ?: $user->email;
    }
}
