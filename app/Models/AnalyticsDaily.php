<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AnalyticsDaily extends Model
{
    use HasUlid;

    protected $table = 'analytics_daily';

    protected $fillable = [
        'date',
        'dimension_id',
        'metric',
        'value',
    ];

    protected $casts = [
        'date' => 'date',
        'value' => 'decimal:4',
    ];

    // 指標の定数
    const METRIC_VIEWS = 'views';
    const METRIC_VISITORS = 'visitors';
    const METRIC_SESSIONS = 'sessions';
    const METRIC_CLICKS = 'clicks';
    const METRIC_IMPRESSIONS = 'impressions';
    const METRIC_AVG_POSITION = 'avg_position';

    public function dimension(): BelongsTo
    {
        return $this->belongsTo(AnalyticsDimension::class, 'dimension_id');
    }

    public function scopeOfMetric($query, string $metric)
    {
        return $query->where('metric', $metric);
    }

    public function scopeBetweenDates($query, $startDate, $endDate)
    {
        return $query->whereBetween('date', [$startDate, $endDate]);
    }
}
