<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PageType extends Model
{
    use HasUlid;

    protected $fillable = [
        'key',
        'name',
        'slug',
        'description',
        'is_system',
        'is_dynamic',
        'has_detail',
        'allowed_component_types',
        'default_layout',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'is_system' => 'boolean',
        'is_dynamic' => 'boolean',
        'has_detail' => 'boolean',
        'allowed_component_types' => 'array',
        'default_layout' => 'array',
    ];

    public function pages(): HasMany
    {
        return $this->hasMany(Page::class);
    }

    public function createdBy()
    {
        return $this->belongsTo(Admin::class, 'created_by');
    }

    public function updatedBy()
    {
        return $this->belongsTo(Admin::class, 'updated_by');
    }
}
