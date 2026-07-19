<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class AdminAttendanceRecord extends Model
{
    use HasFactory, SoftDeletes;

    public const STATUSES = [
        'working' => '勤務中',
        'finished' => '退勤済み',
    ];

    protected $fillable = [
        'admin_id',
        'work_date',
        'clocked_in_at',
        'clocked_out_at',
        'status',
        'notes',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    protected function casts(): array
    {
        return [
            'work_date' => 'date',
            'clocked_in_at' => 'datetime',
            'clocked_out_at' => 'datetime',
        ];
    }

    public static function getStatusLabel(string $status): string
    {
        return self::STATUSES[$status] ?? $status;
    }

    public function isWorking(): bool
    {
        return $this->status === 'working';
    }

    public function scopeCurrentlyWorking($query)
    {
        return $query->where('status', 'working');
    }

    public function admin(): BelongsTo
    {
        return $this->belongsTo(Admin::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'created_by');
    }

    public function updater(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'updated_by');
    }

    public function deleter(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'deleted_by');
    }
}
