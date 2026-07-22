<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AdminEmployment extends Model
{
    public const EMPLOYMENT_TYPES = [
        'full_time' => '正社員',
        'contract' => '契約社員',
        'temp_staff' => '派遣社員',
        'part_time' => 'パート・アルバイト',
    ];

    public const PAY_TYPES = [
        'monthly' => '月給制',
        'hourly' => '時給制',
    ];

    protected $fillable = [
        'admin_id',
        'employment_type',
        'pay_type',
        'base_salary',
        'hourly_wage',
        'created_by',
        'updated_by',
    ];

    protected function casts(): array
    {
        return [
            'base_salary' => 'decimal:2',
            'hourly_wage' => 'decimal:2',
        ];
    }

    public static function getEmploymentTypeLabel(string $type): string
    {
        return self::EMPLOYMENT_TYPES[$type] ?? $type;
    }

    public static function getPayTypeLabel(string $type): string
    {
        return self::PAY_TYPES[$type] ?? $type;
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
}
