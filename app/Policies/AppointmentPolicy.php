<?php

namespace App\Policies;

use App\Models\Appointment;
use App\Models\User;

class AppointmentPolicy
{
    /**
     * Userが自分自身の予約を編集できる状態か（変更可能なステータスかつ本人所有）
     */
    private function isOwnedAndModifiable(User $user, Appointment $appointment): bool
    {
        return $appointment->user_id === $user->id
            && in_array($appointment->status, ['pending', 'confirmed'], true);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Appointment $appointment): bool
    {
        return $appointment->user_id === $user->id;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Appointment $appointment): bool
    {
        return $this->isOwnedAndModifiable($user, $appointment);
    }

    /**
     * Determine whether the user can cancel the model.
     */
    public function cancel(User $user, Appointment $appointment): bool
    {
        return $this->isOwnedAndModifiable($user, $appointment);
    }
}
