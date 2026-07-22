<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectDocumentSectionColumn extends Model
{
    use HasUlid, HasFactory;

    protected $fillable = [
        'project_document_section_id',
        'name',
        'data_type',
        'length',
        'nullable',
        'default_value',
        'is_primary_key',
        'is_unique',
        'references_table',
        'references_column',
        'comment',
        'sort_order',
    ];

    protected $casts = [
        'nullable'       => 'boolean',
        'is_primary_key' => 'boolean',
        'is_unique'      => 'boolean',
        'sort_order'     => 'integer',
    ];

    public function section(): BelongsTo
    {
        return $this->belongsTo(ProjectDocumentSection::class, 'project_document_section_id');
    }
}
