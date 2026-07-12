<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class DocumentCategory extends Model
{
    use HasUlid;

    protected $fillable = [
        'name',
        'slug',
        'sort_order',
    ];

    // -------------------------
    // Relationships
    // -------------------------

    public function documents(): HasMany
    {
        return $this->hasMany(Document::class)->orderBy('sort_order');
    }

    // -------------------------
    // Scopes
    // -------------------------

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('name');
    }

    // -------------------------
    // Boot
    // -------------------------

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->slug)) {
                $model->slug = Str::slug($model->name);
            }
        });
    }
}
