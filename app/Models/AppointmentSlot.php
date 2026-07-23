<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class AppointmentSlot extends Model
{
  use HasFactory, SoftDeletes;

  /**
   * The attributes that are mass assignable.
   *
   * @var array<int, string>
   */
  protected $fillable = [
    'date',
    'start_time',
    'end_time',
    'slot_type',
    'max_capacity',
    'current_bookings',
    'assigned_admin_id',
    'status',
    'notes',
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
    // 'date'のみだとJSON化の際にUTC変換され、日本時間の日付が前日にズレてしまうため
    // 出力フォーマットを明示し、日付のみを保持する
    'date' => 'date:Y-m-d',
    'current_bookings' => 'integer',
    'max_capacity' => 'integer',
  ];

  /**
   * 予約枠タイプのラベル
   */
  public static function getSlotTypeLabel(string $type): string
  {
    return match ($type) {
      'meeting' => '面談',
      'progress_review' => '進捗会',
      'consultation' => '相談',
      'other' => 'その他',
      default => $type,
    };
  }

  /**
   * ステータスのラベル
   */
  public static function getStatusLabel(string $status): string
  {
    return match ($status) {
      'available' => '予約可能',
      'blocked' => 'ブロック中',
      'full' => '満席',
      default => $status,
    };
  }

  /**
   * 予約可能な枠のみに絞り込む
   */
  public function scopeAvailableForBooking($query, ?string $excludeSlotId = null)
  {
    return $query->where(function ($q) use ($excludeSlotId) {
      $q->where('status', 'available')
        ->whereRaw('current_bookings < max_capacity');

      if ($excludeSlotId) {
        $q->orWhere('id', $excludeSlotId);
      }
    })->where('date', '>=', now()->format('Y-m-d'));
  }

  /**
   * 予約可能かチェック
   */
  public function isAvailable(): bool
  {
    return $this->status === 'available' && $this->current_bookings < $this->max_capacity;
  }

  /**
   * 満席かチェック
   */
  public function isFull(): bool
  {
    return $this->current_bookings >= $this->max_capacity;
  }

  /**
   * 予約数を更新
   */
  public function updateBookingCount(): void
  {
    $this->current_bookings = $this->appointments()->whereIn('status', ['pending', 'confirmed'])->count();

    // 満席の場合はステータスを更新
    if ($this->isFull() && $this->status === 'available') {
      $this->status = 'full';
    } elseif (!$this->isFull() && $this->status === 'full') {
      $this->status = 'available';
    }

    $this->save();
  }

  /**
   * 担当管理者
   */
  public function assignedAdmin(): BelongsTo
  {
    return $this->belongsTo(Admin::class, 'assigned_admin_id');
  }

  /**
   * 予約一覧
   */
  public function appointments(): HasMany
  {
    return $this->hasMany(Appointment::class);
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
