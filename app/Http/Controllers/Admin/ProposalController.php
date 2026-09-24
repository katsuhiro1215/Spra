<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProposalRequest;
use App\Models\AiStaffActivityLog;
use App\Models\Proposal;
use App\Services\AiStaffActivityLogger;
use App\Services\ProposalService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ProposalController extends Controller
{
    public function __construct(
        private ProposalService $service,
        private AiStaffActivityLogger $activityLogger,
    ) {}

    public function show(Proposal $proposal): Response
    {
        $proposal->load(['hearing', 'contact', 'creator', 'quotes']);

        return Inertia::render('Admin/Proposals/Show', [
            'proposal' => $proposal,
        ]);
    }

    public function store(ProposalRequest $request): RedirectResponse
    {
        $proposal = $this->service->createProposal(
            $request->validated(),
            Auth::guard('admins')->id()
        );

        $this->activityLogger->log(
            Auth::guard('admins')->user(),
            AiStaffActivityLog::ACTION_PROPOSAL_CREATED,
            "提案書「{$proposal->title}」を作成",
            $proposal
        );

        return redirect()->route('admin.proposal.show', $proposal)
            ->with('success', __('messages.created', ['attribute' => '提案書']));
    }
}
