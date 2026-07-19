<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePublicAppointmentRequest;
use App\Services\AppointmentNotificationService;
use App\Services\AppointmentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Public用「無料相談」予約コントローラー
 *
 * アカウントを持たない訪問者からの無料相談予約を処理する
 */
class AppointmentController extends Controller
{
  /**
   * 公開フォームで受け付ける予約枠の種別
   */
  private const SLOT_TYPE = 'consultation';

  /**
   * 予約可能な日数の上限（本日から何日先まで）
   */
  private const BOOKABLE_WITHIN_DAYS = 14;

  public function __construct(
    private AppointmentService $appointmentService,
    private AppointmentNotificationService $notificationService,
  ) {}

  /**
   * 無料相談予約フォームを表示
   */
  public function create(): Response
  {
    return Inertia::render('Public/Consultation', [
      'availableSlots' => $this->appointmentService->availableSlotOptions(
        null,
        self::SLOT_TYPE,
        self::BOOKABLE_WITHIN_DAYS,
      ),
    ]);
  }

  /**
   * 無料相談予約を送信
   */
  public function store(StorePublicAppointmentRequest $request): RedirectResponse
  {
    $validated = $request->validated();

    // ハニーポット欄が埋まっていればスパムとみなし、正常に完了したかのように振る舞う
    if (filled($validated['website'] ?? null)) {
      return redirect()
        ->back()
        ->with('success', 'ご予約を受け付けました。確認メールをお送りしましたのでご確認ください。');
    }

    try {
      $appointment = $this->appointmentService->book($validated['appointment_slot_id'], [
        'guest_name' => $validated['guest_name'],
        'guest_email' => $validated['guest_email'],
        'guest_phone' => $validated['guest_phone'],
        'subject' => '無料相談',
        'description' => $validated['description'] ?? null,
        'location_type' => 'online',
        'send_reminder' => true,
      ]);

      $appointment->load(['appointmentSlot.assignedAdmin', 'company', 'project', 'user']);
      $this->notificationService->sendNewAppointmentNotifications($appointment);

      Log::info('無料相談予約を受け付けました', [
        'appointment_id' => $appointment->id,
        'guest_email' => $appointment->guest_email,
      ]);

      return redirect()
        ->back()
        ->with('success', 'ご予約を受け付けました。確認メールをお送りしましたのでご確認ください。');
    } catch (\RuntimeException $e) {
      return redirect()
        ->back()
        ->withInput()
        ->with('error', $e->getMessage());
    } catch (\Exception $e) {
      Log::error('無料相談予約エラー: ' . $e->getMessage(), [
        'error' => $e->getMessage(),
        'trace' => $e->getTraceAsString(),
      ]);

      return redirect()
        ->back()
        ->withInput()
        ->with('error', 'ご予約の送信に失敗しました。お手数ですが、しばらくしてから再度お試しください。');
    }
  }
}
