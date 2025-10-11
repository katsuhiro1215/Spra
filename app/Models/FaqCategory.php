<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class FaqCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'color',
        'icon',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * FAQとの関係
     */
    public function faqs()
    {
        return $this->hasMany(Faq::class)->orderBy('sort_order');
    }

    /**
     * 公開中のFAQとの関係
     */
    public function publishedFaqs()
    {
        return $this->hasMany(Faq::class)->where('is_published', true)->orderBy('sort_order');
    }

    /**
     * アクティブなカテゴリのスコープ
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * 表示順でソートするスコープ
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('name');
    }

    /**
     * スラッグの自動生成
     */
    public static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->slug)) {
                $model->slug = Str::slug($model->name);
            }
        });

        static::updating(function ($model) {
            if ($model->isDirty('name') && empty($model->slug)) {
                $model->slug = Str::slug($model->name);
            }
        });
    }

    /**
     * ルートキーの指定
     */
    public function getRouteKeyName()
    {
        return 'slug';
    }
}
