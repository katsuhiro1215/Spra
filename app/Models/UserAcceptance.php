<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserAcceptance extends Model
{
    use HasUlid;

    protected $fillable = [
        'user_id',
        'document_version_id',
        'accepted_at',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'accepted_at' => 'datetime',
    ];

    // -------------------------
    // Relationships
    // -------------------------

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function documentVersion(): BelongsTo
    {
        return $this->belongsTo(DocumentVersion::class);
    }
}
