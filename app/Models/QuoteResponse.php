<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuoteResponse extends Model
{
    use HasUlid;

    protected $fillable = [
        'quote_id',
        'token',
        'email',
        'response_type',
        'response_text',
        'responded_at',
        'admin_notified_at',
        'user_id',
        'company_id',
    ];

    protected $casts = [
        'responded_at' => 'datetime',
        'admin_notified_at' => 'datetime',
    ];

    // Response types
    public const RESPONSE_TYPES = [
        'request' => 'ご依頼をお願いします',
        'decline' => '今回は見送ります。',
        'revision_request' => 'お見積りの見直しを依頼',
        'other' => 'その他',
    ];

    /**
     * Get the quote that this response belongs to.
     */
    public function quote(): BelongsTo
    {
        return $this->belongsTo(Quote::class);
    }

    /**
     * Get the user created from this response
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the company created from this response
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Get human-readable response type label
     */
    public function getResponseTypeLabel(): string
    {
        return self::RESPONSE_TYPES[$this->response_type] ?? $this->response_type;
    }

    /**
     * Check if response is pending
     */
    public function isPending(): bool
    {
        return $this->responded_at === null;
    }

    /**
     * Check if admin has been notified
     */
    public function isAdminNotified(): bool
    {
        return $this->admin_notified_at !== null;
    }
}
