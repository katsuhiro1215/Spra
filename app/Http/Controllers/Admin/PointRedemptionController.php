<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PointRedemption;
use App\Services\PointRedemptionService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class PointRedemptionController extends Controller
{
    public function __construct(
        private PointRedemptionService $pointRedemptionService
    ) {}

    /**
     * ポイント交換申請一覧
     */
    public function index(Request $request): Response
    {
        $status = $request->input('status');

        $query = PointRedemption::with(['company', 'requestedBy', 'reviewedBy'])
            ->orderByDesc('created_at');

        if ($status) {
            $query->where('status', $status);
        }

        $redemptions = $query->paginate(20)->withQueryString();

        $stats = [
            'total' => PointRedemption::count(),
            'pending' => PointRedemption::where('status', 'pending')->count(),
            'approved' => PointRedemption::where('status', 'approved')->count(),
            'rejected' => PointRedemption::where('status', 'rejected')->count(),
        ];

        return Inertia::render('Admin/PointRedemption/Index', [
            'redemptions' => $redemptions,
            'stats' => $stats,
            'filters' => ['status' => $status],
            'statuses' => PointRedemption::STATUSES,
        ]);
    }

    /**
     * 詳細表示
     */
    public function show(PointRedemption $pointRedemption): Response
    {
        $pointRedemption->load(['company', 'catalogItem', 'requestedBy', 'reviewedBy', 'transaction']);

        return Inertia::render('Admin/PointRedemption/Show', [
            'redemption' => $pointRedemption,
        ]);
    }

    /**
     * 承認（ポイントを消費）
     */
    public function approve(PointRedemption $pointRedemption): RedirectResponse
    {
        try {
            $this->pointRedemptionService->approve($pointRedemption, Auth::guard('admins')->id());

            return redirect()->route('admin.point-redemption.show', $pointRedemption->id)
                ->with('success', '交換申請を承認し、ポイントを消費しました。');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', $e->getMessage());
        }
    }

    /**
     * 却下
     */
    public function reject(Request $request, PointRedemption $pointRedemption): RedirectResponse
    {
        $validated = $request->validate([
            'reason' => 'nullable|string|max:1000',
        ]);

        try {
            $this->pointRedemptionService->reject(
                $pointRedemption,
                Auth::guard('admins')->id(),
                $validated['reason'] ?? null,
            );

            return redirect()->route('admin.point-redemption.show', $pointRedemption->id)
                ->with('success', '交換申請を却下しました。');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', $e->getMessage());
        }
    }
}
