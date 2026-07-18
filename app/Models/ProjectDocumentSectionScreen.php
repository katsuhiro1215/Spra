<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectDocumentSectionScreen extends Model
{
    use HasUlid, HasFactory;

    protected $fillable = [
        'project_document_section_id',
        'screen_name',
        'path',
        'description',
        'related_features',
        'sort_order',
    ];

    protected $casts = [
        'sort_order' => 'integer',
    ];

    public function section(): BelongsTo
    {
        return $this->belongsTo(ProjectDocumentSection::class, 'project_document_section_id');
    }
}
