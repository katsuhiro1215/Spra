<?php

namespace App\Http\Controllers\Admin\Project;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\Project;
use Inertia\Inertia;
use Inertia\Response;

class GanttChartController extends Controller
{
    public function index(): Response
    {
        // プロジェクト一覧を取得
        $projects = Project::orderBy('created_at', 'desc')->get();

        return Inertia::render('Admin/Project/GanttChart/Index', [
            'projects' => $projects,
        ]);
    }

    /**
     * Display the gantt chart for a project.
     */
    public function show(Project $project): Response
    {
        // 現在のバージョンとそのマイルストーン・アイテムを取得
        $currentVersion = $project->versions()
            ->where('is_current', true)
            ->with([
                'milestones' => fn($q) => $q->orderBy('sort_order'),
                'items' => fn($q) => $q->orderBy('sort_order'),
                'items.assignee.profile',
            ])
            ->first();

        $admins = Admin::select('id', 'email')->with('profile')->get();

        return Inertia::render('Admin/Project/GanttChart/Show', [
            'project' => $project,
            'currentVersion' => $currentVersion,
            'milestones' => $currentVersion?->milestones ?? [],
            'items' => $currentVersion?->items ?? [],
            'admins' => $admins,
        ]);
    }
}
