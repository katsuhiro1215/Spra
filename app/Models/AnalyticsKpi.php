<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class AnalyticsKpi extends Model
{
    use HasUlid;

    protected $table = 'analytics_kpis';

    protected $fillable = [
        'period_type',
        'period_date',
        'dimension_type',
        'dimension_id',
        'kpi_key',
        'value',
        'meta',
    ];

    protected $casts = [
        'period_date' => 'date',
        'value' => 'decimal:4',
        'meta' => 'array',
    ];

    // 集計期間単位の定数
    const PERIOD_DAILY = 'daily';
    const PERIOD_MONTHLY = 'monthly';

    // KPI種別の定数（代表例。kpi_key自体は自由文字列）
    const KPI_REVENUE = 'revenue';
    const KPI_NEW_CONTRACTS = 'new_contracts';
    const KPI_QUOTE_COUNT = 'quote_count';
    const KPI_CONVERSION_RATE = 'conversion_rate';
    const KPI_NEW_CONTACTS = 'new_contacts';
    const KPI_ACTIVE_PROJECTS = 'active_projects';

    /**
     * 集計対象モデル（Service/Project/Company/User等）
     * 全社KPIの場合はnull
     */
    public function dimension(): MorphTo
    {
        return $this->morphTo();
    }

    public function scopeOfKpi($query, string $kpiKey)
    {
        return $query->where('kpi_key', $kpiKey);
    }

    public function scopePeriod($query, string $periodType)
    {
        return $query->where('period_type', $periodType);
    }

    public function scopeCompanyWide($query)
    {
        return $query->whereNull('dimension_type')->whereNull('dimension_id');
    }
}
