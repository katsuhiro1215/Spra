<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Invoice extends Model
{
    use HasUlid, HasFactory, SoftDeletes;

    protected $fillable = [
        'invoice_number',
        'contract_id',
        'user_id',
        'company_id',
        'billing_period_start',
        'billing_period_end',
        'subtotal',
        'discount_amount',
        'tax_rate',
        'tax_amount',
        'total_amount',
        'status',
        'due_date',
        'sent_at',
        'viewed_at',
        'paid_at',
        'notes',
        'created_by',
    ];

    protected $casts = [
        'billing_period_start' => 'date',
        'billing_period_end'   => 'date',
        'due_date'             => 'date',
        'sent_at'              => 'datetime',
        'viewed_at'            => 'datetime',
        'paid_at'              => 'datetime',
        'subtotal'             => 'decimal:2',
        'discount_amount'      => 'decimal:2',
        'tax_rate'             => 'decimal:2',
        'tax_amount'           => 'decimal:2',
        'total_amount'         => 'decimal:2',
    ];

    public const STATUSES = [
        'draft'     => '下書き',
        'sent'      => '送付済み',
        'viewed'    => '確認済み',
        'paid'      => '支払済み',
        'overdue'   => '期限超過',
        'cancelled' => 'キャンセル',
    ];

    public function contract(): BelongsTo
    {
        return $this->belongsTo(Contract::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(InvoiceItem::class)->orderBy('sort_order');
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function scopeForClient($query, string $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeUnpaid($query)
    {
        return $query->whereIn('status', ['sent', 'viewed', 'overdue']);
    }

    public function isPaid(): bool
    {
        return $this->status === 'paid';
    }

    public function isOverdue(): bool
    {
        return $this->status === 'overdue'
            || ($this->due_date < now() && !in_array($this->status, ['paid', 'cancelled']));
    }

    public function getStatusNameAttribute(): string
    {
        return self::STATUSES[$this->status] ?? $this->status;
    }
}
