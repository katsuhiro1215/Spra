<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class CalendarController extends Controller
{
    /**
     * 自分の予約をカレンダー形式で確認する
     */
    public function index(): InertiaResponse
    {
        $appointments = Appointment::where('user_id', Auth::id())
            ->whereNotNull('appointment_slot_id')
            ->with(['appointmentSlot.assignedAdmin.profile', 'project'])
            ->whereHas('appointmentSlot')
            ->orderBy('created_at')
            ->get();

        return Inertia::render('User/Calendar/Index', [
            'appointments' => $appointments,
        ]);
    }
}
