<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectDocumentSectionPermission extends Model
{
    use HasUlid, HasFactory;

    protected $fillable = [
        'project_document_section_id',
        'role_name',
        'permission',
        'description',
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
