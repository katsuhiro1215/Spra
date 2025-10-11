<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Faq extends Model
{
    use HasFactory;

    protected $fillable = [
        'faq_category_id',
        'question',
        'answer',
        'category', // 一時的に残す（後で削除予定）
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
     * 旧カテゴリでフィルタするスコープ（後で削除予定）
     */
    public function scopeByOldCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    /**
     * 表示順でソートするスコープ
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('created_at');
    }

    /**
     * 旧カテゴリ一覧を取得（後で削除予定）
     */
    public static function getOldCategories()
    {
        return [
            'general' => '一般',
            'pricing' => '料金',
            'contract' => '契約',
            'support' => 'サポート',
            'process' => '開発プロセス',
            'technical' => '技術'
        ];
    }
}
