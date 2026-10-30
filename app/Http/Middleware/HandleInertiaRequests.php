<?php

namespace App\Http\Middleware;

use App\Models\Menu;
use App\Models\Organization;
use App\Models\QuoteResponse;
use App\Services\ContactService;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $admin = $request->user('admins');
        $user = $request->user('users');

        // admin に profile リレーションを含める
        if ($admin) {
            $admin->load('profile');
        }

        // user に profile リレーションを含める（アバター表示用）
        if ($user) {
            $user->load('profile.media');
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
                'admin' => $admin,
                'adminPermissions' => fn() => $admin ? $admin->getEffectivePermissionNames() : [],
                'todayAttendance' => fn() => $admin ? app(\App\Services\AttendanceService::class)->getTodayRecord($admin) : null,
            ],
            'flash' => [
                'message' => fn() => $request->session()->get('message'),
                'success' => fn() => $request->session()->get('success'),
                'error' => fn() => $request->session()->get('error'),
                'warning' => fn() => $request->session()->get('warning'),
                'info' => fn() => $request->session()->get('info'),
                'apiKeyReveal' => fn() => $request->session()->get('api_key_reveal'),
            ],
            'notifications' => [
                'unreadContacts' => $admin ? app(ContactService::class)->getUnreadCount() : 0,
                'pendingResponses' => $admin ? QuoteResponse::whereNull('responded_at')->count() : 0,
            ],
            'userNotifications' => [
                'unreadCount' => fn() => $user ? $user->unreadNotifications()->count() : 0,
                'items' => fn() => $user
                    ? $user->notifications()->latest()->limit(10)->get(['id', 'data', 'read_at', 'created_at'])
                    : [],
            ],
            'adminNotifications' => [
                'unreadCount' => fn() => $admin ? $admin->unreadNotifications()->count() : 0,
                'items' => fn() => $admin
                    ? $admin->notifications()->latest()->limit(10)->get(['id', 'data', 'read_at', 'created_at'])
                    : [],
            ],
            'headerMenu' => fn() => $this->menuFor('header'),
            // 公開サイトのフッターメニュー（管理画面で設置場所を footer にしたメニュー。無ければ null）
            'footerMenu' => fn() => $this->menuFor('footer'),
            // 全ページ共通で送る組織情報。番地（district/address_other）・郵便番号は、個人事業主の
            // 自宅兼事務所の住所になりうるため含めない（2026-10-30、公開サイトリニューアル段階2で変更）。
            // 管理画面（Admin/Organization/Edit等）は各コントローラーが別途フルの organization を渡すため、
            // ここを絞ってもadmin側には影響しない
            'organization' => fn() => $this->publicOrganization(),
        ];
    }

    /**
     * 公開サイト向けの組織情報。住所は都道府県・市区町村までに絞る
     */
    private function publicOrganization(): ?array
    {
        $organization = Organization::query()->with(['defaultAddress'])->first();
        if (! $organization) {
            return null;
        }

        $data = $organization->toArray();
        $address = $organization->defaultAddress->first();
        $data['default_address'] = $address ? [[
            'prefecture' => $address->prefecture,
            'city' => $address->city,
        ]] : [];

        return $data;
    }

    /**
     * 公開サイトのメニュー（親項目と、その子項目。有効なものだけを並び順で）
     */
    private function menuFor(string $location): ?Menu
    {
        return Menu::query()
            ->where('location', $location)
            ->with(['menuItems' => function ($query) {
                $query->whereNull('parent_id')
                    ->active()
                    ->ordered()
                    ->with(['page:id,slug', 'children' => function ($query) {
                        $query->active()->ordered()->with('page:id,slug');
                    }]);
            }])
            ->first();
    }
}
