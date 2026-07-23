<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\AtlasMembershipRequest;
use App\Models\AtlasMembership;
use App\Models\User;
use App\Services\AtlasMembershipService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class AtlasMembershipController extends Controller
{
    public function __construct(
        private AtlasMembershipService $atlasMembershipService
    ) {}

    /**
     * Atlas会員一覧
     */
    public function index(Request $request): Response
    {
        $filters = [
            'search' => $request->input('search'),
            'status' => $request->input('status'),
        ];

        $sort = [
            'field' => $request->input('sort_field', 'created_at'),
            'direction' => $request->input('sort_direction', 'desc'),
        ];

        $memberships = $this->atlasMembershipService->getPaginated($filters, $sort, 20);
        $stats = $this->atlasMembershipService->getStats();

        return Inertia::render('Admin/AtlasMembership/Index', [
            'memberships' => $memberships,
            'stats' => $stats,
            'filters' => $filters,
        ]);
    }

    /**
     * 新規作成フォーム
     */
    public function create(): Response
    {
        return Inertia::render('Admin/AtlasMembership/Create');
    }

    /**
     * 保存
     */
    public function store(AtlasMembershipRequest $request): RedirectResponse
    {
        try {
            $data = $request->validated();
            $user = User::where('email', $data['email'])->firstOrFail();
            unset($data['email']);
            $data['user_id'] = $user->id;

            $this->atlasMembershipService->createMembership($data);

            return redirect()->route('admin.atlas-membership.index')
                ->with('success', __('messages.created', ['attribute' => 'Atlas会員']));
        } catch (\Exception $e) {
            Log::error('AtlasMembership store error: ' . $e->getMessage());
            return redirect()->back()
                ->withInput()
                ->with('error', __('messages.create_failed', ['attribute' => 'Atlas会員']));
        }
    }

    /**
     * 編集フォーム
     */
    public function edit(AtlasMembership $atlasMembership): Response
    {
        return Inertia::render('Admin/AtlasMembership/Edit', [
            'membership' => $atlasMembership->load('user'),
        ]);
    }

    /**
     * 更新
     */
    public function update(AtlasMembershipRequest $request, AtlasMembership $atlasMembership): RedirectResponse
    {
        try {
            $this->atlasMembershipService->updateMembership($atlasMembership, $request->validated());

            return redirect()->route('admin.atlas-membership.index')
                ->with('success', __('messages.updated', ['attribute' => 'Atlas会員']));
        } catch (\Exception $e) {
            Log::error('AtlasMembership update error: ' . $e->getMessage());
            return redirect()->back()
                ->withInput()
                ->with('error', __('messages.update_failed', ['attribute' => 'Atlas会員']));
        }
    }
}
