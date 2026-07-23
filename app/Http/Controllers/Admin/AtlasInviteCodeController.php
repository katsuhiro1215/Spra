<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\AtlasInviteCodeRequest;
use App\Models\AtlasInviteCode;
use App\Services\AtlasInviteCodeService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class AtlasInviteCodeController extends Controller
{
    public function __construct(
        private AtlasInviteCodeService $atlasInviteCodeService
    ) {}

    /**
     * 招待コード一覧
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

        $inviteCodes = $this->atlasInviteCodeService->getPaginated($filters, $sort, 20);
        $stats = $this->atlasInviteCodeService->getStats();

        return Inertia::render('Admin/AtlasInviteCode/Index', [
            'inviteCodes' => $inviteCodes,
            'stats' => $stats,
            'filters' => $filters,
        ]);
    }

    /**
     * 発行フォーム
     */
    public function create(): Response
    {
        return Inertia::render('Admin/AtlasInviteCode/Create');
    }

    /**
     * 発行
     */
    public function store(AtlasInviteCodeRequest $request): RedirectResponse
    {
        try {
            $this->atlasInviteCodeService->issue($request->validated());

            return redirect()->route('admin.atlas-invite-code.index')
                ->with('success', '招待コードを発行しました。');
        } catch (\Exception $e) {
            Log::error('AtlasInviteCode issue error: ' . $e->getMessage());
            return redirect()->back()
                ->withInput()
                ->with('error', '招待コードの発行に失敗しました。');
        }
    }

    /**
     * 失効
     */
    public function revoke(AtlasInviteCode $atlasInviteCode): RedirectResponse
    {
        try {
            $this->atlasInviteCodeService->revoke($atlasInviteCode);

            return redirect()->back()->with('success', '招待コードを失効しました。');
        } catch (\Exception $e) {
            Log::error('AtlasInviteCode revoke error: ' . $e->getMessage());
            return redirect()->back()->with('error', '招待コードの失効に失敗しました。');
        }
    }
}
