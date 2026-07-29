<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAppointmentSlotRecurrenceRequest;
use App\Models\Admin;
use App\Models\AppointmentSlotRecurrence;
use App\Services\AppointmentSlotRecurrenceService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AppointmentSlotRecurrenceController extends Controller
{
    public function __construct(
        private AppointmentSlotRecurrenceService $service,
    ) {}

    public function index(): Response
    {
        $recurrences = AppointmentSlotRecurrence::with('assignedAdmin.profile')
            ->withCount('slots')
            ->orderBy('day_of_week')
            ->get();

        return Inertia::render('Admin/AppointmentSlots/Recurrences/Index', [
            'recurrences' => $recurrences,
        ]);
    }

    public function create(): Response
    {
        $admins = Admin::with('profile')
            ->whereHas('profile')
            ->get()
            ->map(fn($admin) => [
                'value' => $admin->id,
                'label' => $admin->profile->full_name ?? $admin->email,
            ]);

        return Inertia::render('Admin/AppointmentSlots/Recurrences/Create', [
            'admins' => $admins,
        ]);
    }

    public function store(StoreAppointmentSlotRecurrenceRequest $request): RedirectResponse
    {
        $recurrence = $this->service->createAndGenerate(
            $request->validated(),
            Auth::guard('admins')->id(),
        );

        $generatedCount = $recurrence->slots()->count();

        return redirect()
            ->route('admin.appointment-slot-recurrences.index')
            ->with('success', "繰り返し予約枠を作成しました（{$generatedCount}件生成）。");
    }

    public function pause(AppointmentSlotRecurrence $appointmentSlotRecurrence): RedirectResponse
    {
        $this->service->pause($appointmentSlotRecurrence);

        return back()->with('success', '繰り返し設定を一時停止しました。');
    }

    public function resume(AppointmentSlotRecurrence $appointmentSlotRecurrence): RedirectResponse
    {
        $this->service->resume($appointmentSlotRecurrence);

        return back()->with('success', '繰り返し設定を再開しました。');
    }

    public function destroy(AppointmentSlotRecurrence $appointmentSlotRecurrence): RedirectResponse
    {
        $this->service->delete($appointmentSlotRecurrence);

        return redirect()
            ->route('admin.appointment-slot-recurrences.index')
            ->with('success', '繰り返し設定を削除しました（生成済みの予約枠は残ります）。');
    }
}
