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
            'headerMenu' => fn() => Menu::query()
                ->where('location', 'header')
                ->with(['menuItems' => function ($query) {
                    $query->whereNull('parent_id')
                        ->active()
                        ->ordered()
                        ->with(['page:id,slug', 'children' => function ($query) {
                            $query->active()->ordered()->with('page:id,slug');
                        }]);
                }])
                ->first(),
            'organization' => fn() => Organization::query()
                ->with(['defaultAddress'])
                ->first(),
        ];
    }
}
