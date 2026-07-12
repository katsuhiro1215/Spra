<?php

namespace App\Services;

use App\Models\Appointment;
use App\Mail\AppointmentConfirmedMail;
use App\Mail\AppointmentReminderMail;
use App\Mail\AppointmentCancelledMail;
use App\Mail\AppointmentNotificationMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

/**
 * 予約通知サービス
 */
class AppointmentNotificationService
{
  /**
   * 新規予約作成時の通知
   */
  public function sendNewAppointmentNotifications(Appointment $appointment): void
  {
    try {
      // 担当Adminに通知
      if ($appointment->appointmentSlot->assignedAdmin) {
        $admin = $appointment->appointmentSlot->assignedAdmin;
        if ($admin->email) {
          Mail::to($admin->email)
            ->send(new AppointmentNotificationMail($appointment));
        }
      }

      // 予約者本人（登録ユーザー）に通知
      if ($appointment->user && $appointment->user->email) {
        Mail::to($appointment->user->email)
          ->send(new AppointmentConfirmedMail($appointment));
      }

      // クライアント（企業）に通知
      if ($appointment->company && $appointment->company->email) {
        Mail::to($appointment->company->email)
          ->send(new AppointmentConfirmedMail($appointment));
      }

      // 一般クライアント（アカウントなし）に通知
      if (!$appointment->user && $appointment->guest_email) {
        Mail::to($appointment->guest_email)
          ->send(new AppointmentConfirmedMail($appointment));
      }

      Log::info('New appointment notifications sent', [
        'appointment_id' => $appointment->id,
      ]);
    } catch (\Exception $e) {
      Log::error('Failed to send new appointment notifications', [
        'appointment_id' => $appointment->id,
        'error' => $e->getMessage(),
      ]);
    }
  }

  /**
   * 予約確定時の通知
   */
  public function sendConfirmationNotification(Appointment $appointment): void
  {
    try {
      // 予約者本人（登録ユーザー）に通知
      if ($appointment->user && $appointment->user->email) {
        Mail::to($appointment->user->email)
          ->send(new AppointmentConfirmedMail($appointment));
      }

      // クライアント（企業）に通知
      if ($appointment->company && $appointment->company->email) {
        Mail::to($appointment->company->email)
          ->send(new AppointmentConfirmedMail($appointment));
      }

      // 一般クライアント（アカウントなし）に通知
      if (!$appointment->user && $appointment->guest_email) {
        Mail::to($appointment->guest_email)
          ->send(new AppointmentConfirmedMail($appointment));
      }

      Log::info('Appointment confirmation notification sent', [
        'appointment_id' => $appointment->id,
      ]);
    } catch (\Exception $e) {
      Log::error('Failed to send confirmation notification', [
        'appointment_id' => $appointment->id,
        'error' => $e->getMessage(),
      ]);
    }
  }

  /**
   * 予約キャンセル時の通知
   */
  public function sendCancellationNotification(Appointment $appointment): void
  {
    try {
      // 予約者本人（登録ユーザー）に通知
      if ($appointment->user && $appointment->user->email) {
        Mail::to($appointment->user->email)
          ->send(new AppointmentCancelledMail($appointment));
      }

      // クライアント（企業）に通知
      if ($appointment->company && $appointment->company->email) {
        Mail::to($appointment->company->email)
          ->send(new AppointmentCancelledMail($appointment));
      }

      // 一般クライアント（アカウントなし）に通知
      if (!$appointment->user && $appointment->guest_email) {
        Mail::to($appointment->guest_email)
          ->send(new AppointmentCancelledMail($appointment));
      }

      // 担当Adminに通知
      if ($appointment->appointmentSlot->assignedAdmin) {
        $admin = $appointment->appointmentSlot->assignedAdmin;
        if ($admin->email) {
          Mail::to($admin->email)
            ->send(new AppointmentCancelledMail($appointment));
        }
      }

      Log::info('Appointment cancellation notification sent', [
        'appointment_id' => $appointment->id,
      ]);
    } catch (\Exception $e) {
      Log::error('Failed to send cancellation notification', [
        'appointment_id' => $appointment->id,
        'error' => $e->getMessage(),
      ]);
    }
  }

  /**
   * 予約リマインダーの送信
   */
  public function sendReminderNotification(Appointment $appointment): void
  {
    try {
      // リマインダー送信が有効な場合のみ
      if (!$appointment->send_reminder) {
        return;
      }

      // 既にリマインダーを送信済みの場合はスキップ
      if ($appointment->reminder_sent_at) {
        return;
      }

      // 確定済みの予約のみ
      if ($appointment->status !== 'confirmed') {
        return;
      }

      // 予約者本人（登録ユーザー）に通知
      if ($appointment->user && $appointment->user->email) {
        Mail::to($appointment->user->email)
          ->send(new AppointmentReminderMail($appointment));
      }

      // クライアント（企業）に通知
      if ($appointment->company && $appointment->company->email) {
        Mail::to($appointment->company->email)
          ->send(new AppointmentReminderMail($appointment));
      }

      // 一般クライアント（アカウントなし）に通知
      if (!$appointment->user && $appointment->guest_email) {
        Mail::to($appointment->guest_email)
          ->send(new AppointmentReminderMail($appointment));
      }

      // リマインダー送信日時を記録（宛先の有無にかかわらず再送を防ぐため必ず記録する）
      $appointment->reminder_sent_at = now();
      $appointment->save();

      Log::info('Appointment reminder sent', [
        'appointment_id' => $appointment->id,
      ]);
    } catch (\Exception $e) {
      Log::error('Failed to send reminder notification', [
        'appointment_id' => $appointment->id,
        'error' => $e->getMessage(),
      ]);
    }
  }

  /**
   * 指定日時の予約のリマインダーを一括送信
   */
  public function sendUpcomingReminders(int $hoursBeforeAppointment = 24): int
  {
    try {
      $targetDate = now()->addHours($hoursBeforeAppointment);

      $appointments = Appointment::with(['appointmentSlot', 'company', 'user'])
        ->where('status', 'confirmed')
        ->where('send_reminder', true)
        ->whereNull('reminder_sent_at')
        ->whereHas('appointmentSlot', function ($query) use ($targetDate) {
          $query->whereDate('date', $targetDate->format('Y-m-d'));
        })
        ->get();

      foreach ($appointments as $appointment) {
        $this->sendReminderNotification($appointment);
      }

      $count = $appointments->count();

      Log::info('Batch reminder notifications sent', [
        'count' => $count,
        'hours_before' => $hoursBeforeAppointment,
      ]);

      return $count;
    } catch (\Exception $e) {
      Log::error('Failed to send batch reminder notifications', [
        'error' => $e->getMessage(),
      ]);

      return 0;
    }
  }
}
