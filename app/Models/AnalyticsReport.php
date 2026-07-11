<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AnalyticsReport extends Model
{
    use HasUlid;

    protected $fillable = [
        'name',
        'description',
        'config',
        'schedule',
        'created_by',
        'last_generated_at',
    ];

    protected $casts = [
        'config' => 'array',
        'last_generated_at' => 'datetime',
    ];

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'created_by');
    }
}
