<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Receipt extends Model
{
    use HasUlid, HasFactory, SoftDeletes;

    protected $fillable = [
        'receipt_number',
        'invoice_id',
        'payment_id',
        'user_id',
        'company_id',
        'amount',
        'tax_amount',
        'total_amount',
        'pdf_path',
        'status',
        'issued_at',
        'sent_at',
        'notes',
        'created_by',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'issued_at' => 'datetime',
        'sent_at' => 'datetime',
    ];

    public const STATUSES = [
        'draft' => '下書き',
        'issued' => '発行済み',
        'sent' => '送付済み',
    ];

    // ========================================
    // Relationships
    // ========================================

    public function invoice(): BelongsTo
    {
        return $this->belongsTo(Invoice::class);
    }

    public function payment(): BelongsTo
    {
        return $this->belongsTo(Payment::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'created_by');
    }

    // ========================================
    // Scopes
    // ========================================

    public function scopeForClient($query, string $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeIssued($query)
    {
        return $query->whereIn('status', ['issued', 'sent']);
    }

    // ========================================
    // Helpers
    // ========================================

    public function isIssued(): bool
    {
        return in_array($this->status, ['issued', 'sent']);
    }

    public function isSent(): bool
    {
        return $this->status === 'sent';
    }
}
