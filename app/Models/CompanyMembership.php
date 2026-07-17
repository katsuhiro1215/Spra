<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CompanyMembership extends Model
{
    use HasUlid;

    protected $fillable = [
        'company_id',
        'points_balance',
        'lifetime_points',
        'current_rank_id',
        'annual_usage_amount',
        'rank_calculated_at',
    ];

    protected $casts = [
        'points_balance' => 'integer',
        'lifetime_points' => 'integer',
        'annual_usage_amount' => 'decimal:2',
        'rank_calculated_at' => 'datetime',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function currentRank(): BelongsTo
    {
        return $this->belongsTo(MembershipRank::class, 'current_rank_id');
    }
}
