<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * 契約特典チケットの消費台帳
 */
class ContractBenefitUsage extends Model
{
    use HasUlid, HasFactory;

    protected $fillable = [
        'contract_benefit_id',
        'appointment_id',
        'quantity_used',
        'used_at',
        'reversed_at',
        'reversed_reason',
    ];

    protected $casts = [
        'quantity_used' => 'integer',
        'used_at' => 'datetime',
        'reversed_at' => 'datetime',
    ];

    public function contractBenefit(): BelongsTo
    {
        return $this->belongsTo(ContractBenefit::class);
    }

    public function appointment(): BelongsTo
    {
        return $this->belongsTo(Appointment::class);
    }

    public function isReversed(): bool
    {
        return $this->reversed_at !== null;
    }
}
