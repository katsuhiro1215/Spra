<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProjectInquiry extends Model
{
    use HasUlid, HasFactory, SoftDeletes;

    protected $fillable = [
        'inquiry_code',
        'user_id',
        'company_id',
        'title',
        'summary',
        'budget_min',
        'budget_max',
        'desired_delivery_date',
        'status',
        'hearing_notes',
        'admin_notes',
        'assigned_admin_id',
        'quote_id',
        'created_by',
    ];

    protected $casts = [
        'desired_delivery_date' => 'date',
        'budget_min'            => 'decimal:2',
        'budget_max'            => 'decimal:2',
    ];

    public const STATUSES = [
        'new'          => '新規受付',
        'in_discussion' => '相談中',
        'estimated'    => '見積済み',
        'contracted'   => '契約済み',
        'cancelled'    => 'キャンセル',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function assignedAdmin(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'assigned_admin_id');
    }

    public function quote(): BelongsTo
    {
        return $this->belongsTo(Quote::class);
    }

    public function project(): HasMany
    {
        return $this->hasMany(Project::class, 'inquiry_id');
    }

    public function scopeForAdmin($query, string $adminId)
    {
        return $query->where('assigned_admin_id', $adminId);
    }

    public function scopeNew($query)
    {
        return $query->where('status', 'new');
    }

    public function getStatusNameAttribute(): string
    {
        return self::STATUSES[$this->status] ?? $this->status;
    }
}
