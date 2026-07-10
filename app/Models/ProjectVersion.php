<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProjectVersion extends Model
{
    use HasUlid, HasFactory, SoftDeletes;

    protected $fillable = [
        'project_id',
        'version',
        'title',
        'description',
        'start_date',
        'estimated_end_date',
        'total_estimated_hours',
        'status',
        'revision_reason',
        'is_current',
        'created_by',
    ];

    protected $casts = [
        'start_date'         => 'date',
        'estimated_end_date' => 'date',
        'total_estimated_hours' => 'integer',
        'is_current'         => 'boolean',
    ];

    public const STATUSES = [
        'draft'      => 'ドラフト',
        'approved'   => '承認済',
        'active'     => 'アクティブ',
        'superseded' => '置き換え済',
        'cancelled'  => 'キャンセル',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function milestones(): HasMany
    {
        return $this->hasMany(ProjectMilestone::class, 'project_version_id')->orderBy('sort_order');
    }

    public function items(): HasMany
    {
        return $this->hasMany(ProjectItem::class, 'project_version_id')->whereNull('parent_id')->orderBy('sort_order');
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'created_by');
    }
}
