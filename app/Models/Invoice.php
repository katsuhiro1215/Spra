<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Invoice extends Model
{
    use HasUlid, HasFactory, SoftDeletes;

    protected $fillable = [
        'invoice_number',
        'invoice_type',
        'issue_date',
        'contract_id',
        'invoice_template_id',
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
        'client_downloaded_at',
        'client_downloaded_by',
        'notes',
        'pdf_path',
        'resend_count',
        'last_resent_at',
        'created_by',
    ];

    protected $casts = [
        'issue_date'           => 'date',
        'billing_period_start' => 'date',
        'billing_period_end'   => 'date',
        'due_date'             => 'date',
        'sent_at'              => 'datetime',
        'viewed_at'            => 'datetime',
        'paid_at'              => 'datetime',
        'client_downloaded_at' => 'datetime',
        'last_resent_at'       => 'datetime',
        'subtotal'             => 'decimal:2',
        'discount_amount'      => 'decimal:2',
        'tax_rate'             => 'decimal:2',
        'tax_amount'           => 'decimal:2',
        'total_amount'         => 'decimal:2',
    ];

    protected $appends = [
        'status_name',
        'invoice_type_name',
        'paid_amount',
        'balance',
    ];

    public const STATUSES = [
        'draft'     => '下書き',
        'sent'      => '送付済み',
        'viewed'    => '確認済み',
        'paid'      => '支払済み',
        'overdue'   => '期限超過',
        'cancelled' => 'キャンセル',
    ];

    public const INVOICE_TYPES = [
        'deposit' => '着手金',
        'interim' => '中間金',
        'final'   => '完了金',
        'full'    => '一括',
        'monthly' => '月額',
        'other'   => 'その他',
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

    public function invoiceTemplate(): BelongsTo
    {
        return $this->belongsTo(InvoiceTemplate::class);
    }



    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(InvoiceItem::class)->orderBy('sort_order');
    }

    public function receipt(): HasOne
    {
        return $this->hasOne(Receipt::class);
    }

    public function clientDownloadedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'client_downloaded_by');
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

    public function hasReceipt(): bool
    {
        return $this->receipt()->exists();
    }

    public function getStatusNameAttribute(): string
    {
        return self::STATUSES[$this->status] ?? $this->status;
    }

    public function getInvoiceTypeNameAttribute(): string
    {
        return self::INVOICE_TYPES[$this->invoice_type] ?? (string) $this->invoice_type;
    }

    /**
     * 完了済みPaymentの合計額
     */
    public function getPaidAmountAttribute(): float
    {
        return (float) $this->payments()->where('status', 'completed')->sum('amount');
    }

    /**
     * 請求額に対する残額(請求額 - 入金額)
     */
    public function getBalanceAttribute(): float
    {
        return (float) $this->total_amount - $this->paid_amount;
    }
}
