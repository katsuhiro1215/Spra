<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectDocumentSectionEndpoint extends Model
{
    use HasUlid, HasFactory;

    protected $fillable = [
        'project_document_section_id',
        'http_method',
        'path',
        'summary',
        'request_body',
        'response_body',
        'status_codes',
        'notes',
        'sort_order',
    ];

    protected $casts = [
        'sort_order' => 'integer',
    ];

    public const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

    public function section(): BelongsTo
    {
        return $this->belongsTo(ProjectDocumentSection::class, 'project_document_section_id');
    }
}
