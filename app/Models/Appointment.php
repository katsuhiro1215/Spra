<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Appointment extends Model
{
  use HasFactory, SoftDeletes;

  /**
   * The attributes that are mass assignable.
   *
   * @var array<int, string>
   */
  protected $fillable = [
    'appointment_slot_id',
    'user_id',
    'company_id',
    'project_id',
    'source',
    'external_reference',
    'guest_name',
    'guest_email',
    'guest_phone',
    'subject',
    'description',
    'location_type',
    'meeting_tool',
    'meeting_url',
    'status',
    'attended',
    'confirmed_at',
    'cancelled_at',
    'cancellation_reason',
    'admin_notes',
    'client_notes',
    'send_reminder',
    'reminder_sent_at',
    'reminder_status',
    'reminder_error',
    'created_by',
    'updated_by',
    'deleted_by',
  ];

  /**
   * The attributes that should be cast.
   *
   * @var array<string, string>
   */
  protected $casts = [
    'attended' => 'boolean',
    'send_reminder' => 'boolean',
    'confirmed_at' => 'datetime',
    'cancelled_at' => 'datetime',
    'reminder_sent_at' => 'datetime',
  ];

  /**
   * 常にJSONへ含める算出属性
   *
   * @var array<int, string>
   */
  protected $appends = [
    'booker_name',
    'is_guest_booking',
  ];

  /**
   * リマインダー送信状況
   */
  const REMINDER_STATUS_PENDING = 'pending';
  const REMINDER_STATUS_SENT = 'sent';
  const REMINDER_STATUS_FAILED = 'failed';

  /**
   * リマインダー送信状況のラベル
   */
  public static function getReminderStatusLabel(string $status): string
  {
    return match ($status) {
      self::REMINDER_STATUS_PENDING => '実行前',
      self::REMINDER_STATUS_SENT => '正常終了',
      self::REMINDER_STATUS_FAILED => '異常終了',
      default => $status,
    };
  }

  /**
   * ステータスのラベル
   */
  public static function getStatusLabel(string $status): string
  {
    return match ($status) {
      'pending' => '保留中',
      'confirmed' => '確定',
      'completed' => '完了',
      'cancelled' => 'キャンセル',
      'no_show' => '不参加',
      default => $status,
    };
  }

  /**
   * ステータスの色
   */
  public static function getStatusColor(string $status): string
  {
    return match ($status) {
      'pending' => 'yellow',
      'confirmed' => 'blue',
      'completed' => 'green',
      'cancelled' => 'red',
      'no_show' => 'gray',
      default => 'gray',
    };
  }

  /**
   * 会議形式のラベル
   */
  public static function getLocationTypeLabel(string $locationType): string
  {
    return match ($locationType) {
      'in_person' => '対面',
      'online' => 'オンライン',
      default => $locationType,
    };
  }

  /**
   * Web会議ツールのラベル
   */
  public static function getMeetingToolLabel(?string $meetingTool): ?string
  {
    return match ($meetingTool) {
      'zoom' => 'Zoom',
      'teams' => 'Microsoft Teams',
      'google_meet' => 'Google Meet',
      'other' => 'その他',
      default => $meetingTool,
    };
  }

  /**
   * 予約者の表示名（User本人 → ゲスト氏名 → 企業名 の順にフォールバック）
   */
  public function getBookerNameAttribute(): string
  {
    if ($this->user) {
      return $this->user->profile?->full_name ?? $this->user->email;
    }

    if ($this->guest_name) {
      return $this->guest_name;
    }

    if ($this->company) {
      return $this->company->name;
    }

    return 'ゲスト';
  }

  /**
   * アカウントを持たない一般クライアントによる予約かどうか
   */
  public function getIsGuestBookingAttribute(): bool
  {
    return is_null($this->user_id) && filled($this->guest_name);
  }

  /**
   * 予約確定
   */
  public function confirm(): void
  {
    $this->status = 'confirmed';
    $this->confirmed_at = now();
    $this->save();
  }

  /**
   * 予約キャンセル
   */
  public function cancel(string $reason = null): void
  {
    $this->status = 'cancelled';
    $this->cancelled_at = now();
    $this->cancellation_reason = $reason;
    $this->save();

    // 予約枠の予約数を更新
    $this->appointmentSlot->updateBookingCount();
  }

  /**
   * 予約完了
   */
  public function complete(): void
  {
    $this->status = 'completed';
    $this->attended = true;
    $this->save();
  }

  /**
   * 不参加に設定
   */
  public function markAsNoShow(): void
  {
    $this->status = 'no_show';
    $this->attended = false;
    $this->save();
  }

  /**
   * 予約枠
   */
  public function appointmentSlot(): BelongsTo
  {
    return $this->belongsTo(AppointmentSlot::class);
  }

  /**
   * 予約者（ユーザー）
   */
  public function user(): BelongsTo
  {
    return $this->belongsTo(User::class);
  }

  /**
   * 予約者（企業）
   */
  public function company(): BelongsTo
  {
    return $this->belongsTo(Company::class);
  }

  /**
   * 関連プロジェクト
   */
  public function project(): BelongsTo
  {
    return $this->belongsTo(Project::class);
  }

  /**
   * 作成者
   */
  public function creator(): BelongsTo
  {
    return $this->belongsTo(Admin::class, 'created_by');
  }

  /**
   * 更新者
   */
  public function updater(): BelongsTo
  {
    return $this->belongsTo(Admin::class, 'updated_by');
  }

  /**
   * 削除者
   */
  public function deleter(): BelongsTo
  {
    return $this->belongsTo(Admin::class, 'deleted_by');
  }
}
