<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProjectItem extends Model
{
    use HasUlid, HasFactory, SoftDeletes;

    protected $fillable = [
        'project_version_id',
        'service_item_id',
        'milestone_id',
        'parent_id',
        'name',
        'description',
        'type',
        'start_date',
        'end_date',
        'actual_start_date',
        'actual_end_date',
        'estimated_hours',
        'actual_hours',
        'status',
        'progress',
        'priority',
        'assigned_to',
        'dependencies',
        'sort_order',
        'is_client_visible',
        'category',
        'tags',
        'internal_notes',
        'client_notes',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'actual_start_date' => 'date',
        'actual_end_date' => 'date',
        'is_client_visible' => 'boolean',
        'dependencies' => 'array',
        'tags' => 'array',
    ];

    public const TYPES = [
        'task' => 'タスク',
        'milestone' => 'マイルストーン',
        'group' => 'グループ',
    ];

    public const STATUSES = [
        'not_started' => '未着手',
        'in_progress' => '進行中',
        'completed' => '完了',
        'on_hold' => '保留',
        'cancelled' => 'キャンセル',
    ];

    public const PRIORITIES = [
        'low' => '低',
        'medium' => '中',
        'high' => '高',
        'urgent' => '緊急',
    ];

    public function projectVersion(): BelongsTo
    {
        return $this->belongsTo(ProjectVersion::class, 'project_version_id');
    }

    public function serviceItem(): BelongsTo
    {
        return $this->belongsTo(ServiceItem::class, 'service_item_id');
    }

    public function milestone(): BelongsTo
    {
        return $this->belongsTo(ProjectMilestone::class, 'milestone_id');
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(ProjectItem::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(ProjectItem::class, 'parent_id')->orderBy('sort_order');
    }

    public function assignee(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'assigned_to');
    }

    protected static function booted(): void
    {
        // ステータスが完了/未着手に変わったら進捗率も連動させる
        static::saving(function (ProjectItem $item) {
            if ($item->isDirty('status')) {
                if ($item->status === 'completed') {
                    $item->progress = 100;
                } elseif ($item->status === 'not_started') {
                    $item->progress = 0;
                }
            }
        });
    }
}
