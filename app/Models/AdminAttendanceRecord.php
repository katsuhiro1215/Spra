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
        'on_break' => '休憩中',
        'finished' => '退勤済み',
    ];

    protected $fillable = [
        'admin_id',
        'work_date',
        'clocked_in_at',
        'clocked_out_at',
        'break_started_at',
        'break_minutes',
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
            'break_started_at' => 'datetime',
            'break_minutes' => 'integer',
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

    public function isOnBreak(): bool
    {
        return $this->status === 'on_break';
    }

    /**
     * 実働時間（分）を算出する。休憩中の場合は現在時刻までの休憩を含めて差し引く
     */
    public function getWorkedMinutes(): ?int
    {
        if (!$this->clocked_in_at) {
            return null;
        }

        $end = $this->clocked_out_at ?? now();
        $breakMinutes = $this->break_minutes;

        if ($this->status === 'on_break' && $this->break_started_at) {
            $breakMinutes += $this->break_started_at->diffInMinutes($end);
        }

        return max(0, $this->clocked_in_at->diffInMinutes($end) - $breakMinutes);
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
