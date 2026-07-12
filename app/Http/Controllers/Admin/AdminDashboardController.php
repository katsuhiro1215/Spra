<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Contract;
use App\Models\Invoice;
use App\Models\LoginLog;
use App\Models\Payment;
use App\Models\Project;
use App\Models\QuoteResponse;
use App\Models\User;
use App\Models\UserActivityLog;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    private const ACTIVE_PROJECT_STATUSES = ['planning', 'design', 'development', 'testing', 'review'];

    /**
     * 管理者ダッシュボード
     */
    public function index(): Response
    {
        return Inertia::render('AdminDashboard', [
            'queue' => $this->getActionQueue(),
            'kpis' => $this->getKpis(),
            'trends' => $this->getTrends(),
            'logs' => $this->getRecentLogs(),
        ]);
    }

    /**
     * 今すぐ対応が必要なもの
     */
    private function getActionQueue(): array
    {
        $today = today();
        $weekEnd = $today->copy()->addDays(7);

        return [
            [
                'label' => '未対応の見積回答',
                'count' => QuoteResponse::whereNull('responded_at')->count(),
                'route' => route('admin.quote-response.index', ['status' => 'pending']),
            ],
            [
                'label' => '署名待ちの契約',
                'count' => Contract::where('status', 'pending_signature')->count(),
                'route' => route('admin.contract.index'),
            ],
            [
                'label' => '期限超過の請求書',
                'count' => Invoice::where('status', 'overdue')
                    ->orWhere(function ($query) use ($today) {
                        $query->where('due_date', '<', $today)
                            ->whereNotIn('status', ['paid', 'cancelled']);
                    })
                    ->count(),
                'route' => route('admin.invoice.index'),
            ],
            [
                'label' => '今週の予約',
                'count' => Appointment::whereIn('status', ['pending', 'confirmed'])
                    ->whereHas('appointmentSlot', function ($query) use ($today, $weekEnd) {
                        $query->whereBetween('date', [$today->toDateString(), $weekEnd->toDateString()]);
                    })
                    ->count(),
                'route' => route('admin.appointments.index'),
            ],
        ];
    }

    /**
     * ざっくりした経営状況（KPIタイル）
     */
    private function getKpis(): array
    {
        $monthStart = today()->startOfMonth();
        $weekStart = today()->subDays(6);

        $revenueThisMonth = Payment::where('status', 'completed')
            ->whereBetween('payment_date', [$monthStart->toDateString(), today()->toDateString()])
            ->sum('amount');

        return [
            [
                'label' => '今月の売上',
                'value' => '¥' . number_format((float) $revenueThisMonth),
            ],
            [
                'label' => 'アクティブな契約',
                'value' => number_format(Contract::where('status', 'active')->count()),
            ],
            [
                'label' => '新規ユーザー（7日間）',
                'value' => number_format(User::where('created_at', '>=', $weekStart)->count()),
            ],
            [
                'label' => '進行中プロジェクト',
                'value' => number_format(Project::whereIn('status', self::ACTIVE_PROJECT_STATUSES)->count()),
            ],
        ];
    }

    /**
     * 直近30日の新規ユーザー数・売上トレンド
     */
    private function getTrends(): array
    {
        $startDate = today()->subDays(29);

        $newUsersByDate = User::where('created_at', '>=', $startDate)
            ->get()
            ->groupBy(fn (User $user) => $user->created_at->toDateString())
            ->map->count();

        $revenueByDate = Payment::where('status', 'completed')
            ->where('payment_date', '>=', $startDate->toDateString())
            ->get()
            ->groupBy(fn (Payment $payment) => $payment->payment_date->toDateString())
            ->map(fn (Collection $payments) => (float) $payments->sum('amount'));

        return collect(range(0, 29))
            ->map(fn (int $i) => $startDate->copy()->addDays($i)->toDateString())
            ->map(fn (string $date) => [
                'date' => $date,
                'newUsers' => (int) ($newUsersByDate[$date] ?? 0),
                'revenue' => (float) ($revenueByDate[$date] ?? 0),
            ])
            ->values()
            ->all();
    }

    /**
     * 最近のアクティビティ（操作ログ・警告・イベント）
     */
    private function getRecentLogs(): array
    {
        $activity = UserActivityLog::with('user.profile')
            ->where('status', UserActivityLog::STATUS_SUCCESS)
            ->latest('performed_at')
            ->limit(10)
            ->get()
            ->map(fn (UserActivityLog $log) => $this->formatActivityLog($log));

        $warning = UserActivityLog::with('user.profile')
            ->whereIn('status', [UserActivityLog::STATUS_ERROR, UserActivityLog::STATUS_WARNING])
            ->latest('performed_at')
            ->limit(10)
            ->get()
            ->map(fn (UserActivityLog $log) => $this->formatActivityLog($log));

        $event = LoginLog::latest()
            ->limit(10)
            ->get()
            ->map(fn (LoginLog $log) => [
                'id' => $log->id,
                'performed_at' => $log->created_at,
                'description' => $log->action_name,
                'action_name' => $log->action_name,
                'user_name' => $log->email,
                'ip_address' => $log->ip_address,
                'status_color' => $log->status_color,
            ]);

        return [
            'activity' => $activity->all(),
            'warning' => $warning->all(),
            'event' => $event->all(),
        ];
    }

    private function formatActivityLog(UserActivityLog $log): array
    {
        return [
            'id' => $log->id,
            'performed_at' => $log->performed_at,
            'description' => $log->description ?? $log->action_name,
            'action_name' => $log->action_name,
            'user_name' => $log->user?->profile?->full_name ?: $log->user?->email,
            'ip_address' => $log->ip_address,
            'status_name' => $log->status_name,
            'status_color' => $log->status_color,
        ];
    }
}
