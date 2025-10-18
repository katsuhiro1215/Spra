<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class User extends Authenticatable
{
    use HasFactory, Notifiable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'company_id',
        'user_type',
        'name',
        'first_name',
        'last_name',
        'display_name',
        'email',
        'phone',
        'mobile_phone',
        'birth_date',
        'gender',
        'avatar',
        'occupation',
        'department',
        'position',
        'preferred_language',
        'timezone',
        'status',
        'password',
        'notes',
        'preferences',
        'metadata',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'last_login_at' => 'datetime',
            'birth_date' => 'date',
            'preferences' => 'array',
            'metadata' => 'array',
            'password' => 'hashed',
        ];
    }

    protected $attributes = [
        'user_type' => 'individual',
        'status' => 'active',
        'preferred_language' => 'ja',
        'timezone' => 'Asia/Tokyo',
    ];

    // Enums
    public const USER_TYPES = [
        'individual' => '個人',
        'corporate' => '法人代表',
        'employee' => '従業員',
    ];

    public const STATUSES = [
        'active' => 'アクティブ',
        'inactive' => '非アクティブ',
        'suspended' => '停止中',
        'pending' => '承認待ち',
    ];

    public const GENDERS = [
        'male' => '男性',
        'female' => '女性',
        'other' => 'その他',
        'not_specified' => '未指定',
    ];

    // Relationships
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function profile()
    {
        return $this->hasOne(UserProfile::class);
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
    public function getUserTypeNameAttribute(): string
    {
        return self::USER_TYPES[$this->user_type] ?? $this->user_type;
    }

    public function getStatusNameAttribute(): string
    {
        return self::STATUSES[$this->status] ?? $this->status;
    }

    public function getGenderNameAttribute(): string
    {
        return self::GENDERS[$this->gender] ?? $this->gender;
    }

    public function getFullNameAttribute(): string
    {
        if ($this->first_name && $this->last_name) {
            return "{$this->last_name} {$this->first_name}";
        }
        return $this->name;
    }

    public function getDisplayNameAttribute(): string
    {
        return $this->attributes['display_name'] ?: $this->full_name;
    }

    public function getAvatarUrlAttribute(): string
    {
        if ($this->avatar) {
            return asset("storage/{$this->avatar}");
        }
        // デフォルトアバター
        return "https://ui-avatars.com/api/?name=" . urlencode($this->display_name) . "&background=6366f1&color=fff";
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeByType($query, $type)
    {
        return $query->where('user_type', $type);
    }

    public function scopeByCompany($query, $companyId)
    {
        return $query->where('company_id', $companyId);
    }

    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
                ->orWhere('display_name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%")
                ->orWhere('first_name', 'like', "%{$search}%")
                ->orWhere('last_name', 'like', "%{$search}%");
        });
    }

    // Helper methods
    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    public function isIndividual(): bool
    {
        return $this->user_type === 'individual';
    }

    public function isCorporate(): bool
    {
        return $this->user_type === 'corporate';
    }

    public function isEmployee(): bool
    {
        return $this->user_type === 'employee';
    }

    public function hasCompany(): bool
    {
        return !is_null($this->company_id);
    }

    public function updateLastLogin(): bool
    {
        return $this->update(['last_login_at' => now()]);
    }
}
