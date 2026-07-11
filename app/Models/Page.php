<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Page extends Model
{
    use HasUlid, SoftDeletes;

    protected $fillable = [
        'page_type_id',
        'title',
        'slug',
        'template',
        'content',
        'meta_title',
        'meta_description',
        'is_published',
        'published_at',
        'sort_order',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    protected $casts = [
        'content' => 'array',  // JSON for block editor
        'is_published' => 'boolean',
        'published_at' => 'datetime',
    ];

    // リレーションシップ
    public function pageType(): BelongsTo
    {
        return $this->belongsTo(PageType::class);
    }

    public function sections(): HasMany
    {
        return $this->hasMany(Section::class);
    }

    public function createdBy()
    {
        return $this->belongsTo(Admin::class, 'created_by');
    }

    public function updatedBy()
    {
        return $this->belongsTo(Admin::class, 'updated_by');
    }

    public function deletedBy()
    {
        return $this->belongsTo(Admin::class, 'deleted_by');
    }

    // スコープ
    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    public function scopeBySlug($query, $slug)
    {
        return $query->where('slug', $slug);
    }
}
