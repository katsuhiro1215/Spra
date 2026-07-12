<?php

namespace App\Services;

use App\Models\Appointment;
use App\Models\AppointmentSlot;
use Illuminate\Support\Facades\DB;

/**
 * 予約枠の選択肢整形・予約作成のビジネスロジックを提供
 */
class AppointmentService
{
  /**
   * 予約可能な予約枠を選択肢配列に整形して取得
   *
   * @param string|null $excludeSlotId 予約可能でなくても含めたい枠（編集中の現在の枠など）
   */
  public function availableSlotOptions(?string $excludeSlotId = null): array
  {
    return AppointmentSlot::availableForBooking($excludeSlotId)
      ->with('assignedAdmin.profile')
      ->orderBy('date')
      ->orderBy('start_time')
      ->get()
      ->map(function (AppointmentSlot $slot) {
        return [
          'value' => $slot->id,
          'label' => sprintf(
            '%s %s-%s (%s) - 残り%d枠',
            $slot->date->format('Y-m-d'),
            substr($slot->start_time, 0, 5),
            substr($slot->end_time, 0, 5),
            AppointmentSlot::getSlotTypeLabel($slot->slot_type),
            max(0, $slot->max_capacity - $slot->current_bookings)
          ),
          'date' => $slot->date->format('Y-m-d'),
          'start_time' => $slot->start_time,
          'end_time' => $slot->end_time,
          'slot_type' => $slot->slot_type,
          'assigned_admin' => $slot->assignedAdmin ? [
            'id' => $slot->assignedAdmin->id,
            'name' => $slot->assignedAdmin->profile->full_name ?? $slot->assignedAdmin->email,
          ] : null,
        ];
      })
      ->all();
  }

  /**
   * 予約枠をロックした上で予約を作成する（二重予約防止のため悲観的ロックを使用）
   *
   * @throws \RuntimeException 予約枠が予約可能でない場合
   */
  public function book(string $slotId, array $data): Appointment
  {
    return DB::transaction(function () use ($slotId, $data) {
      $slot = AppointmentSlot::lockForUpdate()->findOrFail($slotId);

      if (!$slot->isAvailable()) {
        throw new \RuntimeException('この予約枠は現在予約できません。');
      }

      $appointment = Appointment::create([
        ...$data,
        'appointment_slot_id' => $slot->id,
        'status' => 'pending',
      ]);

      $slot->updateBookingCount();

      return $appointment;
    });
  }

  /**
   * 予約枠を変更（必要であればロックして空き状況を確認）した上で予約を更新する
   *
   * @throws \RuntimeException 変更先の予約枠が予約可能でない場合
   */
  public function reschedule(Appointment $appointment, string $newSlotId, array $data): Appointment
  {
    return DB::transaction(function () use ($appointment, $newSlotId, $data) {
      $oldSlotId = $appointment->appointment_slot_id;
      $slotChanged = (string) $oldSlotId !== (string) $newSlotId;

      if ($slotChanged) {
        $newSlot = AppointmentSlot::lockForUpdate()->findOrFail($newSlotId);

        if (!$newSlot->isAvailable()) {
          throw new \RuntimeException('この予約枠は現在予約できません。');
        }
      }

      $appointment->update([
        ...$data,
        'appointment_slot_id' => $newSlotId,
      ]);

      if ($slotChanged) {
        $oldSlot = AppointmentSlot::find($oldSlotId);
        $oldSlot?->updateBookingCount();
        $newSlot->updateBookingCount();
      }

      return $appointment;
    });
  }
}
