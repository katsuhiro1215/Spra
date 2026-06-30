<?php

namespace App\Http\Middleware;

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

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
                'admin' => $admin,
            ],
            'flash' => [
                'message' => fn() => $request->session()->get('message'),
                'success' => fn() => $request->session()->get('success'),
                'error' => fn() => $request->session()->get('error'),
                'warning' => fn() => $request->session()->get('warning'),
                'info' => fn() => $request->session()->get('info'),
            ],
            'notifications' => [
                'unreadContacts' => $admin ? app(ContactService::class)->getUnreadCount() : 0,
                'pendingResponses' => $admin ? QuoteResponse::whereNull('responded_at')->count() : 0,
            ],
        ];
    }
}
