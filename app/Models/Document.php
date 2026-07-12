<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Document extends Model
{
    use HasUlid, SoftDeletes;

    protected $fillable = [
        'document_category_id',
        'title',
        'slug',
        'description',
        'requires_acceptance',
        'sort_order',
    ];

    protected $casts = [
        'requires_acceptance' => 'boolean',
    ];

    // -------------------------
    // Relationships
    // -------------------------

    public function category(): BelongsTo
    {
        return $this->belongsTo(DocumentCategory::class, 'document_category_id');
    }

    public function versions(): HasMany
    {
        return $this->hasMany(DocumentVersion::class)->orderByDesc('version');
    }

    /**
     * 現在有効なバージョン
     */
    public function activeVersion(): HasOne
    {
        return $this->hasOne(DocumentVersion::class)
            ->where('status', 'active')
            ->latest('version');
    }

    // -------------------------
    // Scopes
    // -------------------------

    public function scopeRequiresAcceptance($query)
    {
        return $query->where('requires_acceptance', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('title');
    }

    // -------------------------
    // Boot
    // -------------------------

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->slug)) {
                $model->slug = Str::slug($model->title);
            }
        });
    }
}
