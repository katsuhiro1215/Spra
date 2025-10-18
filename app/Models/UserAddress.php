<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class UserAddress extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'addressable_type',
        'addressable_id',
        'type',
        'label',
        'postal_code',
        'prefecture',
        'city',
        'district',
        'address_other',
        'phone',
        'contact_person',
        'latitude',
        'longitude',
        'api_response',
        'is_default',
        'is_active',
        'verified_at',
        'notes',
        'metadata',
    ];

    protected $casts = [
        'latitude' => 'decimal:7',
        'longitude' => 'decimal:7',
        'api_response' => 'array',
        'metadata' => 'array',
        'is_default' => 'boolean',
        'is_active' => 'boolean',
        'verified_at' => 'datetime',
    ];

    protected $attributes = [
        'type' => 'home',
        'is_default' => false,
        'is_active' => true,
    ];

    // Enums
    public const TYPES = [
        'home' => '自宅',
        'office' => '会社',
        'billing' => '請求先',
        'shipping' => '配送先',
        'other' => 'その他',
    ];

    // Relationships
    public function addressable(): MorphTo
    {
        return $this->morphTo();
    }

    // Accessors
    public function getTypeNameAttribute(): string
    {
        return self::TYPES[$this->type] ?? $this->type;
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

    public function getDisplayLabelAttribute(): string
    {
        return $this->label ?: $this->type_name;
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeDefault($query)
    {
        return $query->where('is_default', true);
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopeForUser($query, $userId)
    {
        return $query->where('addressable_type', User::class)
            ->where('addressable_id', $userId);
    }

    public function scopeForCompany($query, $companyId)
    {
        return $query->where('addressable_type', Company::class)
            ->where('addressable_id', $companyId);
    }

    // Helper methods
    public function isActive(): bool
    {
        return $this->is_active;
    }

    public function isDefault(): bool
    {
        return $this->is_default;
    }

    public function isVerified(): bool
    {
        return !is_null($this->verified_at);
    }

    public function markAsDefault(): bool
    {
        // 同じaddressableの他の住所のデフォルトを解除
        static::where('addressable_type', $this->addressable_type)
            ->where('addressable_id', $this->addressable_id)
            ->where('id', '!=', $this->id)
            ->update(['is_default' => false]);

        return $this->update(['is_default' => true]);
    }

    public function markAsVerified(): bool
    {
        return $this->update(['verified_at' => now()]);
    }
}
