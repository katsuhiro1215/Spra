<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;

class Holiday extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'date',
        'name',
        'type',
        'color',
        'is_recurring',
        'description',
        'created_by',
        'updated_by',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'date' => 'date',
            'is_recurring' => 'boolean',
        ];
    }

    /**
     * Get the creator of the holiday.
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'created_by');
    }

    /**
     * Get the last updater of the holiday.
     */
    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'updated_by');
    }

    /**
     * Scope a query to only include national holidays.
     */
    public function scopeNational($query)
    {
        return $query->where('type', 'national');
    }

    /**
     * Scope a query to only include international holidays.
     */
    public function scopeInternational($query)
    {
        return $query->where('type', 'international');
    }

    /**
     * Scope a query to only include holidays for a specific date.
     */
    public function scopeForDate($query, $date)
    {
        return $query->where('date', $date);
    }

    /**
     * Scope a query to only include recurring holidays.
     */
    public function scopeRecurring($query)
    {
        return $query->where('is_recurring', true);
    }
}
