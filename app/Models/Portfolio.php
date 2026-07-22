<?php

namespace App\Models;

use App\Models\Concerns\HasUlid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Portfolio extends Model
{
    use HasUlid, SoftDeletes;

    protected $fillable = [
        'title',
        'description',
        'media_id',
        'url',
        'completed_at',
        'is_displayed',
        'sort_order',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'is_displayed' => 'boolean',
        'sort_order' => 'integer',
        'completed_at' => 'date',
    ];

    public function media(): BelongsTo
    {
        return $this->belongsTo(Media::class);
    }

    public function services(): BelongsToMany
    {
        return $this->belongsToMany(Service::class, 'portfolio_service')
            ->withPivot('sort_order')
            ->orderBy('portfolio_service.sort_order');
    }

    public function creator()
    {
        return $this->belongsTo(Admin::class, 'created_by');
    }

    public function updater()
    {
        return $this->belongsTo(Admin::class, 'updated_by');
    }

    public function scopeDisplayed($query)
    {
        return $query->where('is_displayed', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('completed_at', 'desc');
    }

    public function isDisplayed(): bool
    {
        return $this->is_displayed;
    }
}
