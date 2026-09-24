<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AiStaffDailyReport extends Model
{
    use HasUlid;

    protected $fillable = [
        'admin_id',
        'report_date',
        'body',
        'activity_count',
        'generated_at',
    ];

    protected $casts = [
        'report_date' => 'date',
        'generated_at' => 'datetime',
    ];

    public function admin(): BelongsTo
    {
        return $this->belongsTo(Admin::class);
    }
}
