<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Faq extends Model
{
    use HasUlid, HasFactory, SoftDeletes;

    protected $fillable = [
        'faq_category_id',
        'question',
        'answer',
        'sort_order',
        'is_featured',
        'is_published',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'is_published' => 'boolean',
    ];

    /**
     * FAQカテゴリとの関係
     */
    public function faqCategory()
    {
        return $this->belongsTo(FaqCategory::class);
    }

    /**
     * 紐付くサービスとの関係
     */
    public function services()
    {
        return $this->belongsToMany(Service::class, 'faq_service')
            ->withPivot('sort_order')
            ->orderBy('faq_service.sort_order');
    }

    /**
     * よくある質問のスコープ
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * 公開中のスコープ
     */
    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    /**
     * カテゴリでフィルタするスコープ
     */
    public function scopeByCategory($query, $categoryId)
    {
        if ($categoryId) {
            return $query->where('faq_category_id', $categoryId);
        }
        return $query;
    }

    /**
     * 表示順でソートするスコープ
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('created_at');
    }
}
