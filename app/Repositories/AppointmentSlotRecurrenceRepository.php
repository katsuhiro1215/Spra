<?php

namespace App\Repositories;

use App\Models\AppointmentSlotRecurrence;
use App\Repositories\Contracts\AppointmentSlotRecurrenceRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class AppointmentSlotRecurrenceRepository extends SoftDeletableRepository implements AppointmentSlotRecurrenceRepositoryInterface
{
    protected function getModelClass(): string
    {
        return AppointmentSlotRecurrence::class;
    }

    protected function getSearchableFields(): array
    {
        return [];
    }

    protected function getSortableFields(): array
    {
        return ['day_of_week', 'starts_on', 'created_at'];
    }

    protected function getDefaultSortField(): string
    {
        return 'day_of_week';
    }

    protected function getDefaultRelations(): array
    {
        return ['assignedAdmin.profile'];
    }

    public function getActive(): Collection
    {
        return AppointmentSlotRecurrence::where('status', 'active')
            ->where(function ($q) {
                $q->whereNull('ends_on')->orWhere('ends_on', '>=', now()->format('Y-m-d'));
            })
            ->get();
    }
}
