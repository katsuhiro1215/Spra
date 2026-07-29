<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectFile extends Model
{
    use HasUlid, HasFactory;

    protected $fillable = [
        'project_id',
        'uploaded_by',
        'disk',
        'path',
        'original_filename',
        'mime_type',
        'file_size',
        'description',
        'is_client_visible',
    ];

    protected $casts = [
        'file_size' => 'integer',
        'is_client_visible' => 'boolean',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function uploadedBy(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'uploaded_by');
    }
}
