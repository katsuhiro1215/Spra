<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Facades\Storage;

class Media extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'original_name',
        'filename',
        'path',
        'url',
        'disk',
        'mime_type',
        'type',
        'size',
        'dimensions',
        'metadata',
        'alt_text',
        'description',
        'folder',
        'tags',
        'is_public',
        'uploaded_by',
    ];

    protected $casts = [
        'dimensions' => 'array',
        'metadata' => 'array',
        'tags' => 'array',
        'is_public' => 'boolean',
    ];

    // リレーション
    public function uploader(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'uploaded_by');
    }

    // スコープ
    public function scopeImages($query)
    {
        return $query->where('type', 'image');
    }

    public function scopeVideos($query)
    {
        return $query->where('type', 'video');
    }

    public function scopeDocuments($query)
    {
        return $query->where('type', 'document');
    }

    public function scopePublic($query)
    {
        return $query->where('is_public', true);
    }

    public function scopeByFolder($query, $folder)
    {
        return $query->where('folder', $folder);
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    // アクセサ
    protected function fullUrl(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->disk === 'public'
                ? Storage::url($this->path)
                : $this->url
        );
    }

    protected function humanFileSize(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->formatBytes($this->size)
        );
    }

    protected function isImage(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->type === 'image'
        );
    }

    protected function isVideo(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->type === 'video'
        );
    }

    protected function typeLabel(): Attribute
    {
        return Attribute::make(
            get: fn() => match ($this->type) {
                'image' => '画像',
                'video' => '動画',
                'audio' => '音声',
                'document' => '文書',
                'other' => 'その他',
                default => $this->type
            }
        );
    }

    // ヘルパーメソッド
    private function formatBytes($bytes, $precision = 2)
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];

        for ($i = 0; $bytes > 1024; $i++) {
            $bytes /= 1024;
        }

        return round($bytes, $precision) . ' ' . $units[$i];
    }

    public static function getTypeFromMime($mimeType)
    {
        if (str_starts_with($mimeType, 'image/')) {
            return 'image';
        } elseif (str_starts_with($mimeType, 'video/')) {
            return 'video';
        } elseif (str_starts_with($mimeType, 'audio/')) {
            return 'audio';
        } elseif (in_array($mimeType, [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain',
        ])) {
            return 'document';
        } else {
            return 'other';
        }
    }

    public function getThumbnailUrl($width = 300, $height = 300)
    {
        if ($this->type !== 'image') {
            return null;
        }

        // ここで画像リサイズ処理を実装
        // 例: Intervention Image や Spatie Media Library を使用
        return $this->full_url;
    }
}
