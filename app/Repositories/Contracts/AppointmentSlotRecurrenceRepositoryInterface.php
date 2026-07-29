<?php

namespace App\Repositories\Contracts;

use Illuminate\Database\Eloquent\Collection;

interface AppointmentSlotRecurrenceRepositoryInterface extends SoftDeletableRepositoryInterface
{
    public function getActive(): Collection;
}
