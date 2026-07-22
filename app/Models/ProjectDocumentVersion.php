<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProjectDocumentVersion extends Model
{
    use HasUlid, HasFactory, SoftDeletes;

    protected $fillable = [
        'project_document_id',
        'version',
        'status',
        'is_current',
        'revision_reason',
        'released_by',
        'released_at',
        'created_by',
    ];

    protected $casts = [
        'version'     => 'integer',
        'is_current'  => 'boolean',
        'released_at' => 'datetime',
    ];

    public const STATUSES = [
        'draft'      => '編集中',
        'released'   => '確定済み',
        'superseded' => '改訂版あり',
    ];

    public function document(): BelongsTo
    {
        return $this->belongsTo(ProjectDocument::class, 'project_document_id');
    }

    public function sections(): HasMany
    {
        return $this->hasMany(ProjectDocumentSection::class)->orderBy('sort_order');
    }

    public function releasedBy(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'released_by');
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'created_by');
    }
}
