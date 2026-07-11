<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AnalyticsDimension extends Model
{
    use HasUlid;

    protected $fillable = [
        'type',
        'code',
        'label',
        'parent_id',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    // ディメンション種別の定数
    const TYPE_SITE = 'site';
    const TYPE_PAGE = 'page';
    const TYPE_REFERRER = 'referrer';
    const TYPE_KEYWORD = 'keyword';
    const TYPE_DEVICE = 'device';
    const TYPE_BROWSER = 'browser';

    public function parent(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(self::class, 'parent_id');
    }

    public function dailyStats(): HasMany
    {
        return $this->hasMany(AnalyticsDaily::class, 'dimension_id');
    }

    public function scopeOfType($query, string $type)
    {
        return $query->where('type', $type);
    }
}
