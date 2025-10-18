<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Company extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'company_type',
        'legal_name',
        'registration_number',
        'tax_number',
        'postal_code',
        'prefecture',
        'city',
        'district',
        'address_other',
        'phone',
        'fax',
        'email',
        'website',
        'representative_name',
        'representative_title',
        'representative_email',
        'representative_phone',
        'business_description',
        'industry',
        'employee_count',
        'capital',
        'established_date',
        'status',
        'notes',
        'metadata',
    ];

    protected $casts = [
        'established_date' => 'date',
        'capital' => 'decimal:2',
        'employee_count' => 'integer',
        'metadata' => 'array',
    ];

    protected $attributes = [
        'company_type' => 'individual',
        'status' => 'active',
    ];

    // Enums
    public const COMPANY_TYPES = [
        'individual' => '個人',
        'corporate' => '法人',
    ];

    public const STATUSES = [
        'active' => 'アクティブ',
        'inactive' => '非アクティブ',
        'suspended' => '停止中',
    ];

    // Relationships
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function addresses(): MorphMany
    {
        return $this->morphMany(UserAddress::class, 'addressable');
    }

    public function defaultAddress(): MorphMany
    {
        return $this->addresses()->where('is_default', true)->where('is_active', true);
    }

    // Accessors
    public function getCompanyTypeNameAttribute(): string
    {
        return self::COMPANY_TYPES[$this->company_type] ?? $this->company_type;
    }

    public function getStatusNameAttribute(): string
    {
        return self::STATUSES[$this->status] ?? $this->status;
    }

    public function getFullAddressAttribute(): string
    {
        $parts = array_filter([
            $this->postal_code ? "〒{$this->postal_code}" : null,
            $this->prefecture,
            $this->city,
            $this->district,
            $this->address_other,
        ]);

        return implode(' ', $parts);
    }

    public function getDisplayNameAttribute(): string
    {
        return $this->legal_name ?: $this->name;
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeByType($query, $type)
    {
        return $query->where('company_type', $type);
    }

    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
                ->orWhere('legal_name', 'like', "%{$search}%")
                ->orWhere('registration_number', 'like', "%{$search}%")
                ->orWhere('representative_name', 'like', "%{$search}%");
        });
    }

    // Helper methods
    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    public function isCorporate(): bool
    {
        return $this->company_type === 'corporate';
    }

    public function isIndividual(): bool
    {
        return $this->company_type === 'individual';
    }
}
