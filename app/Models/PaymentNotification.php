<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PaymentNotification extends Model
{
  use HasUlid, HasFactory, SoftDeletes;

  protected $fillable = [
    'invoice_id',
    'user_id',
    'company_id',
    'payment_method',
    'amount',
    'payment_date',
    'notes',
    'transaction_id',
    'status',
    'acknowledged_at',
    'acknowledged_by',
  ];

  protected $casts = [
    'payment_date'  => 'date',
    'amount'        => 'decimal:2',
    'acknowledged_at' => 'datetime',
  ];

  public const STATUSES = [
    'pending'      => '待機中',
    'acknowledged' => '確認済み',
    'verified'     => '確認完了',
    'rejected'     => '却下',
  ];

  public const PAYMENT_METHODS = [
    'bank_transfer' => '銀行振込',
    'credit_card'   => 'クレジットカード',
    'cash'          => '現金',
    'other'         => 'その他',
  ];

  // ========================================
  // Relationships
  // ========================================

  public function invoice(): BelongsTo
  {
    return $this->belongsTo(Invoice::class);
  }

  public function user(): BelongsTo
  {
    return $this->belongsTo(User::class);
  }

  public function company(): BelongsTo
  {
    return $this->belongsTo(Company::class);
  }

  public function acknowledgedBy(): BelongsTo
  {
    return $this->belongsTo(Admin::class, 'acknowledged_by');
  }

  // ========================================
  // Scopes
  // ========================================

  public function scopePending($query)
  {
    return $query->where('status', 'pending');
  }

  public function scopeAcknowledged($query)
  {
    return $query->where('status', 'acknowledged');
  }

  // ========================================
  // Helpers
  // ========================================

  public function getStatusNameAttribute(): string
  {
    return self::STATUSES[$this->status] ?? $this->status;
  }

  public function getMethodNameAttribute(): string
  {
    return self::PAYMENT_METHODS[$this->payment_method] ?? $this->payment_method;
  }

  public function isPending(): bool
  {
    return $this->status === 'pending';
  }

  public function acknowledge(string $adminId): void
  {
    $this->update([
      'status'           => 'acknowledged',
      'acknowledged_at'  => now(),
      'acknowledged_by'  => $adminId,
    ]);
  }
}
