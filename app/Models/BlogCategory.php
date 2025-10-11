<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Str;

class BlogCategory extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'color',
        'sort_order',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    // リレーションシップ
    public function blogs(): BelongsToMany
    {
        return $this->belongsToMany(Blog::class);
    }

    public function publishedBlogs(): BelongsToMany
    {
        return $this->blogs()->where('status', 'published')
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }

    // スコープ
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('name');
    }

    public function scopeWithPosts($query)
    {
        return $query->whereHas('blogs', function ($query) {
            $query->where('status', 'published');
        });
    }

    // アクセサ
    protected function postsCount(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->publishedBlogs()->count()
        );
    }

    protected function totalPostsCount(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->blogs()->count()
        );
    }

    protected function colorStyle(): Attribute
    {
        return Attribute::make(
            get: fn() => "background-color: {$this->color}; color: " . $this->getContrastColor($this->color)
        );
    }

    // ヘルパーメソッド
    private function getContrastColor($hexColor)
    {
        // #を取り除く
        $hexColor = ltrim($hexColor, '#');

        // RGB値を計算
        $r = hexdec(substr($hexColor, 0, 2));
        $g = hexdec(substr($hexColor, 2, 2));
        $b = hexdec(substr($hexColor, 4, 2));

        // 明度を計算（0-255）
        $brightness = ($r * 299 + $g * 587 + $b * 114) / 1000;

        return $brightness > 155 ? '#000000' : '#ffffff';
    }

    public function generateSlug()
    {
        $baseSlug = Str::slug($this->name);
        $slug = $baseSlug;
        $counter = 1;

        while (static::where('slug', $slug)->where('id', '!=', $this->id)->exists()) {
            $slug = $baseSlug . '-' . $counter;
            $counter++;
        }

        return $slug;
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($category) {
            if (empty($category->slug)) {
                $category->slug = $category->generateSlug();
            }

            if ($category->sort_order === null) {
                $category->sort_order = static::max('sort_order') + 1;
            }
        });

        static::updating(function ($category) {
            if ($category->isDirty('name') && empty($category->slug)) {
                $category->slug = $category->generateSlug();
            }
        });
    }
}
