<?php

namespace App\Http\Controllers\Admin\Attendance;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\AdminShift;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AdminShiftController extends Controller
{
    /**
     * まとめて作成できる最大期間（日数）
     */
    private const BULK_CREATE_MAX_DAYS = 31;

    private function adminOptions()
    {
        return Admin::with('profile')
            ->whereHas('profile')
            ->get()
            ->map(fn (Admin $admin) => [
                'value' => $admin->id,
                'label' => $admin->profile->full_name ?? $admin->email,
            ]);
    }

    public function index(Request $request): Response
    {
        $filters = $request->only(['admin_id', 'date_from', 'date_to']);

        $query = AdminShift::with('admin.profile')->orderBy('shift_date', 'desc');

        if (!empty($filters['admin_id'])) {
            $query->where('admin_id', $filters['admin_id']);
        }
        if (!empty($filters['date_from'])) {
            $query->where('shift_date', '>=', $filters['date_from']);
        }
        if (!empty($filters['date_to'])) {
            $query->where('shift_date', '<=', $filters['date_to']);
        }

        return Inertia::render('Admin/Attendance/Shifts/Index', [
            'shifts' => $query->paginate(20)->withQueryString(),
            'admins' => $this->adminOptions(),
            'filters' => $filters,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Attendance/Shifts/Create', [
            'admins' => $this->adminOptions(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'admin_id' => 'required|exists:admins,id',
            'shift_date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'notes' => 'nullable|string|max:1000',
        ]);

        $validated['created_by'] = Auth::guard('admins')->id();
        $validated['updated_by'] = Auth::guard('admins')->id();

        AdminShift::create($validated);

        return redirect()->route('admin.attendance.shifts.index')
            ->with('success', __('messages.registered', ['attribute' => 'シフト']));
    }

    public function edit(AdminShift $shift): Response
    {
        return Inertia::render('Admin/Attendance/Shifts/Edit', [
            'shift' => $shift,
            'admins' => $this->adminOptions(),
        ]);
    }

    public function update(Request $request, AdminShift $shift): RedirectResponse
    {
        $validated = $request->validate([
            'admin_id' => 'required|exists:admins,id',
            'shift_date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'notes' => 'nullable|string|max:1000',
        ]);

        $validated['updated_by'] = Auth::guard('admins')->id();

        $shift->update($validated);

        return redirect()->route('admin.attendance.shifts.index')
            ->with('success', __('messages.updated', ['attribute' => 'シフト']));
    }

    public function destroy(AdminShift $shift): RedirectResponse
    {
        $shift->deleted_by = Auth::guard('admins')->id();
        $shift->save();
        $shift->delete();

        return redirect()->route('admin.attendance.shifts.index')
            ->with('success', __('messages.deleted', ['attribute' => 'シフト']));
    }

    /**
     * シフトのまとめて作成（プレビュー表示）
     */
    public function bulkCreate(Request $request): Response
    {
        $params = $request->validate([
            'admin_id' => 'nullable|exists:admins,id',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'weekdays' => 'nullable|array',
            'weekdays.*' => 'integer|between:0,6',
            'start_time' => 'nullable|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i',
        ]);

        $adminId = $params['admin_id'] ?? null;
        $startDate = isset($params['start_date']) ? Carbon::parse($params['start_date']) : now()->startOfDay();
        $endDate = isset($params['end_date']) ? Carbon::parse($params['end_date']) : $startDate->copy()->addDays(6);
        $weekdays = array_map('intval', $params['weekdays'] ?? [1, 2, 3, 4, 5]);
        $startTime = $params['start_time'] ?? '09:00';
        $endTime = $params['end_time'] ?? '18:00';

        $preview = collect();
        $rangeError = null;

        if ($startDate->diffInDays($endDate) + 1 > self::BULK_CREATE_MAX_DAYS) {
            $rangeError = __('messages.appointment_slot.bulk_create_period_max', ['days' => self::BULK_CREATE_MAX_DAYS]);
        } elseif ($adminId) {
            $existingDates = AdminShift::where('admin_id', $adminId)
                ->whereBetween('shift_date', [$startDate->format('Y-m-d'), $endDate->format('Y-m-d')])
                ->pluck('shift_date')
                ->map(fn ($date) => $date->format('Y-m-d'));

            $current = $startDate->copy();
            $dayNames = ['日', '月', '火', '水', '木', '金', '土'];

            while ($current->lte($endDate)) {
                if (in_array($current->dayOfWeek, $weekdays, true)) {
                    $dateStr = $current->format('Y-m-d');
                    $preview->push([
                        'date' => $dateStr,
                        'day_name' => $dayNames[$current->dayOfWeek],
                        'start_time' => $startTime,
                        'end_time' => $endTime,
                        'already_exists' => $existingDates->contains($dateStr),
                        'include' => !$existingDates->contains($dateStr),
                    ]);
                }
                $current->addDay();
            }
        }

        return Inertia::render('Admin/Attendance/Shifts/BulkCreate', [
            'admins' => $this->adminOptions(),
            'preview' => $preview->values(),
            'rangeError' => $rangeError,
            'form' => [
                'admin_id' => $adminId,
                'start_date' => $startDate->format('Y-m-d'),
                'end_date' => $endDate->format('Y-m-d'),
                'weekdays' => $weekdays,
                'start_time' => $startTime,
                'end_time' => $endTime,
            ],
            'maxDays' => self::BULK_CREATE_MAX_DAYS,
        ]);
    }

    /**
     * シフトのまとめて保存
     */
    public function bulkStore(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'admin_id' => 'required|exists:admins,id',
            'shifts' => 'required|array|min:1',
            'shifts.*.date' => 'required|date',
            'shifts.*.start_time' => 'required|date_format:H:i',
            'shifts.*.end_time' => 'required|date_format:H:i|after:shifts.*.start_time',
        ]);

        $createdBy = Auth::guard('admins')->id();
        $createdCount = 0;
        $skippedCount = 0;

        DB::transaction(function () use ($validated, $createdBy, &$createdCount, &$skippedCount) {
            foreach ($validated['shifts'] as $shift) {
                $exists = AdminShift::where('admin_id', $validated['admin_id'])
                    ->where('shift_date', $shift['date'])
                    ->exists();

                if ($exists) {
                    $skippedCount++;
                    continue;
                }

                AdminShift::create([
                    'admin_id' => $validated['admin_id'],
                    'shift_date' => $shift['date'],
                    'start_time' => $shift['start_time'],
                    'end_time' => $shift['end_time'],
                    'created_by' => $createdBy,
                    'updated_by' => $createdBy,
                ]);
                $createdCount++;
            }
        });

        return redirect()->route('admin.attendance.shifts.index')
            ->with('success', "{$createdCount}件のシフトを作成しました。（重複のためスキップ: {$skippedCount}件）");
    }
}
