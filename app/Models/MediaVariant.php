<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class MediaVariant extends Model
{
    use HasUlids;

    protected $fillable = [
        'media_id',
        'size',
        'custom_name',
        'path',
        'file_size',
        'width',
        'height',
        'crop_x',
        'crop_y',
        'crop_width',
        'crop_height',
        'crop_position',
        'quality',
        'maintain_aspect_ratio',
    ];

    protected $casts = [
        'file_size' => 'integer',
        'width' => 'integer',
        'height' => 'integer',
        'crop_x' => 'integer',
        'crop_y' => 'integer',
        'crop_width' => 'integer',
        'crop_height' => 'integer',
        'quality' => 'integer',
        'maintain_aspect_ratio' => 'boolean',
    ];

    protected $appends = [
        'url',
    ];

    /**
     * メディア
     */
    public function media(): BelongsTo
    {
        return $this->belongsTo(Media::class);
    }

    /**
     * バリアントのURL取得
     */
    public function getUrlAttribute(): string
    {
        return Storage::disk('public')->url($this->path);
    }
}
