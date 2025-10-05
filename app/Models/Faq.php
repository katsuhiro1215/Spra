<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Faq extends Model
{
    protected $fillable = [
        'question',
        'answer',
        'category',
        'is_featured',
        'sort_order'
    ];

    protected $casts = [
        'is_featured' => 'boolean'
    ];

    // スコープ
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('created_at');
    }

    // カテゴリ一覧を取得
    public static function getCategories()
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
