<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AtlasMembership extends Model
{
    use HasUlid;

    public const BRANDS = ['concierge', 'life', 'japan'];
    public const STATUSES = ['pending', 'active', 'paused', 'revoked'];

    protected $fillable = [
        'user_id',
        'brand',
        'status',
        'granted_by',
        'activated_at',
        'note',
    ];

    protected $casts = [
        'activated_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function grantedBy(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'granted_by');
    }

    public function isActive(): bool
    {
        return $this->status === 'active';
    }
}
