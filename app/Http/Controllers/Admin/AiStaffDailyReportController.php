<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\AiStaffActivityLog;
use App\Models\AiStaffDailyReport;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AiStaffDailyReportController extends Controller
{
    public function index(Request $request): Response
    {
        $query = AiStaffDailyReport::with('admin')
            ->orderByDesc('report_date');

        if ($request->filled('admin_id')) {
            $query->where('admin_id', $request->input('admin_id'));
        }

        if ($request->filled('report_date')) {
            $query->where('report_date', $request->input('report_date'));
        }

        return Inertia::render('Admin/AiStaffDailyReports/Index', [
            'reports' => $query->paginate(20)->withQueryString(),
            'filters' => $request->only(['admin_id', 'report_date']),
            'aiStaffAdmins' => Admin::where('role', 'ai_staff')
                ->orderBy('department')
                ->get(['id', 'email', 'department']),
        ]);
    }

    public function show(AiStaffDailyReport $aiStaffDailyReport): Response
    {
        $aiStaffDailyReport->load('admin');

        $activityLogs = AiStaffActivityLog::where('admin_id', $aiStaffDailyReport->admin_id)
            ->whereBetween('occurred_at', [
                $aiStaffDailyReport->report_date->copy()->startOfDay(),
                $aiStaffDailyReport->report_date->copy()->endOfDay(),
            ])
            ->orderBy('occurred_at')
            ->get();

        return Inertia::render('Admin/AiStaffDailyReports/Show', [
            'report' => $aiStaffDailyReport,
            'activityLogs' => $activityLogs,
        ]);
    }
}
