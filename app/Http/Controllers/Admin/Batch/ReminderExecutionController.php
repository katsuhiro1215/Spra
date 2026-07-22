<?php

namespace App\Http\Controllers\Admin\Batch;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReminderExecutionController extends Controller
{
    /**
     * クライアント×日付でリマインダー送信状況を一覧表示
     */
    public function index(Request $request): Response
    {
        $from = $request->filled('from')
            ? Carbon::parse($request->input('from'))->startOfDay()
            : now()->startOfDay();
        $to = $request->filled('to')
            ? Carbon::parse($request->input('to'))->endOfDay()
            : $from->copy()->addDays(30)->endOfDay();

        $appointments = Appointment::with(['appointmentSlot', 'user.profile', 'company'])
            ->where('status', 'confirmed')
            ->where('send_reminder', true)
            ->whereHas('appointmentSlot', function ($query) use ($from, $to) {
                $query->whereBetween('date', [$from->format('Y-m-d'), $to->format('Y-m-d')]);
            })
            ->get()
            ->filter(fn (Appointment $appointment) => $appointment->appointmentSlot !== null)
            ->sortBy(fn (Appointment $appointment) => $appointment->appointmentSlot->date->format('Y-m-d') . $appointment->appointmentSlot->start_time);

        $rows = $appointments
            ->groupBy(fn (Appointment $appointment) => $this->clientKey($appointment))
            ->map(function ($group) {
                /** @var Appointment $first */
                $first = $group->first();

                return [
                    'client_key' => $this->clientKey($first),
                    'client_name' => $first->booker_name,
                    'is_guest' => $first->is_guest_booking,
                    'cells' => $group->keyBy(fn (Appointment $appointment) => $appointment->appointmentSlot->date->format('Y-m-d'))
                        ->map(fn (Appointment $appointment) => [
                            'appointment_id' => $appointment->id,
                            'status' => $appointment->reminder_status,
                            'status_label' => Appointment::getReminderStatusLabel($appointment->reminder_status),
                            'error' => $appointment->reminder_error,
                            'time' => substr($appointment->appointmentSlot->start_time, 0, 5),
                            'subject' => $appointment->subject,
                        ]),
                ];
            })
            ->sortBy('client_name')
            ->values();

        $dates = $appointments
            ->map(fn (Appointment $appointment) => $appointment->appointmentSlot->date->format('Y-m-d'))
            ->unique()
            ->sort()
            ->values();

        return Inertia::render('Admin/Batch/Reminders/Index', [
            'rows' => $rows,
            'dates' => $dates,
            'filters' => [
                'from' => $from->format('Y-m-d'),
                'to' => $to->format('Y-m-d'),
            ],
        ]);
    }

    /**
     * クライアントの識別キー（企業 → 登録ユーザー → ゲストの順で決定）
     */
    private function clientKey(Appointment $appointment): string
    {
        if ($appointment->company_id) {
            return "company:{$appointment->company_id}";
        }

        if ($appointment->user_id) {
            return "user:{$appointment->user_id}";
        }

        return 'guest:' . ($appointment->guest_email ?: $appointment->guest_name ?: $appointment->id);
    }
}
