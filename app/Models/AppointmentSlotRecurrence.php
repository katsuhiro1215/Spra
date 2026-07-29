<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class AppointmentSlotRecurrence extends Model
{
    use HasUlid, HasFactory, SoftDeletes;

    protected $fillable = [
        'day_of_week',
        'start_time',
        'end_time',
        'slot_type',
        'max_capacity',
        'assigned_admin_id',
        'starts_on',
        'ends_on',
        'status',
        'notes',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'day_of_week' => 'integer',
        'max_capacity' => 'integer',
        'starts_on' => 'date:Y-m-d',
        'ends_on' => 'date:Y-m-d',
    ];

    protected $appends = ['day_name'];

    public const DAY_NAMES = ['日', '月', '火', '水', '木', '金', '土'];

    public function getDayNameAttribute(): string
    {
        return self::DAY_NAMES[$this->day_of_week] ?? (string) $this->day_of_week;
    }

    public function isActive(): bool
    {
        if ($this->status !== 'active') {
            return false;
        }

        return !$this->ends_on || now()->startOfDay()->lte($this->ends_on);
    }

    public function assignedAdmin(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'assigned_admin_id');
    }

    public function slots(): HasMany
    {
        return $this->hasMany(AppointmentSlot::class, 'recurrence_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'created_by');
    }

    public function updater(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'updated_by');
    }
}
