<?php

namespace App\Http\Controllers\Admin\Project;

use App\Http\Controllers\Controller;
use App\Http\Requests\Project\ProjectItemRequest;
use App\Models\Project;
use App\Models\ProjectVersion;
use App\Models\ProjectItem;
use App\Models\ServiceItem;
use App\Services\ProjectService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ProjectItemController extends Controller
{
    public function __construct(
        private ProjectService $projectService
    ) {}

    /**
     * Show the form for creating a new resource.
     */
    public function create(Project $project, ProjectVersion $version): Response
    {
        $serviceItems = ServiceItem::all();
        $milestones = $version->milestones()->get();
        $contractItems = [];

        // プロジェクトに関連する契約がある場合、そのアイテムを取得
        // ContractItem は ContractVersion を経由して紐付いているため、currentVersion から取得
        if ($project->contract_id) {
            $contract = $project->contract;
            if ($contract && $contract->currentVersion) {
                $contractItems = $contract->currentVersion->items->map(fn($item) => [
                    'id' => $item->id,
                    'name' => $item->name,
                    'description' => $item->description,
                    'service_item_id' => $item->service_item_id,
                    'quantity' => $item->quantity,
                    'unit_price' => $item->unit_price,
                ])->all();
            }
        }

        // version の情報をロード（estimated_end_date のため）
        $version->load(['project']);

        return Inertia::render('Admin/ProjectItem/Create', [
            'project' => $project,
            'version' => $version,
            'serviceItems' => $serviceItems,
            'milestones' => $milestones,
            'contractItems' => $contractItems,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ProjectItemRequest $request, Project $project, ProjectVersion $version): RedirectResponse
    {
        $data = $request->validated();

        // items 配列内の各アイテムを処理
        foreach ($data['items'] as $itemData) {
            $itemData['project_version_id'] = $version->id;

            // title を name にマップ
            $itemData['name'] = $itemData['title'];
            unset($itemData['title']);

            // デフォルト値の設定
            if (!isset($itemData['status'])) {
                $itemData['status'] = 'not_started';
            }
            if (!isset($itemData['priority'])) {
                $itemData['priority'] = 'medium';
            }

            // assigned_to が空の場合は null に設定
            if (empty($itemData['assigned_to'])) {
                $itemData['assigned_to'] = null;
            }

            ProjectItem::create($itemData);
        }

        return back()->with('success', count($data['items']) . ' 個のアイテムを追加しました。');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Project $project, ProjectVersion $version, ProjectItem $item): Response
    {
        $serviceItems = ServiceItem::all();
        $milestones = $version->milestones()->get();

        return Inertia::render('Admin/ProjectItem/Edit', [
            'project' => $project,
            'version' => $version,
            'item' => $item,
            'serviceItems' => $serviceItems,
            'milestones' => $milestones,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ProjectItemRequest $request, Project $project, ProjectVersion $version, ProjectItem $item): RedirectResponse
    {
        $data = $request->validated();

        // title を name にマップ
        if (isset($data['title'])) {
            $data['name'] = $data['title'];
            unset($data['title']);
        }

        // assigned_to が空の場合は null に設定
        if (empty($data['assigned_to'])) {
            $data['assigned_to'] = null;
        }

        $item->update($data);

        return back()->with('success', __('messages.updated', ['attribute' => 'アイテム']));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project, ProjectVersion $version, ProjectItem $item): RedirectResponse
    {
        $item->delete();

        return back()->with('success', __('messages.deleted', ['attribute' => 'アイテム']));
    }
}
