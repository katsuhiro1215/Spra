<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ContactCategory extends Model
{
    use HasUlid;

    protected $fillable = [
        'name',
        'description',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    // リレーション
    public function contacts(): HasMany
    {
        return $this->hasMany(Contact::class, 'contact_category_id');
    }

    // スコープ
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    // 並び順スコープ
    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('name');
    }
}
