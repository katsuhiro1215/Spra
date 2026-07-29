<?php

namespace App\Services;

use App\Models\AppointmentSlot;
use App\Models\AppointmentSlotRecurrence;
use App\Repositories\Contracts\AppointmentSlotRecurrenceRepositoryInterface;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AppointmentSlotRecurrenceService extends BaseService
{
    /**
     * 繰り返し設定作成時、この日数分先まで先行して予約枠を生成する
     */
    private const GENERATION_HORIZON_DAYS = 90;

    public function __construct(
        AppointmentSlotRecurrenceRepositoryInterface $repository,
        private ScheduleService $scheduleService,
    ) {
        parent::__construct($repository);
    }

    protected function getEntityName(): string
    {
        return 'AppointmentSlotRecurrence';
    }

    public function createAndGenerate(array $data, ?string $adminId): AppointmentSlotRecurrence
    {
        return DB::transaction(function () use ($data, $adminId) {
            $data['status'] ??= 'active';
            $data['created_by'] = $adminId;
            $data['updated_by'] = $adminId;

            $recurrence = $this->repository->create($data);

            $this->generateSlots($recurrence);

            return $recurrence;
        });
    }

    public function pause(AppointmentSlotRecurrence $recurrence): AppointmentSlotRecurrence
    {
        $recurrence->update(['status' => 'paused']);

        return $recurrence;
    }

    public function resume(AppointmentSlotRecurrence $recurrence): AppointmentSlotRecurrence
    {
        $recurrence->update(['status' => 'active']);
        $this->generateSlots($recurrence);

        return $recurrence;
    }

    /**
     * 繰り返し設定に対応する未生成分の予約枠を生成する。
     * 既存の予約枠（同日・同時間帯）とは重複させない。
     *
     * @return int 新規生成した予約枠数
     */
    public function generateSlots(AppointmentSlotRecurrence $recurrence, ?Carbon $until = null): int
    {
        if (!$recurrence->isActive()) {
            return 0;
        }

        $until ??= now()->addDays(self::GENERATION_HORIZON_DAYS);
        if ($recurrence->ends_on && $until->gt($recurrence->ends_on)) {
            $until = Carbon::parse($recurrence->ends_on);
        }

        $lastGeneratedDate = $recurrence->slots()->max('date');
        $current = $lastGeneratedDate
            ? Carbon::parse($lastGeneratedDate)->addDay()
            : Carbon::parse($recurrence->starts_on);

        if ($current->lt(now()->startOfDay())) {
            $current = now()->startOfDay();
        }

        $existingDates = AppointmentSlot::where('recurrence_id', $recurrence->id)
            ->whereBetween('date', [$current->format('Y-m-d'), $until->format('Y-m-d')])
            ->pluck('date')
            ->map(fn($date) => $date->format('Y-m-d'))
            ->all();

        $created = 0;

        while ($current->lte($until)) {
            if (
                $current->dayOfWeek === (int) $recurrence->day_of_week
                && !in_array($current->format('Y-m-d'), $existingDates, true)
                && $this->scheduleService->isBusinessDay($current)
            ) {
                AppointmentSlot::create([
                    'recurrence_id' => $recurrence->id,
                    'date' => $current->format('Y-m-d'),
                    'start_time' => $recurrence->start_time,
                    'end_time' => $recurrence->end_time,
                    'slot_type' => $recurrence->slot_type,
                    'max_capacity' => $recurrence->max_capacity,
                    'assigned_admin_id' => $recurrence->assigned_admin_id,
                    'status' => 'available',
                    'created_by' => $recurrence->created_by,
                    'updated_by' => $recurrence->created_by,
                ]);
                $created++;
            }
            $current->addDay();
        }

        return $created;
    }

    /**
     * すべての有効な繰り返し設定について、先行生成の穴埋めを行う（スケジューラーから呼ばれる）
     */
    public function generateForAllActive(): int
    {
        $total = 0;
        foreach ($this->repository->getActive() as $recurrence) {
            $total += $this->generateSlots($recurrence);
        }

        return $total;
    }
}
