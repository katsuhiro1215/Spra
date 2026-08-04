<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class HearingTemplateItem extends Model
{
    use HasUlid;

    const TYPE_SINGLE_CHOICE = 'single_choice';
    const TYPE_MULTI_CHOICE = 'multi_choice';
    const TYPE_TEXT = 'text';
    const TYPE_NUMBER = 'number';

    protected $fillable = [
        'category',
        'question',
        'type',
        'options',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'options' => 'array',
        'sort_order' => 'integer',
        'is_active' => 'boolean',
    ];

    public function answers(): HasMany
    {
        return $this->hasMany(HearingAnswer::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('category')->orderBy('sort_order');
    }
}
