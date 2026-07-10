<?php

namespace App\Http\Controllers\Admin\Project;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProjectVersionRequest;
use App\Models\Project;
use App\Models\ProjectVersion;
use App\Repositories\ProjectVersionRepository;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class ProjectVersionController extends Controller
{
    public function __construct(
        private ProjectVersionRepository $repository
    ) {}

    /**
     * Display a listing of versions for a project.
     */
    public function index(Project $project): Response
    {
        $versions = $this->repository->getByProjectId($project->id);

        return Inertia::render('Admin/ProjectVersion/Index', [
            'project' => $project,
            'versions' => $versions->map(fn($v) => [
                'id' => $v->id,
                'version' => $v->version,
                'title' => $v->title,
                'status' => $v->status,
                'is_current' => $v->is_current,
                'created_at' => $v->created_at->format('Y-m-d H:i'),
                'created_by' => $v->createdBy?->profile?->name,
            ]),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Project $project): Response
    {
        $currentVersion = $this->repository->findCurrentByProjectId($project->id);

        // 関連する契約アイテムを取得
        $contractItems = [];
        if ($project->contract_id) {
            $contract = $project->contract;
            if ($contract && $contract->currentVersion) {
                $contractItems = $contract->currentVersion->items->map(fn($item) => [
                    'id' => $item->id,
                    'name' => $item->name,
                    'description' => $item->description,
                    'service_item_id' => $item->service_item_id,
                    'billing_type' => $item->billing_type,
                    'quantity' => $item->quantity,
                    'unit_price' => $item->unit_price,
                    'amount' => $item->amount,
                    'estimated_days' => $item->estimated_days,
                ])->all();
            }
        }

        return Inertia::render('Admin/ProjectVersion/Create', [
            'project' => $project,
            'currentVersion' => $currentVersion,
            'contractItems' => $contractItems,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ProjectVersionRequest $request, Project $project): RedirectResponse
    {
        $currentVersion = $this->repository->findCurrentByProjectId($project->id);

        $versionData = [
            'title' => $request->validated('title'),
            'description' => $request->validated('description'),
            'start_date' => $request->validated('start_date') ?? $project->start_date,
            'estimated_end_date' => $request->validated('estimated_end_date') ?? $project->estimated_end_date,
            'total_estimated_hours' => $request->validated('total_estimated_hours'),
            'status' => $request->validated('status') ?? 'draft',
            'revision_reason' => $request->validated('revision_reason'),
        ];

        $newVersion = $this->repository->createNewVersion($project, $currentVersion, $versionData);

        // ContractItemsから取り込み
        if ($request->validated('import_from_contract') && $project->contract_id) {
            $contract = $project->contract;
            if ($contract && $contract->currentVersion) {
                $startDate = new \DateTime($newVersion->start_date ?? date('Y-m-d'));
                $endDate = new \DateTime($newVersion->estimated_end_date ?? date('Y-m-d', strtotime('+30 days')));
                $totalDays = $startDate->diff($endDate)->days;

                $itemCount = $contract->currentVersion->items->count();
                $daysPerItem = $itemCount > 0 ? floor($totalDays / $itemCount) : 0;

                $currentDate = clone $startDate;

                foreach ($contract->currentVersion->items as $index => $contractItem) {
                    $itemStartDate = clone $currentDate;
                    $itemEndDate = clone $currentDate;
                    $itemEndDate->modify("+{$daysPerItem} days");

                    // 最後のアイテムは終了日まで
                    if ($index === $itemCount - 1) {
                        $itemEndDate = $endDate;
                    }

                    $newVersion->items()->create([
                        'service_item_id' => $contractItem->service_item_id,
                        'name' => $contractItem->name,
                        'description' => $contractItem->description,
                        'start_date' => $itemStartDate->format('Y-m-d'),
                        'end_date' => $itemEndDate->format('Y-m-d'),
                        'estimated_hours' => $contractItem->estimated_days * 8,
                        'status' => 'not_started',
                        'priority' => 'medium',
                        'sort_order' => $index,
                    ]);

                    $currentDate->modify("+{$daysPerItem} days");
                }
            }
        }
        // 現在のバージョンからコピー
        elseif ($request->validated('copy_from_current') && $currentVersion) {
            // Copy milestones
            foreach ($currentVersion->milestones as $milestone) {
                $newVersion->milestones()->create($milestone->only([
                    'title',
                    'description',
                    'status',
                    'due_date',
                    'sort_order',
                    'is_client_visible'
                ]));
            }

            // Copy items
            foreach ($currentVersion->items as $item) {
                $newVersion->items()->create($item->only([
                    'service_item_id',
                    'milestone_id',
                    'parent_id',
                    'name',
                    'description',
                    'type',
                    'start_date',
                    'end_date',
                    'estimated_hours',
                    'status',
                    'progress',
                    'priority',
                    'assigned_to',
                    'dependencies',
                    'sort_order',
                    'is_client_visible',
                    'category',
                    'tags'
                ]));
            }
        }

        // マイルストーン自動生成
        if ($request->validated('auto_generate_milestones')) {
            $milestoneCount = $request->validated('milestone_count') ?? 3;
            $this->generateMilestones($newVersion, $milestoneCount);
        }

        return redirect()
            ->route('admin.project.versions.show', [$project->id, $newVersion->id])
            ->with('success', 'バージョンを作成しました。');
    }

    /**
     * マイルストーンを自動生成
     */
    private function generateMilestones(ProjectVersion $version, int $count): void
    {
        $startDate = new \DateTime($version->start_date ?? date('Y-m-d'));
        $endDate = new \DateTime($version->estimated_end_date ?? date('Y-m-d', strtotime('+30 days')));
        $totalDays = $startDate->diff($endDate)->days;
        $daysPerPhase = floor($totalDays / $count);

        $phaseNames = [
            '要件定義・設計',
            '開発フェーズ1',
            '開発フェーズ2',
            'テスト・QA',
            'リリース準備',
            '本番リリース',
            '運用保守',
        ];

        $currentDate = clone $startDate;

        for ($i = 0; $i < $count; $i++) {
            $phaseEndDate = clone $currentDate;
            $phaseEndDate->modify("+{$daysPerPhase} days");

            // 最後のフェーズは終了日まで
            if ($i === $count - 1) {
                $phaseEndDate = $endDate;
            }

            $version->milestones()->create([
                'title' => $phaseNames[$i] ?? "フェーズ " . ($i + 1),
                'description' => '',
                'status' => 'pending',
                'due_date' => $phaseEndDate->format('Y-m-d'),
                'sort_order' => $i,
                'is_client_visible' => true,
            ]);

            $currentDate = clone $phaseEndDate;
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project, ProjectVersion $version): Response
    {
        $version->load(['milestones', 'items']);

        return Inertia::render('Admin/ProjectVersion/Show', [
            'project' => $project,
            'version' => $version,
            'milestones' => $version->milestones,
            'items' => $version->items,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Project $project, ProjectVersion $version): Response
    {
        return Inertia::render('Admin/ProjectVersion/Edit', [
            'project' => $project,
            'version' => $version,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ProjectVersionRequest $request, Project $project, ProjectVersion $version): RedirectResponse
    {
        $this->repository->update($version, $request->validated());

        return back()->with('success', 'バージョンを更新しました。');
    }

    /**
     * Set a version as current.
     */
    public function setCurrent(Project $project, ProjectVersion $version): RedirectResponse
    {
        $this->repository->setCurrentVersion($project->id, $version->id);

        return back()->with('success', 'このバージョンを現在のバージョンに設定しました。');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project, ProjectVersion $version): RedirectResponse
    {
        // Prevent deleting the current version
        if ($version->is_current) {
            return back()->with('error', 'アクティブなバージョンは削除できません。');
        }

        $this->repository->delete($version);

        return back()->with('success', 'バージョンを削除しました。');
    }
}
