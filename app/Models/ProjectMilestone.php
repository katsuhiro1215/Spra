<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectMilestone extends Model
{
    use HasUlid, HasFactory;

    protected $fillable = [
        'project_version_id',
        'title',
        'description',
        'status',
        'due_date',
        'completed_at',
        'sort_order',
        'is_client_visible',
    ];

    protected $casts = [
        'due_date'          => 'date',
        'completed_at'      => 'datetime',
        'is_client_visible' => 'boolean',
    ];

    public const STATUSES = [
        'pending'     => '未着手',
        'in_progress' => '進行中',
        'completed'   => '完了',
        'skipped'     => 'スキップ',
    ];

    public function projectVersion(): BelongsTo
    {
        return $this->belongsTo(ProjectVersion::class, 'project_version_id');
    }

    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    public function getStatusNameAttribute(): string
    {
        return self::STATUSES[$this->status] ?? $this->status;
    }
}
