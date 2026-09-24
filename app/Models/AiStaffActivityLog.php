<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AiStaffActivityLog extends Model
{
    use HasUlid;

    public $timestamps = false;

    protected $fillable = [
        'admin_id',
        'action',
        'subject_type',
        'subject_id',
        'description',
        'occurred_at',
    ];

    protected $casts = [
        'occurred_at' => 'datetime',
    ];

    public const ACTION_TASK_STATUS_CHANGED = 'task_status_changed';

    public const ACTION_RESPONSE_CREATED = 'response_created';

    public const ACTION_QUOTE_CREATED = 'quote_created';

    public const ACTION_PROPOSAL_CREATED = 'proposal_created';

    protected static function booted(): void
    {
        static::creating(function (self $log) {
            $log->created_at = $log->created_at ?? now();
        });
    }

    public function admin(): BelongsTo
    {
        return $this->belongsTo(Admin::class);
    }
}
