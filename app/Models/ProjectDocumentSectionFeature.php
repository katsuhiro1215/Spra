<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectDocumentSectionFeature extends Model
{
    use HasUlid, HasFactory;

    protected $fillable = [
        'project_document_section_id',
        'name',
        'description',
        'related_screen',
        'priority',
        'status',
        'sort_order',
    ];

    protected $casts = [
        'sort_order' => 'integer',
    ];

    public const PRIORITIES = [
        'low'    => '低',
        'medium' => '中',
        'high'   => '高',
    ];

    public const STATUSES = [
        'planned'     => '未着手',
        'in_progress' => '開発中',
        'done'        => '完了',
    ];

    public function section(): BelongsTo
    {
        return $this->belongsTo(ProjectDocumentSection::class, 'project_document_section_id');
    }
}
