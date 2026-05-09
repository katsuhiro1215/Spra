<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

class MediaSetting extends Model
{
    use HasUlids;

    protected $fillable = [
        'max_file_size_kb',
        'max_total_storage_mb',
        'auto_compress',
        'compression_quality',
        'output_format',
        'large_width',
        'large_height',
        'medium_width',
        'medium_height',
        'small_width',
        'small_height',
        'generate_large',
        'generate_medium',
        'generate_small',
        'allow_video_upload',
        'max_video_size_mb',
        'max_video_duration_seconds',
    ];

    protected $casts = [
        'max_file_size_kb' => 'integer',
        'max_total_storage_mb' => 'integer',
        'auto_compress' => 'boolean',
        'compression_quality' => 'integer',
        'large_width' => 'integer',
        'large_height' => 'integer',
        'medium_width' => 'integer',
        'medium_height' => 'integer',
        'small_width' => 'integer',
        'small_height' => 'integer',
        'generate_large' => 'boolean',
        'generate_medium' => 'boolean',
        'generate_small' => 'boolean',
        'allow_video_upload' => 'boolean',
        'max_video_size_mb' => 'integer',
        'max_video_duration_seconds' => 'integer',
    ];
}
