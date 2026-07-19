<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ScheduleService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;

/**
 * 顧客向けの「現在営業中か」判定API
 */
class BusinessStatusController extends Controller
{
    public function status(ScheduleService $scheduleService): JsonResponse
    {
        $now = Carbon::now();
        $hours = $scheduleService->getBusinessHours($now);
        $isOpen = $hours !== null && $scheduleService->isTimeAvailable($now, 0);

        return response()->json([
            'date' => $now->format('Y-m-d'),
            'time' => $now->format('H:i'),
            'is_open' => $isOpen,
            'is_holiday' => $scheduleService->isHoliday($now),
            'hours' => $hours,
        ]);
    }
}
