<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class Media extends Model
{
    use HasFactory, HasUlids, SoftDeletes;

    protected $fillable = [
        'title',
        'description',
        'alt_text',
        'type',
        'mime_type',
        'original_file_size',
        'original_hash',
        'original_path',
        'original_filename',
        'original_width',
        'original_height',
        'duration',
        'quality',
        'format',
        'is_processing',
        'is_processed',
        'usage_count',
        'last_used_at',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'is_processing' => 'boolean',
        'is_processed' => 'boolean',
        'usage_count' => 'integer',
        'last_used_at' => 'datetime',
        'original_file_size' => 'integer',
        'original_width' => 'integer',
        'original_height' => 'integer',
        'duration' => 'integer',
        'quality' => 'integer',
    ];

    protected $appends = [
        'original_url',
        'url',
    ];

    /**
     * バリアント
     */
    public function variants(): HasMany
    {
        return $this->hasMany(MediaVariant::class);
    }

    /**
     * プロフィール（このメディアを使用しているプロフィール）
     */
    public function profiles(): HasMany
    {
        return $this->hasMany(Profile::class, 'media_id');
    }

    /**
     * 作成者
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'created_by');
    }

    /**
     * 更新者
     */
    public function updater(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'updated_by');
    }

    /**
     * オリジナル画像のURL取得（S3またはpublic）
     */
    public function getOriginalUrlAttribute(): string
    {
        // 本番環境ではS3、開発環境ではpublicディスクを使用
        $disk = config('app.env') === 'production' ? 's3' : 'public';
        return Storage::disk($disk)->url($this->original_path);
    }

    /**
     * URLアクセサ（original_urlのエイリアス）
     */
    public function getUrlAttribute(): string
    {
        return $this->original_url;
    }

    /**
     * 指定サイズのバリアントURL取得
     */
    public function getVariantUrl(string $size = 'medium'): ?string
    {
        $variant = $this->variants()->where('size', $size)->first();
        if (!$variant) {
            return null;
        }

        // 本番環境ではS3、開発環境ではpublicディスクを使用
        $disk = config('app.env') === 'production' ? 's3' : 'public';
        return Storage::disk($disk)->url($variant->path);
    }

    /**
     * 使用カウント増加
     */
    public function incrementUsage(): void
    {
        $this->increment('usage_count');
        $this->update(['last_used_at' => now()]);
    }

    /**
     * 画像のみを取得
     */
    public function scopeImages($query)
    {
        return $query->where('type', 'image');
    }

    /**
     * 動画のみを取得
     */
    public function scopeVideos($query)
    {
        return $query->where('type', 'video');
    }

    /**
     * 3Dモデルのみを取得
     */
    public function scope3dModels($query)
    {
        return $query->where('type', '3d_model');
    }

    /**
     * ファイルサイズを人間が読みやすい形式で取得
     */
    // public function getHumanFileSizeAttribute(): string
    // {
    //     $bytes = $this->original_file_size;
    //     if ($bytes === 0) return '0 B';

    //     $k = 1024;
    //     $sizes = ['B', 'KB', 'MB', 'GB'];
    //     $i = floor(log($bytes) / log($k));

    //     return round($bytes / pow($k, $i), 2) . ' ' . $sizes[$i];
    // }
}
