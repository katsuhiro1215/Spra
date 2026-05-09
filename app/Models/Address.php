<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Address extends Model
{
    use HasUlid, HasFactory, SoftDeletes;

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
        'is_default',
        'is_active',
        'verified_at',
        'notes',
    ];

    protected $casts = [
        'is_default'  => 'boolean',
        'is_active'   => 'boolean',
        'verified_at' => 'datetime',
        'latitude'    => 'decimal:7',
        'longitude'   => 'decimal:7',
    ];

    protected $appends = [
        'full_address',
        'formatted_postal_code',
    ];

    public const TYPES = [
        'home'     => '自宅',
        'office'   => 'オフィス',
        'branch'   => '支店',
        'billing'  => '請求先',
        'shipping' => '配送先',
        'other'    => 'その他',
    ];

    /**
     * ポリモーフィックリレーション（Admin、User、Company）
     */
    public function addressable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * 完全な住所を取得
     */
    public function getFullAddressAttribute(): string
    {
        $parts = array_filter([
            $this->prefecture,
            $this->city,
            $this->district,
            $this->address_other,
        ]);
        return implode(' ', $parts);
    }

    /**
     * 郵便番号をフォーマット（ハイフン付き）
     */
    public function getFormattedPostalCodeAttribute(): string
    {
        if (strlen($this->postal_code) === 7) {
            return substr($this->postal_code, 0, 3) . '-' . substr($this->postal_code, 3);
        }
        return $this->postal_code;
    }

    /**
     * デフォルト住所のスコープ
     */
    public function scopeDefault($query)
    {
        return $query->where('is_default', true)->where('is_active', true);
    }

    /**
     * 有効な住所のスコープ
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
