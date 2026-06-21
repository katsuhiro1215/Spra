<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class ScheduleDefault extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'day_of_week',
        'is_open',
        'open_time',
        'close_time',
        'break_start',
        'break_end',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_open' => 'boolean',
            'day_of_week' => 'integer',
        ];
    }

    /**
     * 曜日名を取得
     */
    public function getDayNameAttribute(): string
    {
        $days = ['日', '月', '火', '水', '木', '金', '土'];
        return $days[$this->day_of_week] ?? '';
    }

    /**
     * Get the creator of the schedule.
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'created_by');
    }

    /**
     * Get the updater of the schedule.
     */
    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'updated_by');
    }

    /**
     * Get the deleter of the schedule.
     */
    public function deletedBy(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'deleted_by');
    }

    /**
     * 営業時間を整形して取得
     */
    public function getFormattedHoursAttribute(): string
    {
        if (!$this->is_open) {
            return '定休日';
        }

        if (!$this->open_time || !$this->close_time) {
            return '時間未設定';
        }

        $hours = substr($this->open_time, 0, 5) . ' - ' . substr($this->close_time, 0, 5);

        if ($this->break_start && $this->break_end) {
            $hours .= ' (休憩: ' . substr($this->break_start, 0, 5) . ' - ' . substr($this->break_end, 0, 5) . ')';
        }

        return $hours;
    }
}
