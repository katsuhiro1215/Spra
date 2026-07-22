<?php

namespace App\Http\Controllers\Admin\Attendance;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\AdminAttendanceRecord;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AttendanceRecordController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = $request->only(['admin_id', 'status', 'date_from', 'date_to']);

        $query = AdminAttendanceRecord::with('admin.profile')->orderBy('work_date', 'desc');

        if (!empty($filters['admin_id'])) {
            $query->where('admin_id', $filters['admin_id']);
        }
        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }
        if (!empty($filters['date_from'])) {
            $query->where('work_date', '>=', $filters['date_from']);
        }
        if (!empty($filters['date_to'])) {
            $query->where('work_date', '<=', $filters['date_to']);
        }

        return Inertia::render('Admin/Attendance/Records/Index', [
            'records' => $query->paginate(20)->withQueryString(),
            'admins' => Admin::with('profile')
                ->whereHas('profile')
                ->get()
                ->map(fn (Admin $admin) => [
                    'value' => $admin->id,
                    'label' => $admin->profile->full_name ?? $admin->email,
                ]),
            'statuses' => collect(AdminAttendanceRecord::STATUSES)
                ->map(fn ($label, $value) => ['value' => $value, 'label' => $label])
                ->values(),
            'filters' => $filters,
        ]);
    }

    public function edit(AdminAttendanceRecord $record): Response
    {
        return Inertia::render('Admin/Attendance/Records/Edit', [
            'record' => $record->load('admin.profile'),
        ]);
    }

    public function update(Request $request, AdminAttendanceRecord $record): RedirectResponse
    {
        $validated = $request->validate([
            'clocked_in_at' => 'nullable|date_format:H:i',
            'clocked_out_at' => 'nullable|date_format:H:i',
            'status' => 'required|in:working,finished',
            'notes' => 'nullable|string|max:1000',
        ]);

        $workDate = $record->work_date->format('Y-m-d');

        $record->update([
            'clocked_in_at' => $validated['clocked_in_at'] ? "{$workDate} {$validated['clocked_in_at']}" : null,
            'clocked_out_at' => $validated['clocked_out_at'] ? "{$workDate} {$validated['clocked_out_at']}" : null,
            'status' => $validated['status'],
            'notes' => $validated['notes'] ?? null,
            'updated_by' => Auth::guard('admins')->id(),
        ]);

        return redirect()->route('admin.attendance.records.index')
            ->with('success', __('messages.attendance.record_corrected'));
    }

    public function destroy(AdminAttendanceRecord $record): RedirectResponse
    {
        $record->deleted_by = Auth::guard('admins')->id();
        $record->save();
        $record->delete();

        return redirect()->route('admin.attendance.records.index')
            ->with('success', __('messages.deleted', ['attribute' => '勤怠記録']));
    }
}
