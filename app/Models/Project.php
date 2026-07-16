<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\HasOne;
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

    /**
     * マイルストーンはProjectVersionを経由してアクセスする。
     * 個別のバージョンのマイルストーンが欲しい場合は $project->currentVersion->milestones を使うこと。
     */
    public function milestones(): HasManyThrough
    {
        return $this->hasManyThrough(
            ProjectMilestone::class,
            ProjectVersion::class,
            'project_id',
            'project_version_id',
        );
    }

    public function versions(): HasMany
    {
        return $this->hasMany(ProjectVersion::class)->orderBy('version');
    }

    public function updates(): HasMany
    {
        return $this->hasMany(ProjectUpdate::class)->orderBy('created_at', 'desc');
    }

    public function currentVersion(): HasOne
    {
        return $this->hasOne(ProjectVersion::class)
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

    /**
     * このプロジェクトで実際に使用している技術
     */
    public function technologies(): BelongsToMany
    {
        return $this->belongsToMany(Technology::class, 'project_technology')
            ->withPivot('sort_order')
            ->orderBy('project_technology.sort_order');
    }

    /**
     * 紐づく契約のServicePlan→Serviceが持つ使用技術（選択候補）。
     * 契約やServicePlanが未設定の場合は空コレクションを返す。
     */
    public function availableTechnologies(): \Illuminate\Support\Collection
    {
        $service = $this->contract?->servicePlan?->service;

        return $service ? $service->technologies()->get() : collect();
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

    /**
     * 現在のバージョンに紐づくProjectItemの進捗から、プロジェクト全体の進捗率(0-100)を算出する。
     */
    public function calculateProgress(?ProjectVersion $version = null): int
    {
        $version ??= $this->versions()->where('is_current', true)->with('items')->first();

        if (!$version) {
            return 0;
        }

        $items = $version->relationLoaded('items') ? $version->items : $version->items()->get();
        $items = $items->reject(fn (ProjectItem $item) => $item->status === 'cancelled');

        if ($items->isEmpty()) {
            return 0;
        }

        return (int) round($items->avg('progress'));
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
