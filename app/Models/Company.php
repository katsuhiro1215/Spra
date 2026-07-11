<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Company extends Model
{
    use HasUlid, HasFactory, SoftDeletes;

    protected $fillable = [
        'media_id',
        'name',
        'company_type',
        'legal_name',
        'registration_number',
        'tax_number',
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
    ];

    protected $casts = [
        'established_date' => 'date',
        'capital'          => 'decimal:2',
    ];

    public const TYPES = [
        'individual' => '個人',
        'corporate'  => '法人',
    ];

    // コントローラー互換のためのエイリアス
    // public const COMPANY_TYPES = self::TYPES;

    public const STATUSES = [
        'active'    => '有効',
        'inactive'  => '無効',
        'suspended' => '停止中',
    ];

    // -------------------------
    // Relationships
    // -------------------------

    public function media(): BelongsTo
    {
        return $this->belongsTo(Media::class);
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'company_user')
            ->using(CompanyUser::class)
            ->withPivot(['role', 'is_primary', 'joined_at', 'left_at'])
            ->withTimestamps();
    }

    public function addresses(): MorphMany
    {
        return $this->morphMany(Address::class, 'addressable');
    }

    public function defaultAddress(): MorphMany
    {
        return $this->addresses()->where('is_default', true)->where('is_active', true);
    }

    public function projects(): HasMany
    {
        return $this->hasMany(Project::class);
    }

    public function contracts(): HasMany
    {
        return $this->hasMany(Contract::class);
    }

    public function quotes(): HasMany
    {
        return $this->hasMany(Quote::class);
    }

    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }

    public function receipts(): HasMany
    {
        return $this->hasMany(Receipt::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    // -------------------------
    // Scopes
    // -------------------------

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeByType($query, string $type)
    {
        return $query->where('company_type', $type);
    }

    public function scopeSearch($query, string $keyword)
    {
        return $query->where(function ($q) use ($keyword) {
            $q->where('name', 'like', "%{$keyword}%")
                ->orWhere('legal_name', 'like', "%{$keyword}%")
                ->orWhere('email', 'like', "%{$keyword}%")
                ->orWhere('representative_name', 'like', "%{$keyword}%");
        });
    }

    public function scopeCorporate($query)
    {
        return $query->where('company_type', 'corporate');
    }

    // -------------------------
    // Helpers
    // -------------------------

    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    public function isCorporate(): bool
    {
        return $this->company_type === 'corporate';
    }
}
