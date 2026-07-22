<?php

namespace App\Http\Controllers\Admin\Project;

use App\Http\Controllers\Controller;
use App\Http\Requests\Project\ProjectTemplateMilestoneRequest;
use App\Models\ProjectTemplate;
use App\Models\ProjectTemplateMilestone;
use Inertia\Inertia;
use Inertia\Response;

class ProjectTemplateMilestoneController extends Controller
{
    /**
     * Show the form for creating a new resource.
     */
    public function create(ProjectTemplate $projectTemplate): Response
    {
        return Inertia::render('Admin/Project/Milestone/Create', [
            'template' => $projectTemplate,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(
        ProjectTemplate $projectTemplate,
        ProjectTemplateMilestoneRequest $request
    ) {
        $milestones = $request->input('milestones', []);
        $count = 0;

        foreach ($milestones as $milestoneData) {
            $projectTemplate->milestones()->create([
                'milestone_name' => $milestoneData['milestone_name'],
                'description' => $milestoneData['description'] ?? null,
                'order' => $milestoneData['order'],
            ]);
            $count++;
        }

        $message = $count === 1 ? 'マイルストーンを作成しました。' : "{$count}個のマイルストーンを作成しました。";

        return redirect()
            ->route('admin.project.template.show', $projectTemplate->id)
            ->with('success', $message);
    }

    /**
     * Display the specified resource.
     */
    public function show(
        ProjectTemplate $projectTemplate,
        ProjectTemplateMilestone $milestone
    ): Response {
        return Inertia::render('Admin/Project/Milestone/Show', [
            'template' => $projectTemplate,
            'milestone' => $milestone,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(
        ProjectTemplate $projectTemplate,
        ProjectTemplateMilestone $milestone
    ): Response {
        return Inertia::render('Admin/Project/Milestone/Edit', [
            'template' => $projectTemplate,
            'milestone' => $milestone,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(
        ProjectTemplate $projectTemplate,
        ProjectTemplateMilestone $milestone,
        ProjectTemplateMilestoneRequest $request
    ) {
        $milestones = $request->input('milestones', []);
        $count = 0;

        // 最初のマイルストーンで現在のマイルストーンを更新
        if (!empty($milestones)) {
            $firstMilestone = $milestones[0];
            $milestone->update([
                'milestone_name' => $firstMilestone['milestone_name'],
                'description' => $firstMilestone['description'] ?? null,
                'order' => $firstMilestone['order'],
            ]);
            $count++;

            // 追加のマイルストーンを新規作成
            for ($i = 1; $i < count($milestones); $i++) {
                $milestoneData = $milestones[$i];
                $projectTemplate->milestones()->create([
                    'milestone_name' => $milestoneData['milestone_name'],
                    'description' => $milestoneData['description'] ?? null,
                    'order' => $milestoneData['order'],
                ]);
                $count++;
            }
        }

        $message = $count === 1 ? 'マイルストーンを更新しました。' : "マイルストーンを更新・作成しました({$count}個)。";

        return redirect()
            ->route('admin.project.template.show', $projectTemplate->id)
            ->with('success', $message);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(
        ProjectTemplate $projectTemplate,
        ProjectTemplateMilestone $milestone
    ) {
        $milestone->delete();

        return redirect()
            ->route('admin.project.template.show', $projectTemplate->id)
            ->with('success', __('messages.deleted', ['attribute' => 'マイルストーン']));
    }
}
