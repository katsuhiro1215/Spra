<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    use HasUlid, HasFactory;

    protected $fillable = [
        'invoice_id',
        'company_id',
        'amount',
        'payment_method',
        'payment_date',
        'transaction_id',
        'status',
        'notes',
        'confirmed_by',
        'confirmed_at',
    ];

    protected $casts = [
        'payment_date' => 'date',
        'amount'       => 'decimal:2',
        'confirmed_at' => 'datetime',
    ];

    public const METHODS = [
        'bank_transfer' => '銀行振込',
        'credit_card'   => 'クレジットカード',
        'cash'          => '現金',
        'other'         => 'その他',
    ];

    public const STATUSES = [
        'pending'   => '保留中',
        'completed' => '完了',
        'failed'    => '失敗',
        'refunded'  => '返金済み',
    ];

    public function invoice(): BelongsTo
    {
        return $this->belongsTo(Invoice::class);
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function confirmedBy(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'confirmed_by');
    }

    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    public function getMethodNameAttribute(): string
    {
        return self::METHODS[$this->payment_method] ?? $this->payment_method;
    }

    public function getStatusNameAttribute(): string
    {
        return self::STATUSES[$this->status] ?? $this->status;
    }
}
