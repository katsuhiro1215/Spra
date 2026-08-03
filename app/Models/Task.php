<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Task extends Model
{
    use HasUlid, HasFactory, SoftDeletes;

    protected $keyType = 'string';
    public $incrementing = false;

    public const STATUSES = ['todo', 'in_progress', 'done'];
    public const PRIORITIES = ['high', 'medium', 'low'];

    protected $fillable = [
        'title',
        'description',
        'status',
        'priority',
        'task_category_id',
        'tags',
        'admin_id',
        'created_by',
        'due_date',
        'due_time',
        'completed_at',
        'recurrence_rule',
        'parent_task_id',
    ];

    protected $casts = [
        'tags' => 'array',
        'recurrence_rule' => 'array',
        'due_date' => 'date',
        'completed_at' => 'datetime',
    ];

    public function isDone(): bool
    {
        return $this->status === 'done';
    }

    public function isRecurringTemplate(): bool
    {
        return $this->parent_task_id === null && $this->recurrence_rule !== null;
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(TaskCategory::class, 'task_category_id');
    }

    public function admin(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'admin_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'created_by');
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Task::class, 'parent_task_id');
    }

    public function occurrences(): HasMany
    {
        return $this->hasMany(Task::class, 'parent_task_id');
    }
}
