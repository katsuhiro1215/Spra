<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Project extends Model
{
    use HasUlid, HasFactory, SoftDeletes;

    protected $fillable = [
        'project_code',
        'contract_id',
        'user_id',
        'company_id',
        'admin_id',
        'title',
        'description',
        'thumbnail',
        'status',
        'priority',
        'start_date',
        'estimated_end_date',
        'actual_end_date',
        'is_client_visible',
        'client_visible_notes',
        'internal_notes',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    protected $casts = [
        'start_date'         => 'date',
        'estimated_end_date' => 'date',
        'actual_end_date'    => 'date',
        'is_client_visible'  => 'boolean',
    ];

    public const STATUSES = [
        'planning'    => '計画中',
        'design'      => 'デザイン中',
        'development' => '開発中',
        'testing'     => 'テスト中',
        'review'      => 'レビュー中',
        'completed'   => '完了',
        'on_hold'     => '保留',
        'cancelled'   => 'キャンセル',
    ];

    public const PRIORITIES = [
        'low'    => '低',
        'medium' => '中',
        'high'   => '高',
        'urgent' => '緊急',
    ];

    public function contract(): BelongsTo
    {
        return $this->belongsTo(Contract::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function admin(): BelongsTo
    {
        return $this->belongsTo(Admin::class);
    }

    // マイルストーンはProjectVersionを経由してアクセス: $project->currentVersion->milestones

    public function versions(): HasMany
    {
        return $this->hasMany(ProjectVersion::class)->orderBy('version');
    }

    public function updates(): HasMany
    {
        return $this->hasMany(ProjectUpdate::class)->orderBy('created_at', 'desc');
    }

    public function currentVersion(): BelongsTo
    {
        return $this->belongsTo(ProjectVersion::class, 'id', 'project_id')
            ->where('is_current', true)
            ->latestOfMany();
    }

    public function clientVisibleUpdates(): HasMany
    {
        return $this->updates()->where('is_client_visible', true);
    }

    public function contracts(): HasMany
    {
        return $this->hasMany(Contract::class);
    }

    public function scopeForClient($query, string $userId)
    {
        return $query->where('user_id', $userId)->where('is_client_visible', true);
    }

    public function scopeActive($query)
    {
        return $query->whereNotIn('status', ['completed', 'cancelled']);
    }

    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    public function isActive(): bool
    {
        return !in_array($this->status, ['completed', 'cancelled']);
    }

    public function getStatusNameAttribute(): string
    {
        return self::STATUSES[$this->status] ?? $this->status;
    }

    public function getPriorityNameAttribute(): string
    {
        return self::PRIORITIES[$this->priority] ?? $this->priority;
    }
}
